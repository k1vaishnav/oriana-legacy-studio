import type { ReactNode } from "react";

/**
 * Brand marks for the affiliation strips.
 *
 * The fashion wall is a transcription of `Wedding Brands Directory.pdf`: the same
 * twenty brands, under the same five headings, in the same order, with the same
 * taglines. Nothing is invented here — an earlier pass drew its own emblems
 * (a rosette for one house, a jhumka for another) and that artwork belonged to
 * nobody, so it has gone. What each brand actually is is its name, and the
 * directory sets those names the way their owners set them: `MANISH MALHOTRA`
 * tracked in caps, `Oscar de la Renta` in title case, `Manyavar & Mohey` with its
 * ampersand intact. The casing in `word` is therefore data, not styling.
 *
 * No third-party artwork is reproduced. The directory carries none — it sets
 * every brand as type — so the wordmark is the whole mark. Every tile links to
 * the brand's own site, so the strip is a set of references rather than
 * decoration. All names and wordmarks are trademarks of their respective owners.
 *
 * Camera and post-production marks are kept compact and unboxed, with the
 * link name available to assistive technology.
 */

const SERIF = '"Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif';
const SANS = 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';

type Mark = {
  /** The brand, as it should be read aloud. Also the link's accessible name. */
  name: string;
  /** The brand's own page. Every tile goes somewhere real. */
  href: string;
  /** The mark, drawn on the shared canvas. */
  art: ReactNode;
  image?: string;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* The tile                                                            */
/* ------------------------------------------------------------------ */

/**
 * One mark, linked out.
 *
 * The label goes on the anchor as `aria-label` rather than as hidden text, so
 * the SVG's own letterforms are not announced twice.
 */
function MarkTile({ name, href, art, image, className = "" }: Mark & { className?: string }) {
  return (
    <a
      className={`logo-tile ${className}`.trim()}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
    >
      {image ? (
        <img className="mark-image" src={image} alt="" />
      ) : (
        <svg viewBox="0 0 200 44" className="mark-svg" role="presentation" aria-hidden="true">
          {art}
        </svg>
      )}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Wordmarks                                                           */
/* ------------------------------------------------------------------ */

type WordProps = {
  children: ReactNode;
  x?: number | undefined;
  y?: number | undefined;
  size?: number | undefined;
  ls?: number | undefined;
  font?: string | undefined;
  weight?: number | undefined;
  anchor?: "start" | "middle" | "end" | undefined;
  fill?: string | undefined;
};

/**
 * The lettered half of a lockup.
 *
 * `y` is a baseline, not a centre, so multi-line marks stay optically aligned
 * with single-line ones at the same box height.
 */
function Word({
  children,
  x = 46,
  y = 27,
  size = 12.5,
  ls = 1.5,
  font = SERIF,
  weight = 500,
  anchor = "start",
  fill = "currentColor",
}: WordProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={font}
      fontSize={size}
      fontWeight={weight}
      letterSpacing={ls}
      fill={fill}
    >
      {children}
    </text>
  );
}

/* ------------------------------------------------------------------ */
/* Couture — a transcription of Wedding Brands Directory.pdf           */
/* ------------------------------------------------------------------ */

type FashionBrand = {
  /** The brand, as it should be read aloud. Also the link's accessible name. */
  name: string;
  /**
   * The wordmark, in the casing the directory prints. This is the mark: no
   * emblem is drawn for any of these houses, because the directory draws none
   * and the emblems an earlier pass invented were nobody's.
   */
  word: string;
  /** The brand's own page. Every tile goes somewhere real. */
  href: string;
  /** The directory's tagline for the house, verbatim. */
  tag: string;
  /** The face the house sets its name in. */
  face: "serif" | "sans";
};

type FashionGroup = {
  /** Used for the heading's id and the wall's column count. */
  id: string;
  title: string;
  brands: readonly FashionBrand[];
};

const FASHION_GROUPS: readonly FashionGroup[] = [
  {
    id: "couture",
    title: "High-Fashion & Couture Bridalwear",
    brands: [
      {
        name: "Sabyasachi",
        word: "SABYASACHI",
        href: "https://www.sabyasachi.com",
        tag: "Heritage Couture",
        face: "serif",
      },
      {
        name: "Vera Wang",
        word: "VERA WANG",
        href: "https://www.verawang.com",
        tag: "Modern Western",
        face: "sans",
      },
      {
        name: "Manish Malhotra",
        word: "MANISH MALHOTRA",
        href: "https://www.manishmalhotra.in",
        tag: "Glamour & Ethnic",
        face: "serif",
      },
      {
        name: "Monique Lhuillier",
        word: "Monique Lhuillier",
        href: "https://www.moniquellhuillier.com",
        tag: "Romantic Couture",
        face: "serif",
      },
      {
        name: "Anita Dongre",
        word: "ANITA DONGRE",
        href: "https://www.anitadongre.com",
        tag: "Sustainable Luxury",
        face: "serif",
      },
      {
        name: "Oscar de la Renta",
        word: "Oscar de la Renta",
        href: "https://www.oscardelarenta.com",
        tag: "Classic Luxury",
        face: "serif",
      },
    ],
  },
  {
    id: "ready-to-wear",
    title: "Ready-to-Wear & Accessible Fashion",
    brands: [
      {
        name: "Reformation",
        word: "REFORMATION",
        href: "https://www.reformation.com",
        tag: "Sustainably Made",
        face: "sans",
      },
      {
        name: "Kalki Fashion",
        word: "KALKI FASHION",
        href: "https://www.kalkifashion.com",
        tag: "Contemporary Ethnic",
        face: "serif",
      },
      {
        name: "Anthropologie / BHLDN",
        word: "BHLDN / ANTHROPOLOGIE",
        href: "https://www.anthro.com",
        tag: "Boho Chic",
        face: "serif",
      },
      {
        name: "Manyavar & Mohey",
        word: "Manyavar & Mohey",
        href: "https://www.manyavar.com",
        tag: "Mass Premium",
        face: "serif",
      },
    ],
  },
  {
    id: "groomswear",
    title: "Groomswear & Tailoring",
    brands: [
      {
        name: "Raghavendra Rathore",
        word: "RAGHAVENDRA RATHORE",
        href: "https://www.raghavendrarathore.com",
        tag: "Bespoke Heritage",
        face: "serif",
      },
      {
        name: "Indochino",
        word: "INDOCHINO",
        href: "https://www.indochino.com",
        tag: "Custom Made",
        face: "sans",
      },
      {
        name: "Tarun Tahiliani",
        word: "TARUN TAHILIANI",
        href: "https://www.taruntahiliani.com",
        tag: "Couture Menswear",
        face: "serif",
      },
      {
        name: "Suitsupply",
        word: "SUITSUPPLY",
        href: "https://suitsupply.com",
        tag: "Modern Tailoring",
        face: "sans",
      },
    ],
  },
  {
    id: "footwear",
    title: "Bridal Footwear & Accessories",
    brands: [
      {
        name: "Jimmy Choo",
        word: "JIMMY CHOO",
        href: "https://www.jimmychoo.com",
        tag: "Luxury Shoes",
        face: "serif",
      },
      {
        name: "Manolo Blahnik",
        word: "MANOLO BLAHNIK",
        href: "https://www.manoloblahnik.com",
        tag: "Classic Shoes",
        face: "serif",
      },
      {
        name: "Dolce Vita",
        word: "DOLCE VITA",
        href: "https://www.dolcevita.com",
        tag: "Accessible Footwear",
        face: "sans",
      },
      {
        name: "Untamed Petals",
        word: "Untamed Petals",
        href: "https://www.untamedpetals.com",
        tag: "Bridal Accessories",
        face: "serif",
      },
    ],
  },
];

/**
 * One house: its wordmark, the directory's tagline for it, and a link out.
 *
 * The wordmark is live text in the page's own faces rather than outlined SVG, so
 * it stays crisp at any zoom, wraps instead of overflowing on a narrow screen,
 * and is already readable by a screen reader. The anchor's `aria-label` is the
 * house's name, so the tile announces once rather than twice.
 */
function BrandTile({ name, word, href, tag, face }: FashionBrand) {
  return (
    <a
      className="brand-tile"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      title={`${name} — opens in a new tab`}
    >
      <span className={`brand-word brand-word-${face}`}>{word}</span>
      <span className="brand-tag">{tag}</span>
    </a>
  );
}

export function FashionLogos() {
  return (
    <div className="brand-groups">
      {FASHION_GROUPS.map((group) => (
        <section key={group.id} className="brand-group" aria-labelledby={`brand-group-${group.id}`}>
          <h4 id={`brand-group-${group.id}`} className="brand-group-label">
            {group.title}
          </h4>
          {/* The column count follows the group size, so a four-house row lands
              as one row and the six-house group as two even ones. */}
          <div className={`logo-wall brand-wall brand-wall-${group.brands.length}`}>
            {group.brands.map((brand) => (
              <BrandTile key={brand.name} {...brand} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cameras, optics and aerial systems                                  */
/* ------------------------------------------------------------------ */

const GEAR: readonly Mark[] = [
  {
    name: "Canon",
    href: "https://global.canon/en/",
    image: "/brand-logos/canon.svg",
    art: (
      <Word
        x={100}
        y={29.5}
        size={25}
        ls={0.4}
        font={SERIF}
        weight={600}
        anchor="middle"
        fill="#BC0024"
      >
        Canon
      </Word>
    ),
  },
  {
    name: "Nikon",
    href: "https://www.nikon.com/",
    image: "/brand-logos/nikon.svg",
    className: "gear-nikon",
    art: (
      <Word
        x={100}
        y={29}
        size={23}
        ls={-0.2}
        font={SANS}
        weight={800}
        anchor="middle"
        fill="#111111"
      >
        Nikon
      </Word>
    ),
  },
  {
    name: "Sony",
    href: "https://electronics.sony.com/imaging/c/interchangeable-lens-cameras",
    image: "/brand-logos/sony.svg",
    className: "gear-sony",
    art: (
      <Word x={100} y={28.5} size={19} ls={3.4} font={SERIF} weight={600} anchor="middle">
        SONY
      </Word>
    ),
  },
  {
    name: "Leica",
    href: "https://www.leica-camera.com/",
    image: "/brand-logos/leica.svg",
    art: (
      <g>
        <circle cx="72" cy="22" r="15" fill="#E4002B" />
        <text
          x="72"
          y="26.2"
          textAnchor="middle"
          fontFamily={SERIF}
          fontSize="12"
          fontStyle="italic"
          fill="#ffffff"
        >
          Leica
        </text>
        <text
          x="95"
          y="27"
          fontFamily={SANS}
          fontSize="13.5"
          fontWeight="700"
          letterSpacing="1.8"
          fill="currentColor"
        >
          LEICA
        </text>
      </g>
    ),
  },
  {
    name: "DJI",
    href: "https://www.dji.com/",
    image: "/brand-logos/dji.svg",
    art: (
      <Word x={100} y={29} size={23} ls={0.6} font={SANS} weight={800} anchor="middle">
        dji
      </Word>
    ),
  },
  {
    name: "RED",
    href: "https://www.red.com/",
    className: "gear-red",
    art: (
      <Word
        x={100}
        y={31}
        size={40}
        ls={2.2}
        font={SANS}
        weight={900}
        anchor="middle"
        fill="#C9252C"
      >
        RED
      </Word>
    ),
  },
  {
    name: "ARRI ALEXA",
    href: "https://www.arri.com/en/cine-systems/cine-cameras",
    image: "/brand-logos/arri.svg",
    art: (
      <g>
        <Word x={100} y={28} size={23} ls={2} font={SANS} weight={900} anchor="middle">
          ARRI
        </Word>
        <Word x={100} y={39} size={7} ls={2.5} font={SANS} weight={600} anchor="middle">
          ALEXA
        </Word>
      </g>
    ),
  },
];

export function CameraLogos() {
  return (
    <div className="logo-wall logo-wall-gear">
      {GEAR.map((mark) => (
        <MarkTile key={mark.name} {...mark} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The post-production desk                                            */
/* ------------------------------------------------------------------ */

const SOFTWARE: readonly Mark[] = [
  {
    name: "Premiere Pro",
    href: "https://www.adobe.com/products/premiere.html",
    image: "/brand-logos/premiere-pro.svg",
    art: (
      <Word x={100} y={29} size={18} ls={1} font={SANS} weight={700} anchor="middle">
        Pr
      </Word>
    ),
  },
  {
    name: "After Effects",
    href: "https://www.adobe.com/products/aftereffects.html",
    image: "/brand-logos/after-effects.svg",
    art: (
      <Word x={100} y={29} size={18} ls={1} font={SANS} weight={700} anchor="middle">
        Ae
      </Word>
    ),
  },
  {
    name: "Final Cut Pro",
    href: "https://www.apple.com/final-cut-pro/",
    image: "/brand-logos/final-cut-pro.png",
    art: (
      <Word x={100} y={29} size={18} ls={1} font={SANS} weight={700} anchor="middle">
        FCP
      </Word>
    ),
  },
  {
    name: "Photoshop",
    href: "https://www.adobe.com/products/photoshop.html",
    image: "/brand-logos/photoshop.svg",
    art: (
      <Word x={100} y={29} size={18} ls={1} font={SANS} weight={700} anchor="middle">
        Ps
      </Word>
    ),
  },
  {
    name: "DaVinci Resolve",
    href: "https://www.blackmagicdesign.com/products/davinciresolve",
    image: "/brand-logos/resolve-color.png",
    art: (
      <Word x={100} y={29} size={15} ls={1} font={SANS} weight={700} anchor="middle">
        Resolve
      </Word>
    ),
  },
  {
    name: "Lightroom",
    href: "https://www.adobe.com/products/lightroom.html",
    image: "/brand-logos/lightroom.svg",
    art: (
      <Word x={100} y={29} size={18} ls={1} font={SANS} weight={700} anchor="middle">
        Lr
      </Word>
    ),
  },
];

export function SoftwareLogos() {
  return (
    <div className="logo-wall logo-wall-kit">
      {SOFTWARE.map((mark) => (
        <a
          key={mark.name}
          className="logo-tile kit-tile"
          href={mark.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={mark.name}
        >
          {mark.image ? (
            <img className="kit-icon" src={mark.image} alt="" />
          ) : (
            <svg viewBox="0 0 200 44" className="mark-svg" role="presentation" aria-hidden="true">
              {mark.art}
            </svg>
          )}
          <span className="kit-tile-name" aria-hidden="true">
            {mark.name}
          </span>
        </a>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Press                                                               */
/* ------------------------------------------------------------------ */

export function PressLogos() {
  return (
    <div className="press-logo-grid">
      <div className="press-logo-card">
        <span className="vogue-logo">VOGUE</span>
      </div>
      <div className="press-logo-card">
        <span className="weddingsutra-logo">WeddingSutra</span>
      </div>
      <div className="press-logo-card">
        <span className="theknot-logo">the knot</span>
      </div>
      <div className="press-logo-card">
        <span className="weddingwire-logo">WEDDINGWIRE</span>
      </div>
      <div className="press-logo-card">
        <span className="pinkvilla-logo">PINKVILLA</span>
      </div>
      <div className="press-logo-card">
        <span className="film-companion-logo">FILM COMPANION</span>
      </div>
    </div>
  );
}
