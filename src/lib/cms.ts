/**
 * The CMS layer.
 *
 * Every editable value on the site is read through here: try Sanity, fall back
 * to the built-in content. When `VITE_SANITY_PROJECT_ID` is unset (local dev,
 * or before the CMS exists) nothing is fetched and the site renders exactly as
 * it does today — the CMS can never blank a page.
 *
 * Photographs arrive as Sanity image assets (upload/replace/remove/reorder in
 * the Studio) and render from Sanity's CDN; every slot keeps a local-archive
 * fallback, so a removed photograph degrades to the built-in frame rather than
 * a hole. Fetches are memoized per session, so a root loader plus a page
 * loader asking for the same document costs one request.
 */
import { createClient, type SanityClient } from "@sanity/client";
import { getRouteApi } from "@tanstack/react-router";

import { films as localFilms, type Film } from "./films";
import { weddings as localWeddings, type Wedding } from "./portfolio";
import { getImage } from "./image-manifest";
import { photoAlt, type Photo } from "./photos";
import type { FilterId } from "./photoFilters";
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
import { cmsImageSrc, type CmsAsset, type CmsCrop, type CmsHotspot } from "./sanity-image";

export const isCmsConfigured =
  Boolean(import.meta.env?.["VITE_SANITY_PROJECT_ID"]) &&
  Boolean(import.meta.env?.["VITE_SANITY_DATASET"]);

