/**
 * Sanity schemas, page by page.
 *
 * One singleton document per page (Home, About, Brands index, Contact, Films,
 * Photography, Portfolio, Site settings) plus three collections (brands,
 * weddings, films). The Studio at `/studio` groups them the same way, so
 * editing the site reads like reading the site.
 *
 * Image fields never upload files — they pick a key from the 30-frame local
 * archive (see `imageKeys.ts`), keeping every photograph inside the
 * pre-generated responsive ladder. Third-party artwork (camera/software marks,
 * press seals) stays in the repo: those are other companies' trademarks, not
 * content, so only their names/links are editable.
 */
import { IMAGE_KEYS } from "./imageKeys";

type Rule = { required: () => unknown };
const required = (r: Rule) => r.required();

const imageKeyField = (title: string, description?: string) => ({
  title,
  ...(description ? { description } : {}),
  name: "key",
  type: "string",
  options: { list: [...IMAGE_KEYS] },
  validation: required,
});

const imageKeysField = (title: string, description?: string) => ({
  title,
  ...(description ? { description } : {}),
  name: "keys",
  type: "array",
  of: [{ type: "string", options: { list: [...IMAGE_KEYS] } }],
  validation: required,
});

const titleBodyCard = {
  type: "object",
  fields: [
    { name: "title", title: "Title", type: "string", validation: required },
    { name: "body", title: "Body", type: "text" },
  ],
};

const singleton = (name: string, title: string, fields: unknown[]) => ({
  name,
  title,
  type: "document",
  // Singletons: one document each, edited in place — no "create new".
  __experimental_omnisearch_visibility: false,
  fields,
});

const seoFields = [
  { name: "seoTitle", title: "Search title (tab + Google)", type: "string" },
  { name: "seoDescription", title: "Search description", type: "text" },
];

