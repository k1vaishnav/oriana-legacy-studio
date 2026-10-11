/**
 * The portfolio wall, managed filter by filter.
 *
 * The wall itself stays the default list below ("All photos" — add new,
 * replace, reorder, captions). Above it, this input renders one section per
 * filter button: the photos inside it, a ✕ on each to take it out, and a row
 * of the wall photos not yet in it with ＋ to put them in. Ticking here and
 * ticking inside a photo are the same stored value, both ways, instantly.
 *
 * Sections follow the “Filter buttons” tab live: add a row there (any id)
 * and its section appears here; delete a row and the section — and the
 * website button — disappear, while the photos' stored ticks are kept.
 */
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { PatchEvent, set, useClient, type ArrayOfObjectsInputProps } from "sanity";

type WallItem = {
  _key: string;
  photo?: { asset?: { _ref?: string } } | null;
  caption?: string;
  categories?: unknown;
};

type FilterRow = { id: string; label: string };

const DEFAULT_FILTERS: readonly FilterRow[] = [
  { id: "candid", label: "Candid" },
  { id: "traditional", label: "Traditional" },
  { id: "intimate", label: "Intimate" },
  { id: "haldi", label: "Haldi & Mehendi" },
  { id: "christian", label: "Christian" },
  { id: "pre", label: "Pre-wedding" },
  { id: "venue", label: "Venues" },
];

const catsOf = (item: WallItem): string[] =>
  Array.isArray(item.categories)
    ? item.categories.filter((c): c is string => typeof c === "string")
    : [];

