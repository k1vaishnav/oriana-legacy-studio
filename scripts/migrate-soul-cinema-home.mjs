/**
 * One-time migration: Soul + Cinema lives on the home page now.
 *
 * The manifesto band (words, background film, still poster) used to sit in
 * Site settings, far from the home page it belongs to. This copies it onto
 * the home document and removes it from Site settings — after which the
 * Studio shows it inside 🏠 Home, next to the films section.
 *
 * Only runs when the home page has no band of its own yet; re-running is a
 * no-op. Featured films need no migration (empty picks = newest four, which
 * is exactly today's behaviour).
 *
 *   node scripts/migrate-soul-cinema-home.mjs
 *   SANITY_API_TOKEN=<editor-token> node scripts/migrate-soul-cinema-home.mjs --write
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

// Whole documents, always — projecting a subset once wiped a page's other
// fields, so never narrow these queries.
const migrateOne = async (id) => {
  const doc = await client.fetch(`*[_id == "${id}"][0]`);
  if (!doc) {
    console.log(`${id}: missing — skipped.`);
    return;
  }
  if (doc.soulCinema) {
    console.log(`${id}: already has the band — nothing to do.`);
    return;
  }
  // Band source, wherever it still lives: the old settings home, its draft,
  // or the already-migrated published home page.
  const pool = await client.fetch(
    `{"a": *[_id == "siteSettings"][0].soulCinema, "b": *[_id == "drafts.siteSettings"][0].soulCinema, "c": *[_id == "homePage"][0].soulCinema}`,
  );
  const band = pool?.a ?? pool?.b ?? pool?.c ?? null;
  if (!band) {
    console.log(`${id}: no band anywhere to move — nothing to do.`);
    return;
  }
  console.log(`move   Soul + Cinema band → ${id} (“${band.title ?? "untitled"}”)`);
  if (!write) return;
  await client.createOrReplace({ ...doc, soulCinema: band });
  // The old settings home stops carrying the band, so the Studio never shows
  // the same section twice (or flags it unknown once the schema moves on).
  const settingsId = id === "homePage" ? "siteSettings" : "drafts.siteSettings";
  const settings = await client.fetch(`*[_id == "${settingsId}"][0]`);
  if (settings?.soulCinema) {
    const next = { ...settings };
    delete next.soulCinema;
    await client.createOrReplace(next);
  }
  console.log(`Migrated ${id}.`);
};

for (const id of ["homePage", "drafts.homePage"]) {
  await migrateOne(id);
}

if (!write) {
  console.log("\nDry run — re-run with --write to apply.");
}
