/**
 * The portfolio wall's per-photo filter checklist.
 *
 * A static `options.list` cannot follow the site: deleting a filter row in
 * "Filter labels" must also remove that tick box here, or the Studio keeps
 * offering a filter the website no longer has. So this input reads the live
 * "Filter labels" rows and renders exactly those tick boxes (plus nothing
 * when the list is unedited, which means "all seven" — the same default the
 * website uses).
 *
 * Ticks for a deleted filter are NOT erased: they stay stored on the photo
 * (shown below as a quiet note) and spring back the moment the filter row is
 * re-added. Deleting is hiding, never data loss.
 */
import { useEffect, useState } from "react";
import { PatchEvent, set, useClient, type ArrayOfPrimitivesInputProps } from "sanity";

const ALL_FILTERS: readonly { value: string; title: string }[] = [
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
  // null = unedited/unknown → show every tick box (the website default).
  const [keptIds, setKeptIds] = useState<string[] | null>(null);

  useEffect(() => {
    let live = true;
    client
      .fetch<string[] | null>(
        `*[_type == "portfolioPage" && _id == "portfolioPage"][0].filterLabels[].id`,
      )
      .then((ids) => {
        if (!live) return;
        setKeptIds(
          Array.isArray(ids) && ids.length > 0 ? ids.filter((id) => typeof id === "string") : null,
        );
      })
      .catch(() => {
        if (live) setKeptIds(null);
      });
    return () => {
      live = false;
    };
  }, [client]);

  const stored: string[] = Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string")
    : [];
  const options =
    keptIds === null ? ALL_FILTERS : ALL_FILTERS.filter((f) => keptIds.includes(f.value));
  // Ticks whose filter was deleted: kept in storage, shown as a note, never
  // dropped by toggling the visible boxes.
  const hidden = stored.filter((v) => !options.some((o) => o.value === v));

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
      {options.map((option) => (
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
          labels” and it applies again.
        </p>
      ) : null}
    </div>
  );
}
