import type { ReactNode } from "react";

/**
 * A ticker of short phrases. Used once or twice per page as a rhythm break
 * between two heavy sections — the modern equivalent of a printed rule, but it
 * carries the studio's vocabulary while it does it.
 *
 * Every tone is now light. A black band here read as a different website.
 *
 * The track is duplicated and translated -50%, which is seamless because the
 * two halves are identical. The copy is hidden from assistive tech: the same
 * words appear as a real list in the section that follows, and a screen reader
 * announcing a looping marquee six times is worse than announcing it once.
 */
export function Marquee({
  items,
  duration = 38,
  tone = "cream",
  slow = false,
}: {
  items: readonly string[];
  duration?: number;
  tone?: "ink" | "paper" | "cream";
  slow?: boolean;
}) {
  const run = (extraClass: string) => (
    <div
      className="marquee"
      style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
    >
      <div className={`flex shrink-0 items-center ${extraClass}`}>
        {items.map((item) => (
          <span key={item} className="flex items-center">
            <span className="px-6 text-h3 font-medium whitespace-nowrap sm:px-9">{item}</span>
            <span aria-hidden="true" className="gold text-lg">
              ✦
            </span>
          </span>
        ))}
      </div>
      <div className={`flex shrink-0 items-center ${extraClass}`} aria-hidden="true">
        {items.map((item) => (
          <span key={item} className="flex items-center">
            <span className="px-6 text-h3 font-medium whitespace-nowrap sm:px-9">{item}</span>
            <span className="gold text-lg">✦</span>
          </span>
        ))}
      </div>
    </div>
  );

  if (tone === "paper") {
    return (
      <div className="overflow-hidden border-y border-line py-6 text-ink" aria-hidden="true">
        {run("")}
      </div>
    );
  }

  if (tone === "cream") {
    return (
      <div className="overflow-hidden bg-cream py-6 text-ink" aria-hidden="true">
        {run("")}
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden bg-cream py-6 text-ink ${slow ? "marquee-slow" : ""}`.trim()}
      aria-hidden="true"
    >
      {run("")}
    </div>
  );
}

/**
 * The bento grid itself. Spans are declared per cell by the caller rather than
 * inferred, because a bento only works when the cells are deliberately
 * different sizes.
 */
export function Bento({
  children,
  columns = 4,
  className = "",
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return <div className={`bento bento-${columns} ${className}`.trim()}>{children}</div>;
}
