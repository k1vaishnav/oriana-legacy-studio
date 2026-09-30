import type { ReactNode } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";

/* ------------------------------------------------------------------ */
/* Section scaffolding                                                 */
/* ------------------------------------------------------------------ */

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`.trim()}>{children}</p>;
}

/**
 * The heading pattern used everywhere: an optional gold eyebrow, a display
 * headline, an optional lead paragraph, and an optional action. Kept as one
 * component so the vertical rhythm of every section heading is identical.
 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  action,
  align = "left",
  className = "",
  titleClass = "text-h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClass?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={`flex flex-col gap-5 ${
        centered ? "items-center text-center" : "items-start"
      } ${className}`.trim()}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className={`${titleClass} max-w-[20ch] ${centered ? "max-w-[24ch]" : ""}`.trim()}>
        {title}
      </h2>
      {lead ? (
        <p className={`lede ${centered ? "mx-auto max-w-[52ch]" : ""}`.trim()}>{lead}</p>
      ) : null}
      {action ? <div className="pt-3">{action}</div> : null}
    </div>
  );
}

/**
 * A grid that pairs a heading with body copy at the top of a section. Falls back
 * to a single column on a phone rather than squeezing both into one narrow
 * measure.
 */
export function SplitHead({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
      <div className="lg:col-span-7">
        {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
        <h2 className="text-h2 max-w-[18ch]">{title}</h2>
      </div>
      <div className="flex flex-col gap-6 lg:col-span-5 lg:pb-2">
        {lead ? <p className="lede">{lead}</p> : null}
        {action}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

type Variant = "ink" | "line" | "paper";

const BTN: Record<Variant, string> = {
  ink: "btn btn-ink hover:btn-ink-hover",
  line: "btn btn-line hover:btn-line-hover",
  paper: "btn btn-paper hover:btn-paper-hover",
};

export function ActionLink({
  to,
  children,
  variant = "ink",
  className = "",
}: {
  /* Typed as the router's own link target rather than `string`, so a link to a
     page that no longer exists is a compile error instead of a 404 found in
     production. That is exactly how the retired pages kept being linked from. */
  to: NonNullable<LinkProps["to"]>;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link to={to} className={`${BTN[variant]} ${className}`.trim()}>
      {children}
    </Link>
  );
}

/** An inline text link with an arrow that advances on hover. */
export function TextLink({
  to,
  children,
  className = "",
}: {
  to: NonNullable<LinkProps["to"]>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} className={`link group ${className}`.trim()}>
      {children}
      <Arrow />
    </Link>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`link-arrow size-4 shrink-0 ${className}`.trim()}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Content blocks                                                      */
/* ------------------------------------------------------------------ */

/**
 * The proof band. Four figures, no adjectives — the numbers a couple can
 * actually check against the brief.
 */
export function StatBand({ stats }: { stats: readonly { value: string; label: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-2">
          <dt className="sr-only">{stat.label}</dt>
          <dd className="tabular text-h1 font-medium tracking-[-0.04em]">{stat.value}</dd>
          <p className="max-w-[18ch] text-sm mute">{stat.label}</p>
        </div>
      ))}
    </dl>
  );
}

/** A numbered list of steps, used for the Oriana System. */
export function NumberedSteps({
  steps,
}: {
  steps: readonly { step: string; title: string; body: string }[];
}) {
  return (
    <ol className="flex flex-col">
      {steps.map((item) => (
        <li
          key={item.step}
          className="grid gap-2 border-t border-line py-7 sm:grid-cols-[4.5rem_1fr] sm:gap-8 lg:py-9"
        >
          <span className="tabular text-sm gold">{item.step}</span>
          <div className="flex flex-col gap-2.5">
            <h3 className="text-h3">{item.title}</h3>
            <p className="max-w-[62ch] text-base mute">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A two-item definition row, used for the Promise and package detail lists. */
export function DetailList({
  items,
  columns = 1,
}: {
  items: readonly { title: string; body: string }[];
  columns?: 1 | 2;
}) {
  return (
    <ul className={`grid gap-x-12 ${columns === 2 ? "sm:grid-cols-2" : ""} border-t border-line`}>
      {items.map((item) => (
        <li key={item.title} className="flex flex-col gap-1.5 border-b border-line py-5">
          <h3 className="text-base font-medium">{item.title}</h3>
          <p className="text-sm mute">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

/** A pill list — functions, styles, deliverables. */
export function ChipList({
  items,
  className = "",
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`.trim()}>
      {items.map((item) => (
        <li key={item} className="chip cursor-default">
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Quote — used for pull lines, never for invented testimonials        */
/* ------------------------------------------------------------------ */
