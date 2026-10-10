import { useState } from "react";
import { PhotoImage } from "@/lib/images";
import { ceremonies, details, originals, portraits, preWedding } from "@/lib/photos";
import type { Photo } from "@/lib/photos";
import { films as localFilms, type Film } from "@/lib/films";

type FilmCardData = {
  couple: string;
  location: string;
  poster: string;
  posterSrcSet: string;
  posterWidth: number;
  posterHeight: number;
  youtubeId: string;
};

const toCard = (film: Film): FilmCardData => ({
  couple: film.title.toUpperCase(),
  location: film.location,
  poster: film.poster,
  posterSrcSet: film.posterSrcSet,
  posterWidth: film.posterWidth,
  posterHeight: film.posterHeight,
  youtubeId: film.youtubeId ?? "",
});

const DEFAULT_COVERS: readonly Photo[] = [
  originals[0]!,
  originals[1]!,
  portraits[0]!,
  ceremonies[0]!,
  preWedding[0]!,
  details[0]!,
];

/**
 * Four featured films with inline playback, plus the image-only cover row.
 *
 * `films` comes from the CMS via the home loader when configured (newest four
 * win); otherwise the built-in catalogue's last four — the same four frames as
 * before, so the section looks identical until the CMS takes over. Headings
 * and the six cover frames are CMS-editable the same way.
 */
export function FilmsGrid({
  films = localFilms.slice(-4),
  eyebrow = "WEDDING FILMS",
  title = "Stories, in motion.",
  covers,
}: {
  films?: Film[];
  eyebrow?: string;
  title?: string;
  covers?: Photo[];
}) {
  const featuredFilms = films.slice(-4).map(toCard);
  const editorialCovers: readonly Photo[] =
    covers && covers.length > 0 ? covers.slice(0, 6) : DEFAULT_COVERS;
  // Which card is playing inline. The film opens right inside its own
  // frame — no popup, no page change.
  const [playingCouple, setPlayingCouple] = useState<string | null>(null);

  return (
    <section id="films" className="films-editorial-section" aria-labelledby="films-heading">
      <h2 id="films-heading" className="sr-only">
        Wedding films
      </h2>
      <div className="film-editorial-heading">
        <p>{eyebrow}</p>
        <h3>{title}</h3>
      </div>
      <div className="films-feature-grid">
        {featuredFilms.map((film) => {
          if (playingCouple === film.couple) {
            return (
              <div key={film.couple} className="film-feature">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}?autoplay=1&rel=0`}
                  title={`${film.couple} wedding film`}
                  className="absolute inset-0 size-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  allowFullScreen
                />
              </div>
            );
          }
          return (
            <button
              key={film.couple}
              type="button"
              onClick={() => setPlayingCouple(film.couple)}
              className="film-feature"
              aria-label={`Play ${film.couple}, filmed in ${film.location}`}
            >
              <picture className="film-feature-picture">
                <img
                  src={film.poster}
                  srcSet={film.posterSrcSet}
                  sizes="(min-width: 100rem) 50rem, (min-width: 640px) 50vw, 100vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={film.posterWidth}
                  height={film.posterHeight}
                />
              </picture>
              <span className="film-feature-shade" aria-hidden="true" />
              <span className="film-feature-copy" aria-hidden="true">
                <span className="film-feature-brand">ORIANA WEDDINGS</span>
                <span className="film-feature-couple">{film.couple}</span>
                <span className="film-feature-location">{film.location}</span>
              </span>
              <span className="film-feature-play" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          );
        })}
      </div>

      <div className="film-cover-row" role="list" aria-label="More wedding stories">
        {editorialCovers.map((photo, index) => (
          <div className="film-cover" key={`${photo.key ?? "cms"}-${index}`} role="listitem">
            <PhotoImage
              photo={photo}
              ratio="2 / 3"
              sizes="(min-width: 900px) 8rem, 6rem"
              className="film-cover-image"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
