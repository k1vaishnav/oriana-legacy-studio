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
  return (
    <section className="soul-section" aria-labelledby="soul-cinema-heading">
      <div className="soul-shell">
        <div className="frame">
          <div className="frame-media" aria-hidden="true">
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
