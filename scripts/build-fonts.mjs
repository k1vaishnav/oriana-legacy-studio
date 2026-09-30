/**
 * Self-hosted font pipeline.
 *
 * Google Fonts is a render-blocking third party: a CSS round trip to
 * fonts.googleapis.com, then a second round trip to fonts.gstatic.com, then the
 * font itself. Three dependent requests before any text can paint, and the
 * stylesheet we were loading asked for 15 separate faces.
 *
 * The design system is a single typeface, so the family list below is
 * deliberately short: one sans, roman only. Anything added here needs a rule in
 * `src/styles.css` saying how the system is allowed to use it, because keeping
 * the face count at one is a design decision rather than a default.
 *
 * DM Sans is a variable font, so the whole usable weight axis collapses into a
 * single woff2 per subset: we ask Google for the range once rather than for
 * every weight we happen to use, and the browser interpolates from that one
 * file. That is what lets the system get real contrast between a heavy display
 * line and a light caption without paying for a second family. We then read the
 * vertical metrics out of the face and emit a metric-matched local fallback, so
 * the moment the webfont swaps in nothing on the page moves.
 *
 * Run with: node scripts/build-fonts.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const wawoff2 = require("wawoff2");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "fonts");
const cssPath = path.join(root, "src", "styles", "fonts.css");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * x-height of the system faces we fall back to, as a fraction of the em, taken
 * from their own OS/2 sxHeight / unitsPerEm. Needed to size-adjust the fallback
 * so its glyphs land at the same size as the webfont's.
 */
const FALLBACK_XHEIGHT = {
  "Playfair Display Fallback": 0.46, // Georgia 0.481 / Times New Roman 0.447
  "Poppins Fallback": 0.548, // Poppins carries a deliberately large x-height
};

/**
 * Two families, roman plus italic where the family has one.
 *
 * A serif for display and a geometric sans for everything structural. The
 * split is the whole point of the editorial system: headlines are set in the
 * serif at large sizes with tight tracking, and every piece of metadata,
 * navigation, label and caption is set in the sans at small sizes with wide
 * tracking. Neither face does the other's job.
 *
 * Asking for the weight axis rather than fixed weights keeps this at one woff2
 * per subset per style. `latin` is the subset this site's copy lives in;
 * `latin-ext` is kept for the accented place names and the destinations we
 * shoot.
 */
const FAMILIES = [
  { name: "Playfair Display", slug: "playfair-display", wght: "400..900", ital: true },
  // The brief asks for a restrained grotesque for navigation, buttons, metadata
  // and captions, alongside the high-contrast display serif. Inter is a variable
  // font, so the whole 300-600 axis collapses into one woff2 per subset the same
  // way Playfair's does.
  { name: "Inter", slug: "inter", wght: "300..600", ital: false },
];

/** Subsets worth paying for. The rest is dead weight for a Latin-script site. */
const KEEP = new Set(["latin", "latin-ext"]);

/** "100..1000" | "400" | "400,700" -> [min, max] for the @font-face descriptor. */
const axisBounds = (wght) => {
  const bounds = wght
    .split(",")
    .flatMap((part) => part.trim().split(".."))
    .map(Number)
    .filter((n) => Number.isFinite(n));
  return [Math.min(...bounds), Math.max(...bounds)];
};

/* A family that has no italic axis has to be asked for without one, or Google
   returns 400 and the whole font build dies on a detail nobody would notice.
   Static families use `;` because each weight is a separate file. */
const spec = ({ wght, ital, static: isStatic }) =>
  isStatic ? `wght@${wght}` : ital ? `ital,wght@0,${wght};1,${wght}` : `wght@${wght}`;

/* ------------------------------------------------------------------ */
/* woff2 CSS parsing                                                   */
/* ------------------------------------------------------------------ */

