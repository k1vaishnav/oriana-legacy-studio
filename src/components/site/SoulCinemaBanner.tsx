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
 * The copy comes from `soulCinema` in `@/lib/site` rather than being written
 * here, so the manifesto is the same sentence everywhere it appears.
 */
export function SoulCinemaBanner() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [playVideo, setPlayVideo] = useState(false);

  // The 2.5MB film only starts downloading when the band is close to the
  // viewport — autoplay would otherwise fetch it on initial page load.
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
              <video
                className="frame-video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/img/home-hero-user.webp"
                aria-hidden="true"
              >
                <source src="/video/soul-cinema-stock.mp4" type="video/mp4" />
              </video>
            ) : (
              <img
                className="frame-video"
                src="/img/home-hero-user.webp"
                alt=""
                loading="lazy"
                decoding="async"
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
