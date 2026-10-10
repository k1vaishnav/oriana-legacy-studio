import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * A horizontal gallery built on native scroll-snap.
 *
 * The arrows and the progress rail are enhancements: touch gets momentum
 * snapping, a pointer user gets paging buttons, a keyboard user gets the
 * buttons, and all three get a real scrollbar. No transform-driven slider means
 * no duplicated slides, no scroll hijacking, and correct behaviour when a
 * visitor drags the page's scrollbar across it.
 */
export function Carousel({
  children,
  label,
  tone = "light",
}: {
  children: ReactNode;
  label: string;
  tone?: "light" | "dark";
}) {
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    setProgress(ratio);
    setAtStart(el.scrollLeft < 4);
    setAtEnd(max - el.scrollLeft < 4);
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure, children]);

  /** Page by the width of the first card plus its gap. */
  const page = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const dark = tone === "dark";
  const buttonClass = `round-link h-11 w-11 ${
    dark ? "border-line-dark text-paper hover:bg-paper hover:text-ink hover:border-paper" : ""
  }`;

  return (
    <div className="flex flex-col gap-6">
      <div className="shell-wide flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={atStart}
          aria-label="Previous"
          className={`${buttonClass} disabled:pointer-events-none disabled:opacity-30`}
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
            <path
              d="M13.5 8h-11m0 0L7 3.5M2.5 8 7 12.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          disabled={atEnd}
          aria-label="Next"
          className={`${buttonClass} disabled:pointer-events-none disabled:opacity-30`}
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
            <path
              d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        ref={track}
        className={`carousel ${dark ? "[&>*]:border-line-dark" : ""}`}
        role="group"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>

      <div className="shell-wide">
        <div className={`carousel-rail ${dark ? "!bg-line-dark" : ""}`} role="presentation">
          <span style={{ transform: `scaleX(${Math.max(progress, 0.06)})` }} />
        </div>
      </div>
    </div>
  );
}

/**
 * A card inside a carousel: a photograph, an optional index, and a caption.
 * `ratio` is passed straight to the image shell, so each card keeps the
 * photograph's own proportions and the row is allowed to be ragged vertically
 * rather than cropping everything to a common height.
 */
export function CarouselCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`carousel-item ${className}`.trim()}>{children}</div>;
}
