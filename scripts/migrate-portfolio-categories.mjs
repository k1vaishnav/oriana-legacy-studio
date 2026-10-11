/**
 * One-time migration: portfolio wall with per-photo ticks → categories that
 * own their photos.
 *
 * Old shape: `library[]` (photo + caption + ticked `categories`) plus a
 * `filterLabels[]` button list. New shape: `categories[]` (label + id +
 * `photos[]`), no ticks anywhere — each photo lives in exactly one category,
 * so it can never appear twice.
 *
 * Photos are bucketed by content (see BUCKET_BY_KEY); labels and order follow
 * the existing button rows, so renames and the deleted Venues button carry
 * over. Photos the script cannot recognise (added in the Studio after
 * seeding) are appended to the first category and reported loudly — nothing
 * is ever dropped.
 *
 * Safe: without `--write` it only prints the plan (dry run, needs no token).
 *
 *   node scripts/migrate-portfolio-categories.mjs
 *   SANITY_API_TOKEN=<editor-token> node scripts/migrate-portfolio-categories.mjs --write
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

/** Archive key → owning category, assigned by photo content. */
const BUCKET_BY_KEY = {
  "home-hero-user": "candid",
  "calicut-cinematic-wedding-hero": "candid",
  "kerala-cinematic-wedding-film-still": "candid",
  "haldi-bride-with-friends": "candid",
  "detail-reception-monochrome": "candid",
  "instagram-04": "candid",
  "instagram-12": "candid",
  "ceremony-temple-ritual": "traditional",
  "ceremony-south-asian-prewedding": "traditional",
  "detail-bride-groom-feet": "traditional",
  "detail-reception-cake": "traditional",
  "instagram-03": "traditional",
  "instagram-05": "traditional",
  "instagram-06": "traditional",
  "hero-traditional-intimate": "intimate",
  "instagram-09": "intimate",
  "instagram-10": "intimate",
  "instagram-11": "intimate",
  "detail-bride-henna-face": "haldi",
  "detail-bouquet": "haldi",
  "portrait-bride-sunlight": "haldi",
  "calicut-church-wedding-ceremony": "christian",
  "church-golden-altar": "christian",
  "church-altar-candid": "christian",
  "church-outside-joy": "christian",
  "instagram-01": "pre",
  "instagram-02": "pre",
  "instagram-07": "pre",
  "instagram-08": "pre",
  "closing-cta-user": "pre",
};

const DEFAULT_LABELS = {
  candid: "Candid",
  traditional: "Traditional",
  intimate: "Intimate",
  haldi: "Haldi & Mehendi",
  christian: "Christian",
  pre: "Pre-wedding",
};

// NOTE: the whole document is fetched and written back — projecting a subset
// here once wiped the page's other fields, so never narrow this query.
const doc = await client.fetch(`*[_type == "portfolioPage" && _id == "portfolioPage"][0]`);
if (!doc) throw new Error('No "portfolioPage" document — run `npm run cms:seed` first.');
if (Array.isArray(doc.categories) && doc.categories.length > 0) {
  console.log("Already on the owned-photos shape — nothing to do.");
  process.exit(0);
}
if (!Array.isArray(doc.library) || doc.library.length === 0) {
  console.log("Library is empty — nothing to migrate.");
  process.exit(0);
}

// Seed uploads store the archive key as the asset filename (`<key>.jpg`).
const assets = await client.fetch(`*[_type == "sanity.imageAsset"]{ _id, originalFilename }`);
const keyByAssetId = new Map(
  (assets ?? [])
    .filter((a) => typeof a.originalFilename === "string" && a.originalFilename.endsWith(".jpg"))
    .map((a) => [a._id, a.originalFilename.slice(0, -".jpg".length)]),
);

// Labels and order follow the existing button rows (renames carry over,
// deleted buttons stay deleted); anything missing falls back to defaults.
const oldLabels = new Map(
  (Array.isArray(doc.filterLabels) ? doc.filterLabels : [])
    .filter((f) => f?.id && f?.label && f.id !== "all")
    .map((f) => [f.id, f.label]),
);
const order = [...oldLabels.keys()];
for (const id of Object.keys(DEFAULT_LABELS)) if (!oldLabels.has(id)) order.push(id);

const buckets = new Map(order.map((id) => [id, []]));
const unknown = [];
for (const item of doc.library) {
  const ref = item?.photo?.asset?._ref;
  const key = ref ? keyByAssetId.get(ref) : undefined;
  const bucket = key ? (BUCKET_BY_KEY[key] ?? null) : null;
  const { categories: _dropped, ...photo } = item ?? {};
  if (bucket && buckets.has(bucket)) buckets.get(bucket).push(photo);
  else {
    unknown.push(item?.caption ?? key ?? "(no caption)");
    buckets.get(order[0]).push(photo);
  }
}

const categories = order.map((id, i) => ({
  _key: `cat-${i + 1}-${id}`,
  label: oldLabels.get(id) ?? DEFAULT_LABELS[id] ?? id,
  id: { _type: "slug", current: id },
  photos: buckets.get(id),
}));

for (const cat of categories) {
  console.log(`${cat.label}: ${cat.photos.length} photos`);
}
if (unknown.length > 0) {
  console.log(`\nUnrecognised photos moved into "${categories[0].label}" (never dropped):`);
  for (const caption of unknown) console.log(`  - ${caption}`);
}

if (!write) {
  console.log("\nDry run — re-run with --write to apply.");
  process.exit(0);
}

const next = { ...doc, categories };
delete next.library;
delete next.filterLabels;
await client.createOrReplace(next);
console.log("\nMigrated: categories own their photos, ticks and button rows retired.");
