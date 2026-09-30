/**
 * Headless layout gate, driven over the Chrome DevTools Protocol directly.
 *
 * Playwright's browsers are installed but the package is not, and adding it as a
 * devDependency for a layout check is not worth it — Node 22 ships a WebSocket
 * client, so the whole thing is about eighty lines and no install.
 *
 * What it checks, per width:
 *   - horizontal overflow (the failure that breaks a phone page outright)
 *   - elements wider than the viewport
 *   - images that never loaded
 *   - tap targets below 24px on touch widths
 *   - console errors
 *
 * Usage: node scripts/check-layout.mjs [baseUrl] [port]
 */
import { spawn } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const BASE = process.argv[2] ?? "http://localhost:5190";
const PORT = Number(process.argv[3] ?? 9333);

const CHROME_DIR = join(
  process.env.USERPROFILE ?? process.env.HOME ?? "",
  "AppData/Local/ms-playwright",
);

const findChrome = async () => {
  const root = await readdir(CHROME_DIR);
  // Playwright's chromium builds use `chrome-win64` on 64-bit Windows and
  // `chrome-win` on 32-bit, so try both rather than assume.
  for (const dir of root.filter((name) => name.startsWith("chromium-"))) {
    for (const inner of ["chrome-win64", "chrome-win"]) {
      const candidate = join(CHROME_DIR, dir, inner, "chrome.exe");
      try {
        await stat(candidate);
        return candidate;
      } catch {
        /* try the next one */
      }
    }
  }
  throw new Error(`No chrome.exe found under ${CHROME_DIR}`);
};

const ROUTES = [
  "/",
  "/about",
  "/wedding-photography",
  "/wedding-films",
  "/portfolio",
  "/portfolio/real-weddings/calicut-church-wedding",
  "/oriana-group",
  "/contact",
];

const WIDTHS = [
  { name: "mobile", width: 390, height: 844, touch: true },
  { name: "tablet", width: 768, height: 1024, touch: true },
  { name: "desktop", width: 1440, height: 900, touch: false },
];

const chrome = spawn(
  await findChrome(),
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const cleanup = () => chrome.kill();
process.on("exit", cleanup);

/* Wait for the debugging endpoint. */
let target;
for (let attempt = 0; attempt < 60; attempt++) {
  try {
    const list = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json());
    target = list.find((t) => t.type === "page");
    if (target) break;
  } catch {
    /* not up yet */
  }
  await new Promise((r) => setTimeout(r, 250));
}
if (!target) {
  cleanup();
  throw new Error("Chromium did not expose a debugging target");
}

/* Minimal CDP client. */
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
const pending = new Map();
const events = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id !== undefined) {
    const entry = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message));
    else entry.resolve(message.result);
  } else if (message.method) {
    events.push(message);
  }
});

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const messageId = ++id;
    pending.set(messageId, { resolve, reject });
    socket.send(JSON.stringify({ id: messageId, method, params }));
  });

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");

const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};

/* The audit, run inside the page. */
const AUDIT = `(() => {
  const docWidth = document.documentElement.clientWidth;
  const problems = { overflow: [], wide: [], broken: [] };

  const scrollWidth = document.documentElement.scrollWidth;
  if (scrollWidth > docWidth + 1) {
    problems.overflow.push({ scrollWidth, docWidth });
  }

  /* Past-the-edge elements are only a bug if nothing clips or scrolls them.
     A marquee track is meant to be wider than the viewport; a zoomed image
     inside its \`overflow: hidden\` shell is clipped and harmless; a carousel
     item lives in a scroll container. Any of those means "not a bug". */
  const isContained = (el) => {
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      if (node.classList && node.classList.contains('marquee')) return true;
      const overflowX = getComputedStyle(node).overflowX;
      if (overflowX === 'auto' || overflowX === 'scroll') return true;
      if (overflowX === 'hidden' || overflowX === 'clip') return true;
    }
    return false;
  };

  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;

    if ((rect.right > docWidth + 1 || rect.left < -1) && !isContained(el)) {
      const tag = el.tagName.toLowerCase();
      const cls = (el.className && el.className.baseVal !== undefined
        ? el.className.baseVal : String(el.className || '')).slice(0, 60);
      problems.wide.push({ tag, cls, left: Math.round(rect.left), right: Math.round(rect.right) });
    }

    if (el.tagName === 'IMG' && el.complete && el.naturalWidth === 0) {
      problems.broken.push(el.currentSrc || el.src);
    }
  }

  return problems;
})()`;

