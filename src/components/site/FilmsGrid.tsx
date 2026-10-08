import { useState } from "react";
import { getImage, srcSet } from "@/lib/image-manifest";
import { ResponsiveImage } from "@/lib/images";
import { VideoLightbox } from "@/components/site/VideoLightbox";
import { ceremonies, details, originals, portraits, preWedding } from "@/lib/photos";
import type { Photo } from "@/lib/photos";

type FilmCardData = {
  couple: string;
  location: string;
  posterKey: "film-tamanna-dan" | "film-alisha-rahul" | "film-sid-saloni" | "film-zina-zoya";
  vimeoId: string;
};

const featuredFilms: FilmCardData[] = [
  {
    couple: "TAMANNA & DAN",
    location: "Lake Como, Italy",
    posterKey: "film-tamanna-dan",
    vimeoId: "787844871",
  },
  {
    couple: "ALISHA & RAHUL",
    location: "Amalfi Coast, Italy",
    posterKey: "film-alisha-rahul",
    vimeoId: "790541936",
  },
  {
    couple: "SALONI & SID",
    location: "Bangkok",
    posterKey: "film-sid-saloni",
    vimeoId: "682018257",
  },
  {
    couple: "ZINA & ZAIN",
    location: "Kashmir Valley",
    posterKey: "film-zina-zoya",
    vimeoId: "758257831",
  },
];

const editorialCovers: readonly Photo[] = [
  originals[4]!,
  originals[5]!,
  portraits[4]!,
  ceremonies[0]!,
  preWedding[0]!,
  details[0]!,
];

export function FilmsGrid() {
  const [activeFilm, setActiveFilm] = useState<FilmCardData | null>(null);

  return (
    <section id="films" className="films-editorial-section" aria-labelledby="films-heading">
      <h2 id="films-heading" className="sr-only">
        Wedding films
      </h2>
      <div className="film-editorial-heading">
        <p>WEDDING FILMS</p>
        <h3>Stories, in motion.</h3>
      </div>
      <div className="films-feature-grid">
        {featuredFilms.map((film) => {
          const image = getImage(film.posterKey);

          return (
            <button
              key={film.couple}
              type="button"
              onClick={() => setActiveFilm(film)}
              className="film-feature"
              aria-label={`Play ${film.couple}, filmed in ${film.location}`}
            >
              <picture className="film-feature-picture">
                <source
                  type="image/avif"
                  srcSet={srcSet(film.posterKey, "avif")}
                  sizes="(min-width: 100rem) 50rem, (min-width: 640px) 50vw, 100vw"
                />
                <source
                  type="image/webp"
                  srcSet={srcSet(film.posterKey, "webp")}
                  sizes="(min-width: 100rem) 50rem, (min-width: 640px) 50vw, 100vw"
                />
                <img
                  src={image.src}
                  srcSet={srcSet(film.posterKey, "jpeg")}
                  sizes="(min-width: 100rem) 50rem, (min-width: 640px) 50vw, 100vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={image.width}
                  height={image.height}
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
        {editorialCovers.map((photo) => (
          <div className="film-cover" key={photo.key} role="listitem">
            <ResponsiveImage
              image={photo.key}
              alt={photo.alt}
              ratio="2 / 3"
              sizes="(min-width: 900px) 8rem, 6rem"
              className="film-cover-image"
            />
          </div>
        ))}
      </div>

      {activeFilm && (
        <VideoLightbox
          open={true}
          onClose={() => setActiveFilm(null)}
          title={activeFilm.couple}
          vimeoId={activeFilm.vimeoId}
        />
      )}
    </section>
  );
}
