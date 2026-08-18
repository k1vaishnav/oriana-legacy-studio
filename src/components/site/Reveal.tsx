import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "span" | "li" | "figure";
};

export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduced ? undefined : { opacity: 0, y: 26 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

type ImageRevealProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  ratio?: string;
  caption?: string;
  priority?: boolean;
  sizes?: string;
};

export function ImageReveal({
  src,
  alt,
  width,
  height,
  className = "",
  ratio = "4 / 5",
  caption,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ImageRevealProps) {
  const reduced = useReducedMotion();

  return (
    <figure className={className}>
      <motion.div
        className="group relative overflow-hidden bg-secondary"
        style={{ aspectRatio: ratio }}
        initial={reduced ? undefined : { clipPath: "inset(12% 12% 12% 12%)", opacity: 0.4 }}
        whileInView={reduced ? undefined : { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className="img-cover group-hover:scale-[1.035]"
        />
      </motion.div>
      {caption ? (
        <figcaption className="mt-3 text-xs tracking-[0.14em] uppercase text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
