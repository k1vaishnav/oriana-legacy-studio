import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { seo } from "@/lib/seo";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { business, offices, whatsappHref } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () =>
    seo({
      title:
        "Contact the Best Photographer in Calicut | Contact the Best Photographer in Kerala | Oriana Weddings",
      description:
        "Contact Oriana Weddings for wedding photography, videography and cinematic wedding films in Calicut, Kerala, Ahmedabad, Gujarat, India and destination locations.",
      path: "/contact",
    }),
  component: ContactPage,
});

/**
 * Contact.
 *
 * The shortest path on the site, so it has the fewest things in front of it.
 *
 * This page carried three large statements before anyone could type anything: a
 * full-bleed photograph, a display-size hero title, and then a second
 * display-size title belonging to the form itself. A visitor who came to type a
 * wedding date scrolled past all three first. There was also a "three ways to
 * reach us" band, which is a reasonable idea and was doing nothing here — every
 * channel it offered is still in the aside and in the pinned mobile bar, one
 * scroll away instead of one screen away.
 *
 * So: one heading at text size, then the form. The photograph is gone rather
 * than moved; nothing about filling in a form needs a background image, and
 * removing it took a full screen out of the shortest route to an enquiry.
 *
 * The other structural fixes:
 *
 *   - The reassurance used to sit as an abstract three-step band above the
 *     form. It now sits next to the send button, where it can actually change a
 *     decision.
 *   - A couple handing over their wedding date is trusting a stranger with the
 *     biggest day of their life. "No payment, no obligation" belongs at the
 *     moment of that decision, not in a band two screens earlier.
 *   - On a phone the page is long and the form is at the end of it, so the
 *     call and WhatsApp actions are pinned to the bottom of the viewport. No
 *     one should have to scroll to the end of a form to find out they could
 *     have just rung.
 */

/** What Oriana does with an enquiry. Reassurance, not a process diagram. */
const NEXT_STEPS = [
  {
    step: "01",
    title: "We read it ourselves",
    body: "Your enquiry goes to the studio, not to a form inbox that nobody opens until Monday.",
  },
  {
    step: "02",
    title: "We reply with a plan",
    body: "You get an honest answer about whether we are the right studio for your date — including when we are not.",
  },
  {
    step: "03",
    title: "Nothing is locked in",
    body: "No payment to begin a conversation. We send a proposal you can read properly before you decide anything.",
  },
];

