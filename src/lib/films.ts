import type { ImageKey } from "./image-manifest";

export type Film = {
  slug: string;
  title: string;
  location: string;
  duration: string;
  description: string;
  poster: ImageKey;
  /**
   * PLACEHOLDER MEDIA. The posters and ids below are frames from another
   * studio's public portfolio, used so the player, the layout and the film
   * section can be reviewed against real footage. They are not Oriana's work
   * and are not licensed for launch. Every poster and every id must be replaced
   * with the studio's own films before this site goes live — the copy, titles
   * and durations above are Oriana's and stay as they are.
   */
  vimeoId?: string | undefined;
};

/**
 * Wedding films.
 *
 * Each entry is a photograph with an optional player behind it. The poster is
 * what a visitor sees and what a search engine indexes; the Vimeo iframe is only
 * created after a click, so a page of four films costs four images and no
 * player JavaScript.
 */
export const films: Film[] = [
  {
    slug: "the-wedding-film",
    title: "The Wedding Film",
    location: "Kozhikode, Kerala",
    duration: "Feature · 12–20 min",
    description:
      "The full narrative of the day, edited as cinema — your voices, your vows, your people. This is the film the family gathers around.",
    poster: "film-zina-zoya",
    vimeoId: "758257831",
  },
  {
    slug: "the-teaser",
    title: "The Wedding Teaser",
    location: "Calicut, Kerala",
    duration: "Teaser · 60–90 sec",
    description:
      "A short, high-impact cut delivered within weeks of the wedding. Made to be shared from the car on the way home.",
    poster: "film-sid-saloni",
    vimeoId: "682018257",
  },
  {
    slug: "save-the-date",
    title: "Save-the-Date Film",
    location: "Wayanad, Kerala",
    duration: "Pre-wedding · 2–3 min",
    description:
      "Shot on location months before the day — mist over the tea estates, the two of you walking ahead. The announcement with intent.",
    poster: "film-alisha-rahul",
    vimeoId: "790541936",
  },
  {
    slug: "storytelling-film",
    title: "Storytelling Film",
    location: "Ahmedabad, Gujarat",
    duration: "Story · 5–8 min",
    description:
      "Films focused on emotion, people and personality rather than simply chronological coverage.",
    poster: "film-prerna-neelaabh",
    vimeoId: "459679250",
  },
  {
    slug: "highlights",
    title: "Highlight Film",
    location: "Kerala",
    duration: "Highlights · 3–4 min",
    description:
      "Documenting celebrations, ceremonies, family interactions and important moments with a cinematic visual approach.",
    poster: "film-tamanna-dan",
    vimeoId: "787844871",
  },
  {
    slug: "reels",
    title: "Reels & Social Cut",
    location: "India & worldwide",
    duration: "Reels · 15–60 sec",
    description:
      "Vertical cuts built for sharing, drawn from the same coverage as the feature film.",
    poster: "film-eshieta-sarthak",
    vimeoId: "895524845",
  },
];
