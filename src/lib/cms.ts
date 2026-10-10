/**
 * The CMS layer.
 *
 * Every editable value on the site is read through here: try Sanity, fall back
 * to the built-in content. When `VITE_SANITY_PROJECT_ID` is unset (local dev,
 * or before the CMS exists) nothing is fetched and the site renders exactly as
 * it does today — the CMS can never blank a page.
 *
 * Image fields in Sanity hold keys into the 30-frame local archive, never
 * uploads, so CMS-chosen photographs stay inside the pre-generated
 * AVIF/WebP/JPEG ladder. Keys are validated at the boundary; a bad key falls
 * back per-field rather than failing the whole document.
 *
 * Fetches are memoized per session, so a root loader plus a page loader asking
 * for the same document costs one request.
 */
import type { SanityClient } from "@sanity/client";
import { getRouteApi } from "@tanstack/react-router";

import { films as localFilms, type Film } from "./films";
import manifest from "./images.json";
import type { ImageKey } from "./image-manifest";
import { weddings as localWeddings, type Wedding } from "./portfolio";
import {
  business as localBusiness,
  coverage as localCoverage,
  groupBrands as localBrands,
  groupStatement,
  offices as localOffices,
  soulCinema as localSoulCinema,
  stats as localStats,
  type GroupBrand,
} from "./site";

export const isCmsConfigured =
  Boolean(import.meta.env?.["VITE_SANITY_PROJECT_ID"]) &&
  Boolean(import.meta.env?.["VITE_SANITY_DATASET"]);

let client: SanityClient | null = null;
async function getClient(): Promise<SanityClient | null> {
  if (!isCmsConfigured) return null;
  if (!client) {
    // Dynamic import: the client (~100 KB) stays out of the main bundle and
    // downloads only when the CMS is actually configured.
    const { createClient } = await import("@sanity/client");
    client = createClient({
      projectId: import.meta.env["VITE_SANITY_PROJECT_ID"] as string,
      dataset: import.meta.env["VITE_SANITY_DATASET"] as string,
      apiVersion: "2025-01-01",
      // Published content on the edge cache — the fastest read path, and it
      // keeps draft editing invisible until publish.
      useCdn: true,
      perspective: "published",
    });
  }
  return client;
}

const memo = new Map<string, Promise<unknown>>();
function cached<T>(key: string, fetch: () => Promise<T>, fallback: T): Promise<T> {
  const hit = memo.get(key) as Promise<T> | undefined;
  if (hit) return hit;
  const task = (async () => {
    try {
      return await fetch();
    } catch {
      return fallback;
    }
  })();
  memo.set(key, task);
  return task;
}

async function fetchDoc<T>(query: string, fallback: T): Promise<T> {
  const c = await getClient();
  if (!c) return fallback;
  return cached(
    query,
    async () => {
      const doc = await c.fetch<T | null>(query);
      return doc ?? fallback;
    },
    fallback,
  );
}

/* ------------------------------------------------------------------ */
/* Image keys                                                          */
/* ------------------------------------------------------------------ */

const isImageKey = (value: unknown): value is ImageKey =>
  typeof value === "string" && value in manifest;

const validKey = (value: unknown, fallback: ImageKey): ImageKey =>
  isImageKey(value) ? value : fallback;

const validKeys = (values: unknown, fallback: readonly ImageKey[]): ImageKey[] => {
  if (!Array.isArray(values)) return [...fallback];
  const keys = values.filter(isImageKey);
  return keys.length > 0 ? keys : [...fallback];
};

/* ------------------------------------------------------------------ */
/* Site settings                                                       */
/* ------------------------------------------------------------------ */

export type SiteSettings = {
  business: typeof localBusiness;
  offices: typeof localOffices;
  coverage: typeof localCoverage;
  soulCinema: typeof localSoulCinema;
  stats: typeof localStats;
  closingCta: { kicker: string; heading: string; button: string };
};

const defaultSettings: SiteSettings = {
  business: localBusiness,
  offices: localOffices,
  coverage: localCoverage,
  soulCinema: localSoulCinema,
  stats: localStats,
  closingCta: {
    kicker: "ORIANAWEDDINGS · WEDDING PHOTOGRAPHY & FILMS",
    heading: "A day, held forever.",
    button: "Enquire on WhatsApp",
  },
};

type RawSettings = {
  tagline?: string;
  phone?: string;
  phoneHref?: string;
  phoneSecondary?: string;
  phoneSecondaryHref?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
  offices?: SiteSettings["offices"];
  coverage?: string[];
  stats?: { value?: string; label?: string }[];
  soulCinema?: { title?: string; body?: string };
  closingCta?: { kicker?: string; heading?: string; button?: string };
};