function parseBlocks(css) {
  const blocks = [];
  // The subset comment is only emitted for the woff2 response, so it is optional.
  const re = /(?:\/\*\s*([a-z-]+)\s*\*\/\s*)?@font-face\s*\{([^}]+)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const body = m[2];
    const pick = (prop) => body.match(new RegExp(`${prop}:\\s*([^;]+);`))?.[1]?.trim();
    const url = body.match(/url\((https:[^)]+)\)/)?.[1];
    if (!url) continue;
    const unicodeRange = pick("unicode-range");
    blocks.push({
      subset: m[1] ?? (unicodeRange?.includes("U+0100") ? "latin-ext" : "latin"),
      url,
      family: pick("font-family")?.replace(/['"]/g, ""),
      style: pick("font-style") ?? "normal",
      weight: pick("font-weight") ?? "400",
      unicodeRange,
    });
  }
  return blocks;
}

/**
 * Read the vertical metrics a browser will actually use, plus x-height, out of
 * the woff2. We decompress to a plain sfnt and read head / hhea / OS/2 directly.
 */
async function readMetrics(woff2Buffer) {
  const ttf = Buffer.from(await wawoff2.decompress(woff2Buffer));
  const numTables = ttf.readUInt16BE(4);
  const tables = {};
  for (let i = 0; i < numTables; i++) {
    const p = 12 + i * 16;
    tables[ttf.subarray(p, p + 4).toString("utf8")] = ttf.readUInt32BE(p + 8);
  }
  for (const tag of ["head", "hhea", "OS/2"]) {
    if (tables[tag] === undefined) throw new Error(`missing ${tag} table`);
  }

  const unitsPerEm = ttf.readUInt16BE(tables.head + 18);
  if (!unitsPerEm) throw new Error("unitsPerEm is 0");

  const hheaAsc = ttf.readUInt16BE(tables.hhea + 4);
  const hheaDesc = Math.abs(ttf.readInt16BE(tables.hhea + 6));
  const hheaGap = ttf.readInt16BE(tables.hhea + 8);

  const os2 = tables["OS/2"];
  const version = ttf.readUInt16BE(os2);
  // USE_TYPO_METRICS (fsSelection bit 7) is what makes a browser prefer OS/2.
  const useTypo = Boolean(ttf.readUInt16BE(os2 + 62) & 0x0080);
  const typoAsc = Math.abs(ttf.readInt16BE(os2 + 68));
  const typoDesc = Math.abs(ttf.readInt16BE(os2 + 70));
  const typoGap = ttf.readInt16BE(os2 + 72);

  const ascent = useTypo && typoAsc ? typoAsc : hheaAsc;
  const descent = useTypo && typoDesc ? typoDesc : hheaDesc;
  const gap = useTypo && typoAsc ? typoGap : hheaGap;

  // sxHeight only exists from OS/2 version 2 onward.
  const sxHeight = version >= 2 ? ttf.readInt16BE(os2 + 86) : 0;

  const pct = (n) => Math.round((n / unitsPerEm) * 10000) / 100;

  return {
    ascent: pct(ascent),
    descent: pct(descent),
    lineGap: pct(gap),
    xHeight: sxHeight > 0 ? sxHeight / unitsPerEm : 0,
  };
}

const fetchCss = (family, ua, specString) =>
  fetch(
    `https://fonts.googleapis.com/css2?family=${family.name.replace(/ /g, "+")}:${specString}&display=swap`,
    { headers: { "User-Agent": ua } },
  ).then((r) => {
    if (!r.ok) throw new Error(`${family.name}: ${r.status}`);
    return r.text();
  });

