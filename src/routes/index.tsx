import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
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
  head: () =>
    seo({
      title: "Best Photographer in Calicut | Best Photographer in Kerala | Oriana Weddings",
      description:
        "Oriana Weddings is a 12+ year wedding photography and filmmaking brand based in Calicut and Ahmedabad, managing personalised weddings across Kerala, Gujarat, India and international destinations.",
      path: "/",
    }),
  component: Home,
});
function Home() {
  return (
    <>
      {/* 01 — Full-bleed Hero header (Pure image, no text clutter) */}
      <EditorialHero
        src="/img/home-hero-user.webp"
        alt="A newlywed couple sharing a quiet moment, photographed in classic black and white"
      />

      <section className="home-intro" aria-labelledby="home-intro-heading">
        <div className="home-intro-inner">
          <p className="home-intro-eyebrow">ORIANAWEDDINGS · PHOTOGRAPHY & CINEMA</p>
          <h2 id="home-intro-heading">Every story has its own rhythm.</h2>
          <p>We hold on to the rituals, the in-between moments, and the joy.</p>
        </div>
      </section>

      {/* 02 — Full-width image-led photography collections */}
      <PhotographyRow />

      {/* 03 — Couture & Press Logos plainly placed right under first section after Hero */}
      <CouturePressStrip />

      {/* 04 — Full-bleed 15-cell image mosaic */}
      <EditorialGrid />

      {/* 05 — Four featured wedding stories */}
      <FeaturedWeddingStories />

      {/* 06 — Wide Soul + Cinema film interlude */}
      <SoulCinemaBanner />

      {/* 07 — Award Leaf Badges */}
      <Awards />

      {/* 08 — Film portraits and image-only editorial covers */}
      <FilmsGrid />

      {/* 09 — Camera and post-production marks sit between the film images and CTA */}
      <TechGearStrip />

      {/* 10 — Fine Art Class Closing CTA matching Image 2 */}
      <ClosingCTA />
    </>
  );
}