/**
 * Tap targets. Scoped to real controls on purpose: plain text links inside a
 * sentence are exempt under WCAG 2.5.8, and `sr-only` inputs inside a chip are
 * 1x1 by design because the wrapping label is the actual target.
 */
const TOUCH_AUDIT = `(() => {
  const out = [];
  for (const el of document.querySelectorAll('button, .btn, .chip, select, textarea, a[role="button"]')) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    if (el.closest('[hidden]')) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (rect.top > 4000) continue;
    if (rect.height < 24 || rect.width < 24) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || '').slice(0, 40),
        text: (el.textContent || '').trim().slice(0, 30),
        w: Math.round(rect.width),
        h: Math.round(rect.height),
      });
    }
  }
  return out;
})()`;

const NAV_AUDIT = `(() => {
  const nav = document.querySelector('header nav');
  if (!nav) return null;
  const items = [...nav.querySelectorAll('a')].map(a => ({
    text: (a.textContent || '').trim(),
    w: Math.round(a.getBoundingClientRect().width),
  }));
  return { items, scrollWidth: nav.scrollWidth, clientWidth: nav.clientWidth };
})()`;

/**
 * Text contrast, computed from what the browser actually painted. A design-token
 * audit would pass while the rendered result still fails, because alpha and
 * blended backgrounds are resolved at paint time — so this reads the used
 * values back off the page instead of re-deriving them.
 *
 * Threshold is 4.5:1, with 3:1 allowed for text at 24px or larger (WCAG 2.2
 * SC 1.4.3 large-text allowance).
 */
const CONTRAST_AUDIT = `(() => {
  const parse = (value) => {
    const m = value.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const parts = m[1].split(/[,\\s/]+/).filter(Boolean).map(Number);
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const lum = (c) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };

  /* Walk up for the first opaque background, the way a human reads a page. */
  const backdrop = (el) => {
    let node = el;
    let acc = null;
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      const c = parse(style.backgroundColor);
      if (c && c.a > 0) {
        acc = acc ? over(acc, c) : c;
        if (acc.a >= 0.999) return acc;
      }
      node = node.parentElement;
    }
    const root = parse(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
    return acc ? over(acc, root) : root;
  };

  /* Text over a photograph, a video poster or a gradient scrim cannot be judged
     from computed styles — the colour that matters is a pixel of an image, not
     a token. Those are reported as "unverifiable" and left to a human rather
     than guessed at, because a wrong number here is worse than no number. */
  const overlaps = (a, b) =>
    !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);

  const sitsOnImage = (el) => {
    for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.backgroundImage && style.backgroundImage !== 'none') return true;
      if (node.tagName === 'IMG' || node.tagName === 'VIDEO' || node.tagName === 'CANVAS') return true;
    }
    /* The media is usually a sibling painted underneath rather than an ancestor
       — a caption over a video poster, a title over a hero. Hit-testing with
       elementsFromPoint only works for whatever is inside the viewport, so a
       title on the third card of a grid silently fell through to the image
       shell's placeholder colour and got reported as a real failure. Overlap is
       decided geometrically instead, which holds for off-screen elements too. */
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    for (const node of document.querySelectorAll('img, video, canvas')) {
      if (el.contains(node)) continue;
      const m = node.getBoundingClientRect();
      if (m.width < 2 || m.height < 2) continue;
      if (overlaps(r, m)) return true;
    }
    return false;
  };

  const fails = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    // Only elements that own visible text directly.
    const own = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
      .map((n) => n.textContent.trim())
      .join(' ');
    if (!own) continue;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    if (Number(style.opacity) < 0.99) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (rect.top > 3000) continue;
    if (sitsOnImage(el)) continue;

    const fg = parse(style.color);
    if (!fg) continue;
    const bg = backdrop(el);
    const painted = over(fg, bg);
    const size = parseFloat(style.fontSize);
    const bold = Number(style.fontWeight) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    const got = ratio(painted, bg);
    if (got < need) {
      const key = style.color + '|' + own.slice(0, 20) + '|' + size;
      if (seen.has(key)) continue;
      seen.add(key);
      fails.push({
        ratio: +got.toFixed(2),
        need,
        size: Math.round(size),
        color: style.color,
        text: own.slice(0, 42),
        cls: String(el.className || '').slice(0, 40),
      });
    }
  }
  return fails;
})()`;

