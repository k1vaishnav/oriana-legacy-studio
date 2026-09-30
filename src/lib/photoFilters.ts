import {
  allPhotos,
  churchWeddings,
  ceremonies,
  details,
  portraits,
  preWedding,
  venues,
} from "@/lib/photos";
import { weddings } from "@/lib/portfolio";
import type { Photo } from "@/lib/photos";

/**
 * One filterable photo library, shared by a single route.
 *
 * This used to exist twice: `/wedding-photography` had a wall with local-state
 * filters and `/portfolio` had a near-identical wall with URL filters and a
 * different set of categories. Two walls, two filter vocabularies, and neither
 * one owned the work properly.
 *
 * Browsing the photographs is now the photography page's job, so the library
 * lives here and `/wedding-photography` renders it. `/portfolio` is the written
 * side — the services, the stories, the proposal — and redirects any leftover
 * `?filter=` link here rather than dropping the visitor on an unfiltered page.
 *
 * The ids are a closed union, and `parseFilter` is the one place anything else
 * validates against it. A card on the homepage cannot link to a category that
 * does not exist, and a hand-typed `?filter=nonsense` falls back to everything
 * instead of filtering to an empty grid.
 */
export const FILTERS = [
  { id: "all", label: "All work" },
  { id: "candid", label: "Candid" },
  { id: "traditional", label: "Traditional" },
  { id: "intimate", label: "Intimate" },
  { id: "haldi", label: "Haldi & Mehendi" },
  { id: "christian", label: "Christian" },
  { id: "pre", label: "Pre-wedding" },
  { id: "venue", label: "Venues" },
] as const;

export type FilterId = (typeof FILTERS)[number]["id"];

/** The active filter's own name, so the count line names what it is counting. */
export const filterLabel = (id: FilterId) =>
  FILTERS.find((f) => f.id === id)?.label ?? "the library";

/**
 * The six wedding covers are already shown, at full size, on `/portfolio` in
 * the Real Weddings section. Rendering them again in this wall meant the same
 * photograph appeared twice on one screen — which is exactly the thing this
 * page is supposed to stop doing — so the wall leaves them to the section that
 * owns them. The lightbox still reaches them, because the lightbox is given the
 * full library rather than the visible slice.
 */
const COVER_KEYS = new Set(weddings.map((w) => w.cover));
const withoutCovers = allPhotos.filter((photo) => !COVER_KEYS.has(photo.key));

export const GROUPS: Record<FilterId, Photo[]> = {
  all: withoutCovers,
  candid: portraits.slice(0, 10),
  traditional: [...ceremonies, ...churchWeddings],
  intimate: portraits.slice(2, 8),
  haldi: preWedding,
  christian: churchWeddings,
  pre: [...preWedding.slice(0, 4), ...portraits.slice(8)],
  venue: [...venues, ...details.slice(-4)],
};

/** The grid opens at this many photographs and grows by the same amount. */
export const PAGE_SIZE = 12;

/**
 * The parsed `?filter=` value, or `{}`.
 *
 * "all" is expressed by omitting the key rather than setting it, so it never
 * appears in the address bar and `<Link to="/wedding-photography">` stays valid
 * without a `search` prop. Anything unrecognised is dropped rather than
 * rejected, so a stale or mistyped query still lands on a populated page.
 */
export function parseFilter(raw: unknown): { filter?: FilterId } {
  return typeof raw === "string" && FILTERS.some((f) => f.id === raw) && raw !== "all"
    ? { filter: raw as FilterId }
    : {};
}
