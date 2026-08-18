import { Play } from "lucide-react";
import { useState } from "react";

import { trackEvent } from "@/lib/analytics";

type FilmFrameProps = {
  poster: string;
  alt: string;
  title: string;
  meta?: string;
  youtubeId?: string;
  ratio?: string;
  width: number;
  height: number;
};

/**
 * Premium film frame. Renders a poster with a restrained play affordance and
 * swaps in the YouTube embed only once the visitor asks for it. Pass
 * `youtubeId` when the client supplies real film URLs.
 */
export function FilmFrame({
  poster,
  alt,
  title,
  meta,
  youtubeId,
  ratio = "16 / 9",
  width,
  height,
}: FilmFrameProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure>
      <div className="group relative overflow-hidden bg-foreground/5" style={{ aspectRatio: ratio }}>
        {playing && youtubeId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <>
            <img
              src={poster}
              alt={alt}
              width={width}
              height={height}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 100vw, 80vw"
              className="img-cover group-hover:scale-[1.03]"
            />
            <button
              type="button"
              onClick={() => {
                trackEvent("film_play", { film: title });
                if (youtubeId) setPlaying(true);
              }}
              className="absolute inset-0 flex items-center justify-center"
              aria-label={youtubeId ? `Play ${title}` : `${title} — film coming soon`}
            >
              <span className="flex size-20 items-center justify-center rounded-full border border-background/70 bg-background/15 backdrop-blur-[2px] transition-all duration-700 group-hover:size-24 group-hover:bg-background/25">
                <Play className="size-5 text-background" strokeWidth={1} />
              </span>
            </button>
          </>
        )}
      </div>
      <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
        <span className="font-display text-xl">{title}</span>
        <span className="text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground">
          {meta ?? "[YOUTUBE FILM]"}
        </span>
      </figcaption>
    </figure>
  );
}
