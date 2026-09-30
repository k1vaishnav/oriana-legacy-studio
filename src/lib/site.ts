export const SITE_URL = "https://orianaweddings.com";

export const business = {
  name: "Oriana Weddings",
  legalDescription: "Wedding Photography & Wedding Films",
  tagline: "Your Wedding. Our Responsibility.",
  longDescription:
    "Oriana Weddings is a wedding photography and filmmaking brand with over 12 years of wedding experience. We bring together photography, filmmaking and professional in-house management to create a smooth, personalised wedding experience. Our main office is in Calicut, Kerala, with an office in Law Garden, Ahmedabad, Gujarat. We manage weddings across Kerala, Gujarat, India and international destinations.",
  establishedYear: 1996,
  director: "Delwin Joseph",
  street: "1st Floor, Marine Building, Cherooty Road",
  city: "Kozhikode",
  region: "Kerala",
  postalCode: "673001",
  country: "IN",
  phone: "+91 96055 75311",
  phoneHref: "tel:+919605575311",
  phoneSecondary: "+91 96055 75330",
  phoneSecondaryHref: "tel:+919605575330",
  whatsapp: "919605575311",
  email: "orianaweddings@gmail.com",
  instagram: "https://www.instagram.com/orianaweddings/",
  youtube: "https://www.youtube.com/@orianaweddings",
  facebook: "https://www.facebook.com/orianaweddings",
  mapQuery: "Marine+Building,+Cherooty+Road,+Kozhikode,+Kerala+673001",
  ahmedabadStreet: "Law Garden",
  ahmedabadCity: "Ahmedabad",
  ahmedabadRegion: "Gujarat",
} as const;

export const whatsappHref = (message: string) =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;

export const coverage = [
  "Kozhikode / Calicut",
  "Malappuram",
  "Wayanad",
  "Kerala",
  "Ahmedabad",
  "Gujarat",
  "Chennai",
  "Mumbai",
  "India",
  "International destinations",
];

/**
 * The whole site, in one list.
 *
 * Seven entries, and they are the whole site. Everything else — a wedding story,
 * the enquiry form — is reached from inside one of these, never from the bar
 * itself. A photography site has one job: get somebody to the work, then to the
 * enquiry. Every extra row of navigation is a place to lose them.
 */
/**
 * The Soul + Cinema manifesto, verbatim as supplied.
 *
 * The client's own copy, reproduced exactly as written, and kept in one place so
 * the films page, the stories page and the Soul + Cinema section cannot drift
 * into saying different things.
 */
export const soulCinema = {
  title: "Soul + Cinema",
  body: "Every wedding is unique and so are our films. For the past 12 years, Oriana has set new benchmarks of storytelling within the wedding realm and beyond. We are fortunate to have experienced such unique cultures and traditions across Kerala, Gujarat, India and beyond, and to document stories that continuously overwhelm us.",
} as const;

