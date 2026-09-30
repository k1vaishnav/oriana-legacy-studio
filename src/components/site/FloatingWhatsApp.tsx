import { useEffect, useState } from "react";

import { business, whatsappHref } from "@/lib/site";

/**
 * Two conversion affordances that follow the visitor without following them
 * off-screen: a desktop WhatsApp pill, and a mobile bar that splits the two
 * things a couple actually does next — call, or message.
 *
 * Both stay out of the way. The pill appears only after the hero has been
 * scrolled past, and the mobile bar yields to the footer so it can never cover
 * the enquiry form.
 */
export function FloatingWhatsApp() {
  const [past, setPast] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setPast(window.scrollY > window.innerHeight * 0.75);
      // A few pixels of slack so the bar clears the footer exactly.
      setAtBottom(window.innerHeight + window.scrollY >= document.body.scrollHeight - 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href={whatsappHref("Hi Oriana, I'd like to talk about my wedding.")}
        target="_blank"
        rel="noreferrer noopener"
        className={`btn btn-ink fixed right-5 bottom-5 z-40 hidden shadow-none transition-all duration-500 hover:btn-ink-hover lg:inline-flex ${
          past && !atBottom
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
        aria-label="Message Oriana on WhatsApp"
      >
        <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden="true">
          <path d="M8 0a8 8 0 0 0-6.9 12L0 16l4.1-1.1A8 8 0 1 0 8 0Zm4.6 11.3c-.2.6-1.1 1.1-1.5 1.1-.4.1-1 .1-1.6-.1a11 11 0 0 1-1.7-.6 12 12 0 0 1-3.9-3.5c-.3-.4-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6a8 8 0 0 0 1.5 1.9 7 7 0 0 0 2 1.3c.3.1.5.1.6 0l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .1 0 .6-.1 1Z" />
        </svg>
        WhatsApp
      </a>

      {/* Mobile: call and message, splitting the width evenly. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-paper/95 backdrop-blur-sm transition-transform duration-500 lg:hidden ${
          atBottom ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <a
          href={business.phoneHref}
          className="flex items-center justify-center gap-2 py-3.5 text-sm font-medium"
        >
          Call
        </a>
        <a
          href={whatsappHref("Hi Oriana, I'd like to talk about my wedding.")}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center justify-center gap-2 bg-ink py-3.5 text-sm font-medium text-paper"
        >
          WhatsApp
        </a>
      </div>
    </>
  );
}
