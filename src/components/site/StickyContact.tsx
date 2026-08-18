import { MessageCircle, Phone } from "lucide-react";

import { business, whatsappHref } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

export function StickyContact() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-border bg-background/95 backdrop-blur-sm lg:hidden">
      <a
        href={business.phoneHref}
        onClick={() => trackEvent("phone_click", { location: "sticky_mobile" })}
        className="flex items-center justify-center gap-2 border-r border-border py-4 text-[0.62rem] tracking-[0.24em] uppercase"
      >
        <Phone className="size-4" strokeWidth={1.2} /> Call
      </a>
      <a
        href={whatsappHref("Hello Oriana Weddings, I'd like to check your availability.")}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackEvent("whatsapp_click", { location: "sticky_mobile" })}
        className="flex items-center justify-center gap-2 py-4 text-[0.62rem] tracking-[0.24em] uppercase"
      >
        <MessageCircle className="size-4" strokeWidth={1.2} /> WhatsApp
      </a>
    </div>
  );
}
