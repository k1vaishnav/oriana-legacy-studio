import { useEffect, useRef, useState } from "react";

import { soulCinema } from "@/lib/site";

/**
 * Soul + Cinema — a wide editorial strip, not a full-screen block.
 *
 * The video runs the full width of the viewport and is deliberately short: a
 * cinematic ratio capped by a max-height, so on a large display it stays a
 * horizontal band rather than swallowing the page. The section around it is the
 * same warm cream as the rest of the site, with room above and below, so the
 * film sits inside the page instead of interrupting it with a black band.
 *
 * The footage is the studio's own "We Became One" wedding film, ambient
 * (muted, looping, no controls) behind the manifesto — and it only loads when
 * the band scrolls near, so it costs nothing on initial page load.
 *
 * The copy comes from `soulCinema` in `@/lib/site` rather than being written
 * here, so the manifesto is the same sentence everywhere it appears.
 */
const FEATURE_VIDEO_ID = "35c2JPyf90I";
export function SoulCinemaBanner() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [playVideo, setPlayVideo] = useState(false);

  // The film only starts loading when the band is close to the viewport.
  // Respects reduced-motion by staying on the still poster.
  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    if (
      typeof window.matchMedia !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setPlayVideo(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPlayVideo(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section className="soul-section" aria-labelledby="soul-cinema-heading">
      <div className="soul-shell">
        <div className="frame" ref={frameRef}>
          <div className="frame-media" aria-hidden="true">
            {playVideo ? (
              <iframe
                className="frame-yt"
                src={`https://www.youtube-nocookie.com/embed/${FEATURE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${FEATURE_VIDEO_ID}&controls=0&rel=0&playsinline=1&disablekb=1`}
                allow="autoplay; fullscreen"
                tabIndex={-1}
                title="Oriana Weddings film"
              />
            ) : (
              <img
                className="frame-video"
                src="/img/yt-we-became-one-800.jpg"
                srcSet="/img/yt-we-became-one-480.jpg 480w, /img/yt-we-became-one-800.jpg 800w"
                sizes="100vw"
                alt=""
                loading="lazy"
                decoding="async"
                width={1280}
                height={720}
              />
            )}
            <div className="frame-grade" />
          </div>
          <div className="frame-copy-block">
            <h2 id="soul-cinema-heading">{soulCinema.title}</h2>
            <p>{soulCinema.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
