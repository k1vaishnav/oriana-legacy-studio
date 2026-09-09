import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, MapPin, MessageCircle, Phone, Mail, Youtube } from "lucide-react";

import { Breadcrumbs, PageHero, SectionHeading } from "@/components/site/Blocks";
import { Reveal } from "@/components/site/Reveal";
import { gallery } from "@/lib/portfolio";
import { SITE_URL, breadcrumbSchema, business, coverage, whatsappHref } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

const title = "Contact Oriana Weddings | Wedding Photographers in Calicut, Kerala";
const description =
  "Enquire about wedding photography and wedding films with Oriana Weddings in Kozhikode (Calicut), Kerala. Call, WhatsApp or send your wedding date and venue details.";

const trail = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/contact` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema(trail)),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: title,
          description,
          url: `${SITE_URL}/contact`,
          about: { "@id": `${SITE_URL}/#organization` },
        }),
      },
    ],
  }),
  component: ContactPage,
});

const functionTypes = [
  "Wedding",
  "Christian wedding",
  "Hindu wedding",
  "Muslim nikah",
  "Engagement",
  "Reception",
  "Pre-wedding shoot",
  "Post-wedding shoot",
  "Other",
];

const requirements = [
  "Candid photography",
  "Traditional photography",
  "Cinematic wedding film",
  "Teaser / short film",
  "Drone coverage",
  "Live screening",
  "Photobooth",
  "Album & prints",
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    functionType: functionTypes[0],
    date: "",
    venue: "",
    place: coverage[0],
    needs: [] as string[],
    message: "",
  });

  const toggleNeed = (value: string) =>
    setForm((prev) => ({
      ...prev,
      needs: prev.needs.includes(value)
        ? prev.needs.filter((n) => n !== value)
        : [...prev.needs, value],
    }));

  const summary = [
    `Hello Oriana Weddings,`,
    `Name: ${form.name || "-"}`,
    `Phone: ${form.phone || "-"}`,
    form.email ? `Email: ${form.email}` : "",
    `Function: ${form.functionType}`,
    `Date: ${form.date || "to be confirmed"}`,
    `Venue: ${form.venue || "-"}, ${form.place}`,
    `Requirements: ${form.needs.length ? form.needs.join(", ") : "to discuss"}`,
    form.message ? `Notes: ${form.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackEvent("enquiry_submit", { function_type: form.functionType });
    setSent(true);
    window.open(whatsappHref(summary), "_blank", "noreferrer");
  };

  const field =
    "w-full border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground";
  const label = "block text-[0.6rem] tracking-[0.22em] uppercase text-muted-foreground";

  return (
    <>
      <Breadcrumbs trail={trail} />
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Tell us about <em>your day.</em>
          </>
        }
        lede="Share your date, venue and what you have in mind. We will come back with availability, the right team and a package that fits."
        image={gallery.details.src}
        imageAlt={gallery.details.alt}
        imageWidth={gallery.details.width}
        imageHeight={gallery.details.height}
      />

      <section className="shell grid gap-16 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-5">
          <Reveal>
            <h2 className="display-md">
              Studio in <em>Calicut.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <address className="mt-8 space-y-1 text-sm not-italic leading-relaxed text-muted-foreground">
              <div>{business.name}</div>
              <div>{business.street}</div>
              <div>
                {business.city}, {business.region} {business.postalCode}
              </div>
            </address>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-10 space-y-4 text-sm">
              <a
                href={business.phoneHref}
                onClick={() => trackEvent("phone_click", { location: "contact_page" })}
                className="flex items-center gap-3 transition-colors hover:text-champagne"
              >
                <Phone className="size-4" strokeWidth={1.2} /> {business.phone}
              </a>
              <a
                href={business.phoneSecondaryHref}
                onClick={() => trackEvent("phone_click", { location: "contact_page_secondary" })}
                className="flex items-center gap-3 transition-colors hover:text-champagne"
              >
                <Phone className="size-4" strokeWidth={1.2} /> {business.phoneSecondary}
              </a>
              <a
                href={`mailto:${business.email}`}
                className="flex items-center gap-3 transition-colors hover:text-champagne"
              >
                <Mail className="size-4" strokeWidth={1.2} /> {business.email}
              </a>
              <a
                href={whatsappHref("Hello Oriana Weddings, I'd like to check your availability.")}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("whatsapp_click", { location: "contact_page" })}
                className="flex items-center gap-3 transition-colors hover:text-champagne"
              >
                <MessageCircle className="size-4" strokeWidth={1.2} /> WhatsApp us
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${business.mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-champagne"
              >
                <MapPin className="size-4" strokeWidth={1.2} /> Get directions
              </a>
              <div className="flex items-center gap-6 pt-2">
                <a
                  href={business.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Oriana Weddings on Instagram"
                >
                  <Instagram className="size-4" strokeWidth={1.2} />
                </a>
                <a
                  href={business.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Oriana Weddings on YouTube"
                >
                  <Youtube className="size-4" strokeWidth={1.2} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <Reveal>
            <div className="border border-border">
              <iframe
                title="Oriana Weddings studio location in Kozhikode, Kerala"
                src={`https://www.google.com/maps?q=${business.mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full md:h-[420px]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="shell py-20 md:py-28">
          <SectionHeading
            index="01"
            eyebrow="Enquiry"
            title={
              <>
                Send your wedding <em>details.</em>
              </>
            }
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Fill this in and we will open WhatsApp with your details ready to send — the fastest
              way to reach the studio. You can also call either number directly.
            </p>
          </SectionHeading>

          <form onSubmit={onSubmit} className="mt-14 grid gap-6 md:grid-cols-2">
            <div>
              <label className={label} htmlFor="name">
                Your name
              </label>
              <input
                id="name"
                required
                className={`${field} mt-3`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className={label} htmlFor="phone">
                Phone / WhatsApp
              </label>
              <input
                id="phone"
                required
                inputMode="tel"
                className={`${field} mt-3`}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className={label} htmlFor="email">
                Email (optional)
              </label>
              <input
                id="email"
                type="email"
                className={`${field} mt-3`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className={label} htmlFor="functionType">
                Function
              </label>
              <select
                id="functionType"
                className={`${field} mt-3`}
                value={form.functionType}
                onChange={(e) => setForm({ ...form, functionType: e.target.value })}
              >
                {functionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="date">
                Wedding date
              </label>
              <input
                id="date"
                type="date"
                className={`${field} mt-3`}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className={label} htmlFor="place">
                Location
              </label>
              <select
                id="place"
                className={`${field} mt-3`}
                value={form.place}
                onChange={(e) => setForm({ ...form, place: e.target.value })}
              >
                {coverage.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={label} htmlFor="venue">
                Venue / church / hall
              </label>
              <input
                id="venue"
                className={`${field} mt-3`}
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </div>

            <fieldset className="md:col-span-2">
              <legend className={label}>What do you need?</legend>
              <div className="mt-4 flex flex-wrap gap-3">
                {requirements.map((item) => {
                  const active = form.needs.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleNeed(item)}
                      aria-pressed={active}
                      className={`border px-4 py-2 text-[0.62rem] tracking-[0.2em] uppercase transition-colors ${
                        active
                          ? "border-foreground bg-foreground text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="md:col-span-2">
              <label className={label} htmlFor="message">
                Anything else
              </label>
              <textarea
                id="message"
                rows={4}
                className={`${field} mt-3`}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center gap-6">
              <button
                type="submit"
                className="border border-foreground bg-foreground px-8 py-4 text-[0.62rem] tracking-[0.28em] uppercase text-primary-foreground transition-colors hover:bg-transparent hover:text-foreground"
              >
                Send enquiry
              </button>
              {sent ? (
                <p className="text-sm text-muted-foreground">
                  Your details are ready in WhatsApp — press send there and we will reply shortly.
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
