import type { CSSProperties } from "react";

import { getImage, srcSet, type ImageKey } from "./image-manifest";

type CommonProps = {
  image: ImageKey;
  alt: string;
  /** Layout ratio, e.g. "4 / 5". Defaults to the photograph's own ratio. */
  // Declared as `| undefined` so callers can forward an optional ratio straight
  // through under exactOptionalPropertyTypes.
  ratio?: string | undefined;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  /** Opt-in slow zoom on load / hover. Used to give a wall of images some life. */
  zoom?: boolean;
};

export type ResponsiveImageProps = CommonProps;

/**
 * The one `<img>` this site uses.
 *
 * AVIF, then WebP, then progressive JPEG, across a width ladder generated at
 * build time. The box is sized from the manifest so space is reserved before a
 * single byte arrives, and a blurred 20px placeholder in the photograph's own
 * dominant colour sits behind it — inlined as a data URI, so it costs no request.
 *
 * The box defaults to the photograph's *own* ratio, which is the whole point:
 * `object-fit: cover` in a box that already matches the source cannot crop
 * anything. A wedding photograph is never sliced to fit a layout box on this
 * site. Callers that want a crop have to ask for one by name.
 */
export function ResponsiveImage({
  image,
  alt,
  ratio,
  sizes = "100vw",
  className = "",
  style,
  zoom = false,
}: ResponsiveImageProps) {
  const entry = getImage(image);

  return (
    <div
      className={`img-shell ${className}`.trim()}
      {...(zoom ? { "data-zoom": "" } : {})}
      style={{
        aspectRatio: ratio ?? `${entry.width} / ${entry.height}`,
        backgroundColor: entry.color,
        backgroundImage: `url("${entry.lqip}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...style,
      }}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet(image, "avif")} sizes={sizes} />
        <img
          src={entry.src}
          srcSet={srcSet(image, "jpeg")}
          sizes={sizes}
          alt={alt}
          width={entry.width}
          height={entry.height}
          decoding="async"
          loading="lazy"
          ref={(node) => {
            // A warm cache can finish decoding before React attaches onLoad.
            if (node?.complete) node.classList.add("is-loaded");
          }}
          onLoad={(event) => event.currentTarget.classList.add("is-loaded")}
        />
      </picture>
    </div>
  );
}

/**
 * Above-the-fold image. Identical to `ResponsiveImage` except that it is never
 * lazy and asks the browser to prioritise it — the hero is the LCP element on
 * every route, and lazy-loading it would delay the largest paint by design.
 */
export function PriorityImage(props: ResponsiveImageProps) {
  const entry = getImage(props.image);

  return (
    <div
      className={`img-shell ${props.className ?? ""}`.trim()}
      {...(props.zoom ? { "data-zoom": "" } : {})}
      style={{
        aspectRatio: props.ratio ?? `${entry.width} / ${entry.height}`,
        backgroundColor: entry.color,
        backgroundImage: `url("${entry.lqip}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...props.style,
      }}
    >
      <picture>
        <source
          type="image/avif"
          srcSet={srcSet(props.image, "avif")}
          sizes={props.sizes ?? "100vw"}
        />
        <img
          src={entry.src}
          srcSet={srcSet(props.image, "jpeg")}
          sizes={props.sizes ?? "100vw"}
          alt={props.alt}
          width={entry.width}
          height={entry.height}
          fetchPriority="high"
          decoding="sync"
          loading="eager"
          ref={(node) => {
            if (node?.complete) node.classList.add("is-loaded");
          }}
          onLoad={(event) => event.currentTarget.classList.add("is-loaded")}
        />
      </picture>
    </div>
  );
}
