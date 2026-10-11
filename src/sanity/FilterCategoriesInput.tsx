/**
 * The portfolio wall's per-photo filter checklist.
 *
 * The tick boxes follow the “Filter buttons” tab live: add a button row
 * (built-in or brand-new id) and its box appears here; delete a row and the
 * box disappears. An unedited button list shows the built-in seven.
 *
 * Ticks for a deleted filter are NOT erased: they stay stored on the photo
 * (shown below as a quiet note) and spring back the moment the filter row is
 * re-added. Deleting is hiding, never data loss.
 */
import { useEffect, useState } from "react";
import { PatchEvent, set, useClient, type ArrayOfPrimitivesInputProps } from "sanity";

const DEFAULT_FILTERS: readonly { value: string; title: string }[] = [
  { value: "candid", title: "Candid" },
  { value: "traditional", title: "Traditional" },
  { value: "intimate", title: "Intimate" },
  { value: "haldi", title: "Haldi & Mehendi" },
  { value: "christian", title: "Christian" },
  { value: "pre", title: "Pre-wedding" },
  { value: "venue", title: "Venues" },
];

export function FilterCategoriesInput(props: ArrayOfPrimitivesInputProps) {
  const { value, onChange, readOnly } = props;
  const client = useClient({ apiVersion: "2025-01-01" });
  // null = unedited/unknown → the built-in boxes (the website default).
  const [options, setOptions] = useState<readonly { value: string; title: string }[] | null>(null);

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
            (r): r is { id: string; label: string } =>
              !!r &&
              typeof (r as { id?: unknown }).id === "string" &&
              typeof (r as { label?: unknown }).label === "string",
          )
          .filter((r) => r.id !== "all")
          .map((r) => ({ value: r.id, title: r.label }));
        setOptions(list.length > 0 ? list : null);
      })
      .catch(() => {
        if (live) setOptions(null);
      });
    return () => {
      live = false;
    };
  }, [client]);

  const stored: string[] = Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string")
    : [];
  const boxes = options ?? DEFAULT_FILTERS;
  // Ticks whose filter was deleted: kept in storage, shown as a note, never
  // dropped by toggling the visible boxes.
  const hidden = stored.filter((v) => !boxes.some((o) => o.value === v));

  const toggle = (filterValue: string) => {
    if (readOnly) return;
    const next = stored.includes(filterValue)
      ? stored.filter((v) => v !== filterValue)
      : [...stored, filterValue];
    // Patches must travel as a PatchEvent — a bare patch object is ignored
    // by the form, which is exactly a checkbox that won't tick.
    onChange(PatchEvent.from(set(next)));
  };

  return (
    <div style={{ display: "grid", gap: "0.35rem", padding: "0.25rem 0" }}>
      {boxes.map((option) => (
        <label
          key={option.value}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.45rem 0.6rem",
            border: "1px solid var(--card-hairline-color, #e5e0d8)",
            borderRadius: "4px",
            cursor: readOnly ? "default" : "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={stored.includes(option.value)}
            disabled={readOnly}
            onChange={() => toggle(option.value)}
            style={{ width: "1rem", height: "1rem", accentColor: "#b08d57" }}
          />
          <span style={{ fontSize: "0.85rem" }}>{option.title}</span>
        </label>
      ))}
      {hidden.length > 0 ? (
        <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", opacity: 0.65 }}>
          Also ticked for a hidden filter: {hidden.join(", ")} — re-add that filter under “Filter
          buttons” and it applies again.
        </p>
      ) : null}
    </div>
  );
}
