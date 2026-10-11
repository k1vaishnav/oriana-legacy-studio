import { SITE_URL, breadcrumbSchema } from "./site";
import { getImage, srcSet } from "./image-manifest";
import { cmsFallbackSrc, cmsSrcSet } from "./sanity-image";
import type { Photo } from "./photos";

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

/**
 * LCP preload for the hero photograph, so the browser starts the largest paint
 * before React hydrates instead of after.
 *
 * The hero `<img>` is rendered client-side (after loaders resolve + hydration),
 * which puts LCP discovery a full round-trip late. A `<link rel="preload"
 * as="image" imagesrcset>` in `<head>` lets the browser pick the right width
 * from the same ladder the `<img>` will use — CMS asset → Sanity CDN ladder,
 * otherwise the local AVIF ladder — at high priority.
 */
export type LcpPreloadLink = {
  rel: "preload";
  as: "image";
  href: string;
  imageSrcSet: string;
  imageSizes: string;
  fetchPriority: "high";
};

export function lcpPreload(
  photo: Photo | null | undefined,
  imageSizes = "100vw",
): LcpPreloadLink | null {
  try {
    if (!photo) return null;
    if (photo.asset) {
      const href = cmsFallbackSrc(photo.asset);
      const set = cmsSrcSet(photo.asset);
      if (!href || !set) return null;
      return {
        rel: "preload",
        as: "image",
        href,
        imageSrcSet: set,
        imageSizes,
        fetchPriority: "high",
      };
    }
    if (!photo.key) return null;
    const entry = getImage(photo.key);
    return {
      rel: "preload",
      as: "image",
      href: entry.src,
      imageSrcSet: srcSet(photo.key, "avif"),
      imageSizes,
      fetchPriority: "high",
    };
  } catch {
    return null;
  }
}

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
