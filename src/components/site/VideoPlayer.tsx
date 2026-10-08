import { useState } from "react";

/**
 * A YouTube film that does not load until it is asked for.
 *
 * A YouTube embed pulls player JavaScript, which on a photography site is
 * one of the most expensive things on the page and competes directly with
 * the images. So nothing is fetched until a visitor clicks: the card is a
 * still from the studio's own channel, and the iframe replaces it in place
 * on click, keeping the same box so nothing on the page moves.
 */
export function VideoPlayer({
  youtubeId,
  title,
  poster,
  posterSrcSet,
  posterWidth,
  posterHeight,
  ratio = "16 / 9",
  autoplay = true,
}: {
  youtubeId?: string | undefined;
  title: string;
  poster: string;
  posterSrcSet: string;
  posterWidth: number;
  posterHeight: number;
  ratio?: string | undefined;
  autoplay?: boolean | undefined;
}) {
  const [playing, setPlaying] = useState(false);

  if (!youtubeId) {
    return (
      /* A known cream surface while the real film is one click away. */
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
    rel: "0",
  });

  return (
    <div className="img-shell" style={{ aspectRatio: ratio, backgroundColor: "#201e1b" }}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${query}`}
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
            <img
              src={poster}
              srcSet={posterSrcSet}
              alt={title}
              width={posterWidth}
              height={posterHeight}
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
