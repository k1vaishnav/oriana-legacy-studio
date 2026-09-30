import { ResponsiveImage } from "@/lib/images";
import { Reveal } from "@/components/site/Reveal";
import { business } from "@/lib/site";
import type { ImageKey } from "@/lib/image-manifest";

/**
 * The people behind the studio.
 *
 * Magazine portraits, not a row of profile cards: each name and role is set
 * large in the serif and hangs beside or under the frame, offset from the
 * photograph rather than boxed with it. No badges, no bios, no avatar circles.
 *
 * The portraits are stand-ins until Oriana supplies the real ones — a
 * photography studio misrepresenting its own team is not a detail.
 *
 * Four 4:5 portraits in two columns, staggered by up to 8rem, took 2736px —
 * three screens to name four people. Four across, cropped a little shorter, with
 * the stagger trimmed to a couple of rems, says the same thing in under a third
 * of the height. The stagger stays because it is what makes the row read as
 * editorial rather than as a directory.
 */
type Member = {
  name: string;
  role: string;
  image: ImageKey;
  /** Which side the caption sits on at desktop. */
  align: "left" | "right";
  /** How far the portrait is dropped down the column, for the stagger. */
  offset: string;
};

const TEAM: Member[] = [
  {
    name: business.director,
    role: "Founder & Director",
    image: "portrait-groom-suit",
    align: "left",
    offset: "lg:mt-0",
  },
  {
    name: "Fathima Abdul Samad",
    role: "Photography",
    image: "portrait-bride-bouquet-smile",
    align: "right",
    offset: "lg:mt-10",
  },
  {
    name: "Ravi Malhotra",
    role: "Film & Cinematography",
    image: "portrait-formal-indoors",
    align: "left",
    offset: "lg:mt-6",
  },
  {
    name: "Vinesh Pandian",
    role: "Post-Production",
    image: "portrait-dance",
    align: "right",
    offset: "lg:mt-14",
  },
];

export function TeamEditorial() {
  return (
    <section className="section surface-cream" aria-labelledby="team-heading">
      <div className="shell">
        <Reveal>
          <h2 id="team-heading" className="text-h2 max-w-[12ch]">
            Meet the team
          </h2>
          <p className="mt-6 max-w-[52ch] text-mute">
            The people you are trusting with a day that cannot be repeated. You meet them before the
            wedding, and the same team photographs it.
          </p>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
          {TEAM.map((member, i) => (
            <Reveal key={member.name} delay={(i % 4) * 0.06} className={member.offset}>
              <li>
                <figure>
                  <ResponsiveImage
                    image={member.image}
                    alt={`${member.name}, ${member.role} at Oriana Weddings`}
                    ratio="3 / 4"
                    sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
                    zoom
                  />
                  <figcaption className="mt-4 flex flex-col gap-1">
                    <span className="font-display text-base leading-snug text-ink">
                      {member.name}
                    </span>
                    <span className="text-micro uppercase text-mute">{member.role}</span>
                  </figcaption>
                </figure>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
