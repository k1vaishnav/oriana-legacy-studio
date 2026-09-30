/**
 * Monogram marks for the Oriana Group brands.
 *
 * These are the group's own brands, so a mark can be drawn for them. The press
 * wordmarks in PressStrip are the opposite case — those are other publishers'
 * trademarks, and that component deliberately falls back to typeset names
 * because we do not hold the artwork.
 *
 * The marks are generated from the brand name rather than drawn by hand, so all
 * six are the same drawing at the same size: a thin ring, the brand's
 * initials set in the display face, and a small laurel pair echoing the award
 * badges. One rule, six marks — a set that looks like a set.
 *
 * `aria-hidden` throughout: the brand name is written out immediately next to
 * every mark, so announcing the initials as well would just be noise.
 */

/** "Oriana Weddings" -> "OW", "Odonata Republic" -> "OR". */
function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return (words[0]![0]! + words[words.length - 1]![0]!).toUpperCase();
}

export function BrandMark({ name, className = "" }: { name: string; className?: string }) {
  const initials = initialsOf(name);

  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true" focusable="false">
      {/* The ring. */}
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />

      {/* Two laurel sprigs, mirrored — the same leaf language as the award
          badges, so the identity reads as one system. */}
      {[false, true].map((mirror) => (
        <g
          key={String(mirror)}
          transform={mirror ? "translate(64,0) scale(-1,1)" : undefined}
          fill="currentColor"
          opacity="0.5"
        >
          {[
            { deg: 200, r: 0.82 },
            { deg: 225, r: 0.86 },
            { deg: 250, r: 0.82 },
            { deg: 275, r: 0.78 },
          ].map((leaf) => {
            const rad = (leaf.deg * Math.PI) / 180;
            const cx = 32 + 30 * leaf.r * Math.cos(rad);
            const cy = 32 + 30 * leaf.r * Math.sin(rad);
            return (
              <ellipse
                key={leaf.deg}
                cx={cx}
                cy={cy}
                rx="2.4"
                ry="1.05"
                transform={`rotate(${leaf.deg + 90} ${cx} ${cy})`}
              />
            );
          })}
        </g>
      ))}

      {/* The initials. */}
      <text
        x="32"
        y="32"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-display)"
        fontSize={initials.length > 1 ? 19 : 23}
        letterSpacing="0.04em"
        fill="currentColor"
      >
        {initials}
      </text>
    </svg>
  );
}
