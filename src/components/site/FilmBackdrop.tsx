import { useState } from "react";

import { ResponsiveImage } from "@/lib/images";
import type { ImageKey } from "@/lib/image-manifest";

/**
 * A black-and-white moving backdrop for the stories section.
 *
 * Two sources, in priority order:
 *
 *  1. `src` — a real video file, played muted, looping and inline. Autoplay
 *     policies only permit this when the element is muted and carries
 *     `playsInline`; both are set, because dropping either one turns the
 *     backdrop into a black rectangle on iOS.
 *
 *  2. `stills` — a slow cross-fade of desaturated frames with a gentle drift.
 *     This runs when no video file has been supplied, and it is a real fallback
 *     rather than a placeholder: the section has to look finished on day one,
 *     and a slow cross-fade reads as film rather than as a missing asset.
 *
 * If the video 404s or the browser refuses to decode it, the stills take over,
 * so the section is never blank. The wash is two layers, because one was not
 * enough to hold white text at AA over an unpredictable photograph.
 */
export function FilmBackdrop({
  src,
  stills,
  interval = 12000,
  className = "",
}: {
  /** Path to a local video file. Leave empty to run on the still sequence. */
  src?: string | undefined;
  /** Image keys from the manifest, used for the desaturated fallback. */
  stills: readonly ImageKey[];
  interval?: number | undefined;
  className?: string | undefined;
}) {
  const [videoBroken, setVideoBroken] = useState(false);
  const useStills = !src || videoBroken;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {!useStills ? (
        <video
          className="size-full object-cover"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoBroken(true)}
        />
      ) : null}

      {useStills ? <StillsSequence stills={stills} interval={interval} /> : null}

      {/* The wash. The dark gradient carries the contrast; the flat ink layer
          stops a bright frame from punching through the middle of a paragraph. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink/90" />
      <div className="absolute inset-0 bg-ink/45" />
    </div>
  );
}

/**
 * The desaturated fallback sequence.
 *
 * Rendered as a stack of frames with a CSS keyframe rather than a React timer,
 * so the cross-fade costs no JavaScript per frame and cannot drift out of sync
 * with the reveal transitions.
 */
function StillsSequence({ stills, interval }: { stills: readonly ImageKey[]; interval: number }) {
  const frames = stills.slice(0, 4);
  if (frames.length === 0) return null;

  const seconds = interval / 1000;

  return (
    <div className="absolute inset-0">
      {frames.map((key, i) => (
        <div
          key={key}
          className="absolute inset-0 opacity-0"
          style={{
            animation: `film-crossfade ${seconds * frames.length}s linear ${i * seconds}s infinite`,
          }}
        >
          <ResponsiveImage
            image={key}
            alt=""
            sizes="100vw"
            className="size-full scale-105"
            style={{ aspectRatio: "auto" }}
          />
        </div>
      ))}
    </div>
  );
}
