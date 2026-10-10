import { CameraLogos, SoftwareLogos } from "@/components/site/BrandLogos";

type Affiliation = {
  name: string;
  style: string;
  href: string;
  image?: string;
  /** Intrinsic pixels — reserves ratio-correct space before bytes arrive. */
  imageWidth?: number;
  imageHeight?: number;
};

const affiliations: Affiliation[] = [
  {
    name: "WeddingSutra",
    style: "affiliation-weddingsutra",
    href: "https://www.weddingsutra.com/",
  },
  { name: "Vogue", style: "affiliation-vogue", href: "https://www.vogue.in/" },
  {
    name: "Hindustan Times",
    style: "affiliation-hindustan",
    href: "https://www.hindustantimes.com/",
  },
  { name: "India Film Project", style: "affiliation-ifp", href: "https://ifp.world/" },
  {
    name: "The Times of India",
    style: "affiliation-toi",
    href: "https://timesofindia.indiatimes.com/",
  },
  {
    name: "Asian Photography",
    style: "affiliation-asian",
    href: "https://asianphotographyindia.com/",
  },
  {
    name: "Femina India Wedding Show",
    style: "affiliation-femina",
    href: "https://www.femina.in/",
  },
  { name: "Diva", style: "affiliation-diva", href: "https://www.divaplanetmagazine.com/" },
  {
    name: "Sabyasachi",
    style: "affiliation-sabyasachi",
    href: "https://www.sabyasachi.com",
  },
  {
    name: "Condé Nast Traveler",
    style: "affiliation-traveler",
    href: "https://www.cntraveller.in/",
  },
  { name: "Wedding Vows", style: "affiliation-vows", href: "https://www.weddingvows.com/" },
  {
    name: "Cultured Wedding Magazine",
    style: "affiliation-cultured",
    href: "https://www.instagram.com/culturedwedding/",
  },
  {
    name: "Manish Malhotra",
    style: "affiliation-manish",
    href: "https://www.manishmalhotra.in",
    image: "/brand-logos/manish-malhotra.png",
    imageWidth: 360,
    imageHeight: 152,
  },
  {
    name: "Vera Wang",
    style: "affiliation-vera",
    href: "https://www.verawang.com",
    image: "/brand-logos/vera-wang.webp",
    imageWidth: 768,
    imageHeight: 102,
  },
];

export function CouturePressStrip({ items }: { items?: { name: string; href: string }[] }) {
  // CMS names/links win when configured; the built-in wall (with its bespoke
  // per-name marks and two image tiles) stands in until then. A renamed entry
  // keeps its look only if the name still matches — otherwise it renders as
  // plain text, never blank.
  const wall: Affiliation[] =
    items && items.length > 0
      ? items.map((item) => {
          const builtin = affiliations.find((a) => a.name === item.name);
          return {
            ...item,
            style: builtin?.style ?? "",
            ...(builtin?.image
              ? {
                  image: builtin.image,
                  imageWidth: builtin.imageWidth,
                  imageHeight: builtin.imageHeight,
                }
              : {}),
          };
        })
      : affiliations;
  return (
    <section className="affiliations-section" aria-label="Bridal couture and press affiliations">
      <div className="affiliations-grid">
        {wall.map(({ name, style, href, image, imageWidth, imageHeight }) => {
          const mark = (
            <span className={`affiliation-mark ${style}`}>
              {image ? (
                <img
                  className="affiliation-image"
                  src={image}
                  alt={name}
                  width={imageWidth}
                  height={imageHeight}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              {!image && name === "WeddingSutra" ? (
                <>
                  <span className="affiliation-seal">WS</span>
                  <span className="affiliation-small">WEDDINGSUTRA</span>
                  <span className="affiliation-tiny">PHOTOGRAPHY AWARDS</span>
                </>
              ) : !image && name === "Hindustan Times" ? (
                <>
                  <span className="ht-disc">HT</span>
                  <span>Hindustan Times</span>
                </>
              ) : !image && name === "The Times of India" ? (
                <>
                  <span className="toi-emblem">✦</span>
                  <span className="affiliation-tiny">THE TIMES OF INDIA</span>
                </>
              ) : !image && name === "Femina India Wedding Show" ? (
                <>
                  <span className="affiliation-tiny">FEMINA</span>
                  <span>
                    INDIA
                    <br />
                    WEDDING
                    <br />
                    SHOW
                  </span>
                </>
              ) : !image && name === "Condé Nast Traveler" ? (
                <>
                  <span className="affiliation-tiny">Condé Nast</span>
                  <span>Traveler</span>
                </>
              ) : !image && name === "Wedding Vows" ? (
                <>
                  <span className="vows-v">V</span>
                  <span className="affiliation-small">WEDDING VOWS</span>
                </>
              ) : !image && name === "Cultured Wedding Magazine" ? (
                <>
                  <span className="affiliation-tiny">CULTURED</span>
                  <span className="affiliation-small">WEDDING</span>
                  <span className="affiliation-tiny">MAGAZINE</span>
                </>
              ) : !image && name === "India Film Project" ? (
                <>
                  INDIA FILM
                  <br />
                  PROJECT
                </>
              ) : !image && name === "Asian Photography" ? (
                <>
                  Asian
                  <br />
                  Photography
                </>
              ) : !image ? (
                name
              ) : null}
            </span>
          );
          return href ? (
            <a
              className="affiliation-link"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} official website`}
              key={name}
            >
              {mark}
            </a>
          ) : (
            <div className={`affiliation-mark ${style}`} key={name} role="img" aria-label={name}>
              {mark.props.children}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function TechGearStrip({
  camerasLabel = "Camera systems",
  postLabel = "Post production",
}: {
  camerasLabel?: string;
  postLabel?: string;
}) {
  return (
    <section
      className="py-6 sm:py-8 bg-[#E9E2D9] border-b border-[#DDD3C8]"
      aria-label="Creative technology and kits"
    >
      <div className="shell gear-strip-inner">
        <div className="gear-logo-set">
          <p className="gear-row-label">{camerasLabel}</p>
          <CameraLogos />
        </div>
        <div className="gear-logo-set">
          <p className="gear-row-label">{postLabel}</p>
          <SoftwareLogos />
        </div>
      </div>
    </section>
  );
}

export const PressStrip = CouturePressStrip;
export const GearStrip = TechGearStrip;
