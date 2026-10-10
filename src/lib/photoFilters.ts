import {
  allPhotos,
  churchWeddings,
  ceremonies,
  details,
  portraits,
  preWedding,
  venues,
} from "@/lib/photos";
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
 *
 * Every group below is drawn from the 30-frame local archive, so no filter can
 * ever address a photograph that does not exist. `all` is the full thirty.
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

const ceremonyKeys = new Set(ceremonies.map((photo) => photo.key));

export const GROUPS: Record<FilterId, Photo[]> = {
  all: allPhotos,
  candid: portraits.slice(0, 10),
  traditional: [...ceremonies, ...churchWeddings.filter((photo) => !ceremonyKeys.has(photo.key))],
  intimate: portraits.slice(0, 6),
  haldi: preWedding,
  christian: churchWeddings,
  pre: [...preWedding, ...portraits.slice(6)],
  venue: [...venues, ...details.slice(0, 2)],
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