export function getSiteSettings(): Promise<SiteSettings> {
  return fetchDoc<RawSettings | null>(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]`,
    null,
  ).then((doc) => {
    if (!doc) return defaultSettings;
    // The built-in business object is `as const` (literal types); CMS values
    // are plain strings, so the merge is cast back — every field is rendered
    // as text, and the shape is unchanged.
    const business = {
      ...localBusiness,
      ...(doc.tagline ? { tagline: doc.tagline } : {}),
      ...(doc.phone ? { phone: doc.phone } : {}),
      ...(doc.phoneHref ? { phoneHref: doc.phoneHref } : {}),
      ...(doc.phoneSecondary ? { phoneSecondary: doc.phoneSecondary } : {}),
      ...(doc.phoneSecondaryHref ? { phoneSecondaryHref: doc.phoneSecondaryHref } : {}),
      ...(doc.whatsapp ? { whatsapp: doc.whatsapp } : {}),
      ...(doc.email ? { email: doc.email } : {}),
      ...(doc.instagram ? { instagram: doc.instagram } : {}),
      ...(doc.youtube ? { youtube: doc.youtube } : {}),
      ...(doc.facebook ? { facebook: doc.facebook } : {}),
    } as SiteSettings["business"];
    return {
      business,
      offices: Array.isArray(doc.offices) && doc.offices.length > 0 ? doc.offices : localOffices,
      coverage:
        Array.isArray(doc.coverage) && doc.coverage.length > 0 ? doc.coverage : localCoverage,
      stats: (Array.isArray(doc.stats) && doc.stats.length > 0
        ? doc.stats
            .filter((s) => s?.value && s?.label)
            .map((s) => ({ value: s.value as string, label: s.label as string }))
        : [...localStats]) as SiteSettings["stats"],
      soulCinema: {
        title: doc.soulCinema?.title || localSoulCinema.title,
        body: doc.soulCinema?.body || localSoulCinema.body,
      } as SiteSettings["soulCinema"],
      closingCta: {
        kicker: doc.closingCta?.kicker || defaultSettings.closingCta.kicker,
        heading: doc.closingCta?.heading || defaultSettings.closingCta.heading,
        button: doc.closingCta?.button || defaultSettings.closingCta.button,
      },
    };
  });
}

/** Site settings inside any component, with the built-in copy as fallback. */
export function useSiteSettings(): SiteSettings {
  try {
    const data = getRouteApi("__root__").useLoaderData() as { settings?: SiteSettings } | undefined;
    return data?.settings ?? defaultSettings;
  } catch {
    return defaultSettings;
  }
}

/** WhatsApp link against CMS settings (falls back to the built-in number). */
export function whatsappHrefFor(settings: SiteSettings, message: string) {
  return `https://wa.me/${settings.business.whatsapp}?text=${encodeURIComponent(message)}`;
}

/* ------------------------------------------------------------------ */
/* Page copy (singletons, merged over the built-in words)              */
/* ------------------------------------------------------------------ */

export type HomePageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroSub: string;
  introEyebrow: string;
  introHeading: string;
  introBody: string;
};

const defaultHome: HomePageContent = {
  heroEyebrow: "Oriana Weddings · Photography & Films",
  heroTitle: "Your wedding, our responsibility.",
  heroSub: "Candid, traditional & cinematic — managed by Oriana.",
  introEyebrow: "ORIANAWEDDINGS · PHOTOGRAPHY & CINEMA",
  introHeading: "Every story has its own rhythm.",
  introBody: "We hold on to the rituals, the in-between moments, and the joy.",
};

export function getHomePage(): Promise<HomePageContent> {
  return fetchDoc<Partial<HomePageContent> | null>(
    `*[_type == "homePage" && _id == "homePage"][0]`,
    null,
  ).then((doc) => ({ ...defaultHome, ...(doc ?? {}) }));
}

export type AboutPageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  teamEyebrow: string;
  teamHeading: string;
  teamBody: string;
  differenceEyebrow: string;
  differenceTitle: string;
  differenceLead: string;
  differenceCards: { title: string; body: string }[];
  marqueeItems: string[];
  placesEyebrow: string;
  placesTitle: string;
  placesLead: string;
};

