import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before the transition starts, for staggering siblings. */
  // Declared as `| undefined` so callers can forward a conditional delay
  // straight through under exactOptionalPropertyTypes.
  delay?: number | undefined;
  className?: string;
  as?: ElementType;
  /**
   * How a bento cell collapses on a phone. A bento that becomes a single
   * column stops reading as a bento, so a full-width cell can opt back into a
   * two-up row.
   */
  mobile?: "half" | "full";
};

/**
 * Scroll reveal without an animation library.
 *
 * One IntersectionObserver is shared by every instance on the page, and it is
 * torn down as soon as the last target resolves, so the cost is a single
 * observer and a class flip per element — no JavaScript runs per frame.
 *
 * The hidden state itself lives behind an `html.js` class that an inline script
 * sets before first paint. With JavaScript unavailable the page is simply
 * visible, which is the correct failure mode for content.
 */
let observer: IntersectionObserver | null = null;

/**
 * Elements still waiting to be revealed. A Set rather than a counter: a counter
 * gets corrupted when an element is released after it has already resolved
 * (reveal, then unmount), and the resulting negative count tears down the next
 * observer far too early.
 */
const pending = new Set<Element>();

/**
 * Unconditional reveal timers, keyed by element. Cleared as soon as the
 * element is revealed or unmounted, so nothing is left pending after a route
 * change.
 */
const failsafes = new Map<Element, number>();

/**
 * How long an element may wait for the observer before it is revealed anyway.
 *
 * Long enough that a normal scroll never trips it — an element has to be on
 * screen, which happens far sooner than this on any real reading speed. Short
 * enough that a visitor who lands on a broken-anchor deep link sees the section
 * rather than a blank screen.
 */
const REVEAL_FAILSAFE_MS = 1500;

const REDUCED =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getObserver(): IntersectionObserver {
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("reveal-in");
        observer?.unobserve(entry.target);
        const timer = failsafes.get(entry.target);
        if (timer !== undefined) {
          window.clearTimeout(timer);
          failsafes.delete(entry.target);
        }
        pending.delete(entry.target);
      }
      // Nothing left to watch — drop the observer rather than leave it idle.
      if (pending.size === 0 && observer) {
        observer.disconnect();
        observer = null;
      }
    },
    // Reveal once the element is meaningfully on screen rather than the instant
    // a single pixel crosses the edge.
    { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
  );

  return observer;
}

function observe(el: Element) {
  pending.add(el);
  getObserver().observe(el);

  // Failsafe. IntersectionObserver can legitimately never fire: an element
  // inside a container that is itself transformed, a `content-visibility`
  // subtree, a zero-height parent, or a browser quirk with nested scroll
  // containers all leave the callback un-called. The result is the worst kind of
  // bug on a content site — a section that is present in the DOM, in the SEO
  // output and in the accessibility tree, but permanently transparent to a
  // visitor, with no error anywhere to explain it.
  //
  // So the observer is only ever an optimisation. This timer reveals the
  // element unconditionally, and the observer revealing it first just clears
  // the timer early.
  const timer = window.setTimeout(() => {
    if (!el.classList.contains("reveal-in")) {
      el.classList.add("reveal-in");
      release(el);
    }
  }, REVEAL_FAILSAFE_MS);

  failsafes.set(el, timer);
}

function release(el: Element) {
  const timer = failsafes.get(el);
  if (timer !== undefined) {
    window.clearTimeout(timer);
    failsafes.delete(el);
  }
  if (!pending.delete(el)) return; // already revealed; not counted any more
  observer?.unobserve(el);
  if (pending.size === 0 && observer) {
    observer.disconnect();
    observer = null;
  }
}

export function Reveal({ children, delay = 0, className = "", as, mobile }: RevealProps) {
  const Component = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion, or no observer support: show the content immediately
    // rather than leaving it stranded at opacity 0.
    if (REDUCED || typeof IntersectionObserver === "undefined") {
      el.classList.add("reveal-in");
      return;
    }

    // Anything already on screen at mount reveals on the next frame, so the
    // transition runs without waiting for a scroll event.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
      const id = requestAnimationFrame(() => {
        el.classList.add("reveal-in");
        release(el);
      });
      return () => cancelAnimationFrame(id);
    }

    observe(el);
    return () => release(el);
  }, []);

  return (
    <Component
      ref={ref}
      className={`reveal${className ? ` ${className}` : ""}`}
      {...(mobile ? { "data-mobile": mobile } : {})}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Component>
  );
}