export const schemaTypes = [
  singleton("siteSettings", "⚙️ Site settings", [
    {
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: required,
    },
    { name: "phone", title: "Phone", type: "string" },
    { name: "phoneHref", title: "Phone link (tel:…)", type: "string" },
    { name: "phoneSecondary", title: "Second phone", type: "string" },
    { name: "phoneSecondaryHref", title: "Second phone link (tel:…)", type: "string" },
    { name: "whatsapp", title: "WhatsApp number (digits only)", type: "string" },
    { name: "email", title: "Email", type: "string" },
    { name: "instagram", title: "Instagram URL", type: "url" },
    { name: "youtube", title: "YouTube URL", type: "url" },
    { name: "facebook", title: "Facebook URL", type: "url" },
    { name: "establishedYear", title: "Founded year (shows as “Est. …”)", type: "number" },
    {
      name: "brandLines",
      title: "Standing credentials (footer)",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "offices",
      title: "Offices",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "city", title: "City", type: "string" },
            { name: "role", title: "Role line", type: "string" },
            { name: "street", title: "Street", type: "string" },
            { name: "postcode", title: "Postcode line", type: "string" },
            { name: "phone", title: "Phone", type: "string" },
            { name: "phoneHref", title: "Phone link", type: "string" },
            { name: "secondPhone", title: "Second phone", type: "string" },
            { name: "secondPhoneHref", title: "Second phone link", type: "string" },
          ],
        },
      ],
    },
    {
      name: "coverage",
      title: "Coverage places (footer + about)",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "stats",
      title: "Proof numbers",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", title: "Value (e.g. 12+)", type: "string" },
            { name: "label", title: "Label", type: "string" },
          ],
        },
      ],
    },
    {
      name: "soulCinema",
      title: "Soul + Cinema manifesto",
      type: "object",
      fields: [
        { name: "title", title: "Title", type: "string" },
        { name: "body", title: "Body", type: "text" },
      ],
    },
    {
      name: "closingCta",
      title: "Closing call to action (every page foot)",
      type: "object",
      fields: [
        { name: "kicker", title: "Kicker", type: "string" },
        { name: "heading", title: "Heading", type: "string" },
        { name: "button", title: "Button label", type: "string" },
      ],
    },
    {
      name: "affiliations",
      title: "Press & couture strip (names + links)",
      description: "Artwork stays as-is; names and links are editable.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string", validation: required },
            { name: "href", title: "Link", type: "url" },
          ],
        },
      ],
    },
    {
      name: "notFound",
      title: "404 page copy",
      type: "object",
      fields: [
        { name: "eyebrow", title: "Eyebrow", type: "string" },
        { name: "title", title: "Title", type: "string" },
        { name: "body", title: "Body", type: "text" },
        { name: "primaryLabel", title: "First button", type: "string" },
        { name: "secondaryLabel", title: "Second button", type: "string" },
      ],
    },
    {
      name: "errorPage",
      title: "Error page copy",
      type: "object",
      fields: [
        { name: "eyebrow", title: "Eyebrow", type: "string" },
        { name: "title", title: "Title", type: "string" },
        { name: "body", title: "Body", type: "text" },
        { name: "primaryLabel", title: "First button", type: "string" },
        { name: "secondaryLabel", title: "Second button", type: "string" },
      ],
    },
  ]),

  singleton("homePage", "🏠 Home page", [
    ...seoFields,
    { ...imageKeyField("Hero photograph", "Full-screen opener."), name: "heroImageKey" },
    { name: "heroEyebrow", title: "Hero eyebrow", type: "string" },
    { name: "heroTitle", title: "Hero title", type: "string" },
    { name: "heroSub", title: "Hero sub-line", type: "string" },
    { name: "introEyebrow", title: "Intro eyebrow", type: "string" },
    { name: "introHeading", title: "Intro heading", type: "string" },
    { name: "introBody", title: "Intro paragraph", type: "text" },
    {
      name: "collections",
      title: "Photography collections (4 cards)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "id",
              title: "Filter it opens",
              type: "string",
              options: { list: ["candid", "traditional", "intimate", "pre"] },
              validation: required,
            },
            { name: "title", title: "Card title", type: "string", validation: required },
            { ...imageKeyField("Card photograph"), name: "imageKey" },
          ],
        },
      ],
    },
    {
      name: "mosaicLines",
      title: "Mosaic title (3 lines)",
      description: "The words set in the middle tile of the photo mosaic.",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      ...imageKeysField("Mosaic photographs (14)", "The image mosaic tiles."),
      name: "mosaicKeys",
    },
    { name: "filmsEyebrow", title: "Films eyebrow", type: "string" },
    { name: "filmsTitle", title: "Films title", type: "string" },
    {
      ...imageKeysField("Film cover row (6 small frames)"),
      name: "filmCoverKeys",
    },
    {
      ...imageKeysField("Stories backdrop (4 cross-fading frames)"),
      name: "backdropKeys",
    },
    { name: "awardsEyebrow", title: "Awards eyebrow", type: "string" },
    { name: "awardsTitle", title: "Awards title", type: "string" },
    {
      name: "awardsBadges",
      title: "Award badges (5)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "subtitle", title: "Subtitle (e.g. WINNER)", type: "string" },
            { name: "title", title: "Title", type: "string", validation: required },
            { name: "year", title: "Year", type: "string", validation: required },
            { name: "organization", title: "Organisation", type: "string" },
          ],
        },
      ],
    },
    { name: "gearCamerasLabel", title: "Gear label: cameras", type: "string" },
    { name: "gearPostLabel", title: "Gear label: post-production", type: "string" },
  ]),

  singleton("aboutPage", "📖 About page", [
    ...seoFields,
    { ...imageKeyField("Hero photograph"), name: "heroImageKey" },
    { name: "heroImageAlt", title: "Hero photo description", type: "string" },
    { name: "heroEyebrow", title: "Hero eyebrow", type: "string" },
    { name: "heroTitle", title: "Hero title", type: "string" },
    { name: "heroLead", title: "Hero lead", type: "text" },
    { name: "teamEyebrow", title: "Team eyebrow", type: "string" },
    { name: "teamHeading", title: "Team heading", type: "string" },
    { name: "teamBody", title: "Team paragraph", type: "text" },
    {
      name: "teamMembers",
      title: "Team members (4)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string", validation: required },
            { name: "role", title: "Role", type: "string", validation: required },
            { ...imageKeyField("Portrait"), name: "imageKey" },
          ],
        },
      ],
    },
    { name: "rightEyebrow", title: "“Right team” eyebrow", type: "string" },
    { name: "rightTitle", title: "“Right team” title", type: "string" },
    { name: "rightLead", title: "“Right team” lead", type: "text" },
    { name: "rightBody", title: "“Right team” paragraph", type: "text" },
    { name: "differenceEyebrow", title: "Difference eyebrow", type: "string" },
    { name: "differenceTitle", title: "Difference title", type: "string" },
    { name: "differenceLead", title: "Difference lead", type: "text" },
    {
      name: "differenceCards",
      title: "Difference cards (6)",
      type: "array",
      of: [titleBodyCard],
    },
    { name: "marqueeItems", title: "Marquee words", type: "array", of: [{ type: "string" }] },
    { name: "placesEyebrow", title: "Offices eyebrow", type: "string" },
    { name: "placesTitle", title: "Offices title", type: "string" },
    { name: "placesLead", title: "Offices lead", type: "text" },
  ]),

  singleton("brandsPage", "🏷️ Brands page", [
    ...seoFields,
    { ...imageKeyField("Hero photograph"), name: "heroImageKey" },
    { name: "heroImageAlt", title: "Hero photo description", type: "string" },
    { name: "heroEyebrow", title: "Hero eyebrow", type: "string" },
    { name: "heroTitle", title: "Hero title", type: "string" },
    { name: "heroLead", title: "Hero lead", type: "text" },
    { name: "whyEyebrow", title: "“Why more than one brand” eyebrow", type: "string" },
    { name: "whyTitle", title: "“Why…” title", type: "string" },
    { name: "whyLead", title: "“Why…” lead", type: "text" },
    { name: "approachEyebrow", title: "Shared-approach eyebrow", type: "string" },
    { name: "approachTitle", title: "Shared-approach title", type: "string" },
    {
      name: "approachCards",
      title: "Shared-approach cards (6)",
      type: "array",
      of: [titleBodyCard],
    },
  ]),

  singleton("contactPage", "✉️ Contact page", [
    ...seoFields,
    { name: "eyebrow", title: "Eyebrow", type: "string" },
    { name: "heading", title: "Heading", type: "string" },
    { name: "lead", title: "Lead paragraph", type: "text" },
    {
      name: "serviceOptions",
      title: "Enquiry form services (3)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", title: "Value", type: "string", validation: required },
            { name: "note", title: "Helper note", type: "string" },
          ],
        },
      ],
    },
    {
      name: "nextSteps",
      title: "“What happens next” steps (3)",
      type: "array",
      of: [titleBodyCard],
    },
    { name: "stepsEyebrow", title: "Steps eyebrow", type: "string" },
    { name: "asideEyebrow", title: "WhatsApp card eyebrow", type: "string" },
    { name: "asideTitle", title: "WhatsApp card title", type: "string" },
    { name: "asideBody", title: "WhatsApp card body", type: "text" },
    { name: "asideButton", title: "WhatsApp button", type: "string" },
    { name: "asideCallLabel", title: "“Or call” label", type: "string" },
    { name: "whereEyebrow", title: "Addresses eyebrow", type: "string" },
    { name: "whereTitle", title: "Addresses title", type: "string" },
    { name: "pinnedCall", title: "Mobile bar: call label", type: "string" },
    { name: "pinnedWhatsapp", title: "Mobile bar: WhatsApp label", type: "string" },
  ]),

  singleton("filmsPage", "🎬 Films page", [...seoFields]),

  singleton("photographyPage", "📷 Photography page", [...seoFields]),

  singleton("portfolioPage", "🖼️ Portfolio page", [
    ...seoFields,
    { name: "eyebrow", title: "Eyebrow", type: "string" },
    { name: "sub", title: "Sub-line under the title", type: "string" },
    {
      name: "countTemplate",
      title: "Count line",
      description: "Use {shown} and {total}, e.g. “Showing {shown} of {total} images”.",
      type: "string",
    },
    {
      name: "showMoreTemplate",
      title: "“Show more” button",
      description: "Use {remaining}, e.g. “Show more ({remaining} remaining)”.",
      type: "string",
    },
    {
      name: "filterLabels",
      title: "Filter labels",
      description: "Renames a filter button; the id must stay one of the eight below.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "id",
              title: "Filter id",
              type: "string",
              options: {
                list: [
                  "all",
                  "candid",
                  "traditional",
                  "intimate",
                  "haldi",
                  "christian",
                  "pre",
                  "venue",
                ],
              },
              validation: required,
            },
            { name: "label", title: "Button label", type: "string", validation: required },
          ],
        },
      ],
    },
  ]),

  {
    name: "brand",
    title: "Brand",
    type: "document",
    fields: [
      { name: "name", title: "Name", type: "string", validation: required },
      {
        name: "slug",
        title: "URL slug",
        type: "slug",
        options: {
          source: "name",
          slugify: (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
        validation: required,
      },
      { name: "order", title: "Order on the Brands page", type: "number" },
      { name: "tagline", title: "Tagline", type: "string" },
      { name: "description", title: "Description", type: "text" },
      { name: "audience", title: "Who it is for", type: "text" },
      { name: "offerings", title: "What it does (list)", type: "array", of: [{ type: "string" }] },
      {
        ...imageKeyField("Card + hero photograph", "One of the 30 archive frames."),
        name: "coverKey",
      },
      {
        ...imageKeysField("Detail-page gallery", "Frames shown on the brand's own page."),
        name: "galleryKeys",
      },
      { name: "seoTitle", title: "Search title override", type: "string" },
      { name: "seoDescription", title: "Search description override", type: "text" },
    ],
    preview: {
      select: { title: "name", subtitle: "tagline" },
    },
  },

  {
    name: "wedding",
    title: "Wedding story",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Story title",
        type: "string",
        validation: required,
      },
      {
        name: "slug",
        title: "URL slug",
        type: "slug",
        options: {
          source: "title",
          slugify: (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
        validation: required,
      },
      { name: "order", title: "Order in lists", type: "number" },
      { name: "couple", title: "Couple names", type: "string" },
      { name: "venue", title: "Venue (named — the search keyword)", type: "string" },
      { name: "location", title: "Location (e.g. Kozhikode, Kerala)", type: "string" },
      {
        name: "type",
        title: "Wedding type",
        type: "string",
        options: {
          list: ["Candid", "Traditional", "Church", "Pre-wedding", "Destination", "Intimate"],
        },
      },
      {
        name: "coverage",
        title: "Coverage",
        type: "string",
        options: { list: ["Photography", "Videography", "Photography + Videography"] },
      },
      { name: "season", title: "Season / month", type: "string" },
      { name: "summary", title: "Summary (cards + search)", type: "text" },
      { name: "story", title: "Story paragraphs", type: "array", of: [{ type: "text" }] },
      { name: "services", title: "Services delivered", type: "array", of: [{ type: "string" }] },
      {
        ...imageKeyField("Cover photograph", "Card + share image for this story."),
        name: "coverKey",
      },
      {
        ...imageKeysField("Story frames", "Photographs on the story page."),
        name: "frameKeys",
      },
      { name: "seoTitle", title: "Search title override", type: "string" },
      { name: "seoDescription", title: "Search description override", type: "text" },
    ],
    preview: {
      select: { title: "title", subtitle: "couple" },
    },
  },

  {
    name: "film",
    title: "Wedding film",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Title",
        type: "string",
        validation: required,
      },
      {
        name: "slug",
        title: "URL slug",
        type: "slug",
        options: {
          source: "title",
          slugify: (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
        validation: required,
      },
      { name: "order", title: "Order in lists", type: "number" },
      { name: "location", title: "Location", type: "string" },
      { name: "duration", title: "Duration label (e.g. Feature · 12–20 min)", type: "string" },
      { name: "description", title: "Description", type: "text" },
      {
        name: "youtubeId",
        title: "YouTube video ID",
        description: "The 11-character ID — the thumbnail and player both come from it.",
        type: "string",
        validation: required,
      },
    ],
    preview: {
      select: { title: "title", subtitle: "location" },
    },
  },
];
