/**
 * One-time re-curation: point each brand's cover + gallery at brand-fitting
 * archive photos.
 *
 * The seed aimed every brand at generic wedding frames; a baby studio showing
 * wedding-day frames reads wrong. This maps each brand to the closest frames
 * in the local archive (tender close-ups for Baby Crew, editorial monochrome
 * for DEOR, gatherings and reception for ORION, fine-art details for Odonata)
 * so every brand page opens on photos that feel like that brand — until real
 * brand shoots replace them in one click in the Studio.
 *
 * Only `cover` and `gallery` are touched; every other field (and the Oriana
 * Weddings house brand) is left exactly as is. The whole document is fetched
 * and written back — never narrow that query.
 *
 *   node scripts/recurate-brands.mjs
 *   SANITY_API_TOKEN=<editor-token> node scripts/recurate-brands.mjs --write
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";

// Minimal `.env` support (no dependency): exported shell vars win.
const envFromFile = {};
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) envFromFile[m[1]] = m[2];
  }
}
const env = (k) => process.env[k] ?? envFromFile[k];

const projectId = env("SANITY_PROJECT_ID") ?? env("VITE_SANITY_PROJECT_ID");
const dataset = env("SANITY_DATASET") ?? env("VITE_SANITY_DATASET") ?? "production";
const token = env("SANITY_API_TOKEN");
const write = process.argv.includes("--write");

if (!projectId) throw new Error("Set SANITY_PROJECT_ID (or VITE_SANITY_PROJECT_ID).");
if (write && !token) throw new Error("Set SANITY_API_TOKEN (Editor role, from sanity.io/manage).");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token: token ?? undefined,
  useCdn: false,
});

/** Brand slug → {cover, gallery} archive keys. Oriana Weddings untouched. */
const CURATION = {
  "baby-crew-studios": {
    cover: "portrait-bride-sunlight",
    gallery: [
      "haldi-bride-with-friends",
      "detail-bride-henna-face",
      "detail-bouquet",
      "church-outside-joy",
    ],
  },
  "deor-fashion": {
    cover: "detail-reception-monochrome",
    gallery: [
      "calicut-cinematic-wedding-hero",
      "hero-traditional-intimate",
      "kerala-cinematic-wedding-film-still",
      "portrait-bride-sunlight",
    ],
  },
  "orion-events": {
    cover: "detail-reception-cake",
    gallery: [
      "closing-cta-user",
      "church-altar-candid",
      "calicut-church-wedding-ceremony",
      "haldi-bride-with-friends",
    ],
  },
  "odonata-republic": {
    cover: "detail-bouquet",
    gallery: [
      "detail-bride-henna-face",
      "detail-bride-groom-feet",
      "detail-reception-monochrome",
      "ceremony-temple-ritual",
    ],
  },
};

const assets = await client.fetch(`*[_type == "sanity.imageAsset"]{ _id, originalFilename }`);
const refByKey = new Map(
  (assets ?? [])
    .filter((a) => typeof a.originalFilename === "string" && a.originalFilename.endsWith(".jpg"))
    .map((a) => [a.originalFilename.slice(0, -".jpg".length), a._id]),
);
const img = (key) => ({
  _type: "image",
  asset: { _type: "reference", _ref: refByKey.get(key) },
});

for (const [slug, { cover, gallery }] of Object.entries(CURATION)) {
  const doc = await client.fetch(`*[_type == "brand" && slug.current == $slug][0]`, { slug });
  if (!doc) {
    console.log(`skip   ${slug} — no such brand`);
    continue;
  }
  const missing = [cover, ...gallery].filter((k) => !refByKey.has(k));
  if (missing.length > 0) {
    console.log(`skip   ${slug} — no uploaded asset for: ${missing.join(", ")}`);
    continue;
  }
  console.log(`curate ${slug}: cover=${cover} gallery=[${gallery.join(",")}]`);
  if (!write) continue;
  await client.createOrReplace({
    ...doc,
    cover: img(cover),
    gallery: gallery.map(img),
  });
}

if (!write) console.log("\nDry run — re-run with --write to apply.");
else console.log("\nDone: brand pages point at brand-fitting photos.");