const defaultAbout: AboutPageContent = {
  heroEyebrow: "About Oriana",
  heroTitle: "More than wedding photographers",
  heroLead:
    "Oriana Weddings has grown beyond the traditional idea of a wedding photography company. It is a photography and filmmaking brand built around experience, team selection, planning, management and trust.",
  teamEyebrow: "The team",
  teamHeading: "Meet the team",
  teamBody:
    "The people you are trusting with a day that cannot be repeated. You meet them before the wedding, and the same team photographs it.",
  differenceEyebrow: "Why we retain selection",
  differenceTitle: "The decision stays with Oriana, on purpose",
  differenceLead:
    "A photographer's old work is evidence of what they have done. It is not evidence of what they are best suited to do for your wedding today.",
  differenceCards: [],
  marqueeItems: [],
  placesEyebrow: "Offices & coverage",
  placesTitle: "Two offices, and everywhere else we can reach",
  placesLead:
    "Our main office is in Calicut, Kerala. Our Gujarat office is in Law Garden, Ahmedabad. With strong wedding heritage in both states, we work across India and undertake destination and international shoots.",
};

export function getAboutPage(): Promise<AboutPageContent> {
  return fetchDoc<Partial<AboutPageContent> | null>(
    `*[_type == "aboutPage" && _id == "aboutPage"][0]`,
    null,
  ).then((doc) => ({ ...defaultAbout, ...(doc ?? {}) }));
}

export type BrandsPageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  whyEyebrow: string;
  whyTitle: string;
  whyLead: string;
  approachEyebrow: string;
  approachTitle: string;
  approachCards: { title: string; body: string }[];
};

const defaultBrands: BrandsPageContent = {
  heroEyebrow: "Our brands",
  heroTitle: "Five brands, one house",
  heroLead: groupStatement,
  whyEyebrow: "Why more than one brand",
  whyTitle: "Different work needs different people, but the same standard",
  whyLead:
    "A wedding, a newborn, a fashion campaign and a 500-guest event are not the same craft. Keeping them in one group means each brand can specialise without reinventing how the business is managed.",
  approachEyebrow: "The shared approach",
  approachTitle: "What every brand in the group does the same way",
  approachCards: [],
};

export function getBrandsPage(): Promise<BrandsPageContent> {
  return fetchDoc<Partial<BrandsPageContent> | null>(
    `*[_type == "brandsPage" && _id == "brandsPage"][0]`,
    null,
  ).then((doc) => ({ ...defaultBrands, ...(doc ?? {}) }));
}

export type ContactPageContent = {
  eyebrow: string;
  heading: string;
  lead: string;
  nextSteps: { title: string; body: string }[];
};

const defaultContact: ContactPageContent = {
  eyebrow: "Contact",
  heading: "Tell us the date. We will tell you the rest.",
  lead: "Write what you know and leave the rest blank. We read every enquiry ourselves and reply the same day, usually the same evening.",
  nextSteps: [],
};

export function getContactPage(): Promise<ContactPageContent> {
  return fetchDoc<Partial<ContactPageContent> | null>(
    `*[_type == "contactPage" && _id == "contactPage"][0]`,
    null,
  ).then((doc) => ({ ...defaultContact, ...(doc ?? {}) }));
}

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

const WEDDING_TYPES = [
  "Candid",
  "Traditional",
  "Church",
  "Pre-wedding",
  "Destination",
  "Intimate",
] as const;
const COVERAGES = ["Photography", "Videography", "Photography + Videography"] as const;

type RawWedding = {
  title?: string;
  slug?: { current?: string } | string;
  couple?: string;
  venue?: string;
  location?: string;
  type?: string;
  coverage?: string;
  season?: string;
  summary?: string;
  story?: string[];
  services?: string[];
  coverKey?: string;
  frameKeys?: string[];
  order?: number;
};

const slugOf = (slug: RawWedding["slug"]): string =>
  typeof slug === "string" ? slug : (slug?.current ?? "");

function mapWedding(raw: RawWedding, fallback: Wedding): Wedding | null {
  const slug = slugOf(raw.slug);
  if (!slug) return null;
  const type = (WEDDING_TYPES as readonly string[]).includes(raw.type ?? "")
    ? (raw.type as Wedding["type"])
    : fallback.type;
  const coverage = (COVERAGES as readonly string[]).includes(raw.coverage ?? "")
    ? (raw.coverage as Wedding["coverage"])
    : fallback.coverage;
  return {
    slug,
    title: raw.title || fallback.title,
    couple: raw.couple || fallback.couple,
    venue: raw.venue || fallback.venue,
    location: raw.location || fallback.location,
    type,
    coverage,
    season: raw.season || fallback.season,
    cover: validKey(raw.coverKey, fallback.cover),
    summary: raw.summary || fallback.summary,
    story:
      Array.isArray(raw.story) && raw.story.length > 0
        ? raw.story.filter(Boolean)
        : [...fallback.story],
    frames: validKeys(raw.frameKeys, fallback.frames),
    services:
      Array.isArray(raw.services) && raw.services.length > 0
        ? raw.services.filter(Boolean)
        : [...fallback.services],
  };
}

