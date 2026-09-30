import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

import { business, nav, whatsappHref } from "@/lib/site";

/**
 * The navigation is deliberately plain: a wordmark, the seven pages, and one
 * action. A studio site has one job — get a couple to the work and then to the
 * enquiry form — so there is no mega-menu, no dropdown and no second row of
 * utility links competing for attention.
 *
 * Over the hero the bar is transparent and the links are light; once the page
 * scrolls it takes the off-white page colour at 92% behind a 16px blur, so the
 * links are legible over any photograph without the bar ever reading as a solid
 * strip of chrome.
 */
export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // The hero owns the first viewport, so the bar has to know when that ends.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A route change should never leave the mobile sheet hanging open.
  useEffect(() => setOpen(false), [pathname]);

  // Lock the page behind the sheet so the content behind it cannot scroll.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onHero = pathname === "/" && !scrolled && !open;
  const tone = onHero ? "text-paper" : "text-ink";
  const rule = onHero ? "border-transparent" : "border-line";

  return (
    <>
      <a
        href="#main"
        className="btn btn-paper sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b ${rule} ${
          onHero ? "bg-transparent" : "bg-cream/92 backdrop-blur-md"
        } transition-colors duration-[400ms] ${tone}`}
      >
        <div className="shell-wide flex h-16 items-center justify-between gap-6 lg:h-20">
          <Link
            to="/"
            className="site-wordmark flex shrink-0 flex-col leading-none"
            aria-label={`${business.name} — home`}
          >
            <span className="font-display text-[1.25rem] leading-none tracking-[0.12em]">Oriana</span>
            <span
              className={`mt-1 text-[0.5rem] tracking-[0.34em] uppercase ${
                onHero ? "text-paper/70" : "mute"
              }`}
            >
              WEDDINGS · CALICUT
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`relative py-1 text-[0.6875rem] font-medium tracking-[0.16em] uppercase transition-opacity duration-300 hover:opacity-100 ${
                        active ? "opacity-100" : "opacity-65 hover:opacity-100"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                      <span
                        className={`absolute -bottom-0.5 left-0 h-px w-full origin-left transition-transform duration-300 ${
                          onHero ? "bg-paper" : "bg-ink"
                        } ${active ? "scale-x-100" : "scale-x-0"}`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={whatsappHref("Hi Oriana, I'd like to talk about my wedding.")}
              target="_blank"
              rel="noreferrer noopener"
              className={`btn hidden text-[0.8125rem] sm:inline-flex ${
                onHero ? "btn-paper hover:btn-paper-hover" : "btn-ink hover:btn-ink-hover"
              }`}
            >
              Enquire
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span
                className={`h-px w-6 transition-transform duration-300 ${
                  onHero ? "bg-paper" : "bg-ink"
                } ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-6 transition-opacity duration-300 ${
                  onHero ? "bg-paper" : "bg-ink"
                } ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px w-6 transition-transform duration-300 ${
                  onHero ? "bg-paper" : "bg-ink"
                } ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen sheet. One column, large type, nothing to hover through. */}
      <div
        id="mobile-menu"
        className={`on-ink fixed inset-0 z-40 bg-ink text-paper transition-opacity duration-400 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="shell flex h-full flex-col justify-between pt-24 pb-10">
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {nav.map((item, index) => (
                <li key={item.to} className="border-b border-line-dark/60">
                  <Link
                    to={item.to}
                    className="flex items-baseline gap-4 py-4 text-h3 transition-opacity duration-300 hover:opacity-60"
                    aria-current={pathname === item.to ? "page" : undefined}
                  >
                    <span className="tabular text-xs gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-6">
            <a
              href={whatsappHref("Hi Oriana, I'd like to talk about my wedding.")}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-paper w-full"
            >
              Enquire on WhatsApp
            </a>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-paper/70">
              <a href={business.phoneHref} className="hover:text-paper">
                {business.phone}
              </a>
              <a
                href={business.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-paper"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
