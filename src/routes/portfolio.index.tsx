import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Lightbox } from "@/components/site/Lightbox";
import { PhotoImage } from "@/lib/images";
import { FILTERS, GROUPS, PAGE_SIZE, parseFilter, type FilterId } from "@/lib/photoFilters";
import { fillCount, fillRemaining, getPortfolioPage } from "@/lib/cms";
import type { Photo } from "@/lib/photos";
import { lcpPreload, seo } from "@/lib/seo";

export const Route = createFileRoute("/portfolio/")({
  validateSearch: (search: Record<string, unknown>): { filter?: FilterId } =>
    parseFilter(search["filter"]),
  loader: async () => ({ page: await getPortfolioPage() }),
  head: ({ loaderData }) => {
    const base = seo({
      title: loaderData?.page.seoTitle || "Wedding Photography Portfolio | Oriana Weddings",
      description:
        loaderData?.page.seoDescription ||
        "Browse wedding photographs by Oriana Weddings. Explore candid, traditional, intimate, pre-wedding and other photography styles.",
      path: "/portfolio",
    });
    // The first wall frame is this page's LCP — but every grid image renders
    // lazy, so without a preload the largest paint waits for hydration.
    const first: Photo | undefined = loaderData?.page.library[0]?.photo ?? GROUPS.all[0];
    const preload = first ? lcpPreload(first, "(min-width: 1024px) 25vw, 50vw") : null;
    return preload ? { ...base, links: [...base.links, preload] } : base;
  },
  component: PortfolioPage,
});

function PortfolioPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { page } = Route.useLoaderData();
  // Deep-linkable filter: home collections land here preselected (?filter=candid).
  const [photoFilter, setPhotoFilter] = useState<FilterId>(search.filter ?? "all");
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Follow the address bar (back/forward, collection links).
  useEffect(() => {
    setPhotoFilter(search.filter ?? "all");
    setActivePhoto(null);
    setVisibleCount(PAGE_SIZE);
  }, [search.filter]);

  // "All work" shows the CMS library when it has frames (full CRUD: add,
  // remove, reorder, replace). A filtered view shows the library frames ticked
  // for that filter — falling back to the curated archive slice only when
  // nothing is ticked, so a filter never goes empty.
  const libraryPhotos = page.library.length > 0 ? page.library : null;
  // Deleting a filter row in the Studio hides that button here. An unedited
  // (empty) CMS list means "show everything"; otherwise only the kept ids
  // render, in the canonical order — with "All work" always first so the wall
  // always has an entry point, even if its row was deleted.
  const visibleFilters =
    page.filterLabels.length > 0
      ? FILTERS.filter((tag) => tag.id === "all" || page.filterLabels.some((f) => f.id === tag.id))
      : FILTERS;
  // A deep link to a now-hidden filter (?filter=haldi) lands on the wall
  // instead of an empty grid.
  const effectiveFilter = visibleFilters.some((tag) => tag.id === photoFilter)
    ? photoFilter
    : ("all" as FilterId);
  const taggedPhotos = (id: FilterId): readonly Photo[] | null => {
    if (!libraryPhotos || id === "all") return null;
    const matches = libraryPhotos
      .filter((item) => item.categories.includes(id))
      .map((item) => item.photo);
    return matches.length > 0 ? matches : null;
  };
  const visiblePhotos: readonly Photo[] =
    effectiveFilter === "all"
      ? libraryPhotos
        ? libraryPhotos.map((item) => item.photo)
        : GROUPS.all
      : (taggedPhotos(effectiveFilter) ?? GROUPS[effectiveFilter]);
  const shownPhotos = visiblePhotos.slice(0, visibleCount);

  // CMS renames a filter button by id; unknown ids and blanks keep the built-in.
  const labelFor = (id: FilterId) =>
    page.filterLabels.find((f) => f.id === id)?.label ||
    FILTERS.find((f) => f.id === id)?.label ||
    id;

  const pickFilter = (id: FilterId) => {
    setPhotoFilter(id);
    setActivePhoto(null);
    setVisibleCount(PAGE_SIZE);
    void navigate({ to: "/portfolio", search: id === "all" ? {} : { filter: id } });
  };

  return (
    <>
      <main className="portfolio-showcase">
        <section className="portfolio-showcase-inner" aria-labelledby="portfolio-title">
          <header className="portfolio-showcase-header">
            <p className="portfolio-showcase-eyebrow">{page.eyebrow}</p>
            <h1 id="portfolio-title" className="sr-only">
              Portfolio
            </h1>
            <p>{page.sub}</p>
          </header>

          <div className="portfolio-showcase-toolbar">
            <div className="portfolio-showcase-filters" role="group" aria-label="Filter portfolio">
              {visibleFilters.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className="portfolio-filter"
                  data-active={effectiveFilter === tag.id}
                  aria-pressed={effectiveFilter === tag.id}
                  onClick={() => pickFilter(tag.id)}
                >
                  {labelFor(tag.id)}
                </button>
              ))}
            </div>
            <p className="portfolio-showcase-count">
              {fillCount(page.countTemplate, shownPhotos.length, visiblePhotos.length)}
            </p>
          </div>

          <div className="portfolio-showcase-grid">
            {shownPhotos.map((photo, index) => (
              <article className="portfolio-work-card" key={`${photo.key ?? "cms"}-${index}`}>
                <button
                  type="button"
                  className="portfolio-work-button"
                  onClick={() => setActivePhoto(index)}
                  aria-label={`View portfolio image: ${photo.alt}`}
                >
                  <PhotoImage
                    photo={photo}
                    ratio="1.18 / 1"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="portfolio-work-picture"
                    eager={index < 2}
                  />
                  <span className="portfolio-work-title">{photo.alt}</span>
                </button>
              </article>
            ))}
          </div>

          {visibleCount < visiblePhotos.length ? (
            <div className="portfolio-showcase-more">
              <button
                type="button"
                className="portfolio-show-more"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                {fillRemaining(page.showMoreTemplate, visiblePhotos.length - visibleCount)}
              </button>
            </div>
          ) : null}
        </section>
      </main>

      {activePhoto !== null ? (
        <Lightbox
          photos={visiblePhotos}
          index={activePhoto}
          onClose={() => setActivePhoto(null)}
          onStep={setActivePhoto}
        />
      ) : null}
    </>
  );
}