/* ------------------------------------------------------------------ */

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(path.dirname(cssPath), { recursive: true });

  const faces = [];
  const fallbacks = [];
  let bytes = 0;

  for (const family of FAMILIES) {
    const specString = spec(family);
    const css = await fetchCss(family, UA, specString);
    const blocks = parseBlocks(css).filter((b) => KEEP.has(b.subset));

    // Every weight of a variable font points at the same file, so dedupe on it.
    // A static family has one file per weight, so its weight is part of the key.
    const seen = new Map();
    for (const block of blocks) {
      const key = family.static
        ? `${block.style}|${block.subset}|${block.weight}`
        : `${block.style}|${block.subset}`;
      if (seen.has(key)) continue;
      seen.set(key, block);
    }

    const weights = { normal: axisBounds(family.wght), italic: axisBounds(family.wght) };

    console.log(`\n  ${family.name}  wght ${family.wght}`);

    for (const block of seen.values()) {
      const isItalic = block.style === "italic";
      // A static face is exactly one weight, so it keeps the weight Google
      // served rather than the range the family as a whole spans.
      const range = family.static
        ? [Number(block.weight), Number(block.weight)]
        : weights[isItalic ? "italic" : "normal"];
      const styleSlug = isItalic ? "italic" : "normal";
      const weightSlug = family.static ? `-${range[0]}` : "";
      const file = `${family.slug}-${styleSlug}${weightSlug}-${block.subset}.woff2`;

      const res = await fetch(block.url, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`${block.url}: ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      await writeFile(path.join(outDir, file), buffer);
      bytes += buffer.length;

      faces.push({
        family: block.family,
        style: block.style,
        min: Math.min(...range),
        max: Math.max(...range),
        file,
        unicodeRange: block.unicodeRange,
        bytes: buffer.length,
      });

      console.log(
        `    ${file.padEnd(42)} ${(buffer.length / 1024).toFixed(1)} kB  ` +
          `wght ${Math.min(...range)}-${Math.max(...range)}`,
      );

      // One fallback per family, taken from the roman face. Metrics are
      // effectively identical across italic and across weights.
      if (isItalic || block.subset !== "latin") continue;
      if (fallbacks.some((f) => f.name === `${block.family} Fallback`)) continue;

      let metrics;
      try {
        metrics = await readMetrics(buffer);
      } catch (error) {
        console.warn(`    ! could not read metrics: ${error.message}`);
        continue;
      }

      const name = `${block.family} Fallback`;
      const refX = FALLBACK_XHEIGHT[name] ?? 0.5;
      const sizeAdjust = metrics.xHeight ? Math.round((metrics.xHeight / refX) * 10000) / 100 : 100;

      const isSerif = /serif|garamond|times|georgia/i.test(family.slug);
      fallbacks.push({
        name,
        local: isSerif
          ? 'local("Georgia"), local("Times New Roman")'
          : 'local("Helvetica Neue"), local("Arial"), local("Segoe UI")',
        sizeAdjust,
        ...metrics,
      });

      console.log(
        `    fallback ${name} — size-adjust ${sizeAdjust}%, asc ${metrics.ascent}%, ` +
          `desc ${metrics.descent}%, gap ${metrics.lineGap}%`,
      );
    }
  }

  const out = [
    "/* GENERATED by scripts/build-fonts.mjs — do not edit by hand. */",
    "/* Self-hosted Playfair Display + Poppins, latin / latin-ext only, plus */",
    "/* a metric-matched local fallback per family so the swap to the        */",
    "/* webfont reflows nothing.                                            */",
    "",
  ];

  for (const fb of fallbacks) {
    out.push(
      "@font-face {",
      `  font-family: "${fb.name}";`,
      `  src: ${fb.local};`,
      `  size-adjust: ${fb.sizeAdjust}%;`,
      `  ascent-override: ${fb.ascent}%;`,
      `  descent-override: ${fb.descent}%;`,
      `  line-gap-override: ${fb.lineGap}%;`,
      "}",
      "",
    );
  }

  for (const face of faces) {
    const weight = face.min === face.max ? `${face.min}` : `${face.min} ${face.max}`;
    out.push(
      "@font-face {",
      `  font-family: "${face.family}";`,
      `  font-style: ${face.style};`,
      `  font-weight: ${weight};`,
      "  font-display: swap;",
      `  src: url("/fonts/${face.file}") format("woff2");`,
      ...(face.unicodeRange ? [`  unicode-range: ${face.unicodeRange};`] : []),
      "}",
      "",
    );
  }

  await writeFile(cssPath, out.join("\n"));

  console.log(`\n  ${faces.length} woff2 files, ${(bytes / 1024).toFixed(0)} kB on disk`);
  console.log(`  css -> ${path.relative(root, cssPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
