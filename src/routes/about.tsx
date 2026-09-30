import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { TeamEditorial } from "@/components/site/TeamEditorial";
import { Reveal } from "@/components/site/Reveal";
import { Bento, Marquee } from "@/components/site/Marquee";
import { Carousel, CarouselCard } from "@/components/site/Carousel";
import {
  ActionLink,
  Arrow,
  DetailList,
  NumberedSteps,
  SectionHead,
  SplitHead,
  StatBand,
  TextLink,
} from "@/components/site/ui";
import { PageHero } from "@/components/site/PageHero";
import { ResponsiveImage } from "@/lib/images";
import { ceremonies, originals, portraits, preWedding } from "@/lib/photos";
import {
  business,
  coverage,
  differenceCards,
  offices,
  orianaPromise,
  orianaSystem,
  stats,
} from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () =>
    seo({
      title: "About Oriana Weddings | Best Photographer in Calicut | Best Photographer in Kerala",
      description:
        "Discover Oriana Weddings, a 12+ year wedding photography and filmmaking brand based in Calicut and Ahmedabad, managing weddings across Kerala, Gujarat, India and beyond.",
      path: "/about",
    }),
  component: AboutPage,
});

/**
 * About is the entity page. Its job, per the plan, is to make the brand
 * *answerable*: who we are, where we are, what we do, who we serve, and what
 * proof exists. So the structure is identity, then difference, then system, then
 * proof, then places — in that order, with the numbers attached to the claims
 * rather than floating on their own.
 */

/**
 * The six-column bento's tile, declared instead of inferred.
 *
 * Read as a grid: the lead card takes four columns and two rows, the two cards
 * beside it take two each, the next pair take three each, and the last takes
 * the full six. That is 8 + 2 + 2 + 3 + 3 + 6 = twenty-four cells against a
 * 6x4 rectangle — a closed tile, with no orphan row and no hole.
 *
 * Every span is `lg:`, which is 64rem, the same breakpoint at which the bento
 * substrate becomes six columns wide. Below it the classes simply do not apply
 * and the grid falls back to its own column counts, so the composition holds at
 * every width without a second set of overrides.
 *
 * Keyed by title rather than by index so the map is checked against the cards
 * themselves: a card added, removed or renamed becomes a type error here
 * instead of a silent shift in the composition.
 */
const DIFFERENCE_SPANS: Record<(typeof differenceCards)[number]["title"], string> = {
  "You Choose Oriana. We Choose the Right Team.": "lg:col-span-4 lg:row-span-2",
  "The Team Is Built Around Your Wedding": "lg:col-span-2",
  "100% Oriana Management": "lg:col-span-2",
  "After the Wedding, You Still Deal With Oriana": "lg:col-span-3",
  "We Don't Impose Our Style": "lg:col-span-3",
  "Your Wedding Is Not Content": "lg:col-span-6",
};

/**
 * Card grounds, keyed by the card's own tone.
 *
 * The section stands on cream, so the `cream` tone cannot paint cream — it
 * would vanish into the page. It takes the one true white instead, which is
 * the site's established way of saying "this one is set apart". Only the ink
 * tone inverts, and it carries its own text colour with it.
 */
const DIFFERENCE_TONES: Record<
  (typeof differenceCards)[number]["tone"],
  { card: string; body: string }
