import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { ClosingCTA } from "@/components/site/ClosingCTA";
import { VideoPlayer } from "@/components/site/VideoPlayer";
import { films, type Film } from "@/lib/films";
import { getImage } from "@/lib/image-manifest";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/wedding-films")({
  head: () =>
    seo({
      title:
        "Wedding Films | Oriana Weddings",
      description:
        "Watch wedding films, teasers, highlights and storytelling films by Oriana Weddings.",
      path: "/wedding-films",
    }),
  component: FilmsPage,
});

function FilmsPage() {
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);

  useEffect(() => {
    if (!activeFilm) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveFilm(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeFilm]);

  return (
    <>
      <main className="films-library-page">
        <section className="films-library" aria-labelledby="films-library-title">
          <h1 id="films-library-title" className="sr-only">Wedding films</h1>
          <div className="films-library-grid">
            {films.map((film) => {
              const poster = getImage(film.poster);
              return (
                <article className="films-library-card" key={film.slug}>
                  <button
                    type="button"
                    className="films-library-card-button"
                    onClick={() => setActiveFilm(film)}
                    aria-label={`View ${film.title} details and play film`}
                  >
                    <img src={poster.src} alt="" loading="lazy" />
                    <span className="films-library-meta">{film.duration} <span aria-hidden="true">·</span> {film.location}</span>
                    <span className="films-library-title">{film.title}</span>
                    <span className="films-library-description">{film.description}</span>
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {activeFilm ? (
        <div
          className="film-detail-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveFilm(null);
          }}
        >
          <section
            className="film-detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="film-detail-title"
          >
            <button
              type="button"
              className="film-detail-close"
              aria-label="Close film details"
              onClick={() => setActiveFilm(null)}
              autoFocus
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="film-detail-player">
              <VideoPlayer
                vimeoId={activeFilm.vimeoId}
                title={activeFilm.title}
                poster={activeFilm.poster}
              />
            </div>
            <div className="film-detail-copy">
              <p className="films-library-meta">{activeFilm.duration} <span aria-hidden="true">·</span> {activeFilm.location}</p>
              <h2 id="film-detail-title">{activeFilm.title}</h2>
              <p>{activeFilm.description}</p>
            </div>
          </section>
        </div>
      ) : null}

      <ClosingCTA />
    </>
  );
}
