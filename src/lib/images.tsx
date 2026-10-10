import type { CSSProperties } from "react";

import { getImage, srcSet, type ImageKey } from "./image-manifest";
import { assetWidths, cmsImageUrl, type CmsAsset } from "./sanity-image";
import type { Photo } from "./photos";

type CommonProps = {
  image: ImageKey;
  alt: string;
  /** Layout ratio, e.g. "4 / 5". Defaults to the photograph's own ratio. */
  // Declared as `| undefined` so callers can forward an optional ratio straight
  // through under exactOptionalPropertyTypes.
  ratio?: string | undefined;
  sizes?: string;
  className?: string;
  /** Classes for the `<img>` itself (layout shells that style the img directly). */
  imgClassName?: string;
  style?: CSSProperties | undefined;
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
  imgClassName = "",
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
        <source type="image/webp" srcSet={srcSet(image, "webp")} sizes={sizes} />
        <img
          src={entry.src}
          srcSet={srcSet(image, "jpeg")}
          sizes={sizes}
          alt={alt}
          width={entry.width}
          height={entry.height}
          decoding="async"
          loading="lazy"
          className={imgClassName}
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
        <source
          type="image/webp"
          srcSet={srcSet(props.image, "webp")}
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
          className={props.imgClassName ?? ""}
          ref={(node) => {
            if (node?.complete) node.classList.add("is-loaded");
          }}
          onLoad={(event) => event.currentTarget.classList.add("is-loaded")}
        />
      </picture>
    </div>
  );
}

export type PhotoImageProps = {
  photo: Photo;
  alt?: string | undefined;
  ratio?: string | undefined;
  sizes?: string;
  /** Classes for the shell box. Use `"contents"` to let a parent lay out the img directly. */
  className?: string;
  /** Classes for the `<img>` itself. */
  imgClassName?: string;
  style?: CSSProperties | undefined;
  zoom?: boolean;
  /** Above-the-fold: eager, synchronous decode, high fetch priority. */
  eager?: boolean;
};

/**
 * A photograph that may live in Sanity, in the local archive, or both.
 *
 * CMS asset present → Sanity CDN across the same width ladder, `auto=format`
 * negotiating AVIF/WebP per browser, the asset's blur-up placeholder behind
 * it. Otherwise (or when the CMS is unconfigured) → the local responsive
 * ladder. Same shell, same fade-in, same reserved space either way.
 */
export function PhotoImage({
  photo,
  alt,
  ratio,
  sizes = "100vw",
  className = "",
  imgClassName = "",
  style,
  zoom = false,
  eager = false,
}: PhotoImageProps) {
  const text = alt ?? photo.alt;
  const asset: CmsAsset | null = photo.asset ?? null;

  if (!asset) {
    if (!photo.key) return null;
    const shared = {
      image: photo.key,
      alt: text,
      ratio,
      sizes,
      className,
      imgClassName,
      style,
      zoom,
    };
    return eager ? <PriorityImage {...shared} /> : <ResponsiveImage {...shared} />;
  }

  const widths = assetWidths(asset);
  const src = (w: number) => cmsImageUrl(asset, w) ?? "";
  const lqip = asset.lqip ? `url("data:image/jpeg;base64,${asset.lqip}")` : undefined;

  return (
    <div
      className={`img-shell ${className}`.trim()}
      {...(zoom ? { "data-zoom": "" } : {})}
      style={{
        aspectRatio: ratio ?? `${asset.width} / ${asset.height}`,
        backgroundColor: "#e8e2d8",
        ...(lqip
          ? { backgroundImage: lqip, backgroundSize: "cover", backgroundPosition: "center" }
          : {}),
        ...style,
      }}
    >
      <picture>
        <img
          src={src(widths[widths.length - 1]!)}
          srcSet={widths.map((w) => `${src(w)} ${w}w`).join(", ")}
          sizes={sizes}
          alt={text}
          width={asset.width}
          height={asset.height}
          loading={eager ? "eager" : "lazy"}
          {...(eager
            ? { fetchPriority: "high" as const, decoding: "sync" as const }
            : { decoding: "async" as const })}
          className={imgClassName}
          ref={(node) => {
            if (node?.complete) node.classList.add("is-loaded");
          }}
          onLoad={(event) => event.currentTarget.classList.add("is-loaded")}
        />
      </picture>
    </div>
  );
}
