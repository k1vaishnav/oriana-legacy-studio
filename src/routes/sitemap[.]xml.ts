import { createFileRoute } from "@tanstack/react-router";

import { weddings as localWeddings } from "@/lib/portfolio";
import { groupBrands as localBrands, SITE_URL } from "@/lib/site";
import { getBrands, getWeddings } from "@/lib/cms";

const staticPaths = [
  "/",
  "/about",
  "/wedding-photography",
  "/wedding-films",
  "/portfolio",
  "/brands",
  "/baby-crew-studios",
  "/deor-fashion",
  "/orion-events",
  "/odonata-republic",
  "/oriana-group",
  "/contact",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // CMS slugs when configured, built-in slugs otherwise — the sitemap
        // must never 500, so anything unexpected falls back to static.
        let weddingPaths = localWeddings.map(
          (wedding) => `/portfolio/real-weddings/${wedding.slug}`,
        );
        // Brands live at top-level addresses (`/deor-fashion`) — short links.
        let brandPaths = localBrands
          .filter((brand) => brand.slug !== "oriana-weddings")
          .map((brand) => `/${brand.slug}`);
        try {
          const [weddings, brands] = await Promise.all([getWeddings(), getBrands()]);
          if (weddings.length > 0) {
            weddingPaths = weddings.map((w) => `/portfolio/real-weddings/${w.slug}`);
          }
          const shareable = brands.filter((b) => b.slug !== "oriana-weddings");
          if (shareable.length > 0) {
            brandPaths = shareable.map((b) => `/${b.slug}`);
          }
        } catch {
          /* static fallbacks above stand */
        }
        // Static paths already name the four brand pages above; CMS brands
        // only add future ones — deduped so no URL is ever listed twice.
        const paths = [...new Set([...staticPaths, ...weddingPaths, ...brandPaths])];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join("\n")}
</urlset>
`;

        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
