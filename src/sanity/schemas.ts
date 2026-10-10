/**
 * Sanity schemas, page by page.
 *
 * One singleton document per page (Home, About, Brands index, Contact, Site
 * settings) plus three collections (brands, weddings, films). The Studio at
 * `/studio` lists them in this order, so editing the site reads like reading
 * the site.
 *
 * Image fields never upload files — they pick a key from the 30-frame local
 * archive (see `imageKeys.ts`), keeping every photograph inside the
 * pre-generated responsive ladder.
 */
import { IMAGE_KEYS } from "./imageKeys";

const imageKeyField = (title: string, description?: string) => ({
  title,
  ...(description ? { description } : {}),
  name: "key",
  type: "string",
  options: { list: [...IMAGE_KEYS] },
  validation: (rule: { required: () => unknown }) => rule.required(),
});

const imageKeysField = (title: string, description?: string) => ({
  title,
  ...(description ? { description } : {}),
  name: "keys",
  type: "array",
  of: [{ type: "string", options: { list: [...IMAGE_KEYS] } }],
  validation: (rule: { required: () => unknown }) => rule.required(),
});

const singleton = (name: string, title: string, fields: unknown[]) => ({
  name,
  title,
  type: "document",
  // Singletons: one document each, edited in place — no "create new".
  __experimental_omnisearch_visibility: false,
  fields,
});

export const schemaTypes = [
  singleton("siteSettings", "⚙️ Site settings", [
    {
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (r: { required: () => unknown }) => r.required(),
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
  ]),

  singleton("homePage", "🏠 Home page", [
    { name: "heroEyebrow", title: "Hero eyebrow", type: "string" },
    { name: "heroTitle", title: "Hero title", type: "string" },
    { name: "heroSub", title: "Hero sub-line", type: "string" },
    { name: "introEyebrow", title: "Intro eyebrow", type: "string" },
    { name: "introHeading", title: "Intro heading", type: "string" },
    { name: "introBody", title: "Intro paragraph", type: "text" },
  ]),

  singleton("aboutPage", "📖 About page", [
    { name: "heroEyebrow", title: "Hero eyebrow", type: "string" },
    { name: "heroTitle", title: "Hero title", type: "string" },
    { name: "heroLead", title: "Hero lead", type: "text" },
    { name: "teamEyebrow", title: "Team eyebrow", type: "string" },
    { name: "teamHeading", title: "Team heading", type: "string" },
    { name: "teamBody", title: "Team paragraph", type: "text" },
    { name: "differenceEyebrow", title: "Difference eyebrow", type: "string" },
    { name: "differenceTitle", title: "Difference title", type: "string" },
    { name: "differenceLead", title: "Difference lead", type: "text" },
    {
      name: "differenceCards",
      title: "Difference cards (6)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "body", title: "Body", type: "text" },
          ],
        },
      ],
    },
    { name: "marqueeItems", title: "Marquee words", type: "array", of: [{ type: "string" }] },
    { name: "placesEyebrow", title: "Offices eyebrow", type: "string" },
    { name: "placesTitle", title: "Offices title", type: "string" },
    { name: "placesLead", title: "Offices lead", type: "text" },
  ]),

  singleton("brandsPage", "🏷️ Brands page", [
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
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "body", title: "Body", type: "text" },
          ],
        },
      ],
    },
  ]),

  singleton("contactPage", "✉️ Contact page", [
    { name: "eyebrow", title: "Eyebrow", type: "string" },
    { name: "heading", title: "Heading", type: "string" },
    { name: "lead", title: "Lead paragraph", type: "text" },
    {
      name: "nextSteps",
      title: "“What happens next” steps (3)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "body", title: "Body", type: "text" },
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
      {
        name: "name",
        title: "Name",
        type: "string",
        validation: (r: { required: () => unknown }) => r.required(),
      },
      {
        name: "slug",
        title: "URL slug",
        type: "slug",
        options: {
          source: "name",
          slugify: (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
        validation: (r: { required: () => unknown }) => r.required(),
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
        validation: (r: { required: () => unknown }) => r.required(),
      },
      {
        name: "slug",
        title: "URL slug",
        type: "slug",
        options: {
          source: "title",
          slugify: (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
        validation: (r: { required: () => unknown }) => r.required(),
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
        validation: (r: { required: () => unknown }) => r.required(),
      },
      {
        name: "slug",
        title: "URL slug",
        type: "slug",
        options: {
          source: "title",
          slugify: (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
        validation: (r: { required: () => unknown }) => r.required(),
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
        validation: (r: { required: () => unknown }) => r.required(),
      },
    ],
    preview: {
      select: { title: "title", subtitle: "location" },
    },
  },
];
