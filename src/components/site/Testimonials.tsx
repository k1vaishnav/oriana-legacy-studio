import { ResponsiveImage } from "@/lib/images";
import { Reveal } from "@/components/site/Reveal";
import { business, strongestMessage } from "@/lib/site";

/**
 * Wedding stories in other people's words.
 *
 * `QUOTES` is deliberately empty. A testimonial is a real person's words about
 * a real wedding, and inventing one — or attributing a plausible sentence to a
 * couple whose wedding actually happened — reads as harmless filler and is not.
 * Add the real quotes here, one per couple, with the wedding they belong to,
 * and the layout below picks them up.
 *
 * Until then the section carries the studio's own position instead. That is
 * different in kind from a testimonial and is labelled as such: it is the
 * director's statement, attributed to the director, not a guest's words about a
 * wedding that has not been given to us.
 *
 * This is the closing statement of the homepage. It replaced a marketing line
 * ("Your story deserves to be remembered") followed by two buttons, which said
 * less and asked for more — and the two buttons were immediately repeated by
 * the footer directory directly beneath them.
 */
type Quote = {
  text: string;
  couple: string;
  image: Parameters<typeof ResponsiveImage>[0]["image"];
  alt: string;
};

const QUOTES: Quote[] = [];

export function Testimonials() {
  if (QUOTES.length === 0) {
    return (
      <section className="section surface-cream" aria-labelledby="statement-heading">
        <div className="shell">
          {/* The pull quote. One statement at display size, set as a quotation
              rather than as a heading with a paragraph beside it — the
              sentence is written to be read, and splitting it across a heading
              and a body column broke it into two smaller claims. */}
          <figure className="mx-auto max-w-[54rem] text-center">
            <Reveal>
              <p className="eyebrow" aria-hidden="true">
                {strongestMessage.eyebrow}
              </p>

              <blockquote>
                <p
                  id="statement-heading"
                  className="mt-8 font-display text-editorial leading-[1.08] tracking-[-0.02em] text-ink text-balance"
                >
                  <span aria-hidden="true" className="gold">
                    &ldquo;
                  </span>
                  {strongestMessage.title}
                  <span aria-hidden="true" className="gold">
                    &rdquo;
                  </span>
                </p>
              </blockquote>
            </Reveal>

            <Reveal delay={0.08}>
              <figcaption className="mx-auto mt-12 max-w-[46ch]">
                <p className="text-base leading-relaxed text-mute text-pretty">
                  {strongestMessage.body}
                </p>
                <p className="mt-8 font-display text-h4 tracking-[-0.01em] text-ink">
                  {business.director}
                </p>
                <p className="mt-1.5 text-micro uppercase tracking-[0.18em] text-mute">Director</p>
              </figcaption>
            </Reveal>
          </figure>
        </div>
      </section>
    );
  }

  return (
    <section className="section surface-paper" aria-label="What couples say">
      <div className="shell">
        <ul className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {QUOTES.map((quote, i) => (
            <Reveal key={quote.couple} delay={(i % 2) * 0.08}>
              <li>
                <figure>
                  <ResponsiveImage
                    image={quote.image}
                    alt={`${quote.couple}'s wedding`}
                    ratio="4 / 3"
                    sizes="(min-width: 768px) 45vw, 100vw"
                  />
                  <blockquote className="mt-8 font-display text-h3 text-ink italic">
                    {quote.text}
                  </blockquote>
                  <figcaption className="mt-6 text-micro uppercase text-mute">
                    {quote.couple}
                  </figcaption>
                </figure>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
