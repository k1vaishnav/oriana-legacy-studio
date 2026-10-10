import { Link } from "@tanstack/react-router";

import { PhotoImage } from "@/lib/images";
import type { Photo } from "@/lib/photos";

/**
 * The opener for every route except the home page.
 *
 * Same idea as the home hero at a calmer register: the type sits on white, the
 * photograph runs full-bleed beneath it. A visitor who lands deep — from Google,
 * from Instagram, on a phone — gets told what this page is in one line before
 * they hit a single photograph, which is the difference between a page and a
 * gallery of strangers' weddings.
 *
 * `ratio` is a *named* crop and every caller should choose it knowingly. Interior
 * heroes are full-bleed bands, so unlike every other image on the site they are
 * not shown at the photograph's own proportions — which means a portrait frame
 * dropped in here loses most of itself. Pass a landscape frame, or pass a taller
 * ratio for the frame you have.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  photo,
  meta,
  crumb,
  ratio = "16 / 9",
  inset = false,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  /** Hero photograph: archive fallback with a CMS asset when set. */
  photo: Photo;
  meta?: readonly { label: string; value: string }[];
  crumb: { name: string; to?: string }[];
  ratio?: string;
  /**
   * Inset image, for pages that do not need a full-bleed photograph.
   *
   * The default bleeds a 16:9 frame across the whole viewport, which is right
   * for a portfolio or a story but turns /contact — a page whose content is a
   * form — into two screens of photography before the form starts. Inset keeps
   * the frame inside the shell, caps its height, and gives it a hairline.
   */
  inset?: boolean;
}) {
  return (
    <header className="pt-16 lg:pt-20">
      <div className="shell-wide pb-10 sm:pb-14">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs mute">
            {crumb.map((item, index) => (
              <li key={item.name} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="gold">
                    /
                  </span>
                ) : null}
                {item.to && index < crumb.length - 1 ? (
                  <Link to={item.to} className="transition-colors hover:text-ink">
                    {item.name}
                  </Link>
                ) : (
                  <span aria-current={index === crumb.length - 1 ? "page" : undefined}>
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5">{eyebrow}</p>
            <h1 className="text-h1 max-w-[17ch]">{title}</h1>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5 lg:pb-2">
            <p className="lede">{lead}</p>
            {meta?.length ? (
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5">
                {meta.map((item) => (
                  <div key={item.label} className="flex min-w-0 flex-col gap-1">
                    <dt className="text-micro tracking-[0.18em] uppercase mute">{item.label}</dt>
                    {/* `break-words` matters here: a value like an email address
                        has no spaces, so its min-content width is the whole
                        string, and without this the two-column track is forced
                        wider than the viewport on a narrow phone. */}
                    <dd className="text-sm font-medium break-words">{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </div>

      {inset ? (
        <div className="shell pb-12 sm:pb-16">
          <div className="max-h-[22rem] overflow-hidden border border-line">
            <PhotoImage
              photo={photo}
              ratio="21 / 9"
              sizes="(min-width: 1024px) 68rem, 92vw"
              eager
            />
          </div>
        </div>
      ) : (
        <PhotoImage photo={photo} ratio={ratio} sizes="100vw" className="rounded-none" eager />
      )}
    </header>
  );
}