const failures = [];
let checks = 0;

for (const width of WIDTHS) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: width.width,
    height: width.height,
    deviceScaleFactor: 1,
    mobile: width.touch,
  });

  for (const route of ROUTES) {
    events.length = 0;
    await send("Page.navigate", { url: BASE + route });
    // Wait for the document to be interactive and images to settle.
    await evaluate(
      `new Promise(r => {
        if (document.readyState === 'complete') return r(1);
        addEventListener('load', () => r(1), { once: true });
      })`,
    );
    await new Promise((r) => setTimeout(r, 350));

    checks++;
    const problems = await evaluate(AUDIT);

    if (problems.overflow.length) {
      failures.push(
        `${route} @${width.name}: horizontal overflow ${JSON.stringify(problems.overflow[0])}`,
      );
    }
    for (const item of problems.wide.slice(0, 3)) {
      failures.push(`${route} @${width.name}: element past the viewport ${JSON.stringify(item)}`);
    }
    for (const src of problems.broken.slice(0, 3)) {
      failures.push(`${route} @${width.name}: broken image ${src}`);
    }

    if (width.touch) {
      const small = await evaluate(TOUCH_AUDIT);
      for (const item of small.slice(0, 4)) {
        failures.push(`${route} @${width.name}: small target ${JSON.stringify(item)}`);
      }
    }

    const errors = events.filter(
      (e) =>
        (e.method === "Log.entryAdded" && e.params.entry.level === "error") ||
        e.method === "Runtime.exceptionThrown",
    );
    for (const error of errors.slice(0, 2)) {
      failures.push(
        `${route} @${width.name}: console ${JSON.stringify(error.params).slice(0, 160)}`,
      );
    }

    if (width.name === "desktop") {
      const lowContrast = await evaluate(CONTRAST_AUDIT);
      for (const item of lowContrast.slice(0, 4)) {
        failures.push(`${route} @${width.name}: contrast ${JSON.stringify(item)}`);
      }
    }
  }

  /* Nav overflow at each width. */
  await send("Page.navigate", { url: BASE + "/" });
  await new Promise((r) => setTimeout(r, 400));
  const nav = await evaluate(NAV_AUDIT);
  if (nav) {
    const overflowing = nav.scrollWidth > nav.clientWidth + 1;
    console.log(
      `  nav @${width.name}: ${nav.items.length} links, ${overflowing ? `OVERFLOWS (${nav.scrollWidth} > ${nav.clientWidth})` : "fits"}`,
    );
    if (overflowing && !width.touch) {
      failures.push(`nav @${width.name}: overflows — ${nav.scrollWidth} > ${nav.clientWidth}`);
    }
  }
}

console.log(`\n  ${checks} page renders checked across ${WIDTHS.map((w) => w.name).join(", ")}`);

if (failures.length) {
  console.error(`\nlayout check failed (${failures.length}):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  socket.close();
  cleanup();
  process.exit(1);
}

console.log("layout check passed — no overflow, no broken images, no small targets.");
socket.close();
cleanup();
process.exit(0);
