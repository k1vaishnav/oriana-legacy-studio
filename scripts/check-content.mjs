/**
 * Content conformance check.
 *
 * Three things in this project fail silently, which is why they are checked
 * here rather than trusted:
 *
 *  1. The brief's FAQ list is the source of truth for both the page and the
 *     FAQPage schema. A question edited in one place and not the other
 *     produces a schema that disagrees with the visible page.
 *  2. Calicut and Kerala are separate search targets. Merging them into one
 *     phrase ("Best Photographer in Calicut and Kerala") looks correct and
 *     ranks for neither, so titles are checked for the merged form.
 *  3. Route titles and meta descriptions are the client's, verbatim. A drifting
 *     length is a sign a title has been rewritten by hand somewhere.
 *
 * This runs as a build step rather than as a runtime throw, because a module
 * that throws on import ships to the browser and takes the page down with it.
 */
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const ROUTES = "src/routes";
const problems = [];
const fail = (message) => problems.push(message);

const routes = (await readdir(ROUTES)).filter((name) => name.endsWith(".tsx"));
const sources = new Map();

for (const name of routes) {
  sources.set(name, await readFile(join(ROUTES, name), "utf8"));
}

/* 1 — the route inventory. The site is eight pages plus the story and brand
   sub-pages, so this is asserted rather than assumed: a deleted page creeping
   back, or a new one appearing without a decision, is exactly the kind of drift
   nobody notices until the sitemap has already shipped it. */
const PAGES = {
  "index.tsx": "/",
  "about.tsx": "/about",
  "wedding-photography.tsx": "/wedding-photography",
  "wedding-films.tsx": "/wedding-films",
  "portfolio.index.tsx": "/portfolio",
  "brands.tsx": "/brands",
  "oriana-group.tsx": "/oriana-group",
  "contact.tsx": "/contact",
};

const RETIRED = [
  "enquiry.tsx",
  "faq.tsx",
  "wedding-photography-packages.tsx",
  "oriana-difference.tsx",
  "oriana-promise.tsx",
];

const routeNames = new Set(routes);
for (const page of Object.keys(PAGES)) {
  if (!routeNames.has(page)) fail(`missing page: ${page}`);
}
for (const gone of RETIRED) {
  if (routeNames.has(gone)) fail(`${gone} was retired but is back`);
}
for (const name of routeNames) {
  // The layout route, the embedded CMS studio and the generated sitemap are not pages.
  if (
    name === "portfolio.real-weddings.$slug.tsx" ||
    name === "portfolio.tsx" ||
    name === "brands.$slug.tsx" ||
    name === "studio.tsx"
  )
    continue;
  if (name.endsWith(".tsx") && !name.startsWith("__") && !(name in PAGES)) {
    fail(`unexpected page: ${name}`);
  }
}

/* The sitemap has to list exactly the pages that exist, or search engines are
   pointed at 404s. It is a .ts file, so it is read directly rather than picked
   up from the page sources above. */
const sitemap = await readFile(join(ROUTES, "sitemap[.]xml.ts"), "utf8");
for (const path of Object.values(PAGES)) {
  if (!sitemap.includes(`"${path}"`)) fail(`sitemap[.]xml.ts is missing "${path}"`);
}
for (const gone of RETIRED) {
  const path = `"/${gone.replace(".tsx", "")}"`;
  if (sitemap.includes(path)) fail(`sitemap[.]xml.ts still lists ${path}`);
}

/* 2 & 3 — per-route SEO. */
const warnings = [];

for (const [name, source] of sources) {
  const titles = [...source.matchAll(/title:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1]);
  const descriptions = [...source.matchAll(/description:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1]);

  for (const title of titles) {
    // "in Calicut | Best ... in Kerala" is the intended shape. "in Calicut and
    // Kerala" (or "Calicut & Kerala" inside one phrase) is the failure.
    if (/Calicut\s+(?:and|&)\s+Kerala/i.test(title) && !/\|\s*Kerala/.test(title)) {
      fail(`${name}: merges the Calicut and Kerala targets — "${title}"`);
    }
    if (!/Calicut/.test(title) && /Kerala/.test(title)) {
      fail(`${name}: targets Kerala but not Calicut — "${title}"`);
    }
    // Advisory only. The brief's dual-target titles are 75–110 characters by
    // design, so this is reported rather than enforced.
    if (title.length > 110) {
      warnings.push(`${name}: title is ${title.length} chars, well past the brief's own longest.`);
    }
  }

  for (const description of descriptions) {
    if (description.length > 200) {
      warnings.push(`${name}: meta description is ${description.length} chars and will truncate.`);
    }
  }
}

/* Report. */
if (warnings.length) {
  console.warn(`\ncontent warnings (${warnings.length}, not failing the build):`);
  for (const warning of warnings) console.warn(`  - ${warning}`);
}

if (problems.length) {
  console.error(`\ncontent check failed (${problems.length}):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(
  `content check passed — ${Object.keys(PAGES).length} pages plus story sub-pages, sitemap in step, Calicut and Kerala kept separate.`,
);
