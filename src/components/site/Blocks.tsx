import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { business, whatsappHref } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { Reveal } from "./Reveal";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}) {
  return (
    <section className="shell pt-36 pb-16 md:pt-48 md:pb-24">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
        <Reveal delay={0.08} className="md:col-span-7">
          <h1 className="display-xl">{title}</h1>
        </Reveal>
        <Reveal delay={0.16} className="md:col-span-5 md:pb-4">
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">{lede}</p>
        </Reveal>
      </div>
      <div className="mt-14 overflow-hidden bg-secondary md:mt-20">
        <img
          src={image}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          sizes="100vw"
          className="h-[52vh] w-full object-cover md:h-[74vh]"
        />
      </div>
    </section>
  );
}

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="shell pt-4">
      <ol className="flex flex-wrap items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground">
        {trail.map((item, index) => (
          <li key={item.path} className="flex items-center gap-2">
            {index > 0 ? <ChevronRight className="size-3" strokeWidth={1} /> : null}
            {index === trail.length - 1 ? (
              <span aria-current="page" className="text-foreground">
                {item.name}
              </span>
            ) : (
              <Link to={item.path} className="transition-colors hover:text-foreground">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  children,
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-12">
      <Reveal className="md:col-span-5">
        <div className="flex items-baseline gap-5">
          {index ? (
            <span className="font-display text-2xl text-champagne">{index}</span>
          ) : null}
          <div>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <h2 className="display-md mt-3">{title}</h2>
          </div>
        </div>
      </Reveal>
      {children ? (
        <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
          {children}
        </Reveal>
      ) : null}
    </div>
  );
}

export function TextLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-3 border-b border-foreground/30 pb-1 text-[0.66rem] tracking-[0.22em] uppercase transition-colors hover:border-champagne hover:text-champagne"
    >
      {children}
      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

export function Placeholder({ label }: { label: string }) {
  return <span className="placeholder-tag">{label}</span>;
}

export function ClosingCta({
  title,
  lede,
  whatsappMessage = "Hello Oriana Weddings, we would like to enquire about wedding photography and films.",
}: {
  title: ReactNode;
  lede?: string;
  whatsappMessage?: string;
}) {
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="shell py-24 text-center md:py-36">
        <Reveal>
          <h2 className="display-lg mx-auto max-w-3xl">{title}</h2>
        </Reveal>
        {lede ? (
          <Reveal delay={0.1}>
            <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {lede}
            </p>
          </Reveal>
        ) : null}
        <Reveal delay={0.18}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="w-full border border-foreground bg-foreground px-10 py-4 text-[0.62rem] tracking-[0.28em] uppercase text-primary-foreground transition-colors hover:bg-transparent hover:text-foreground sm:w-auto"
            >
              Start a conversation
            </Link>
            <a
              href={whatsappHref(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("whatsapp_click", { location: "closing_cta" })}
              className="w-full border border-foreground px-10 py-4 text-[0.62rem] tracking-[0.28em] uppercase transition-colors hover:bg-foreground hover:text-primary-foreground sm:w-auto"
            >
              WhatsApp Oriana
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-10 text-xs tracking-[0.16em] uppercase text-muted-foreground">
            {business.phone} · Kozhikode, Kerala
          </p>
        </Reveal>
      </div>
    </section>
  );
}
