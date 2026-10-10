/**
 * Image-key inputs with live thumbnails.
 *
 * CMS image fields hold keys into the site's own 30-frame archive — picking
 * from a blind text dropdown is miserable, so these wrap the default input
 * (unchanged behaviour: options, validation, focus, read-only) and pin the
 * actual photograph underneath it. The Studio is served from the same domain
 * as the site, so the thumbnails are just the site's own `-480.jpg`
 * derivatives — no uploads, no extra requests that matter.
 */
import { useState } from "react";
import type { InputProps, StringInputProps } from "sanity";

const thumb = (key: string) => `/img/${key}-480.jpg`;

function Thumb({ imageKey, size = 96 }: { imageKey: string; size?: number }) {
  const [broken, setBroken] = useState(false);
  if (!imageKey || broken) return null;
  return (
    <img
      src={thumb(imageKey)}
      alt=""
      width={size}
      height={Math.round((size * 3) / 4)}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
      style={{
        width: size,
        height: Math.round((size * 3) / 4),
        objectFit: "cover",
        borderRadius: 4,
        border: "1px solid var(--card-hairline-color, #e5e2dc)",
        background: "#f4f1ea",
      }}
    />
  );
}

/** Single photograph field: default dropdown + its picture below. */
export function ImageKeyInput(props: StringInputProps) {
  return (
    <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
      {props.renderDefault(props)}
      {props.value ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Thumb imageKey={props.value} />
          <code style={{ fontSize: 12, opacity: 0.75 }}>{props.value}</code>
        </div>
      ) : (
        <span style={{ fontSize: 12, opacity: 0.6 }}>No photograph selected.</span>
      )}
    </div>
  );
}

/** Photograph-list field: default list editor + a thumbnail strip below. */
export function ImageKeysInput(props: InputProps) {
  const raw = (props as { value?: unknown }).value;
  const keys = (Array.isArray(raw) ? raw : []).filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );
  return (
    <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
      {props.renderDefault(props)}
      {keys.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {keys.map((key) => (
            <Thumb key={key} imageKey={key} size={72} />
          ))}
        </div>
      ) : (
        <span style={{ fontSize: 12, opacity: 0.6 }}>No photographs selected.</span>
      )}
    </div>
  );
}
