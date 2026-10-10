import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
import { getFilms, getHomePage, getWeddings, useSiteSettings } from "@/lib/cms";
import { EditorialHero } from "@/components/site/Hero";
import { EditorialGrid } from "@/components/site/EditorialGrid";
import { FeaturedWeddingStories } from "@/components/site/FeaturedWeddingStories";
import { PhotographyRow } from "@/components/site/PhotographyRow";
import { CouturePressStrip, TechGearStrip } from "@/components/site/PressStrip";
import { SoulCinemaBanner } from "@/components/site/SoulCinemaBanner";
import { Awards } from "@/components/site/Awards";
import { FilmsGrid } from "@/components/site/FilmsGrid";
import { ClosingCTA } from "@/components/site/ClosingCTA";

/**
 * Minimal luxury homepage inspired by editorial wedding photography.
 * Full-bleed hero, collections and image mosaics, B&W Soul Cinema banner,
 * clean award badges with leaf image & sub-showcase, and FINE ART CLASS closing CTA.
 */
export const Route = createFileRoute("/")({
  loader: async () => ({
    weddings: await getWeddings(),
    films: await getFilms(),
    page: await getHomePage(),
  }),
  head: ({ loaderData }) =>
    seo({
      title:
        loaderData?.page.seoTitle ||
        "Best Photographer in Calicut | Best Photographer in Kerala | Oriana Weddings",
      description:
        loaderData?.page.seoDescription ||
        "Oriana Weddings is a 12+ year wedding photography and filmmaking brand based in Calicut and Ahmedabad, managing personalised weddings across Kerala, Gujarat, India and international destinations.",
      path: "/",
    }),
  component: Home,
});
function Home() {
  const { weddings, films, page } = Route.useLoaderData();
  const settings = useSiteSettings();
  return (
    <>
      {/* 01 — Full-bleed Hero header (Pure image, no text clutter) */}
      <EditorialHero
        image={page.heroImage.key ?? "home-hero-user"}
        asset={page.heroImage.asset}
        alt="A newlywed couple sharing a quiet moment, photographed in classic black and white"
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        sub={page.heroSub}
        primaryLabel={page.heroPrimaryLabel}
        secondaryLabel={page.heroSecondaryLabel}
      />

      <section className="home-intro" aria-labelledby="home-intro-heading">
        <div className="home-intro-inner">
          <p className="home-intro-eyebrow">{page.introEyebrow}</p>
          <h2 id="home-intro-heading">{page.introHeading}</h2>
          <p>{page.introBody}</p>
        </div>
      </section>

      {/* 02 — Full-width image-led photography collections */}
      <PhotographyRow items={page.collections} />

      {/* 03 — Couture & Press Logos plainly placed right under first section after Hero */}
      <CouturePressStrip items={settings.affiliations} />

      {/* 04 — Full-bleed 15-cell image mosaic */}
      <EditorialGrid photos={page.mosaic} titleLines={page.mosaicLines} />

      {/* 05 — Four featured wedding stories */}
      <FeaturedWeddingStories weddings={weddings} />

      {/* 06 — Wide Soul + Cinema film interlude */}
      <SoulCinemaBanner />

      {/* 07 — Award Leaf Badges */}
      <Awards eyebrow={page.awardsEyebrow} title={page.awardsTitle} badges={page.awardsBadges} />

      {/* 08 — Film portraits and image-only editorial covers */}
      <FilmsGrid
        films={films}
        eyebrow={page.filmsEyebrow}
        title={page.filmsTitle}
        covers={page.filmCovers}
      />

      {/* 09 — Camera and post-production marks sit between the film images and CTA */}
      <TechGearStrip camerasLabel={page.gearCamerasLabel} postLabel={page.gearPostLabel} />

      {/* 10 — Fine Art Class Closing CTA matching Image 2 */}
      <ClosingCTA />
    </>
  );
}