> = {
  paper: { card: "border-line bg-paper", body: "mute" },
  ink: { card: "border-ink bg-ink", body: "text-paper/75" },
  cream: { card: "border-line bg-bone", body: "mute" },
};
function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Oriana"
        title="More than wedding photographers"
        lead="Oriana Weddings has grown beyond the traditional idea of a wedding photography company. It is a photography and filmmaking brand built around experience, team selection, planning, management and trust."
        image="kerala-drone-wedding-venue-aerial"
        alt="Aerial drone view of a Kerala wedding venue surrounded by coconut palms, photographed by Oriana Weddings"
        meta={[
          { label: "Founded", value: "12+ years experience" },
          { label: "Main office", value: "Calicut, Kerala" },
        ]}
        crumb={[{ name: "About" }]}
      />

      {/* The team goes first. An entity page should answer "who" before it
          starts explaining "how" — and the team is the most human thing on
          the page, so it is the right thing to meet first. */}
      <TeamEditorial />

      <section className="section surface-paper">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow mb-5">The right team for the right wedding</p>
              <h2 className="text-h1 max-w-[16ch]">
                We don&apos;t believe one photographer is right for every couple.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="flex flex-col gap-6 lg:col-span-5 lg:pt-12">
              <p className="lede">
                Every photographer has a different visual language, personality, technical ability
                and experience. We understand the client first. Then we select the team.
              </p>
              <p className="text-sm mute">
                Oriana retains the professional decision-making responsibility for selecting the
                photography and filmmaking team. That is not a way of avoiding accountability — it
                is how we take responsibility for the result.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-16 border-t border-line pt-12">
            <StatBand stats={stats} />
          </Reveal>
        </div>
      </section>

      {/* The differentiator, as cards. */}
      <section className="section surface-cream">
        <div className="shell-wide">
          <SectionHead
            eyebrow="Why we retain selection"
            title="The decision stays with Oriana, on purpose"
            lead="A photographer's old work is evidence of what they have done. It is not evidence of what they are best suited to do for your wedding today."
          />
          {/*
            A bento that closes.

            The substrate is six columns at desktop (the `bento-3` rule widens to
            six past 64rem), and the spans below are declared so the six cards
            tile that rectangle exactly — 4x2, 2, 2, 3, 3, 6 — twenty-four cells
            with nothing left over. The previous version gave only the lead card
            a span, which put five cards on the first row and left the sixth
            alone on a row of its own: a bento with a hole in it reads as a
            mistake, not as a composition.

            Below desktop the spans do not apply, so the grid degrades on its own:
            two columns on a phone with every card full width, three equal
            columns on a tablet with two clean rows. Nothing here is a
            breakpoint-specific override — one set of `lg:` spans, and the
            substrate handles the rest.
          */}
          <Bento columns={3} className="mt-12">
            {differenceCards.slice(0, 6).map((card, index) => {
              const tone = DIFFERENCE_TONES[card.tone];
              return (
                <Reveal
                  key={card.title}
                  delay={index * 0.05}
                  className={DIFFERENCE_SPANS[card.title]}
                >
                  <article
                    className={`flex h-full flex-col justify-between gap-8 rounded-card border p-7 sm:p-8 ${tone.card} ${
                      card.tone === "ink" ? "text-paper" : "text-ink"
                    }`}
                  >
                    <h3 className="text-h3 max-w-[24ch]">{card.title}</h3>
                    <p className={`text-sm max-w-[62ch] ${tone.body}`}>{card.body}</p>
                  </article>
                </Reveal>
              );
            })}
          </Bento>
        </div>
      </section>

      {/* The studio's own vocabulary, on a loop that rejoins itself. The track
          is duplicated and translated -50%, so the second half is pixel-identical
          to the first and the seam is invisible. A longer phrase list means the
          seam comes round less often, which is what makes it read as endless. */}
      <Marquee
        tone="cream"
        items={[
          "12+ years",
          "Two studios",
          "Kerala",
          "Gujarat",
          "India",
          "Worldwide",
          "In-house team",
          "One point of contact",
          "Destination shoots",
          "Confidential coverage",
        ]}
        slow
      />

      {/* Places. The entity page's locality proof. */}
      <section className="section surface-paper">
        <div className="shell-wide">
          <SectionHead
            eyebrow="Offices & coverage"
            title="Two offices, and everywhere else we can reach"
            lead="Our main office is in Calicut, Kerala. Our Gujarat office is in Law Garden, Ahmedabad. With strong wedding heritage in both states, we work across India and undertake destination and international shoots."
          />

          <Bento columns={2} className="mt-12">
            {offices.map((office, index) => (
              <Reveal key={office.city} delay={index * 0.08}>
                <article className="flex h-full flex-col justify-between gap-8 rounded-card border border-line bg-paper p-8">
                  <div className="flex flex-col gap-3">
                    <span className="tabular text-xs gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-h3">{office.city}</h3>
                    <p className="text-sm mute">{office.role}</p>
                  </div>
                  <address className="flex flex-col gap-1.5 text-sm not-italic">
                    <span>{office.street}</span>
                    <span>{office.postcode}</span>
                    <a
                      href={office.phoneHref}
                      className="mt-2 w-fit border-b border-line pb-0.5 transition-colors hover:border-ink"
                    >
                      {office.phone}
                    </a>
                  </address>
                </article>
              </Reveal>
            ))}
          </Bento>

          <Reveal className="mt-12 flex flex-col gap-5">
            <p className="text-micro tracking-[0.18em] uppercase mute">Coverage</p>
            <ul className="flex flex-wrap gap-2">
              {coverage.map((place) => (
                <li key={place} className="chip cursor-default">
                  {place}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