export const nav = [
  { label: "Home", to: "/" },
  { label: "Photography", to: "/wedding-photography" },
  { label: "Films", to: "/wedding-films" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Group", to: "/oriana-group" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export const filmServices = [
  "Cinematic wedding films",
  "Wedding videography",
  "Wedding teasers",
  "Highlight films",
  "Storytelling wedding films",
  "Save-the-date films",
  "Reels",
] as const;

export const services = [
  {
    name: "Candid Wedding Photography",
    description:
      "Genuine moments, naturally captured. We focus on genuine emotions while documenting the complete atmosphere of your celebration.",
  },
  {
    name: "Traditional Wedding Photography",
    description:
      "Important rituals deserve to be documented with care. We capture ceremonies, family photographs, traditions and timeless portraits.",
  },
  {
    name: "Intimate Wedding Photography",
    description:
      "Small weddings can hold some of the most meaningful moments. We focus on genuine interactions, close family relationships, personal details and the atmosphere of the celebration.",
  },
  {
    name: "Pre-Wedding Photography",
    description:
      "Sessions designed around your personalities, relationship and chosen environment.",
  },
  {
    name: "Post-Wedding Photography",
    description: "More time and freedom for locations, portraits and creative compositions.",
  },
  {
    name: "Engagement Photography",
    description: "Capturing the excitement, connection and emotions surrounding your engagement.",
  },
  {
    name: "Reception Photography",
    description:
      "Documenting the energy, people, performances, family interactions and celebrations.",
  },
  {
    name: "Haldi & Mehendi Photography",
    description: "Capturing colour, energy, emotions, traditions and people.",
  },
  {
    name: "Nikah Photography",
    description:
      "Documenting important moments with sensitivity to ceremony, family and cultural traditions.",
  },
  {
    name: "Destination Wedding Photography",
    description:
      "Oriana can manage photography teams for destination weddings across India and beyond.",
  },
  {
    name: "Confidential Wedding Photography",
    description:
      "Privacy-focused wedding coverage according to agreed requirements. Your wedding does not have to become content.",
  },
  {
    name: "Cinematic Wedding Films",
    description:
      "Meaningful moments brought together into a cinematic story that you can revisit for years.",
  },
  {
    name: "Wedding Videography",
    description:
      "Documenting celebrations, ceremonies, family interactions and important moments with a cinematic visual approach.",
  },
  {
    name: "Wedding Teasers",
    description:
      "Short, emotional and visually engaging films designed to give you a glimpse of your wedding story.",
  },
  {
    name: "Storytelling Wedding Films",
    description:
      "Films focused on emotion, people and personality rather than simply chronological coverage.",
  },
  {
    name: "Save-the-Date Films",
    description:
      "Personalised cinematic films created to announce your wedding in a way that reflects your story.",
  },
  {
    name: "Drone Shoots",
    description: "Dramatic aerial photography and sweeping venue cinematography.",
  },
  {
    name: "Live Screening & Photobooth",
    description:
      "On-site digital setup for guest entertainment and real-time ceremony broadcasting.",
  },
];

/**
 * The seven stages of the Oriana System, in the order a wedding actually
 * happens. The point of showing them is that the list is the *management*
 * story — a couple choosing a photographer is implicitly choosing someone to
 * carry all of this.
 */
export const orianaSystem = [
  {
    step: "01",
    title: "Understanding",
    body: "We begin with what you want, not with what we usually shoot. Your references, family, culture, rituals, venue and functions all shape what comes next.",
  },
  {
    step: "02",
    title: "Planning",
    body: "Function schedules, timings, light, movement and access are mapped before anyone picks up a camera, so the day runs to a plan rather than to a hope.",
  },
  {
    step: "03",
    title: "Selection",
    body: "We select the photography and filmmaking team against your wedding — its style, scale, culture, language and the output you are expecting.",
  },
  {
    step: "04",
    title: "Coordination",
    body: "One point of contact stays with you from enquiry to delivery. You are never chasing a photographer between functions.",
  },
  {
    step: "05",
    title: "Execution",
    body: "Your team arrives, knows the plan, and shoots it. Management stays in the background where you do not have to think about it.",
  },
  {
    step: "06",
    title: "Quality Management",
    body: "The work is reviewed against the brief before anything reaches you. Corrections happen here, not in your inbox.",
  },
  {
    step: "07",
    title: "Final Delivery",
    body: "Edited photographs and finished films, delivered as agreed, with the terms explained in writing at the proposal stage.",
  },
] as const;

/** The Oriana Promise — nine commitments, verbatim from the brief. */
export const orianaPromise = [
  {
    title: "One Point of Contact",
    body: "Your relationship remains with Oriana.",
  },
  {
    title: "Professional Team Selection",
    body: "We select creative professionals according to your requirements.",
  },
  {
    title: "100% Oriana Team Decision",
    body: "The final selection remains with Oriana so we can take responsibility for the team.",
  },
  {
    title: "No Forced Style",
    body: "We don’t impose one photographer’s style.",
  },
  {
    title: "Professional Management",
    body: "Our in-house team manages the teams.",
  },
  {
    title: "Privacy",
    body: "Confidential coverage is available.",
  },
  {
    title: "Transparent Terms",
    body: "Your proposal and terms explain what you receive.",
  },
  {
    title: "No Unnecessary Headaches",
    body: "We manage photography and filmmaking so you can enjoy your wedding.",
  },
  {
    title: "12+ Years of Experience",
    body: "Experience managing different weddings, people, cultures and situations.",
  },
] as const;

export const offices = [
  {
    city: "Calicut, Kerala",
    role: "Main office and the home of Oriana Weddings",
    street: "1st Floor, Marine Building, Cherooty Road",
    postcode: "Kozhikode 673001",
    phone: business.phone,
    phoneHref: business.phoneHref,
    secondPhone: business.phoneSecondary,
    secondPhoneHref: business.phoneSecondaryHref,
  },
  {
    city: "Ahmedabad, Gujarat",
    role: "Our Gujarat office",
    street: "Law Garden",
    postcode: "Ahmedabad",
    phone: business.phone,
    phoneHref: business.phoneHref,
    secondPhone: business.phoneSecondary,
    secondPhoneHref: business.phoneSecondaryHref,
  },
] as const;

/** The group's own opening sentence, verbatim from the brief. */
export const groupStatement =
  "Oriana Group brings together creative brands working across photography, fashion, events and luxury products.";

export const groupBrands = [
  {
    name: "Oriana Weddings",
    tagline: "Wedding photography and cinematic films.",
    description:
      "Wedding photography and cinematic films — candid, traditional, intimate, pre-wedding, post-wedding, destination and confidential wedding coverage. Managed by Oriana.",
  },
  {
    name: "Baby Crew Studios",
    tagline: "Baby photography and related creative services.",
    description:
      "Baby photography and related creative services — newborn, baby and family portraiture.",
  },
  {
    name: "DEOR Fashion",
    tagline: "Fashion photography and fashion-related creative work.",
    description:
      "Fashion photography and fashion-related creative work — editorial, lookbook and campaign photography.",
  },
  {
    name: "ORION Events",
    tagline: "Wedding and corporate event services.",
    description:
      "Wedding and corporate event services — event design, coordination and on-ground production.",
  },
  {
    name: "Odonata Republic",
    tagline: "Fashion and luxury products.",
    description:
      "Fashion and luxury products — specialty collections, handcrafted albums and fine-art prints.",
  },
];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: business.name,
  additionalType: "https://schema.org/ProfessionalService",
  description: business.longDescription,
  url: SITE_URL,
  telephone: business.phone,
  email: business.email,
  foundingDate: String(business.establishedYear),
  founder: { "@type": "Person", name: business.director },
  address: {
    "@type": "PostalAddress",
    streetAddress: business.street,
    addressLocality: business.city,
    addressRegion: business.region,
    postalCode: business.postalCode,
    addressCountry: business.country,
  },
  areaServed: [
    "Kozhikode",
    "Calicut",
    "Malappuram",
    "Wayanad",
    "Kerala",
    "Ahmedabad",
    "Gujarat",
    "Chennai",
    "Mumbai",
    "India",
  ].map((name) => ({ "@type": "Place", name })),
  sameAs: [business.instagram, business.youtube, business.facebook],
  makesOffer: services.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.name,
      description: service.description,
    },
  })),
};