export function getWeddings(): Promise<Wedding[]> {
  return fetchDoc<RawWedding[] | null>(`*[_type == "wedding"] | order(order asc)`, null).then(
    (docs) => {
      if (!docs || docs.length === 0) return localWeddings;
      const bySlug = new Map(localWeddings.map((w) => [w.slug, w]));
      const mapped = docs
        .map((raw, index) => {
          const slug = slugOf(raw.slug);
          const fallback = bySlug.get(slug) ?? localWeddings[index % localWeddings.length]!;
          return mapWedding(raw, fallback);
        })
        .filter((w): w is Wedding => w !== null);
      return mapped.length > 0 ? mapped : localWeddings;
    },
  );
}

export async function getWedding(slug: string): Promise<Wedding | undefined> {
  const all = await getWeddings();
  return all.find((w) => w.slug === slug);
}

type RawBrand = {
  name?: string;
  slug?: { current?: string } | string;
  tagline?: string;
  description?: string;
  audience?: string;
  offerings?: string[];
  coverKey?: string;
  galleryKeys?: string[];
  order?: number;
};

function mapBrand(raw: RawBrand, fallback: GroupBrand): GroupBrand | null {
  const slug = typeof raw.slug === "string" ? raw.slug : (raw.slug?.current ?? "");
  const name = raw.name || fallback.name;
  if (!slug || !name) return null;
  return {
    slug,
    name,
    tagline: raw.tagline || fallback.tagline,
    description: raw.description || fallback.description,
    audience: raw.audience || fallback.audience,
    offerings:
      Array.isArray(raw.offerings) && raw.offerings.length > 0
        ? raw.offerings.filter(Boolean)
        : [...fallback.offerings],
    cover: validKey(raw.coverKey, fallback.cover),
    images: validKeys(raw.galleryKeys, fallback.images),
  };
}

export function getBrands(): Promise<readonly GroupBrand[]> {
  return fetchDoc<RawBrand[] | null>(`*[_type == "brand"] | order(order asc)`, null).then(
    (docs) => {
      if (!docs || docs.length === 0) return localBrands;
      const bySlug = new Map(localBrands.map((b) => [b.slug, b]));
      const mapped = docs
        .map((raw, index) => {
          const slug = typeof raw.slug === "string" ? raw.slug : (raw.slug?.current ?? "");
          const fallback = bySlug.get(slug) ?? localBrands[index % localBrands.length]!;
          return mapBrand(raw, fallback);
        })
        .filter((b): b is GroupBrand => b !== null);
      return mapped.length > 0 ? mapped : localBrands;
    },
  );
}

export async function getBrand(slug: string): Promise<GroupBrand | undefined> {
  const all = await getBrands();
  return all.find((b) => b.slug === slug);
}

type RawFilm = {
  title?: string;
  slug?: { current?: string } | string;
  location?: string;
  duration?: string;
  description?: string;
  youtubeId?: string;
  order?: number;
};

const ytPoster = (youtubeId: string) => ({
  poster: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  posterSrcSet:
    `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg 320w, ` +
    `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg 480w`,
  posterWidth: 480,
  posterHeight: 360,
});

function mapFilm(raw: RawFilm, fallback: Film): Film | null {
  const slug = typeof raw.slug === "string" ? raw.slug : (raw.slug?.current ?? "");
  const youtubeId = raw.youtubeId?.trim();
  if (!slug || !youtubeId) return null;
  return {
    slug,
    title: raw.title || fallback.title,
    location: raw.location || fallback.location,
    duration: raw.duration || fallback.duration,
    description: raw.description || fallback.description,
    ...ytPoster(youtubeId),
    youtubeId,
  };
}

export function getFilms(): Promise<Film[]> {
  return fetchDoc<RawFilm[] | null>(`*[_type == "film"] | order(order asc)`, null).then((docs) => {
    if (!docs || docs.length === 0) return localFilms;
    const bySlug = new Map(localFilms.map((f) => [f.slug, f]));
    const mapped = docs
      .map((raw, index) => {
        const slug = typeof raw.slug === "string" ? raw.slug : (raw.slug?.current ?? "");
        const fallback = bySlug.get(slug) ?? localFilms[index % localFilms.length]!;
        return mapFilm(raw, fallback);
      })
      .filter((f): f is Film => f !== null);
    return mapped.length > 0 ? mapped : localFilms;
  });
}
