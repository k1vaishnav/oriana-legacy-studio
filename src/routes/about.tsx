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
import { getAboutPage, useSiteSettings } from "@/lib/cms";
import {
  coverage as fallbackCoverage,
  differenceCards as fallbackDifferenceCards,
  offices as fallbackOffices,
  stats as fallbackStats,
} from "@/lib/site";

export const Route = createFileRoute("/about")({
  loader: async () => ({ page: await getAboutPage() }),
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
 * Keyed by title with a safe default, so a CMS-edited card that renames a title
 * still tiles instead of breaking the composition.
 */
const DIFFERENCE_SPANS: Record<string, string> = {
  "You Choose Oriana. We Choose the Right Team.": "lg:col-span-4 lg:row-span-2",
  "The Team Is Built Around Your Wedding": "lg:col-span-2",
  "100% Oriana Management": "lg:col-span-2",
  "After the Wedding, You Still Deal With Oriana": "lg:col-span-3",
  "We Don't Impose Our Style": "lg:col-span-3",
  "Your Wedding Is Not Content": "lg:col-span-6",
};
const DEFAULT_SPAN = "lg:col-span-2";

/**
 * Card grounds, keyed by the card's own tone.
 *
 * The section stands on cream, so the `cream` tone cannot paint cream — it
 * would vanish into the page. It takes the one true white instead, which is
 * the site's established way of saying "this one is set apart". Only the ink
 * tone inverts, and it carries its own text colour with it.
 */
const DIFFERENCE_TONES: Record<string, { card: string; body: string; text: string }> = {
  paper: { card: "border-line bg-paper", body: "mute", text: "text-ink" },
  ink: { card: "border-ink bg-ink", body: "text-paper/75", text: "text-paper" },
  cream: { card: "border-line bg-bone", body: "mute", text: "text-ink" },
};

const DEFAULT_MARQUEE = [
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
];

function AboutPage() {
  const { page } = Route.useLoaderData();
  const settings = useSiteSettings();
  const stats = settings.stats.length > 0 ? settings.stats : fallbackStats;
  const offices = settings.offices.length > 0 ? settings.offices : fallbackOffices;
  const coverage = settings.coverage.length > 0 ? settings.coverage : fallbackCoverage;
  // CMS cards carry title + body; tone follows the built-in order so the bento
  // keeps its paper/ink/cream composition. Unknown counts degrade to paper.
  const tones = ["paper", "ink", "paper", "paper", "paper", "cream"] as const;
  const cards =
    page.differenceCards.length > 0
      ? page.differenceCards.map((card, i) => ({
          ...card,
          tone: tones[i % tones.length] as (typeof tones)[number],
        }))
      : fallbackDifferenceCards.map((card) => ({ ...card }));
  const marquee = page.marqueeItems.length > 0 ? page.marqueeItems : DEFAULT_MARQUEE;
  return (
    <>
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        lead={page.heroLead}
        image="calicut-church-wedding-ceremony"
        alt="Wedding ceremony with family and friends, photographed by Oriana Weddings"
        meta={[
          { label: "Founded", value: "12+ years experience" },
          { label: "Main office", value: "Calicut, Kerala" },
        ]}
        crumb={[{ name: "About" }]}
      />

      {/* The team goes first. An entity page should answer "who" before it
          starts explaining "how" — and the team is the most human thing on
          the page, so it is the right thing to meet first. */}
      <TeamEditorial eyebrow={page.teamEyebrow} heading={page.teamHeading} body={page.teamBody} />

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
            eyebrow={page.differenceEyebrow}
            title={page.differenceTitle}
            lead={page.differenceLead}
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
            {cards.slice(0, 6).map((card, index) => {
              const tone = DIFFERENCE_TONES[card.tone] ?? DIFFERENCE_TONES["paper"]!;
              return (
                <Reveal
                  key={card.title}
                  delay={index * 0.05}
                  className={DIFFERENCE_SPANS[card.title] ?? DEFAULT_SPAN}
                >
                  <article
                    className={`flex h-full flex-col justify-between gap-8 rounded-card border p-7 sm:p-8 ${tone.card} ${tone.text}`}
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
      <Marquee tone="cream" items={marquee} slow />

      {/* Places. The entity page's locality proof. */}
      <section className="section surface-paper">
        <div className="shell-wide">
          <SectionHead
            eyebrow={page.placesEyebrow}
            title={page.placesTitle}
            lead={page.placesLead}
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
