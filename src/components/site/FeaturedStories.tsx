import { Link } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { ResponsiveImage } from "@/lib/images";
import { FilmBackdrop } from "@/components/site/FilmBackdrop";
import { Arrow } from "@/components/site/ui";
import { soulCinema } from "@/lib/site";
import type { ImageKey } from "@/lib/image-manifest";
import type { Wedding } from "@/lib/portfolio";
import { weddings } from "@/lib/portfolio";

/**
 * A local video file for the backdrop.
 *
 * Deliberately empty. There is no licensed Oriana or HOTC film footage on this
 * machine — only Vimeo IDs for films that are not ours to download — so
 * pointing this at a stock clip would put someone else's wedding on Oriana's
 * homepage. Drop an owned file at `public/film/manifesto.mp4` and set this to
 * "/film/manifesto.mp4"; the still sequence below is what runs until then, and
 * it is designed to look deliberate rather than like a placeholder.
 */
const BACKDROP_VIDEO = "";

const DEFAULT_STILLS: readonly ImageKey[] = [
  "kerala-cinematic-wedding-film-still",
  "calicut-cinematic-wedding-hero",
  "hero-traditional-intimate",
  "portrait-bride-sunlight",
];

/**
 * Featured stories: a dark film interlude, the Soul + Cinema manifesto, and two
 * vertical cards.
 *
 * The stories used to be a zig-zag of landscape rows alternating sides. It read
 * as a magazine feature, which was the intent, but it was the widest thing on a
 * light page and it fought the spread above it.
 *
 * They are vertical cards now — one column, portrait frames, the full set
 * leading the eye down rather than across — sitting on a desaturated moving
 * backdrop. Putting the manifesto in the same block is the point: the paragraph
 * about films and the photographs of weddings are the same argument, so they
 * belong in the same frame instead of eleven screens apart.
 */
export function FeaturedStories({ stills }: { stills?: ImageKey[] }) {
  const stories = weddings.slice(0, 2);

  return (
    <section
      className="relative isolate overflow-hidden on-ink text-paper"
      aria-labelledby="featured-heading"
    >
      <FilmBackdrop
        {...(BACKDROP_VIDEO ? { src: BACKDROP_VIDEO } : {})}
        stills={stills && stills.length > 0 ? stills : DEFAULT_STILLS}
      />

      <div className="shell relative py-24 sm:py-32">
        <Reveal>
          <p className="eyebrow on-ink">Featured</p>
          <h2 id="featured-heading" className="mt-5 max-w-[16ch] font-display text-h2 text-paper">
            Wedding stories
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-8 border-t border-paper/20 pt-10 lg:grid-cols-12 lg:gap-16">
            <h3 className="font-display text-h3 tracking-[-0.02em] text-paper lg:col-span-4">
              {soulCinema.title}
            </h3>
            <p className="max-w-[62ch] text-base leading-relaxed text-paper/75 lg:col-span-7 lg:col-start-6">
              {soulCinema.body}
            </p>
          </div>
        </Reveal>

        {/* One column, portrait frames. Two across from `lg` would be two
            landscapes again, which is the layout this section was moved away
            from. */}
        <ul className="mt-20 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:max-w-[54rem]">
          {stories.map((wedding, i) => (
            <li key={wedding.slug}>
              <Reveal delay={i * 0.08}>
                <Link
                  to="/portfolio/real-weddings/$slug"
                  params={{ slug: wedding.slug }}
                  className="group block"
                >
                  <div className="overflow-hidden">
                    <StoryCover wedding={wedding} />
                  </div>

                  <div className="mt-6 border-t border-paper/20 pt-5">
                    <h4 className="font-display text-h3 tracking-[-0.02em] text-paper">
                      {wedding.title}
                    </h4>
                    <p className="mt-2 text-sm text-paper/60">
                      {wedding.couple} · {wedding.location}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm text-paper">
                      Read the story
                      <Arrow className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The portrait cover for a story card, with the alt text derived from the story. */
function StoryCover({ wedding }: { wedding: Wedding }) {
  return (
    <ResponsiveImage
      image={wedding.cover}
      alt={`${wedding.title} — ${wedding.couple} in ${wedding.location}`}
      ratio="3 / 4"
      sizes="(min-width: 1024px) 26rem, (min-width: 640px) 28rem, 92vw"
      zoom
    />
  );
}
