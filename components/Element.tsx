import { atomicNumber } from "@/lib/elements";

// The periodic-table tile: Bimo Materials' own mark.
export default function Element({ symbol, size, dark, z }: { symbol: string; size?: "sm" | "lg"; dark?: boolean; z?: number | null }) {
  // z === null: an alloy, so no atomic number on the tile.
  const n = z === null ? undefined : (z ?? atomicNumber(symbol));
  const cls = ["el", size ? `el--${size}` : "", dark ? "el--dark" : ""].join(" ");
  return (
    <span className={cls} aria-hidden="true">
      <small>{n ?? " "}</small>
      <b>{symbol}</b>
    </span>
  );
}
