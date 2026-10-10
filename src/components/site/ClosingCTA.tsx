import { getImage, srcSet } from "@/lib/image-manifest";
import { useSiteSettings, whatsappHrefFor } from "@/lib/cms";

/**
 * The one closing call to action, rendered at the foot of every route.
 *
 * It takes no props on purpose. Each page used to pass its own eyebrow, heading
 * and button, which meant eight near-identical banners arguing with each other
 * and no two agreeing on what to ask for. The homepage version is now the only
 * version: the same ask, the same words, the same destination on all of them, so
 * the site reads as one continuous page rather than eight that happen to share
 * a footer.
 *
 * The supplied `closing-cta-user` photograph fills the frame behind the copy as
 * a real responsive image — AVIF, then WebP, then JPEG across the generated
 * width ladder — rather than a CSS background, so phones fetch a small variant
 * and desktops fetch a large one. It is decorative (`aria-hidden`, empty alt):
 * the heading carries the message.
 */
const CTA_IMAGE = "closing-cta-user" as const;

export function ClosingCTA() {
  const settings = useSiteSettings();
  const { closingCta } = settings;
  const entry = getImage(CTA_IMAGE);

  return (
    <section className="closing-cta closing-cta-banner" aria-labelledby="closing-cta-heading">
      <picture className="closing-cta-photo" aria-hidden="true">
        <source type="image/avif" srcSet={srcSet(CTA_IMAGE, "avif")} sizes="100vw" />
        <source type="image/webp" srcSet={srcSet(CTA_IMAGE, "webp")} sizes="100vw" />
        <img
          src={entry.src}
          srcSet={srcSet(CTA_IMAGE, "jpeg")}
          sizes="100vw"
          alt=""
          width={entry.width}
          height={entry.height}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div className="closing-cta-inner shell">
        <div className="closing-cta-copy">
          <p className="closing-cta-kicker">{closingCta.kicker}</p>
          <h2 id="closing-cta-heading">{closingCta.heading}</h2>
          <a
            href={whatsappHrefFor(
              settings,
              "Hello Oriana Weddings, I would love to enquire about my wedding.",
            )}
            className="closing-cta-link"
            target="_blank"
            rel="noreferrer"
          >
            {closingCta.button} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
