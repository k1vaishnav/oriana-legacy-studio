import { useState } from "react";

import { getImage, srcSet, type ImageKey } from "@/lib/image-manifest";

/**
 * A Vimeo film that does not load until it is asked for.
 *
 * A Vimeo embed pulls roughly half a megabyte of player JavaScript, which on a
 * photography site is the single most expensive thing on the page and competes
 * directly with the images. So nothing is fetched until a visitor clicks: the
 * card is a photograph, and the iframe replaces it in place on click, keeping
 * the same box so nothing on the page moves.
 *
 * `vimeoId` is a placeholder. Replace the ids in `src/lib/films.ts` with the
 * studio's own films before launch — do not ship other studios' work.
 */
export function VideoPlayer({
  vimeoId,
  title,
  poster,
  ratio = "16 / 9",
  autoplay = true,
}: {
  vimeoId?: string | undefined;
  title: string;
  poster: ImageKey;
  ratio?: string;
  autoplay?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const entry = getImage(poster);

  if (!vimeoId) {
    return (
      /* A known cream surface, not the poster's average colour. Tinting with
         entry.color meant the contrast of this panel depended on whichever
         photograph happened to be behind it — a light frame left "Film coming
         soon" sitting at roughly 2:1. */
      <div className="img-shell surface-bone" style={{ aspectRatio: ratio }}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="text-sm font-medium text-ink">Film coming soon</p>
          <p className="max-w-[34ch] text-xs text-mute">Ask for this film on enquiry.</p>
        </div>
      </div>
    );
  }

  const query = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    background: "1",
    // Lets the player fill its box instead of letterboxing inside a black frame.
    dnt: "1",
    title: "0",
    byline: "0",
    portrait: "0",
  });

  return (
    <div className="img-shell" style={{ aspectRatio: ratio, backgroundColor: entry.color }}>
      {playing ? (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?${query}`}
          title={title}
          className="absolute inset-0 size-full border-0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          allowFullScreen
        />
      ) : (
        <>
          <picture
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <source
              type="image/avif"
              srcSet={srcSet(poster, "avif")}
              sizes="(min-width: 1024px) 44rem, 92vw"
            />
            <source
              type="image/webp"
              srcSet={srcSet(poster, "webp")}
              sizes="(min-width: 1024px) 44rem, 92vw"
            />
            <img
              src={entry.src}
              srcSet={srcSet(poster, "jpeg")}
              alt={title}
              width={entry.width}
              height={entry.height}
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1024px) 44rem, 92vw"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </picture>
          {/* Kept deliberately light: enough to hold the caption, not to darken
              the photograph into a different picture. */}
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgb(11 11 11 / 0.72) 0%, rgb(11 11 11 / 0.1) 45%, rgb(11 11 11 / 0.18) 100%)",
            }}
          />
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex size-full flex-col items-start justify-end gap-4 p-5 text-left sm:p-7"
            aria-label={`Play ${title}`}
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:scale-105 sm:size-16">
              <svg
                viewBox="0 0 16 16"
                className="ml-0.5 size-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4.5 2.6v10.8a.6.6 0 0 0 .92.5l8.3-5.4a.6.6 0 0 0 0-1L5.42 2.1a.6.6 0 0 0-.92.5Z" />
              </svg>
            </span>
            <span className="text-h3 max-w-[20ch] font-medium text-paper">{title}</span>
          </button>
        </>
      )}
    </div>
  );
}
