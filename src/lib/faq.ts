export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Where is Oriana Weddings based?",
    a: "Oriana Weddings has its main office in Calicut, Kerala, and an office in Law Garden, Ahmedabad, Gujarat.",
  },
  {
    q: "Do you work outside Kerala and Gujarat?",
    a: "Yes. Oriana manages weddings across India as well as destination and international wedding shoots.",
  },
  {
    q: "Do I get to choose my photographer?",
    a: "Oriana retains the professional decision-making responsibility for selecting the photography and filmmaking team, based on your wedding requirements, style, experience, language, cultural understanding, professional qualities and expected output.",
  },
  {
    q: "Why don't you allow every client to select a specific photographer?",
    a: "A photographer's previous portfolio does not always show whether they are the right fit for a particular wedding today. Oriana selects based on current suitability, not simply an old portfolio or a personal connection.",
  },
  {
    q: "Can I show you photographs I like?",
    a: "Absolutely. References help us understand what you want and select the appropriate team.",
  },
  {
    q: "Will I communicate directly with the photographer?",
    a: "Your primary relationship remains with Oriana. The photographer interacts professionally during the event, while Oriana remains responsible for communication, coordination and agreed deliverables.",
  },
  {
    q: "What happens after the wedding?",
    a: "The photographer completes the assigned capture and submits the required work through the Oriana workflow. Your relationship continues directly with Oriana for post-production and final deliverables.",
  },
  {
    q: "Do I need to contact the photographer for my album or video?",
    a: "No. Your post-production and agreed deliverables are handled through Oriana.",
  },
  {
    q: "Do you offer confidential weddings?",
    a: "Yes, according to agreed requirements and terms. Your wedding does not have to become content.",
  },
  {
    q: "Do you offer intimate wedding photography?",
    a: "Yes. Intimate wedding photography is one of our core services.",
  },
  {
    q: "Do you provide candid and traditional photography?",
    a: "Yes, and they can be combined according to your requirements.",
  },
  {
    q: "Do you provide cinematic wedding films?",
    a: "Yes. Our film services include cinematic films, videography, teasers, highlights, storytelling films and reels.",
  },
  {
    q: "Do you charge additional amounts after booking?",
    a: "Our proposal clearly explains agreed services, deliverables and applicable terms. We aim to keep the commercial process transparent and avoid unexpected charges outside the agreed proposal.",
  },
  {
    q: "How do I get a quotation?",
    a: "Send your wedding date, venue, location, functions and required services. Our team will understand your requirements and prepare a suitable proposal.",
  },
];

export const faqSchema = (items: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});
