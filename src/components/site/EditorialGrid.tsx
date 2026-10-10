import { useState } from "react";
import { PhotoImage } from "@/lib/images";
import { Lightbox } from "@/components/site/Lightbox";
import { originals, ceremonies } from "@/lib/photos";
import type { Photo } from "@/lib/photos";

const DEFAULT_PHOTOS: readonly Photo[] = [...originals, ...ceremonies];
const DEFAULT_LINES = ["Some of the most", "ICONIC", "wedding images"];
const GRID_CELLS = Array.from({ length: 15 }, (_, index) => index);

/**
 * The 15-cell mosaic — CMS picks the 14 photographs and the 3 title lines.
 * The middle cell (index 7) is always the title, so 14 photos fill 14 cells.
 */
export function EditorialGrid({ photos, titleLines }: { photos?: Photo[]; titleLines?: string[] }) {
  const gridPhotos: readonly Photo[] =
    photos && photos.length > 0 ? photos.slice(0, 14) : DEFAULT_PHOTOS;
  const lines =
    titleLines && titleLines.length >= 3
      ? [titleLines[0]!, titleLines[1]!, titleLines[2]!]
      : DEFAULT_LINES;
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="the-work" className="editorial-grid-section" aria-labelledby="spread-heading">
      <h2 id="spread-heading" className="sr-only">
        Selected wedding photographs
      </h2>
      <div className="editorial-image-grid">
        {GRID_CELLS.map((cell) => {
          if (cell === 7) {
            return (
              <div className="editorial-grid-title" key="title">
                <span>{lines[0]}</span>
                <strong>{lines[1]}</strong>
                <span>{lines[2]}</span>
              </div>
            );
          }

          const photoIndex = cell < 7 ? cell : cell - 1;
          const photo = gridPhotos[photoIndex];
          if (!photo) return null;

          return (
            <button
              key={`${photo.key ?? "cms"}-${photoIndex}`}
              type="button"
              onClick={() => setLightbox(photoIndex)}
              className="editorial-grid-photo"
              aria-label={`Open photograph: ${photo.alt}`}
            >
              <PhotoImage
                photo={photo}
                ratio="1 / 1"
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="editorial-grid-image"
              />
            </button>
          );
        })}
      </div>

      {lightbox !== null && (
        <Lightbox
          photos={gridPhotos}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onStep={setLightbox}
        />
      )}
    </section>
  );
}