export const breadcrumbSchema = (trail: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

/* ------------------------------------------------------------------ */
/* Presentation data                                                    */
/*                                                                     */
/* Everything below drives the new interface. Copy stays verbatim from  */
/* the client brief; the arrangement is what makes it readable.         */
/* ------------------------------------------------------------------ */

/**
 * Proof, not adjectives. Every figure here is stated in the brief — 12+ years,
 * two offices, in-house management, and the four geographies we cover.
 */
export const stats = [
  { value: "12+", label: "Years managing weddings" },
  { value: "100%", label: "Oriana management" },
  { value: "02", label: "Offices — Calicut & Ahmedabad" },
  { value: "04", label: "Kerala · Gujarat · India · Beyond" },
] as const;

/* ------------------------------------------------------------------ */
/* Brand spine                                                         */
/*                                                                     */
/* The opening two lines of the client brief, kept as data because they */
/* appear in the hero, the footer and the structured data.             */
/* ------------------------------------------------------------------ */

export const establishedMark = `Est. ${business.establishedYear}`;

export const brandLines = [
  "Indian Wedding Film Award Winner",
  "Couple Choice Award Winner",
] as const;

export const managedByline = "Wedding Photography & Films, Managed by Oriana.";

/** The one line the home page closes on before the contact block. */
export const responsibilityLine = "You enjoy your wedding. We manage the work.";

/**
 * The differentiator, as a set of cards rather than one long argument. The
 * bento treats the lead card as the thesis and the rest as its evidence.
 *
 * `tone` is stated on every card rather than only the two that differ from
 * paper, so the array is one shape: `as const` on a list of literals with
 * mixed keys gives a union that has to be narrowed at every read site, and a
 * card that quietly opts into a different ground is exactly the kind of detail
 * a bento needs to be able to see at a glance.
 */
export const differenceCards = [
  {
    title: "You Choose Oriana. We Choose the Right Team.",
    body: "A photographer's portfolio shows what they have photographed before. Your wedding is happening today. After 12+ years, our in-house team understands the photographers and filmmakers we work with — their strengths, working styles, technical knowledge, character, language proficiency and suitability.",
    tone: "paper",
    wide: true,
  },
  {
    title: "The Team Is Built Around Your Wedding",
    body: "Style, scale, culture, language and the output you are expecting all decide who is on the day. A Keralite Hindu wedding and a Calicut church wedding are not the same assignment, and we do not staff them as if they were.",
    tone: "ink",
    wide: false,
  },
  {
    title: "100% Oriana Management",
    body: "You communicate with Oriana. Oriana manages the team. The team captures the wedding. Oriana takes responsibility for the agreed output.",
    tone: "paper",
    wide: false,
  },
  {
    title: "After the Wedding, You Still Deal With Oriana",
    body: "The photographer's assigned role ends at capture and submission. Post-production and final delivery stay with Oriana.",
    tone: "paper",
    wide: false,
  },
  {
    title: "We Don't Impose Our Style",
    body: "You already know what you like. Bring references. We respect them instead of forcing one Oriana look onto every couple.",
    tone: "paper",
    wide: false,
  },
  {
    title: "Your Wedding Is Not Content",
    body: "Some weddings are meant to stay private. Confidential, privacy-focused coverage is available on request.",
    tone: "cream",
    wide: false,
  },
] as const;

/** The four supporting arguments, in the brief's order. */
export const proofBlocks = [
  {
    label: "12+ Years of Experience",
    body: "Our experience goes beyond taking photographs. It is about understanding people, families, cultures, rituals, timing, venues, light, communication, teamwork, responsibility and unexpected situations.",
  },
  {
    label: "Kerala + Gujarat + India + Beyond",
    body: "Our main office is in Calicut, Kerala. Our Gujarat office is in Law Garden, Ahmedabad. With strong wedding heritage and experience across Kerala and Gujarat, Oriana has expanded its services across India and also undertakes destination and international wedding shoots.",
  },
  {
    label: "Privacy",
    body: "Some weddings are meant to stay private. Oriana offers privacy-focused and confidential wedding coverage for clients who do not want their photographs, videos, names or identities publicly shared.",
  },
  {
    label: "Transparent Experience",
    body: "We clearly explain services, deliverables and applicable terms in your proposal and terms & conditions. We aim to avoid unnecessary intermediaries, unnecessary pressure and unexpected charges outside the agreed proposal.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Brand messages  (brief sections 16 and 17)                          */
/* ------------------------------------------------------------------ */

export const strongestMessage = {
  eyebrow: "Strongest brand message",
  title: "Don't worry about the photographer. Trust Oriana.",
  body: "You don't have to find the perfect photographer. You don't have to judge a photographer only by old Instagram photographs. You don't have to choose someone because you know them personally. You don't have to manage them after the wedding.",
  kicker: "That's our responsibility.",
  conclusion: "You choose Oriana. We choose the team. We take responsibility for the result.",
} as const;

export const finalMessage = {
  title: "We are not simply a team of photographers.",
  body: "We are a wedding photography and filmmaking brand built around experience, selection, management and trust.",
  steps: [
    "We understand your wedding.",
    "We select the right people.",
    "We manage the team.",
    "We protect the relationship.",
    "We respect your privacy.",
    "We deliver what we promise.",
  ],
  kicker: "You don't have to manage your photographers. You just have to enjoy your wedding.",
} as const;

/* ------------------------------------------------------------------ */
/* Portfolio  (brief section 06)                                        */
/* ------------------------------------------------------------------ */

export const portfolioCategories = [
  "Real Weddings",
  "Candid Photography",
  "Traditional Weddings",
  "Intimate Weddings",
  "Pre-Wedding",
  "Wedding Films",
  "Destination Weddings",
  "Featured Stories",
] as const;

/* ------------------------------------------------------------------ */
/* Local SEO structure  (brief section 12)                             */
/* ------------------------------------------------------------------ */

/**
 * The brief's central SEO rule, kept as data so it can be checked:
 * Calicut and Kerala are *separate* search targets and must never be merged
 * into a single keyword phrase. `scripts/check-content.mjs` fails the build if
 * a route title ever contains both, because the failure mode here is silent —
 * a title that reads "Best Photographer in Calicut and Kerala" looks fine and
 * ranks for neither.
 */
export const keywordTargets = [
  {
    topic: "Primary photographer",
    calicut: "Best Photographer in Calicut",
    kerala: "Best Photographer in Kerala",
  },
  {
    topic: "Wedding photography",
    calicut: "Best Wedding Photography in Calicut",
    kerala: "Best Wedding Photography in Kerala",
  },
  {
    topic: "Wedding photography packages",
    calicut: "Wedding Photography Packages in Calicut",
    kerala: "Wedding Photography Packages in Kerala",
  },
  {
    topic: "Candid wedding photography",
    calicut: "Best Candid Wedding Photographer in Calicut",
    kerala: "Best Candid Wedding Photographer in Kerala",
  },
  {
    topic: "Traditional wedding photography",
    calicut: "Best Traditional Wedding Photographer in Calicut",
    kerala: "Best Traditional Wedding Photographer in Kerala",
  },
  {
    topic: "Intimate wedding photography",
    calicut: "Intimate Wedding Photography in Calicut",
    kerala: "Intimate Wedding Photography in Kerala",
  },
  {
    topic: "Pre-wedding photography",
    calicut: "Best Pre-Wedding Photographer in Calicut",
    kerala: "Best Pre-Wedding Photographer in Kerala",
  },
  {
    topic: "Post-wedding photography",
    calicut: "Best Post-Wedding Photographer in Calicut",
    kerala: "Best Post-Wedding Photographer in Kerala",
  },
  {
    topic: "Wedding videography",
    calicut: "Best Wedding Videographer in Calicut",
    kerala: "Best Wedding Videographer in Kerala",
  },
  {
    topic: "Cinematic wedding films",
    calicut: "Cinematic Wedding Films in Calicut",
    kerala: "Cinematic Wedding Films in Kerala",
  },
  {
    topic: "Wedding photography portfolio",
    calicut: "Best Wedding Photography Portfolio in Calicut",
    kerala: "Best Wedding Photography Portfolio in Kerala",
  },
  {
    topic: "Real wedding stories",
    calicut: "[Venue] Wedding Photographer / Wedding Photography in Calicut",
    kerala: "[Venue] Wedding Photographer / Wedding Photography in Kerala",
  },
  {
    topic: "Contact",
    calicut: "Contact the Best Photographer in Calicut",
    kerala: "Contact the Best Photographer in Kerala",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Google Business Profile  (brief section 13)                         */
/* ------------------------------------------------------------------ */

/**
 * The GBP long description, verbatim. It is not rendered on the site — Google
 * Business Profiles have a character limit and their own field — so it lives
 * here as the copy of record to paste into the profile, and the two SEO fields
 * the brief specifies for it.
 */
export const gbp = {
  seoTitle: "Best Photographer in Calicut | Best Photographer in Kerala | Oriana Weddings",
  metaDescription:
    "Oriana Weddings is a 12+ year wedding photography and filmmaking brand based in Calicut, Kerala, with an office in Law Garden, Ahmedabad.",
  longDescription: [
    "Oriana Weddings is a wedding photography and filmmaking brand with its main office in Calicut, Kerala, and an office in Law Garden, Ahmedabad, Gujarat.",
    "With over 12 years of wedding experience, we specialise in candid wedding photography, traditional wedding photography, intimate wedding photography, pre-wedding and post-wedding photography, wedding videography and cinematic wedding films.",
    "Our in-house team selects and manages photographers and filmmakers according to each client's requirements, style, language, experience and expected output.",
    "We manage weddings across Kerala, Gujarat and India, as well as destination and international wedding shoots.",
    "Privacy-focused and confidential wedding coverage is also available for clients who prefer their celebrations and identities to remain private.",
  ],
} as const;
