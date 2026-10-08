export type Film = {
  slug: string;
  title: string;
  location: string;
  duration: string;
  description: string;
  /** Real Oriana work: YouTube thumbnail stills + the film's YouTube id. */
  poster: string;
  posterSrcSet: string;
  posterWidth: number;
  posterHeight: number;
  youtubeId?: string | undefined;
};

/**
 * Wedding films — real Oriana work from the studio's own YouTube channel.
 *
 * Each entry is a photograph with an optional player behind it. The poster is
 * what a visitor sees and what a search engine indexes; the YouTube iframe is
 * only created after a click, so a page of films costs images and no player
 * JavaScript.
 */
const yt = (name: string, width = 1280, height = 720) => ({
  poster: `/img/${name}.jpg`,
  posterSrcSet: `/img/${name}-480.jpg 480w, /img/${name}-800.jpg 800w`,
  posterWidth: width,
  posterHeight: height,
});

export const films: Film[] = [
  {
    slug: "the-wedding-film",
    title: "The Wedding Film",
    location: "Kozhikode, Kerala",
    duration: "Feature · 12–20 min",
    description:
      "The full narrative of the day, edited as cinema — your voices, your vows, your people. This is the film the family gathers around.",
    ...yt("yt-we-became-one"),
    youtubeId: "35c2JPyf90I",
  },
  {
    slug: "the-teaser",
    title: "The Wedding Teaser",
    location: "Calicut, Kerala",
    duration: "Teaser · 60–90 sec",
    description:
      "A short, high-impact cut delivered within weeks of the wedding. Made to be shared from the car on the way home.",
    ...yt("yt-haripriya-glimpse"),
    youtubeId: "znvVRN1awcc",
  },
  {
    slug: "save-the-date",
    title: "Save-the-Date Film",
    location: "Wayanad, Kerala",
    duration: "Pre-wedding · 2–3 min",
    description:
      "Shot on location months before the day — mist over the tea estates, the two of you walking ahead. The announcement with intent.",
    ...yt("yt-save-the-date-chennai"),
    youtubeId: "LD7Z8_gTSH8",
  },
  {
    slug: "storytelling-film",
    title: "Storytelling Film",
    location: "Ahmedabad, Gujarat",
    duration: "Story · 5–8 min",
    description:
      "Films focused on emotion, people and personality rather than simply chronological coverage.",
    ...yt("yt-kerala-wedding"),
    youtubeId: "bF1HWBMYiqk",
  },
  {
    slug: "highlights",
    title: "Highlight Film",
    location: "Kerala",
    duration: "Highlights · 3–4 min",
    description:
      "Documenting celebrations, ceremonies, family interactions and important moments with a cinematic visual approach.",
    ...yt("yt-vyshnavi-wedding"),
    youtubeId: "Be-OFEhGUxQ",
  },
  {
    slug: "reels",
    title: "Reels & Social Cut",
    location: "India & worldwide",
    duration: "Reels · 15–60 sec",
    description:
      "Vertical cuts built for sharing, drawn from the same coverage as the feature film.",
    ...yt("yt-mehndi-day"),
    youtubeId: "GZiu5-_Zwkw",
  },
];
