export type Film = {
  slug: string;
  title: string;
  location: string;
  duration: string;
  description: string;
  /** YouTube thumbnail stills + the film's YouTube id. */
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
 * the film's own YouTube thumbnail served from Google's image CDN
 * (`i.ytimg.com`), so a page of films costs remote images and no player
 * JavaScript — and no local poster files that can drift out of sync. The
 * YouTube iframe is only created after a click, keeping the same box so
 * nothing on the page moves.
 */
const yt = (youtubeId: string) => ({
  poster: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  posterSrcSet:
    `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg 320w, ` +
    `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg 480w`,
  posterWidth: 480,
  posterHeight: 360,
});

export const films: Film[] = [
  {
    slug: "the-wedding-film",
    title: "The Wedding Film",
    location: "Kozhikode, Kerala",
    duration: "Feature · 12–20 min",
    description:
      "The full narrative of the day, edited as cinema — your voices, your vows, your people. This is the film the family gathers around.",
    ...yt("35c2JPyf90I"),
    youtubeId: "35c2JPyf90I",
  },
  {
    slug: "the-teaser",
    title: "The Wedding Teaser",
    location: "Calicut, Kerala",
    duration: "Teaser · 60–90 sec",
    description:
      "A short, high-impact cut delivered within weeks of the wedding. Made to be shared from the car on the way home.",
    ...yt("znvVRN1awcc"),
    youtubeId: "znvVRN1awcc",
  },
  {
    slug: "save-the-date",
    title: "Save-the-Date Film",
    location: "Wayanad, Kerala",
    duration: "Pre-wedding · 2–3 min",
    description:
      "Shot on location months before the day — mist over the tea estates, the two of you walking ahead. The announcement with intent.",
    ...yt("LD7Z8_gTSH8"),
    youtubeId: "LD7Z8_gTSH8",
  },
  {
    slug: "storytelling-film",
    title: "Storytelling Film",
    location: "Ahmedabad, Gujarat",
    duration: "Story · 5–8 min",
    description:
      "Films focused on emotion, people and personality rather than simply chronological coverage.",
    ...yt("bF1HWBMYiqk"),
    youtubeId: "bF1HWBMYiqk",
  },
  {
    slug: "highlights",
    title: "Highlight Film",
    location: "Kerala",
    duration: "Highlights · 3–4 min",
    description:
      "Documenting celebrations, ceremonies, family interactions and important moments with a cinematic visual approach.",
    ...yt("Be-OFEhGUxQ"),
    youtubeId: "Be-OFEhGUxQ",
  },
  {
    slug: "reels",
    title: "Reels & Social Cut",
    location: "India & worldwide",
    duration: "Reels · 15–60 sec",
    description:
      "Vertical cuts built for sharing, drawn from the same coverage as the feature film.",
    ...yt("GZiu5-_Zwkw"),
    youtubeId: "GZiu5-_Zwkw",
  },
  {
    slug: "arun-diana",
    title: "Arun & Diana",
    location: "Kerala",
    duration: "Feature",
    description:
      "A full Kerala wedding story — the ceremony, the family and the celebration, edited as cinema.",
    ...yt("kdRKkLJkZgI"),
    youtubeId: "kdRKkLJkZgI",
  },
  {
    slug: "sangeeth-sruthi",
    title: "Sangeeth & Sruthi",
    location: "Kerala",
    duration: "Feature",
    description: "Their wedding day told end to end — quiet moments and loud celebrations alike.",
    ...yt("YMOYz-KhvEQ"),
    youtubeId: "YMOYz-KhvEQ",
  },
  {
    slug: "rarun-amisha",
    title: "Rarun & Amisha",
    location: "Kerala",
    duration: "Feature",
    description: "A Kerala wedding film — vows, rituals and the people who made the day.",
    ...yt("UrGMsSwgdKE"),
    youtubeId: "UrGMsSwgdKE",
  },
  {
    slug: "manish-kritika-pre-wedding",
    title: "Manish & Kritika",
    location: "Pre-wedding",
    duration: "Pre-wedding documentary",
    description: "A pre-wedding documentary — their story, in their own words and places.",
    ...yt("1N3foXgTtHo"),
    youtubeId: "1N3foXgTtHo",
  },
];
