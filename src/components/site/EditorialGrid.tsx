import { useState } from "react";
import { ResponsiveImage } from "@/lib/images";
import { Lightbox } from "@/components/site/Lightbox";
import { originals, ceremonies } from "@/lib/photos";
import type { Photo } from "@/lib/photos";

const GRID_PHOTOS: readonly Photo[] = [...originals, ...ceremonies];
const GRID_CELLS = Array.from({ length: 15 }, (_, index) => index);

export function EditorialGrid() {
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
                <span>Some of the most</span>
                <strong>ICONIC</strong>
                <span>wedding images</span>
              </div>
            );
          }

          const photoIndex = cell < 7 ? cell : cell - 1;
          const photo = GRID_PHOTOS[photoIndex];
          if (!photo) return null;

          return (
            <button
              key={photo.key}
              type="button"
              onClick={() => setLightbox(photoIndex)}
              className="editorial-grid-photo"
              aria-label={`Open photograph: ${photo.alt}`}
            >
              <ResponsiveImage
                image={photo.key}
                alt={photo.alt}
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
          photos={GRID_PHOTOS}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onStep={setLightbox}
        />
      )}
    </section>
  );
}
