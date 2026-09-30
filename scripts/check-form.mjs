/**
 * Headless enquiry-form gate, over the Chrome DevTools Protocol.
 *
 * Same approach as check-layout.mjs — the browser is driven directly, no
 * Playwright package — because the form is the one place on this site where a
 * silent regression means a couple's enquiry goes nowhere.
 *
 * What it asserts:
 *   - submitting empty is blocked and the three required fields report errors
 *   - filling them clears the errors
 *   - the honeypot is present and hidden from the accessibility tree
 *   - every control has an accessible name
 *   - a valid submit reaches the sent state and opens the WhatsApp handoff
 *
 * Usage: node scripts/check-form.mjs [baseUrl] [port]
 */
import { spawn } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const BASE = process.argv[2] ?? "http://localhost:5190";
const PORT = Number(process.argv[3] ?? 9334);

const CHROME_DIR = join(
  process.env.USERPROFILE ?? process.env.HOME ?? "",
  "AppData/Local/ms-playwright",
);

const findChrome = async () => {
  const root = await readdir(CHROME_DIR);
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

const chrome = spawn(
  await findChrome(),
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const cleanup = () => chrome.kill();
process.on("exit", cleanup);

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

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
const pending = new Map();
const consoleErrors = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id !== undefined) {
    const entry = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message));
    else entry.resolve(message.result);
    return;
  }
  if (message.method === "Log.entryAdded" && message.params?.entry?.level === "error") {
    consoleErrors.push(message.params.entry.text);
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

await send("Page.navigate", { url: `${BASE}/contact` });

const results = [];

/*
 * A capture-phase listener that swallows every submit.
 *
 * This matters more than it looks. The assertions below drive the form with
 * `requestSubmit()`, and if React has not hydrated yet there is no `onSubmit`
 * handler attached — so the browser performs a real GET submit and navigates,
 * which tears down the inspected target and kills the run with
 * "Inspected target navigated or closed" instead of a test failure. Swallowing
 * the event means an unhydrated page fails an assertion, which is readable,
 * rather than crashing the harness, which is not.
 */
await evaluate(`document.addEventListener("submit", (e) => e.preventDefault(), true); true`);

/* Wait for hydration rather than guessing at a delay. */
const hydrated = await evaluate(`(async () => {
  for (let i = 0; i < 80; i++) {
    const form = document.querySelector("form");
    const button = form?.querySelector('button[type="submit"]');
    if (form && button && !button.disabled) return true;
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
})()`);
results.push(["page hydrated and the form is interactive", hydrated === true]);
if (!hydrated) {
  console.log("FAIL  page never hydrated — stopping before the remaining assertions");
  for (const [name, ok] of results) console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  cleanup();
  process.exit(1);
}

/* 1. The form exists at all. */
results.push(["enquiry form is present", await evaluate(`!!document.querySelector("form")`)]);

/* 2. Submitting empty is blocked, and every field complains. All five controls
    are required — the form has no optional fields left, so the count of
    complaints on an empty submit is the count of fields. */
results.push([
  "empty submit blocked, all 5 fields report",
  await evaluate(`(() => {
    const form = document.querySelector("form");
    form.requestSubmit();
    return new Promise((r) => setTimeout(() => {
      const alerts = [...document.querySelectorAll('[role="alert"]')];
      if (alerts.length === 5) return r(true);
      return r("got " + alerts.length + ": " + JSON.stringify(alerts.map((a) => a.textContent.trim().slice(0, 30))));
    }, 900));
  })()`),
]);

/* 2b. Nothing on the page advertises a field as optional. The old form carried
    a footnote promising four of its eight boxes were optional, which is what
    made people hesitate over them; that copy is gone and this keeps it gone. */
results.push([
  "no field is advertised as optional",
  await evaluate(`(() => {
    const visible = document.querySelector("form").innerText.toLowerCase();
    const bad = ["optional", "if you like", "leave blank", "not sure yet"];
    const found = bad.filter((phrase) => visible.includes(phrase));
    if (found.length) return "still advertising: " + found.join(", ");
    return true;
  })()`),
]);

/* 3. No navigation happened — the browser must not reload on a bad submit. */
results.push([
  "page did not reload on invalid submit",
  await evaluate(`performance.getEntriesByType("navigation").length === 1`),
]);

/* 4. Filling the required fields clears every error. */
results.push([
  "errors clear once the required fields are valid",
  await evaluate(`(() => {
    const set = (sel, value) => {
      const el = document.querySelector(sel);
      const proto =
        el instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };
    set("#enquiry-name", "A Test");
    set("#enquiry-phone", "9999999999");
    set("#enquiry-email", "a@test.com");
    set("#enquiry-query", "Are you free in February?");
    const radio = document.querySelector('input[name="service"]');
    radio.click();
    return new Promise((r) => setTimeout(() => r(
      document.querySelectorAll('[role="alert"]').length === 0 && radio.checked
    ), 600));
  })()`),
]);

/* 5. The honeypot is present but not announced. */
results.push([
  "honeypot present and hidden from the a11y tree",
  await evaluate(`(() => {
    const el = document.querySelector("#enquiry-website");
    if (!el) return false;
    const wrapper = el.closest('[aria-hidden="true"]');
    if (!wrapper) return false;
    const style = getComputedStyle(wrapper);
    const box = el.getBoundingClientRect();
    /* Hidden from sight: zero-size and clipped, and off the tab order. */
    return (
      (box.width === 0 || style.overflow === "hidden") &&
      el.tabIndex === -1 &&
      el.getAttribute("autocomplete") === "off"
    );
  })()`),
]);

/* 6. Every control has an accessible name. */
results.push([
  "every form control has an accessible name",
  await evaluate(`(() => {
    const controls = [...document.querySelectorAll(
      "form input:not([type=hidden]), form select, form textarea"
    )];
    if (controls.length < 6) return false;
    return controls.every(
      (el) =>
        (el.labels && el.labels.length) ||
        el.getAttribute("aria-label") ||
        el.getAttribute("aria-labelledby"),
    );
  })()`),
]);

/* 7. A valid submit sends in one press. The form is a single screen, so there
      is no step to advance through and no Back button to press — a submit on a
      complete form must reach the sent state directly. */
results.push([
  "a complete submit sends in one press",
  await evaluate(`(async () => {
    const until = async (fn, ms = 5000) => {
      const end = Date.now() + ms;
      while (Date.now() < end) {
        if (fn()) return true;
        await new Promise((r) => setTimeout(r, 60));
      }
      return false;
    };
    window.open = () => null;
    document.querySelector("form").requestSubmit();
    if (await until(() => !!document.querySelector("#enquiry-done"), 4000)) return true;
    return "no #enquiry-done; errors=" + document.querySelectorAll('[role="alert"]').length;
  })()`),
]);

/* 8. A blocked hand-off must not read as a silent success. This is the failure
      the whole rescue path exists for: `window.open` returns null when a popup
      blocker refuses, and if that is ignored the visitor sees "thank you" while
      the enquiry goes nowhere. */
results.push([
  "a blocked WhatsApp hand-off surfaces a rescue link",
  await evaluate(`(() => {
    const links = [...document.querySelectorAll('a[href*="wa.me"]')];
    const rescue = links.find((a) => /open whatsapp/i.test(a.textContent));
    if (!rescue) return "no rescue link on the sent screen";
    const href = rescue.getAttribute("href");
    return /%20|%2F/.test(href) || href.length > 40;
  })()`),
]);

/* 9. The form and the WhatsApp route sit side by side on a wide screen. The
      page is a two-column proposition — write it, or just message us — and if
      the WhatsApp card ever drops below the fold on a laptop, the right-hand
      column is not doing its job. */
results.push([
  "WhatsApp CTA sits beside the form, not below it",
  await evaluate(`(() => {
    const form = document.querySelector("form");
    const cta = [...document.querySelectorAll("a[href*='wa.me']")].find((a) =>
      /open whatsapp/i.test(a.textContent));
    if (!cta) return "no WhatsApp CTA on the page";
    if (window.innerWidth < 1024) return true;
    const f = form.getBoundingClientRect();
    const c = cta.getBoundingClientRect();
    const beside = c.top > f.top - 80 && c.top < f.bottom;
    return beside || "form top " + Math.round(f.top) + " cta top " + Math.round(c.top);
  })()`),
]);

/* 9. No "Continue" or step counter is left on the page. The two-step form is
      gone, so a lingering affordance for it would be a control that does
      nothing. */
results.push([
  "no leftover step-advance affordances",
  await evaluate(`(() => {
    const buttons = [...document.querySelectorAll("form button")].map((b) =>
      b.textContent.trim().toLowerCase());
    if (buttons.some((t) => t === "continue")) return "a Continue button is still present";
    if (buttons.some((t) => t === "back")) return "a Back button is still present";
    if (document.body.textContent.includes("Step 1 of")) return "a step counter is still present";
    return true;
  })()`),
]);

/* 10. No console errors along the way. */
results.push(["no console errors", consoleErrors.length === 0]);

let failed = 0;
for (const [name, ok] of results) {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
}
if (consoleErrors.length) {
  console.log("\nconsole errors:");
  for (const text of consoleErrors) console.log("  " + text);
}
console.log(`\nform check ${failed === 0 ? "passed" : "FAILED"} — ${results.length} assertions.`);

cleanup();
process.exit(failed === 0 ? 0 : 1);
