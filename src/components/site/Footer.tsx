import { Link } from "@tanstack/react-router";

import { brandLines, establishedMark, nav } from "@/lib/site";
import { useSiteSettings } from "@/lib/cms";

/**
 * The footer is a directory, and now only a directory.
 *
 * It used to open with its own "Let's talk" block, a newsletter capture, and a
 * call to action — directly beneath a ClosingCTA saying the same thing on the
 * same screen. Two conversion panels per page, one of which submitted to nothing
 * (`onSubmit` just set a boolean). With the enquiry form now living on
 * /contact, the footer keeps what a footer is actually for: where to go next,
 * where to find the studio, and what it claims to be.
 *
 * It also repeats the studio's two full postal addresses on every page, including
 * the two pages whose entire subject is those addresses. The footers now carry
 * city and telephone only; the street and postcode live on /about and /contact,
 * which are the pages that own them.
 */
export function Footer() {
  const { business, coverage, offices } = useSiteSettings();
  const sections = nav.filter((item) => item.to !== "/");

  return (
    <footer className="surface-cream mt-auto border-t border-line">
      <div className="shell-wide grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-20">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Explore</p>
          <ul className="flex flex-col gap-2.5">
            {sections.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="link-muted text-sm transition-colors duration-300 hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {offices.map((office) => (
          <div key={office.city} className="flex flex-col gap-3">
            <p className="eyebrow">Studio</p>
            <address className="flex flex-col gap-1 text-sm text-mute not-italic">
              <span className="font-medium text-ink">{office.city}</span>
              <a href={office.phoneHref} className="link-muted transition-colors hover:text-ink">
                {office.phone}
              </a>
            </address>
          </div>
        ))}

        <div className="flex flex-col gap-4">
          <p className="eyebrow">Where we shoot</p>
          <ul className="flex flex-wrap gap-1.5">
            {coverage.slice(0, 8).map((place) => (
              /* The chip's own ground is ivory, a shade off the cream footer, so
                 the pills read without the override they needed against white. */
              <li key={place} className="chip">
                {place}
              </li>
            ))}
          </ul>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <a
              href={business.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="link-muted transition-colors hover:text-ink"
            >
              Instagram
            </a>
            <a
              href={business.youtube}
              target="_blank"
              rel="noreferrer noopener"
              className="link-muted transition-colors hover:text-ink"
            >
              YouTube
            </a>
            <a
              href={business.facebook}
              target="_blank"
              rel="noreferrer noopener"
              className="link-muted transition-colors hover:text-ink"
            >
              Facebook
            </a>
            <a
              href={`mailto:${business.email}`}
              className="link-muted transition-colors hover:text-ink"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      <div className="shell-wide flex flex-col gap-3 border-t border-line py-7 text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {business.name}. {business.legalDescription}.
        </p>
        {/* The standing credentials. These are the two claims a couple checks
            before anything else, and they belong on every page rather than only
            on the pages that happen to mention them. */}
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-gold-ink">{establishedMark}</span>
          {brandLines.map((line) => (
            <span key={line} className="flex items-center gap-3">
              <span aria-hidden="true" className="text-line">
                ·
              </span>
              {line}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