export function PortfolioWallInput(props: ArrayOfObjectsInputProps) {
  const { value, onChange, readOnly, renderDefault } = props as ArrayOfObjectsInputProps & {
    renderDefault: (p: ArrayOfObjectsInputProps) => ReactNode;
  };
  const client = useClient({ apiVersion: "2025-01-01" });
  // null = unedited/unknown → the built-in filters (the website default).
  const [filterRows, setFilterRows] = useState<FilterRow[] | null>(null);

  useEffect(() => {
    let live = true;
    client
      .fetch<unknown>(
        `*[_type == "portfolioPage" && _id == "portfolioPage"][0].filterLabels[]{id, label}`,
      )
      .then((rows) => {
        if (!live) return;
        const list = (Array.isArray(rows) ? rows : [])
          .filter(
            (r): r is FilterRow =>
              !!r &&
              typeof (r as FilterRow).id === "string" &&
              typeof (r as FilterRow).label === "string",
          )
          .filter((r) => r.id !== "all");
        setFilterRows(list.length > 0 ? list : null);
      })
      .catch(() => {
        if (live) setFilterRows(null);
      });
    return () => {
      live = false;
    };
  }, [client]);

  const items: WallItem[] = useMemo(
    () => (Array.isArray(value) ? (value as WallItem[]).filter((i) => i && i._key) : []),
    [value],
  );

  const projectId = client.config().projectId as string | undefined;
  const dataset = client.config().dataset as string | undefined;
  const thumb = (item: WallItem): string | null => {
    try {
      const ref = item.photo?.asset?._ref;
      if (!ref || !projectId || !dataset) return null;
      return imageUrlBuilder({ projectId, dataset })
        .image({ _type: "image", asset: { _type: "reference", _ref: ref } } as never)
        .width(240)
        .auto("format")
        .url();
    } catch {
      return null;
    }
  };

  const writeAll = (next: WallItem[]) => {
    if (readOnly) return;
    onChange(PatchEvent.from(set(next)));
  };
  const setTicks = (key: string, nextCats: string[]) => {
    writeAll(items.map((i) => (i._key === key ? { ...i, categories: nextCats } : i)));
  };

  const filters = filterRows ?? [...DEFAULT_FILTERS];
  const captionOf = (item: WallItem, index: number) =>
    item.caption && item.caption.trim() !== "" ? item.caption : `Photo ${index + 1}`;

  const card: CSSProperties = {
    position: "relative",
    width: "5.5rem",
    border: "1px solid var(--card-hairline-color, #e5e0d8)",
    borderRadius: "4px",
    overflow: "hidden",
    background: "#f4f1ec",
  };

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {filters.map((filter) => {
        const inside = items.filter((i) => catsOf(i).includes(filter.id));
        const outside = items.filter((i) => !catsOf(i).includes(filter.id));
        return (
          <section
            key={filter.id}
            style={{
              border: "1px solid var(--card-hairline-color, #e5e0d8)",
              borderRadius: "6px",
              padding: "0.75rem",
            }}
          >
            <h4 style={{ margin: "0 0 0.15rem", fontSize: "0.9rem" }}>{filter.label}</h4>
            <p style={{ margin: "0 0 0.6rem", fontSize: "0.75rem", opacity: 0.65 }}>
              {inside.length === 0
                ? "No photos yet — add some below."
                : `${inside.length} photo${inside.length === 1 ? "" : "s"} on the website under this button.`}
            </p>
            {inside.length > 0 ? (
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.6rem" }}
              >
                {inside.map((item) => {
                  const src = thumb(item);
                  return (
                    <div key={item._key} style={card} title={captionOf(item, items.indexOf(item))}>
                      {src ? (
                        <img
                          src={src}
                          alt=""
                          style={{
                            display: "block",
                            width: "100%",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div style={{ aspectRatio: "1 / 1" }} />
                      )}
                      <button
                        type="button"
                        disabled={readOnly}
                        aria-label={`Remove from ${filter.label}`}
                        onClick={() =>
                          setTicks(
                            item._key,
                            catsOf(item).filter((c) => c !== filter.id),
                          )
                        }
                        style={{
                          position: "absolute",
                          top: "2px",
                          right: "2px",
                          width: "1.35rem",
                          height: "1.35rem",
                          borderRadius: "50%",
                          border: "1px solid #fff",
                          background: "rgba(30,25,20,0.8)",
                          color: "#fff",
                          fontSize: "0.8rem",
                          lineHeight: 1,
                          cursor: readOnly ? "default" : "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {outside.length > 0 && !readOnly ? (
              <details>
                <summary style={{ fontSize: "0.8rem", cursor: "pointer" }}>
                  ＋ Add photos to {filter.label} ({outside.length} on the wall)
                </summary>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}
                >
                  {outside.map((item) => {
                    const src = thumb(item);
                    return (
                      <button
                        key={item._key}
                        type="button"
                        title={captionOf(item, items.indexOf(item))}
                        onClick={() => setTicks(item._key, [...catsOf(item), filter.id])}
                        style={{
                          ...card,
                          padding: 0,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {src ? (
                          <img
                            src={src}
                            alt=""
                            style={{
                              display: "block",
                              width: "100%",
                              aspectRatio: "1 / 1",
                              objectFit: "cover",
                              opacity: 0.75,
                            }}
                          />
                        ) : (
                          <div style={{ aspectRatio: "1 / 1" }} />
                        )}
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.4rem",
                            color: "#fff",
                            textShadow: "0 1px 6px rgba(0,0,0,0.7)",
                          }}
                          aria-hidden="true"
                        >
                          ＋
                        </span>
                      </button>
                    );
                  })}
                </div>
              </details>
            ) : null}
          </section>
        );
      })}

      <section>
        <h4 style={{ margin: "0 0 0.15rem", fontSize: "0.9rem" }}>
          All photos ({items.length} on the wall)
        </h4>
        <p style={{ margin: "0 0 0.6rem", fontSize: "0.75rem", opacity: 0.65 }}>
          Everything lives here, in wall order — add new photos, replace one, reorder, or edit
          captions. Use the sections above to put photos into filters.
        </p>
        {renderDefault(props)}
      </section>
    </div>
  );
}
