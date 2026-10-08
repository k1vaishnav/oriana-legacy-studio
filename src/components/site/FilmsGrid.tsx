import { useState } from "react";
import { ResponsiveImage } from "@/lib/images";
import { VideoLightbox } from "@/components/site/VideoLightbox";
import { ceremonies, details, originals, portraits, preWedding } from "@/lib/photos";
import type { Photo } from "@/lib/photos";

type FilmCardData = {
  couple: string;
  location: string;
  poster: string;
  posterSrcSet: string;
  posterWidth: number;
  posterHeight: number;
  youtubeId: string;
};

const featuredFilms: FilmCardData[] = [
  {
    couple: "ARUN & DIANA",
    location: "Kerala",
    poster: "/img/yt-arun-diana.jpg",
    posterSrcSet: "/img/yt-arun-diana-480.jpg 480w, /img/yt-arun-diana-800.jpg 800w",
    posterWidth: 1280,
    posterHeight: 720,
    youtubeId: "kdRKkLJkZgI",
  },
  {
    couple: "SANGEETH & SRUTHI",
    location: "Kerala",
    poster: "/img/yt-sangeeth-sruthi.jpg",
    posterSrcSet: "/img/yt-sangeeth-sruthi-480.jpg 480w, /img/yt-sangeeth-sruthi-800.jpg 800w",
    posterWidth: 1280,
    posterHeight: 720,
    youtubeId: "YMOYz-KhvEQ",
  },
  {
    couple: "RARUN & AMISHA",
    location: "Kerala",
    poster: "/img/yt-rarun-amisha.jpg",
    posterSrcSet: "/img/yt-rarun-amisha-480.jpg 480w, /img/yt-rarun-amisha-800.jpg 800w",
    posterWidth: 1280,
    posterHeight: 720,
    youtubeId: "UrGMsSwgdKE",
  },
  {
    couple: "MANISH & KRITIKA",
    location: "Pre-wedding",
    poster: "/img/yt-manish-kritika.jpg",
    posterSrcSet: "/img/yt-manish-kritika-480.jpg 480w, /img/yt-manish-kritika-800.jpg 800w",
    posterWidth: 1280,
    posterHeight: 720,
    youtubeId: "1N3foXgTtHo",
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
          return (
            <button
              key={film.couple}
              type="button"
              onClick={() => setActiveFilm(film)}
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
          youtubeId={activeFilm.youtubeId}
        />
      )}
    </section>
  );
}