function ContactPage() {
  /*
   * The mobile action bar is fixed to the viewport, so it ends up on top of
   * whatever sits at the bottom of the document — which is the footer's phone
   * number and social links. The footer is rendered by the root layout, after
   * this page, so this page cannot pad it directly. Setting a flag on <body>
   * and letting the stylesheet do the padding is the one place both can meet.
   */
  useEffect(() => {
    document.body.dataset["pinnedActions"] = "true";
    return () => {
      delete document.body.dataset["pinnedActions"];
    };
  }, []);

  return (
    <>
      {/*
        No hero photograph and no hero headline.

        This page used to open on a full-bleed image and a display-size title,
        then open the form under a second display-size title of its own — two
        large statements in a row, both of them about the studio rather than
        about the form. Someone who came to type a date had to scroll past both
        before reaching a single input, on a page whose only job is that input.

        So the heading is now one line at text size, and the form is the first
        thing on the page. The photograph is gone rather than moved: nothing
        about a contact form needs a background image, and dropping it takes a
        full screen of scrolling out of the shortest path to an enquiry.
      */}
      <section className="surface-cream pt-14 pb-4 sm:pt-20" aria-labelledby="contact-heading">
        <div className="shell">
          <p className="eyebrow">Contact</p>
          <h1 id="contact-heading" className="mt-4 max-w-[24ch] font-display text-h2 text-ink">
            Tell us the date. We will tell you the rest.
          </h1>
          <p className="lede mt-4">
            Write what you know and leave the rest blank. We read every enquiry ourselves and reply
            the same day, usually the same evening.
          </p>
        </div>
      </section>

      {/* The form first, on white. The page ground is cream; the card is the
          one true white on the site, which is exactly what a panel of inputs
          wants to be — paper on a spread. */}
      {/* Bottom padding clears the pinned call/WhatsApp bar on phones. */}
      <section id="enquiry" className="surface-cream pb-32 sm:pb-20">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <EnquiryForm />

            {/*
              Where we are, on the left under the form.

              It used to sit at the bottom of the right-hand column, so a visitor
              reading top to bottom met the addresses last, after a block of
              reassurance text that was about the studio's process rather than
              about the place. Addresses are the other half of "how do I reach
              you", and they belong with the form that starts the enquiry.

              The box repeats the form's own card — same border, radius, ground
              and padding — so the two panels line up edge to edge and the page
              reads as one column with a form in it and a card under it, rather
              than a form and a stray list of addresses.

              Two offices, two columns. Stacked full height in a seven-column
              measure they leave a long ragged gap next to the sidebar, and the
              city names were being set in a class the type ramp does not
              define, so they inherited body size and read as captions rather
              than as the headings they are.
            */}
            <div className="mt-10 lg:mt-12">
              <div className="rounded-card border border-line bg-bone p-6 sm:p-9">
                <p className="eyebrow">Where we are</p>
                <h2 className="mt-4 max-w-[28ch] font-display text-h3 leading-[1.15] text-ink">
                  Two offices. One studio, whichever one you visit.
                </h2>

                <dl className="mt-8 grid gap-9 sm:grid-cols-2 sm:gap-12">
                  {offices.map((office) => (
                    <div key={office.city}>
                      <dd className="font-display text-h3 leading-[1.1] tracking-[-0.015em] text-ink">
                        {office.city}
                      </dd>
                      <dt className="mt-3 text-sm leading-relaxed text-mute">{office.role}</dt>
                      <dd className="mt-4 text-base leading-relaxed text-mute">
                        {office.street}
                        <br />
                        {office.postcode}
                      </dd>
                      <dd className="mt-4">
                        <a href={office.phoneHref} className="link text-base text-ink">
                          {office.phone}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            {/* WhatsApp first and loudest, because on the other side of this
                form is a real studio that answers messages. A visitor who
                would rather talk than type should not have to scroll. */}
            <div className="rounded-card border border-ink bg-bone p-7">
              <p className="eyebrow">Faster than the form</p>
              <p className="mt-5 max-w-[30ch] font-display text-h3 leading-[1.15] text-ink">
                Message us on WhatsApp.
              </p>
              <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-mute">
                One message is enough — send the date, or a voice note, or nothing more than
                &ldquo;are you free in February&rdquo;. We read them ourselves.
              </p>
              <a
                href={whatsappHref("Hi Oriana, I'd like to talk about my wedding.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ink mt-7 w-full justify-center"
              >
                Open WhatsApp
              </a>
              <div className="mt-6 border-t border-line pt-5">
                <a
                  href={business.phoneHref}
                  className="flex items-baseline justify-between gap-4 text-sm text-ink"
                >
                  <span className="text-mute">Or call the studio</span>
                  <span className="underline decoration-line underline-offset-4 transition-colors hover:decoration-ink">
                    {business.phone}
                  </span>
                </a>
              </div>
            </div>

            <p className="eyebrow mt-12">What happens next</p>

            <ol className="mt-6 flex flex-col gap-6">
              {NEXT_STEPS.map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span className="tabular shrink-0 pt-0.5 text-xs gold">{item.step}</span>
                  <span>
                    <span className="block text-sm font-medium text-ink">{item.title}</span>
                    <span className="mt-1 block max-w-[34ch] text-sm leading-relaxed text-mute">
                      {item.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <ClosingCTA />

      {/*
        Pinned actions on small screens only.

        The form is the last thing on a long page. Without this, a visitor who
        changed their mind halfway down — or who never scrolled that far —
        has no way to reach a human that does not involve more scrolling.
      */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-sm sm:hidden">
        <div className="grid grid-cols-2 gap-px bg-line">
          <a
            href={business.phoneHref}
            className="flex items-center justify-center gap-2 bg-paper px-4 py-4 text-sm text-ink"
          >
            Call
            <span className="text-xs text-mute">{business.phone}</span>
          </a>
          <a
            href={whatsappHref("Hi Oriana, I would like to ask about my wedding.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-ink px-4 py-3.5 text-sm text-paper"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
