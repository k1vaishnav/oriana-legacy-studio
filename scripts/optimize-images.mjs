/**
 * Image optimisation pipeline.
 *
 * Reads the raw photographs in src/assets and emits, for every image:
 *   - AVIF + WebP at several widths (responsive srcset)
 *   - a 24px-wide LQIP base64 (blurred placeholder, inlined into the markup)
 *   - dominant colour, used as the pre-decode background so nothing flashes
 *
 * Output lands in public/img, which is copied verbatim to the build.
 * Run with: node scripts/optimize-images.mjs
 */
import { mkdir, readdir, readFile, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src", "assets");
const outDir = path.join(root, "public", "img");
const manifestPath = path.join(root, "src", "lib", "images.json");

const WIDTHS = [480, 800, 1200, 1600, 1920];
// AVIF is the format every modern browser will actually fetch, so it is tuned
// for the smallest honest file. WebP and JPEG only ever get chosen by older
// clients, so they are tuned to be merely good.
//
// `effort` is AVIF's search depth. 9 finds the smallest file but costs minutes
// per image, which does not scale to a library; 5 is within a couple of percent
// of it and processes a full library in a reasonable time.
const QUALITY = { avif: 58, webp: 72, jpeg: 78 };
const EFFORT = { avif: 5, webp: 4 };

const slug = (name) =>
  name
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/^oriana-weddings-/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const human = (bytes) =>
  bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(0)} kB`;

async function main() {
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(srcDir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  const manifest = {};
  let before = 0;
  let after = 0;

  for (const file of files) {
    const key = slug(file);
    const source = path.join(srcDir, file);
    const input = await readFile(source);
    before += input.length;

    const image = sharp(input, { failOn: "none" });
    const meta = await image.metadata();
    const maxWidth = Math.min(meta.width ?? 1920, WIDTHS[WIDTHS.length - 1]);
    const widths = WIDTHS.filter((w) => w <= maxWidth);
    if (widths[widths.length - 1] !== maxWidth && maxWidth < 1920) widths.push(maxWidth);
    if (widths.length === 0) widths.push(maxWidth);

    const sources = {};

    for (const width of widths) {
      const base = sharp(input, { failOn: "none" })
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .toColorspace("srgb");

      const avifName = `${key}-${width}.avif`;
      const webpName = `${key}-${width}.webp`;
      const jpegName = `${key}-${width}.jpg`;

      const avif = await base
        .clone()
        .avif({ quality: QUALITY.avif, effort: EFFORT.avif, chromaSubsampling: "4:2:0" })
        .toBuffer();
      const webp = await base
        .clone()
        .webp({ quality: QUALITY.webp, effort: EFFORT.webp })
        .toBuffer();
      const jpeg = await base
        .clone()
        .jpeg({
          quality: QUALITY.jpeg,
          progressive: true,
          mozjpeg: true,
          chromaSubsampling: "4:2:0",
        })
        .toBuffer();

      await Promise.all([
        writeFile(path.join(outDir, avifName), avif),
        writeFile(path.join(outDir, webpName), webp),
        writeFile(path.join(outDir, jpegName), jpeg),
      ]);

      sources[width] = {
        avif: `/img/${avifName}`,
        webp: `/img/${webpName}`,
        jpeg: `/img/${jpegName}`,
        bytes: { avif: avif.length, webp: webp.length, jpeg: jpeg.length },
      };
      after += avif.length + webp.length + jpeg.length;
    }

    // Largest entry is the fallback / preload candidate.
    const largest = widths[widths.length - 1];
    const fallback = sources[largest];

    // Placeholder background for the pre-decode box. Uses the channel *mean*
    // rather than `stats().dominant`: dominant is the single most common colour
    // bucket, which on these vignetted photographs lands on near-black and
    // flashes dark against a white page — exactly what the placeholder is meant
    // to prevent. The mean is representative of the whole frame.
    const stats = await sharp(input, { failOn: "none" })
      .rotate()
      .resize(24, 24, { fit: "inside" })
      .stats();

    const toHex = (v) =>
      Math.max(0, Math.min(255, Math.round(v)))
        .toString(16)
        .padStart(2, "0");

    const color = `#${stats.channels
      .slice(0, 3)
      .map((c) => toHex(c.mean))
      .join("")}`;

    const lqipBuffer = await sharp(input, { failOn: "none" })
      .rotate()
      .resize(20, 20, { fit: "inside" })
      .blur(1.2)
      .jpeg({ quality: 42, progressive: true })
      .toBuffer();
    const lqip = `data:image/jpeg;base64,${lqipBuffer.toString("base64")}`;

    manifest[key] = {
      width: meta.width ?? largest,
      height: meta.height ?? largest,
      ratio: (meta.width ?? 1) / (meta.height ?? 1),
      color,
      lqip,
      widths,
      sources,
      src: fallback.jpeg,
      avifSrc: fallback.avif,
      webpSrc: fallback.webp,
    };

    const total = Object.values(sources).reduce((sum, s) => sum + s.bytes.avif, 0);
    console.log(
      `  ${key.padEnd(42)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} ` +
        `${human(input.length).padStart(8)} -> ${human(total).padStart(8)} avif (${widths.length} widths)`,
    );
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `\n  total original ${human(before)} -> all derivatives ${human(after)} across ${
      Object.keys(manifest).length
    } images`,
  );
  console.log(`  manifest -> ${path.relative(root, manifestPath)}`);
}

if (!existsSync(srcDir)) {
  console.error(`No source directory at ${srcDir}`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
