import { whatsappHref } from "@/lib/site";

/**
 * The one closing call to action, rendered at the foot of every route.
 *
 * It takes no props on purpose. Each page used to pass its own eyebrow, heading
 * and button, which meant eight near-identical banners arguing with each other
 * and no two agreeing on what to ask for. The homepage version is now the only
 * version: the same ask, the same words, the same destination on all of them, so
 * the site reads as one continuous page rather than eight that happen to share
 * a footer.
 */
export function ClosingCTA() {
  return (
    <section
      className="closing-cta closing-cta-banner"
      aria-labelledby="closing-cta-heading"
      style={{ backgroundImage: "url('/img/closing-cta-user.webp')" }}
    >
      <div className="closing-cta-inner shell">
        <div className="closing-cta-copy">
          <p className="closing-cta-kicker">ORIANAWEDDINGS · WEDDING PHOTOGRAPHY &amp; FILMS</p>
          <h2 id="closing-cta-heading">A day, held forever.</h2>
          <a
            href={whatsappHref("Hello Oriana Weddings, I would love to enquire about my wedding.")}
            className="closing-cta-link"
            target="_blank"
            rel="noreferrer"
          >
            Enquire on WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
