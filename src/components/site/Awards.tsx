import React from "react";

type AwardBadge = {
  subtitle?: string;
  title: string;
  year: string;
  organization?: string;
};

const BADGES: AwardBadge[] = [
  {
    subtitle: "FINALIST",
    title: "LOS ANGELES FILM FESTIVAL",
    year: "2020",
  },
  {
    subtitle: "WINNER",
    title: "WEDDING FILMMAKER OF THE YEAR",
    year: "2020, 2019, 2018",
    organization: "WEDDINGSUTRA",
  },
  {
    subtitle: "PLATINUM",
    title: "PLATINUM FILM OF THE YEAR",
    year: "2017",
    organization: "INDIA FILM PROJECT",
  },
  {
    subtitle: "WINNER",
    title: "WEDDING INFLUENCERS OF THE YEAR",
    year: "2018",
    organization: "WEDDINGSUTRA",
  },
  {
    subtitle: "TOP HONOURS",
    title: "BEST DESTINATION STUDIO",
    year: "2023",
    organization: "COUPLES' CHOICE",
  },
];

export function Awards() {
  return (
    <section id="awards" className="py-14 md:py-28 bg-[#F6F4EF]" aria-labelledby="awards-heading">
      <div className="shell max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8F8A82] mb-3 font-semibold">
            DECADE OF EXCELLENCE
          </p>
          <h2
            id="awards-heading"
            className="font-serif text-3xl md:text-5xl text-[#171717] font-normal"
          >
            Awards & Accolades
          </h2>
        </div>

        {/* 5 Golden Laurel Wreath Leaf Badges (Title inside leaf, Year & Org showcase UNDER leaf) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-6 items-start justify-center">
          {BADGES.map((badge, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center justify-start text-center group transition-transform duration-500 hover:-translate-y-1"
            >
              {/* Leaf Container */}
              <div className="relative w-full max-w-[210px] aspect-square flex items-center justify-center mx-auto">
                {/* Official Laurel Leaf — 47KB WebP (was 787KB PNG), PNG fallback */}
                <picture className="absolute inset-0 w-full h-full pointer-events-none select-none">
                  <source type="image/webp" srcSet="/brand/award-leaf-420.webp" />
                  <img
                    src="/brand/award-leaf.png"
                    alt="Golden Laurel Wreath Award"
                    width={420}
                    height={420}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>

                {/* Content STRICTLY inside the Leaf - Only Title & Subtitle */}
                <div className="relative z-10 flex flex-col items-center justify-center px-7 py-6 text-center max-w-[160px]">
                  {badge.subtitle && (
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#8F8A82] mb-1 font-bold">
                      {badge.subtitle}
                    </span>
                  )}

                  <h3 className="font-sans font-bold text-[11px] sm:text-[12px] tracking-tight leading-[1.2] text-[#171717] uppercase max-w-[13ch]">
                    {badge.title}
                  </h3>
                </div>
              </div>

              {/* Showcase UNDER the Leaf Container */}
              <div className="mt-3 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-sans font-extrabold text-[#B39A5A] tracking-wider">
                  {badge.year}
                </span>

                {badge.organization && (
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#625E57] font-semibold mt-0.5">
                    {badge.organization}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
