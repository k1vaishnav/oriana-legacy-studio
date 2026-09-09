export const SITE_URL = "https://orianaweddings.com";

export const business = {
  name: "Oriana Weddings",
  legalDescription: "Wedding Photography & Wedding Films",
  tagline:
    "Experience The Oriana Legacy. Turning fleeting moments into timeless memories, weaving together the narrative of your unique love.",
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
} as const;

export const whatsappHref = (message: string) =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;

export const coverage = [
  "Kozhikode / Calicut",
  "Malappuram",
  "Wayanad",
  "Kerala",
  "Ahmedabad",
  "Chennai",
  "Mumbai",
  "Destination weddings",
];

export const nav = [
  { label: "Home", to: "/" },
  { label: "About Oriana", to: "/about" },
  { label: "Wedding Photography", to: "/wedding-photography" },
  { label: "Wedding Films", to: "/wedding-films" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Oriana Group", to: "/oriana-group" },
  { label: "Contact", to: "/contact" },
] as const;

export const services = [
  {
    name: "Candid Photography",
    description:
      "Spontaneous, authentic emotional storytelling and unposed frames.",
  },
  {
    name: "Traditional Photography",
    description:
      "Composed portraiture, formal group framing and complete rituals coverage.",
  },
  {
    name: "Cinematographic Wedding Films",
    description:
      "Feature-length and short teaser high-definition cinematic wedding films.",
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
  {
    name: "Specialty Portfolios",
    description:
      "Destination pre-wedding films, fashion portraits and maternity shoots.",
  },
];

export const groupBrands = [
  {
    name: "Oriana Weddings",
    description:
      "The wedding division: candid and traditional photography, cinematic wedding films, drone coverage and live screening across Kerala and destination venues.",
  },
  {
    name: "Oriana Studios",
    description:
      "Studio portraiture, family sittings, maternity and newborn sessions, and commercial product photography from our Cherooty Road base in Calicut.",
  },
  {
    name: "Oriana Fashion",
    description:
      "Editorial and lookbook photography for designers, boutiques and bridal labels, including model direction, styling support and campaign films.",
  },
  {
    name: "Oriana Events",
    description:
      "Event coverage and on-ground coordination for engagements, receptions, corporate functions and cultural celebrations.",
  },
  {
    name: "Oriana Luxe",
    description:
      "Handcrafted wedding albums, fine-art prints, framed portraits and keepsake boxes finished for archival life.",
  },
];


export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: business.name,
  additionalType: "https://schema.org/ProfessionalService",
  description:
    "Oriana Weddings is a wedding photography and wedding film studio based in Kozhikode (Calicut), Kerala, covering weddings across Kerala and destination weddings in India.",
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
    "Malappuram",
    "Wayanad",
    "Kerala",
    "Ahmedabad",
    "Chennai",
    "Mumbai",
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

export const breadcrumbSchema = (
  trail: { name: string; path: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});
