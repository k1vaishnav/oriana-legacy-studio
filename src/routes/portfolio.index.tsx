import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Lightbox } from "@/components/site/Lightbox";
import { ResponsiveImage } from "@/lib/images";
import { FILTERS, GROUPS, PAGE_SIZE, parseFilter, type FilterId } from "@/lib/photoFilters";
import type { Photo } from "@/lib/photos";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/portfolio/")({
  validateSearch: (search: Record<string, unknown>): { filter?: FilterId } =>
    parseFilter(search["filter"]),
  head: () =>
    seo({
      title: "Wedding Photography Portfolio | Oriana Weddings",
      description:
        "Browse wedding photographs by Oriana Weddings. Explore candid, traditional, intimate, pre-wedding and other photography styles.",
      path: "/portfolio",
    }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
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

  const visiblePhotos: readonly Photo[] = GROUPS[photoFilter];
  const shownPhotos = visiblePhotos.slice(0, visibleCount);

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
            <p className="portfolio-showcase-eyebrow">ORIANA WEDDINGS · PORTFOLIO</p>
            <h1 id="portfolio-title" className="sr-only">
              Portfolio
            </h1>
            <p>A few moments, held in still frames.</p>
          </header>

          <div className="portfolio-showcase-toolbar">
            <div className="portfolio-showcase-filters" role="group" aria-label="Filter portfolio">
              {FILTERS.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className="portfolio-filter"
                  data-active={photoFilter === tag.id}
                  aria-pressed={photoFilter === tag.id}
                  onClick={() => pickFilter(tag.id)}
                >
                  {tag.label}
                </button>
              ))}
            </div>
            <p className="portfolio-showcase-count">
              Showing {shownPhotos.length} of {visiblePhotos.length} images
            </p>
          </div>

          <div className="portfolio-showcase-grid">
            {shownPhotos.map((photo, index) => (
              <article className="portfolio-work-card" key={`${photo.key}-${index}`}>
                <button
                  type="button"
                  className="portfolio-work-button"
                  onClick={() => setActivePhoto(index)}
                  aria-label={`View portfolio image: ${photo.alt}`}
                >
                  <ResponsiveImage
                    image={photo.key}
                    alt={photo.alt}
                    ratio="1.18 / 1"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="portfolio-work-picture"
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
                Show more ({visiblePhotos.length - visibleCount} remaining)
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
