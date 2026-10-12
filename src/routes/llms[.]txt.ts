import { createFileRoute } from "@tanstack/react-router";

import {
  business as localBusiness,
  coverage as localCoverage,
  filmServices,
  groupBrands as localBrands,
  offices as localOffices,
  services,
  SITE_URL,
} from "@/lib/site";
import {
  getAboutPage,
  getBrands,
  getBrandsPage,
  getContactPage,
  getFilms,
  getFilmsPage,
  getHomePage,
  getPhotographyPage,
  getPortfolioPage,
  getSiteSettings,
  getWeddings,
} from "@/lib/cms";

/**
 * `/llms.txt` — the site in plain Markdown for AI crawlers and answer
 * engines (ChatGPT, Claude, Perplexity, Gemini, Copilot).
 *
 * Everything here is existing copy pulled live from the CMS (with the
 * built-in copy as fallback): no new keywords, no new claims, nothing
 * visitors can see. It stays accurate on its own because it reads the same
 * getters the pages read — a rename in the Studio appears here too.
 *
 * AI bots are allowed site-wide (see `public/robots.txt`), and the sitemap
 * carries the same URLs for classic crawlers.
 */
const oneLine = (value: unknown, fallback = ""): string =>
  typeof value === "string" && value.trim() !== ""
    ? value.replace(/\s+/g, " ").trim()
    : fallback;

async function buildLlms(): Promise<string> {
  const [settings, home, about, brandsPage, contact, portfolio, filmsMeta, photoMeta, brands, films, weddings] =
    await Promise.all([
      getSiteSettings(),
      getHomePage(),
      getAboutPage(),
      getBrandsPage(),
      getContactPage(),
      getPortfolioPage(),
      getFilmsPage(),
      getPhotographyPage(),
      getBrands(),
      getFilms(),
      getWeddings(),
    ]);

  const business = settings.business ?? localBusiness;
  const offices = settings.offices.length > 0 ? settings.offices : localOffices;
  const coverage = settings.coverage.length > 0 ? settings.coverage : localCoverage;
  const brandList = brands.length > 0 ? [...brands] : [...localBrands];

  const pages: { path: string; title: string; description: string }[] = [
    { path: "/", title: home.seoTitle, description: home.seoDescription },
    { path: "/wedding-photography", title: photoMeta.seoTitle, description: photoMeta.seoDescription },
    { path: "/wedding-films", title: filmsMeta.seoTitle, description: filmsMeta.seoDescription },
    { path: "/portfolio", title: portfolio.seoTitle, description: portfolio.seoDescription },
    { path: "/brands", title: brandsPage.seoTitle, description: brandsPage.seoDescription },
    { path: "/about", title: about.seoTitle, description: about.seoDescription },
    { path: "/contact", title: contact.seoTitle, description: contact.seoDescription },
  ];

  const lines: string[] = [
    "# Oriana Weddings",
    "",
    `> ${oneLine(business.tagline)} ${oneLine(localBusiness.longDescription)}`,
    "",
    "## Contact and studios",
    "",
    `- Phone: ${oneLine(business.phone)} (${oneLine(business.phoneHref)})`,
    `- Email: ${oneLine(business.email)}`,
    `- Instagram: ${oneLine(business.instagram)}`,
    `- YouTube: ${oneLine(business.youtube)}`,
    `- Facebook: ${oneLine(business.facebook)}`,
    ...offices.map(
      (o) => `- Studio: ${oneLine(o.city)} — ${oneLine(o.street)}, ${oneLine(o.postcode)} (${oneLine(o.phone)})`,
    ),
    "",
    "## Coverage areas",
    "",
    ...coverage.map((place) => `- ${oneLine(place)}`),
    "",
    "## Photography services",
    "",
    ...services.map((s) => `- ${oneLine(s.name)}: ${oneLine(s.description)}`),
    "",
    "## Film services",
    "",
    ...filmServices.map((s) => `- ${oneLine(s)}`),
    "",
    "## Pages",
    "",
    ...pages.map(
      (p) => `- [${oneLine(p.title)}](${SITE_URL}${p.path}): ${oneLine(p.description)}`,
    ),
    "",
    "## Brands",
    "",
    ...brandList.map((b) => {
      const url = b.slug === "oriana-weddings" ? `${SITE_URL}/` : `${SITE_URL}/${b.slug}`;
      return `- [${oneLine(b.name)}](${url}): ${oneLine(b.tagline)} ${oneLine(b.description)} Audience: ${oneLine(b.audience)} Offerings: ${b.offerings.map((o) => oneLine(o)).join("; ")}`;
    }),
    "",
    "## Wedding stories",
    "",
    ...weddings.map(
      (w) =>
        `- [${oneLine(w.couple)} — ${oneLine(w.title)}](${SITE_URL}/portfolio/real-weddings/${w.slug}): ${oneLine(w.type)} wedding at ${oneLine(w.venue)}, ${oneLine(w.location)}. ${oneLine(w.summary)}`,
    ),
    "",
    "## Wedding films",
    "",
    ...films.map(
      (f) =>
        `- [${oneLine(f.title)}](${SITE_URL}/wedding-films) (${oneLine(f.duration)}, ${oneLine(f.location)}): ${oneLine(f.description)} Watch: https://www.youtube.com/watch?v=${f.youtubeId ?? ""}`,
    ),
    "",
    "## Enquiries",
    "",
    `- Enquire: ${SITE_URL}/contact or WhatsApp ${oneLine(business.whatsapp)}.`,
    `- Full URL list: ${SITE_URL}/sitemap.xml`,
    "",
  ];

  return lines.join("\n");
}

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        // The file must never 500: crawlers treat errors as "no file".
        let body: string;
        try {
          body = await buildLlms();
        } catch {
          body = [
            "# Oriana Weddings",
            "",
            `> ${localBusiness.tagline} ${localBusiness.longDescription}`,
            "",
            `- Contact: ${localBusiness.phone}, ${localBusiness.email}`,
            `- Sitemap: ${SITE_URL}/sitemap.xml`,
            "",
          ].join("\n");
        }
        return new Response(body, {
          headers: {
            "content-type": "text/markdown; charset=utf-8",
            "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
