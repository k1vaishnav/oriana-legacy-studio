import { SITE_URL, breadcrumbSchema } from "./site";

/**
 * One place to assemble a route's head, so eleven routes cannot drift apart on
 * canonical URLs, Open Graph tags or breadcrumbs.
 *
 * The titles themselves are per-route and come from the content brief, where
 * "Calicut" and "Kerala" are written as separate target phrases rather than
 * blended into one keyword — a photographer in Calicut and a photographer in
 * Kerala are different searches, and the copy reflects that.
 */
type SeoInput = {
  title: string;
  description: string;
  path: string;
  /** Extra schema.org graph nodes for this route, e.g. an FAQPage or a Service. */
  schema?: Record<string, unknown>[];
  /** Set false on a route that should not be indexed, e.g. a thin filter view. */
  index?: boolean;
  /**
   * Absolute URL of the social share image. Routes with a real photograph —
   * a wedding story, a portfolio — pass their cover, so a shared link previews
   * with the work rather than with nothing. Left unset on routes that have no
   * single representative frame.
   */
  image?: string;
};

type SeoHead = {
  meta: Record<string, string>[];
  links: Record<string, string>[];
  scripts: { type: string; children: string }[];
};

export function seo({
  title,
  description,
  path,
  schema = [],
  index = true,
  image,
}: SeoInput): SeoHead {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  // Crawlers resolve `og:image` against the *page*, not against the site, and
  // most of them do not resolve a root-relative path at all. The manifest stores
  // site-relative paths, so the origin is prepended here rather than at every
  // call site.
  const imageUrl = image && (image.startsWith("/") ? `${SITE_URL}${image}` : image);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Oriana Weddings" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: imageUrl ? "summary_large_image" : "summary" },
      ...(imageUrl ? [{ property: "og:image", content: imageUrl }] : []),
      {
        name: "robots",
        content: index ? "index, follow, max-image-preview:large" : "noindex, follow",
      },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      ...(index && path !== "/"
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(
                breadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: title.split("|")[0]?.trim() || title, path },
                ]),
              ),
            },
          ]
        : []),
      ...schema.map((node) => ({
        type: "application/ld+json",
        children: JSON.stringify(node),
      })),
    ],
  };
}