let client: SanityClient | null = null;
async function getClient(): Promise<SanityClient | null> {
  if (!isCmsConfigured) return null;
  if (!client) {
    // Dynamic import: the client stays out of the main bundle and downloads
    // only when the CMS is actually configured.
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
/* Sanity image values                                                 */
/* ------------------------------------------------------------------ */

type RawImage =
  | {
      crop?: CmsCrop | null;
      hotspot?: CmsHotspot | null;
      ref?: string;
      dimensions?: { width?: number; height?: number } | null;
      lqip?: string;
    }
  | null
  | undefined;

/**
 * Image fragment: explicit reference id plus dimensions and placeholder.
 *
 * NOTE: `asset->{_ref}` does NOT work — dereferencing follows the reference,
 * and the target asset document has no `_ref` of its own. The id must be read
 * off the reference itself (`asset._ref`).
 */
const IMG = `{crop,hotspot,"ref":asset._ref,"dimensions":asset->metadata.dimensions,"lqip":asset->metadata.lqip}`;

const mapAsset = (raw: RawImage): CmsAsset | null => {
  const ref = raw?.ref;
  const width = raw?.dimensions?.width;
  const height = raw?.dimensions?.height;
  if (!ref || !width || !height) return null;
  return {
    ref,
    width,
    height,
    lqip: raw?.lqip,
    crop: raw?.crop ?? null,
    hotspot: raw?.hotspot ?? null,
  };
};

/** Absolute display URL: CDN asset when present, else the archive fallback. */
export function photoSrc(photo: Photo): string {
  if (photo.asset) {
    const url = cmsImageSrc(photo.asset);
    if (url) return url;
  }
  if (photo.key) return getImage(photo.key).src;
  return "";
}

/* ------------------------------------------------------------------ */
/* Site settings                                                       */
/* ------------------------------------------------------------------ */

export type SiteSettings = {
  business: typeof localBusiness;
  establishedYear: number;
  brandLines: readonly string[];
  offices: typeof localOffices;
  coverage: typeof localCoverage;
  soulCinema: typeof localSoulCinema & { videoSrc: string; poster: Photo };
  stats: typeof localStats;
  closingCta: { kicker: string; heading: string; button: string; image: Photo };
  affiliations: { name: string; href: string }[];
  chatbot: { greeting: string; prompt: string; handoff: string };
  footerExplore: string;
  footerStudios: string;
  footerCoverage: string;
  notFound: {
    eyebrow: string;
    title: string;
    body: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  errorPage: {
    eyebrow: string;
    title: string;
    body: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
};

const defaultSettings: SiteSettings = {
  business: localBusiness,
  establishedYear: 1996,
  brandLines: ["Indian Wedding Film Award Winner", "Couple Choice Award Winner"],
  offices: localOffices,
  coverage: localCoverage,
  soulCinema: {
    ...localSoulCinema,
    videoSrc: "/video/soul-cinema-stock.mp4",
    poster: {
      key: "kerala-cinematic-wedding-film-still",
      alt: "",
      asset: null,
    },
  },
  stats: localStats,
  closingCta: {
    kicker: "ORIANAWEDDINGS · WEDDING PHOTOGRAPHY & FILMS",
    heading: "A day, held forever.",
    button: "Enquire on WhatsApp",
    image: { key: "closing-cta-user", alt: "", asset: null },
  },
  affiliations: [],
  chatbot: {
    greeting: "Hi there! 👋 Welcome to Oriana Weddings.",
    prompt: "Ask me anything — or share your name and I’ll get you a quick quote.",
    handoff: "Perfect! Opening WhatsApp so our team can assist you right away. 💬",
  },
  footerExplore: "Explore",
  footerStudios: "Studio",
  footerCoverage: "Where we shoot",
  notFound: {
    eyebrow: "404",
    title: "This page has moved on.",
    body: "The page you are looking for doesn’t exist. Browse our wedding stories, or start a conversation with the studio.",
    primaryLabel: "View portfolio",
    secondaryLabel: "Go home",
  },
  errorPage: {
    eyebrow: "Error",
    title: "This page didn’t load",
    body: "Something went wrong on our end. Try again, or head back home.",
    primaryLabel: "Try again",
    secondaryLabel: "Go home",
  },
};

/** `Est. 1996` — the footer mark, from the CMS year. */
export const establishedMarkFor = (settings: SiteSettings) => `Est. ${settings.establishedYear}`;

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
  establishedYear?: number;
  brandLines?: string[];
  offices?: SiteSettings["offices"];
  coverage?: string[];
  stats?: { value?: string; label?: string }[];
  soulCinema?: { title?: string; body?: string; videoSrc?: string; poster?: RawImage };
  closingCta?: { kicker?: string; heading?: string; button?: string; image?: RawImage };
  affiliations?: { name?: string; href?: string }[];
  chatbot?: Partial<SiteSettings["chatbot"]>;
  footerExplore?: string;
  footerStudios?: string;
  footerCoverage?: string;
  notFound?: Partial<SiteSettings["notFound"]>;
  errorPage?: Partial<SiteSettings["errorPage"]>;
};

export function getSiteSettings(): Promise<SiteSettings> {
  return fetchDoc<RawSettings | null>(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]{
      tagline, phone, phoneHref, phoneSecondary, phoneSecondaryHref, whatsapp,
      email, instagram, youtube, facebook, establishedYear, brandLines, offices,
      coverage, stats, chatbot, footerExplore, footerStudios, footerCoverage,
      notFound, errorPage,
      soulCinema{title, body, videoSrc, poster${IMG}},
      closingCta{kicker, heading, button, image${IMG}}
    }`,
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
      establishedYear:
        typeof doc.establishedYear === "number" && doc.establishedYear > 0
          ? Math.floor(doc.establishedYear)
          : defaultSettings.establishedYear,
      brandLines:
        Array.isArray(doc.brandLines) && doc.brandLines.length > 0
          ? doc.brandLines.filter(Boolean)
          : [...defaultSettings.brandLines],
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
        videoSrc: doc.soulCinema?.videoSrc || "/video/soul-cinema-stock.mp4",
        poster: {
          ...defaultSettings.soulCinema.poster,
          asset: mapAsset(doc.soulCinema?.poster),
        },
      } as SiteSettings["soulCinema"],
      closingCta: {
        kicker: doc.closingCta?.kicker || defaultSettings.closingCta.kicker,
        heading: doc.closingCta?.heading || defaultSettings.closingCta.heading,
        button: doc.closingCta?.button || defaultSettings.closingCta.button,
        image: {
          ...defaultSettings.closingCta.image,
          asset: mapAsset(doc.closingCta?.image),
        },
      },
      affiliations:
        Array.isArray(doc.affiliations) && doc.affiliations.length > 0
          ? doc.affiliations
              .filter((a) => a?.name)
              .map((a) => ({ name: a.name as string, href: a.href || "" }))
          : [],
      chatbot: { ...defaultSettings.chatbot, ...(doc.chatbot ?? {}) },
      footerExplore: doc.footerExplore || defaultSettings.footerExplore,
      footerStudios: doc.footerStudios || defaultSettings.footerStudios,
      footerCoverage: doc.footerCoverage || defaultSettings.footerCoverage,
      notFound: { ...defaultSettings.notFound, ...(doc.notFound ?? {}) },
      errorPage: { ...defaultSettings.errorPage, ...(doc.errorPage ?? {}) },
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

export type CollectionFilterId = "candid" | "traditional" | "intimate" | "pre";

export type HomeCollection = {
  id: CollectionFilterId;
  title: string;
  photo: Photo;
};

export type AwardBadgeContent = {
  subtitle?: string;
  title: string;
  year: string;
  organization?: string;
};

export type HomePageContent = {
  seoTitle: string;
  seoDescription: string;
  heroImage: Photo;
  heroEyebrow: string;
  heroTitle: string;
  heroSub: string;
  heroPrimaryLabel: string;
  heroSecondaryLabel: string;
  introEyebrow: string;
  introHeading: string;
  introBody: string;
  collections: HomeCollection[];
  mosaicLines: string[];
  mosaic: Photo[];
  filmsEyebrow: string;
  filmsTitle: string;
  filmCovers: Photo[];
  awardsEyebrow: string;
  awardsTitle: string;
  awardsBadges: AwardBadgeContent[];
  gearCamerasLabel: string;
  gearPostLabel: string;
};

const defaultHome: HomePageContent = {
  seoTitle: "Best Photographer in Calicut | Best Photographer in Kerala | Oriana Weddings",
  seoDescription:
    "Oriana Weddings is a 12+ year wedding photography and filmmaking brand based in Calicut and Ahmedabad, managing personalised weddings across Kerala, Gujarat, India and international destinations.",
  heroImage: { key: "home-hero-user", alt: "", asset: null },
  heroEyebrow: "Oriana Weddings · Photography & Films",
  heroTitle: "Your wedding, our responsibility.",
  heroSub: "Candid, traditional & cinematic — managed by Oriana.",
  heroPrimaryLabel: "View our work",
  heroSecondaryLabel: "Enquire",
  introEyebrow: "ORIANAWEDDINGS · PHOTOGRAPHY & CINEMA",
  introHeading: "Every story has its own rhythm.",
  introBody: "We hold on to the rituals, the in-between moments, and the joy.",
  collections: [],
  mosaicLines: [],
  mosaic: [],
  filmsEyebrow: "WEDDING FILMS",
  filmsTitle: "Stories, in motion.",
  filmCovers: [],
  awardsEyebrow: "DECADE OF EXCELLENCE",
  awardsTitle: "Awards & Accolades",
  awardsBadges: [],
  gearCamerasLabel: "Camera systems",
  gearPostLabel: "Post production",
};

const COLLECTION_IDS = ["candid", "traditional", "intimate", "pre"] as const;

type RawHomeCollection = {
  id?: string;
  title?: string;
  image?: RawImage;
};

type RawHome = Partial<
  Omit<HomePageContent, "collections" | "mosaic" | "filmCovers" | "heroImage">
> & {
  heroImage?: RawImage;
  collections?: RawHomeCollection[];
  mosaic?: RawImage[];
  filmCovers?: RawImage[];
};

export function getHomePage(): Promise<HomePageContent> {
  return fetchDoc<RawHome | null>(
    `*[_type == "homePage" && _id == "homePage"][0]{
      seoTitle, seoDescription, heroEyebrow, heroTitle, heroSub,
      heroPrimaryLabel, heroSecondaryLabel, introEyebrow, introHeading, introBody,
      mosaicLines, filmsEyebrow, filmsTitle, awardsEyebrow, awardsTitle,
      awardsBadges, gearCamerasLabel, gearPostLabel,
      heroImage${IMG}, collections[]{id, title, image${IMG}},
      mosaic[]${IMG}, filmCovers[]${IMG}
    }`,
    null,
  ).then((doc) => {
    if (!doc) return defaultHome;
    const rawCollections = Array.isArray(doc.collections) ? doc.collections : [];
    const toPhoto = (raw: RawImage | null | undefined, alt: string): Photo | null => {
      const asset = mapAsset(raw);
      return asset ? { key: null, alt, asset } : null;
    };
    return {
      ...defaultHome,
      ...doc,
      heroImage: {
        ...defaultHome.heroImage,
        asset: mapAsset(doc.heroImage),
      },
      collections: rawCollections
        .filter(
          (c) => !!c && (COLLECTION_IDS as readonly string[]).includes(c.id ?? "") && !!c.title,
        )
        .map((c) => {
          const asset = mapAsset(c.image);
          return asset
            ? {
                id: c.id as CollectionFilterId,
                title: c.title as string,
                photo: {
                  key: null,
                  alt: `${c.title} wedding photography`,
                  asset,
                } as Photo,
              }
            : null;
        })
        .filter((c): c is HomeCollection => c !== null),
      mosaicLines:
        Array.isArray(doc.mosaicLines) && doc.mosaicLines.length > 0 ? doc.mosaicLines : [],
      mosaic: (Array.isArray(doc.mosaic) ? doc.mosaic : [])
        .map((raw) => toPhoto(raw, "Wedding photograph"))
        .filter((p): p is Photo => p !== null),
      filmCovers: (Array.isArray(doc.filmCovers) ? doc.filmCovers : [])
        .map((raw) => toPhoto(raw, "Wedding story"))
        .filter((p): p is Photo => p !== null),
      awardsBadges:
        Array.isArray(doc.awardsBadges) && doc.awardsBadges.length > 0
          ? doc.awardsBadges
              .filter((b) => b?.title && b?.year)
              .map((b) => ({
                ...(b.subtitle ? { subtitle: b.subtitle } : {}),
                title: b.title as string,
                year: b.year as string,
                ...(b.organization ? { organization: b.organization } : {}),
              }))
          : [],
    };
  });
}

export type TeamMemberContent = { name: string; role: string; photo: Photo };

export type AboutPageContent = {
  seoTitle: string;
  seoDescription: string;
  heroImage: Photo;
  heroImageAlt: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroMeta: { label: string; value: string }[];
  teamEyebrow: string;
  teamHeading: string;
  teamBody: string;
  teamMembers: TeamMemberContent[];
  rightEyebrow: string;
  rightTitle: string;
  rightLead: string;
  rightBody: string;
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
  seoTitle: "About Oriana Weddings | Best Photographer in Calicut | Best Photographer in Kerala",
  seoDescription:
    "Discover Oriana Weddings, a 12+ year wedding photography and filmmaking brand based in Calicut and Ahmedabad, managing weddings across Kerala, Gujarat, India and beyond.",
  heroImage: {
    key: "calicut-church-wedding-ceremony",
    alt: "Wedding ceremony with family and friends, photographed by Oriana Weddings",
    asset: null,
  },
  heroImageAlt: "Wedding ceremony with family and friends, photographed by Oriana Weddings",
  heroEyebrow: "About Oriana",
  heroTitle: "More than wedding photographers",
  heroLead:
    "Oriana Weddings has grown beyond the traditional idea of a wedding photography company. It is a photography and filmmaking brand built around experience, team selection, planning, management and trust.",
  heroMeta: [
    { label: "Founded", value: "12+ years experience" },
    { label: "Main office", value: "Calicut, Kerala" },
  ],
  teamEyebrow: "The team",
  teamHeading: "Meet the team",
  teamBody:
    "The people you are trusting with a day that cannot be repeated. You meet them before the wedding, and the same team photographs it.",
  teamMembers: [],
  rightEyebrow: "The right team for the right wedding",
  rightTitle: "We don't believe one photographer is right for every couple.",
  rightLead:
    "Every photographer has a different visual language, personality, technical ability and experience. We understand the client first. Then we select the team.",
  rightBody:
    "Oriana retains the professional decision-making responsibility for selecting the photography and filmmaking team. That is not a way of avoiding accountability — it is how we take responsibility for the result.",
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

type RawTeamMember = { name?: string; role?: string; image?: RawImage };

type RawAbout = Partial<Omit<AboutPageContent, "heroImage" | "heroMeta" | "teamMembers">> & {
  heroImage?: RawImage;
  heroMeta?: { label?: string; value?: string }[];
  teamMembers?: RawTeamMember[];
};

export function getAboutPage(): Promise<AboutPageContent> {
  return fetchDoc<RawAbout | null>(
    `*[_type == "aboutPage" && _id == "aboutPage"][0]{
      seoTitle, seoDescription, heroImageAlt, heroEyebrow, heroTitle, heroLead,
      heroMeta, teamEyebrow, teamHeading, teamBody, rightEyebrow, rightTitle,
      rightLead, rightBody, differenceEyebrow, differenceTitle, differenceLead,
      differenceCards, marqueeItems, placesEyebrow, placesTitle, placesLead,
      heroImage${IMG}, teamMembers[]{name, role, image${IMG}}
    }`,
    null,
  ).then((doc) => {
    if (!doc) return defaultAbout;
    const members = Array.isArray(doc.teamMembers) ? doc.teamMembers : [];
    const meta = Array.isArray(doc.heroMeta) ? doc.heroMeta : [];
    return {
      ...defaultAbout,
      ...doc,
      heroImage: {
        ...defaultAbout.heroImage,
        asset: mapAsset(doc.heroImage),
      },
      heroMeta:
        meta.length > 0
          ? meta
              .filter((m) => m?.label && m?.value)
              .map((m) => ({ label: m.label as string, value: m.value as string }))
          : [...defaultAbout.heroMeta],
      teamMembers: members
        .filter((m) => m?.name && m?.role)
        .map((m) => {
          const asset = mapAsset(m.image);
          return asset
            ? {
                name: m.name as string,
                role: m.role as string,
                photo: {
                  key: null,
                  alt: `${m.name}, ${m.role} at Oriana Weddings`,
                  asset,
                } as Photo,
              }
            : null;
        })
        .filter((m): m is TeamMemberContent => m !== null),
    };
  });
}

export type BrandsPageContent = {
  seoTitle: string;
  seoDescription: string;
  heroImage: Photo;
  heroImageAlt: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  metaFirstLabel: string;
  metaSecondLabel: string;
  metaSecondValue: string;
  backLabel: string;
  whyEyebrow: string;
  whyTitle: string;
  whyLead: string;
  approachEyebrow: string;
  approachTitle: string;
  approachCards: { title: string; body: string }[];
};

const defaultBrands: BrandsPageContent = {
  seoTitle: "Our Brands | Oriana Weddings | Creative Brands",
  seoDescription:
    "Meet the creative brands of Oriana — Oriana Weddings, Baby Crew Studios, DEOR Fashion, ORION Events and Odonata Republic.",
  heroImage: {
    key: "detail-reception-monochrome",
    alt: "Newlywed couple in a quiet moment at home, photographed by Oriana Weddings",
    asset: null,
  },
  heroImageAlt: "Newlywed couple in a quiet moment at home, photographed by Oriana Weddings",
  heroEyebrow: "Our brands",
  heroTitle: "Five brands, one house",
  heroLead: groupStatement,
  metaFirstLabel: "Brands",
  metaSecondLabel: "Offices",
  metaSecondValue: "Calicut & Ahmedabad",
  backLabel: "← All brands",
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
    `*[_type == "brandsPage" && _id == "brandsPage"][0]{
      seoTitle, seoDescription, heroImageAlt, heroEyebrow, heroTitle, heroLead,
      metaFirstLabel, metaSecondLabel, metaSecondValue, backLabel,
      whyEyebrow, whyTitle, whyLead, approachEyebrow, approachTitle, approachCards,
      heroImage${IMG}
    }`,
    null,
  ).then((doc) => {
    if (!doc) return defaultBrands;
    const { heroImage: rawHero, ...rest } = doc as Partial<BrandsPageContent> & {
      heroImage?: RawImage;
    };
    return {
      ...defaultBrands,
      ...rest,
      heroImage: { ...defaultBrands.heroImage, asset: mapAsset(rawHero) },
    };
  });
}

export type ContactPageContent = {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  heading: string;
  lead: string;
  serviceOptions: { value: string; note: string }[];
  nextSteps: { title: string; body: string }[];
  stepsEyebrow: string;
  formEyebrow: string;
  formTitle: string;
  formBody: string;
  sentEyebrow: string;
  sentTitle: string;
  sentBody: string;
  blockedTitle: string;
  blockedBody: string;
  blockedButton: string;
  asideEyebrow: string;
  asideTitle: string;
  asideBody: string;
  asideButton: string;
  asideCallLabel: string;
  whereEyebrow: string;
  whereTitle: string;
  pinnedCall: string;
  pinnedWhatsapp: string;
};

const defaultContact: ContactPageContent = {
  seoTitle:
    "Contact the Best Photographer in Calicut | Contact the Best Photographer in Kerala | Oriana Weddings",
  seoDescription:
    "Contact Oriana Weddings for wedding photography, videography and cinematic wedding films in Calicut, Kerala, Ahmedabad, Gujarat, India and destination locations.",
  eyebrow: "Contact",
  heading: "Tell us the date. We will tell you the rest.",
  lead: "Write what you know and leave the rest blank. We read every enquiry ourselves and reply the same day, usually the same evening.",
  serviceOptions: [],
  nextSteps: [],
  stepsEyebrow: "What happens next",
  formEyebrow: "Enquiry",
  formTitle: "Five boxes. That is the whole form.",
  formBody:
    "We only ask for what we need to answer you. Dates, venue and everything else can wait for the reply.",
  sentEyebrow: "Sent",
  sentTitle: "Thank you — we have your details.",
  sentBody:
    "Oriana will reply to you shortly, usually the same day. If it is urgent, call {phone}.",
  blockedTitle: "One tap left.",
  blockedBody:
    "Your browser stopped the WhatsApp window from opening on its own, so this has not been sent yet. Nothing you typed is lost — press the button and it goes.",
  blockedButton: "Open WhatsApp",
  asideEyebrow: "Faster than the form",
  asideTitle: "Message us on WhatsApp.",
  asideBody:
    "One message is enough — send the date, or a voice note, or nothing more than “are you free in February”. We read them ourselves.",
  asideButton: "Open WhatsApp",
  asideCallLabel: "Or call the studio",
  whereEyebrow: "Where we are",
  whereTitle: "Two offices. One studio, whichever one you visit.",
  pinnedCall: "Call",
  pinnedWhatsapp: "WhatsApp",
};

export function getContactPage(): Promise<ContactPageContent> {
  return fetchDoc<Partial<ContactPageContent> | null>(
    `*[_type == "contactPage" && _id == "contactPage"][0]`,
    null,
  ).then((doc) => {
    if (!doc) return defaultContact;
    const options = Array.isArray(doc.serviceOptions) ? doc.serviceOptions : [];
    return {
      ...defaultContact,
      ...doc,
      serviceOptions: options
        .filter((o) => o?.value)
        .map((o) => ({ value: o.value as string, note: o.note || "" })),
    };
  });
}

export type FilmsPageContent = { seoTitle: string; seoDescription: string };

const defaultFilms: FilmsPageContent = {
  seoTitle: "Wedding Films | Oriana Weddings",
  seoDescription:
    "Watch wedding films, teasers, highlights and storytelling films by Oriana Weddings.",
};

export function getFilmsPage(): Promise<FilmsPageContent> {
  return fetchDoc<Partial<FilmsPageContent> | null>(
    `*[_type == "filmsPage" && _id == "filmsPage"][0]`,
    null,
  ).then((doc) => ({ ...defaultFilms, ...(doc ?? {}) }));
}

export type PhotographyPageContent = { seoTitle: string; seoDescription: string };

const defaultPhotography: PhotographyPageContent = {
  seoTitle: "Wedding Photography Stories | Oriana Weddings",
  seoDescription: "A collection of wedding photography stories from Oriana Weddings.",
};

export function getPhotographyPage(): Promise<PhotographyPageContent> {
  return fetchDoc<Partial<PhotographyPageContent> | null>(
    `*[_type == "photographyPage" && _id == "photographyPage"][0]`,
    null,
  ).then((doc) => ({ ...defaultPhotography, ...(doc ?? {}) }));
}

export type PortfolioPageContent = {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  sub: string;
  storyBackLabel: string;
  storiesBackLabel: string;
  countTemplate: string;
  showMoreTemplate: string;
  filterLabels: { id: string; label: string }[];
  library: LibraryItem[];
};

/** One wall frame: its photograph plus the filters it appears in. */
export type LibraryItem = {
  photo: Photo;
  categories: FilterId[];
};

const FILTER_IDS = [
  "candid",
  "traditional",
  "intimate",
  "haldi",
  "christian",
  "pre",
  "venue",
] as const;

const defaultPortfolio: PortfolioPageContent = {
  seoTitle: "Wedding Photography Portfolio | Oriana Weddings",
  seoDescription:
    "Browse wedding photographs by Oriana Weddings. Explore candid, traditional, intimate, pre-wedding and other photography styles.",
  eyebrow: "ORIANA WEDDINGS · PORTFOLIO",
  sub: "A few moments, held in still frames.",
  storyBackLabel: "← All stories",
  storiesBackLabel: "← All photography stories",
  countTemplate: "Showing {shown} of {total} images",
  showMoreTemplate: "Show more ({remaining} remaining)",
  filterLabels: [],
  library: [],
};

type RawLibraryItem = { photo?: RawImage; caption?: string; categories?: string[] };

export function getPortfolioPage(): Promise<PortfolioPageContent> {
  return fetchDoc<
    (Partial<Omit<PortfolioPageContent, "library">> & { library?: RawLibraryItem[] }) | null
  >(
    `*[_type == "portfolioPage" && _id == "portfolioPage"][0]{
      seoTitle, seoDescription, eyebrow, sub, storyBackLabel, storiesBackLabel,
      countTemplate, showMoreTemplate, filterLabels,
      library[]{caption, categories, photo${IMG}}
    }`,
    null,
  ).then((doc) => {
    if (!doc) return defaultPortfolio;
    const labels = Array.isArray(doc.filterLabels) ? doc.filterLabels : [];
    const library = Array.isArray(doc.library) ? doc.library : [];
    return {
      ...defaultPortfolio,
      ...doc,
      filterLabels: labels
        .filter((f) => f?.id && f?.label)
        .map((f) => ({ id: f.id as string, label: f.label as string })),
      library: library
        .map((item) => {
          const asset = mapAsset(item?.photo);
          return asset
            ? ({
                photo: {
                  key: null,
                  alt: item?.caption || "Wedding photograph",
                  asset,
                } as Photo,
                categories: (Array.isArray(item?.categories) ? item.categories : []).filter(
                  (c): c is FilterId => (FILTER_IDS as readonly string[]).includes(c),
                ),
              } as LibraryItem)
            : null;
        })
        .filter((item): item is LibraryItem => item !== null),
    };
  });
}

/** "Showing 12 of 30 images" — fills {shown} and {total}. */
export const fillCount = (template: string, shown: number, total: number) =>
  template.replace("{shown}", String(shown)).replace("{total}", String(total));

/** "Show more (18 remaining)" — fills {remaining}. */
export const fillRemaining = (template: string, remaining: number) =>
  template.replace("{remaining}", String(remaining));

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
  cover?: RawImage;
  frames?: RawImage[];
  seoTitle?: string;
  seoDescription?: string;
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
  const coverAsset = mapAsset(raw.cover);
  const rawFrames = Array.isArray(raw.frames) ? raw.frames : [];
  return {
    slug,
    title: raw.title || fallback.title,
    couple: raw.couple || fallback.couple,
    venue: raw.venue || fallback.venue,
    location: raw.location || fallback.location,
    type,
    coverage,
    season: raw.season || fallback.season,
    cover: {
      key: fallback.cover.key,
      alt: (fallback.cover.key ? photoAlt(fallback.cover.key) : undefined) ?? fallback.title,
      asset: coverAsset,
    },
    summary: raw.summary || fallback.summary,
    story:
      Array.isArray(raw.story) && raw.story.length > 0
        ? raw.story.filter(Boolean)
        : [...fallback.story],
    frames:
      rawFrames.length > 0
        ? rawFrames
            .map((frame) => {
              const asset = mapAsset(frame);
              return asset
                ? ({
                    key: null,
                    alt: `${raw.couple || fallback.couple} wedding photography`,
                    asset,
                  } as Photo)
                : null;
            })
            .filter((p): p is Photo => p !== null)
        : [...fallback.frames],
    services:
      Array.isArray(raw.services) && raw.services.length > 0
        ? raw.services.filter(Boolean)
        : [...fallback.services],
    ...(raw.seoTitle ? { seoTitle: raw.seoTitle } : {}),
    ...(raw.seoDescription ? { seoDescription: raw.seoDescription } : {}),
  };
}

export function getWeddings(): Promise<Wedding[]> {
  return fetchDoc<RawWedding[] | null>(
    `*[_type == "wedding"] | order(order asc){
      "slug": slug.current, title, couple, venue, location, type, coverage,
      season, summary, story, services, seoTitle, seoDescription,
      cover${IMG}, frames[]${IMG}
    }`,
    null,
  ).then((docs) => {
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
  });
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
  cover?: RawImage;
  gallery?: RawImage[];
  seoTitle?: string;
  seoDescription?: string;
  order?: number;
};

function mapBrand(raw: RawBrand, fallback: GroupBrand): GroupBrand | null {
  const slug = typeof raw.slug === "string" ? raw.slug : (raw.slug?.current ?? "");
  const name = raw.name || fallback.name;
  if (!slug || !name) return null;
  const rawGallery = Array.isArray(raw.gallery) ? raw.gallery : [];
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
    cover: {
      key: fallback.cover.key,
      alt: (fallback.cover.key ? photoAlt(fallback.cover.key) : undefined) ?? fallback.tagline,
      asset: mapAsset(raw.cover),
    },
    images:
      rawGallery.length > 0
        ? rawGallery
            .map((frame) => {
              const asset = mapAsset(frame);
              return asset
                ? ({
                    key: null,
                    alt: `${name} — ${raw.tagline || fallback.tagline}`,
                    asset,
                  } as Photo)
                : null;
            })
            .filter((p): p is Photo => p !== null)
        : [...fallback.images],
    ...(raw.seoTitle ? { seoTitle: raw.seoTitle } : {}),
    ...(raw.seoDescription ? { seoDescription: raw.seoDescription } : {}),
  };
}

export function getBrands(): Promise<readonly GroupBrand[]> {
  return fetchDoc<RawBrand[] | null>(
    `*[_type == "brand"] | order(order asc){
      "slug": slug.current, name, tagline, description, audience, offerings,
      seoTitle, seoDescription, cover${IMG}, gallery[]${IMG}
    }`,
    null,
  ).then((docs) => {
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
  });
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
  return fetchDoc<RawFilm[] | null>(
    `*[_type == "film"] | order(order asc){
      "slug": slug.current, title, location, duration, description, youtubeId
    }`,
    null,
  ).then((docs) => {
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
