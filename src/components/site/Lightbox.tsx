import { useCallback, useEffect } from "react";

import { getImage, srcSet } from "@/lib/image-manifest";
import type { Photo } from "@/lib/photos";

/**
 * Full-screen image viewer.
 *
 * The grid underneath stays mounted and scroll-locked, so opening a photograph
 * and closing it returns the visitor to exactly where they were in the gallery
 * rather than to the top of the page. Escape and the arrow keys work, the close
 * button is the first thing in the tab order, and focus moves into the dialog on
 * open so a keyboard user is not left behind on the page underneath.
 */
export function Lightbox({
  photos,
  index,
  onClose,
  onStep,
}: {
  photos: readonly Photo[];
  index: number;
  onClose: () => void;
  onStep: (next: number) => void;
}) {
  const photo = photos[index];
  const entry = photo ? getImage(photo.key) : undefined;

  const go = useCallback(
    (direction: 1 | -1) => {
      if (photos.length < 2) return;
      onStep((index + direction + photos.length) % photos.length);
    },
    [index, onStep, photos.length],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [go, onClose]);

  if (!photo || !entry) return null;

  return (
    <div
      className="lightbox on-ink"
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.alt} — image ${index + 1} of ${photos.length}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="lightbox-close flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors duration-300 hover:border-paper hover:bg-paper/10"
        aria-label="Close"
        autoFocus
      >
        <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
          <path
            d="m4 4 8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {photos.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute top-1/2 left-2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors duration-300 hover:border-paper hover:bg-paper/10 sm:left-6"
            aria-label="Previous image"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path
                d="M13.5 8h-11m0 0L7 3.5M2.5 8 7 12.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute top-1/2 right-2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors duration-300 hover:border-paper hover:bg-paper/10 sm:right-6"
            aria-label="Next image"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path
                d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      ) : null}

      <figure className="lightbox-stage flex flex-col gap-4">
        <img
          key={photo.key}
          src={entry.src}
          srcSet={srcSet(photo.key, "jpeg")}
          sizes="92vw"
          alt={photo.alt}
          width={entry.width}
          height={entry.height}
          decoding="async"
          className="max-h-[74svh] w-auto max-w-full object-contain"
          style={{ backgroundColor: entry.color }}
        />
        <figcaption className="flex items-baseline justify-between gap-6 text-sm text-paper/70">
          <span className="max-w-[60ch]">{photo.alt}</span>
          <span className="tabular shrink-0">
            {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
