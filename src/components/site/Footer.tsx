import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Facebook } from "lucide-react";

import { business, nav, whatsappHref } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="shell grid gap-14 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-5">
          <p className="font-display text-3xl tracking-[0.18em] uppercase">Oriana</p>
          <p className="mt-2 text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground">
            Weddings
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Wedding photography &amp; films. Kozhikode · Kerala. Photographing weddings
            since {business.establishedYear}.
          </p>
          <div className="mt-8 flex items-center gap-5">
            <a href={business.instagram} aria-label="Oriana Weddings on Instagram" target="_blank" rel="noreferrer">
              <Instagram className="size-4" strokeWidth={1.2} />
            </a>
            <a href={business.youtube} aria-label="Oriana Weddings on YouTube" target="_blank" rel="noreferrer">
              <Youtube className="size-4" strokeWidth={1.2} />
            </a>
            <a href={business.facebook} aria-label="Oriana Weddings on Facebook" target="_blank" rel="noreferrer">
              <Facebook className="size-4" strokeWidth={1.2} />
            </a>
          </div>
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <p className="eyebrow">Explore</p>
          <ul className="mt-6 space-y-3">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="eyebrow">Studio</p>
          <address className="mt-6 space-y-2 text-sm leading-relaxed text-muted-foreground not-italic">
            <p>
              1st Floor, Marine Building,
              <br /> Cherooty Road, Kozhikode,
              <br /> Kerala 673001, India
            </p>
            <p>
              <a
                href={business.phoneHref}
                onClick={() => trackEvent("phone_click", { location: "footer" })}
                className="transition-colors hover:text-foreground"
              >
                {business.phone}
              </a>
              <br />
              <a
                href={business.phoneSecondaryHref}
                onClick={() => trackEvent("phone_click", { location: "footer_secondary" })}
                className="transition-colors hover:text-foreground"
              >
                {business.phoneSecondary}
              </a>
            </p>
            <p>
              <a href={`mailto:${business.email}`} className="transition-colors hover:text-foreground">
                {business.email}
              </a>
            </p>
            <p>
              <a
                href={whatsappHref("Hello Oriana Weddings, I would like to enquire about wedding coverage.")}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("whatsapp_click", { location: "footer" })}
                className="transition-colors hover:text-foreground"
              >
                WhatsApp Oriana
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-border py-8 text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Oriana Weddings</p>
        <p>Kozhikode · Malappuram · Wayanad · Kerala</p>
      </div>
    </footer>
  );
}
