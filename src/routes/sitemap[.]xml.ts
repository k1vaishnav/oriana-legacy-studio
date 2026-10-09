import { createFileRoute } from "@tanstack/react-router";

import { weddings } from "@/lib/portfolio";
import { SITE_URL, groupBrands } from "@/lib/site";

const staticPaths = [
  "/",
  "/about",
  "/wedding-photography",
  "/wedding-films",
  "/portfolio",
  "/oriana-group",
  "/contact",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const paths = [
          ...staticPaths,
          ...groupBrands.map((brand) => `/oriana-group/${brand.slug}`),
          ...weddings.map((wedding) => `/portfolio/real-weddings/${wedding.slug}`),
        ];

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
