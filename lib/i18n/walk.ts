// Which strings in the site's data are text to translate. Shared by the site (lib/i18n/server.ts)
// and the string extractor (scripts/i18n.mjs), so both see exactly the same strings.
// This file must not import anything: the extractor loads it directly with Node.

/** Keys whose values are never translated: identifiers, paths, codes, people's names and licences. */
export const KEEP = new Set([
  "slug", "symbol", "src", "img", "image", "href", "licenseUrl", "license", "source", "credit", "date", "year",
  "n", "id", "email", "phone", "brand", "logo", "tiles", "elements", "programmes", "side", "lat", "lon", "z", "meltingC", "density",
]);

/** Returns a copy of `value` with every translatable string passed through `f`. Arrays keep their parent's key. */
export function mapStrings<T>(value: T, f: (s: string) => string, key?: string): T {
  if (key !== undefined && KEEP.has(key)) return value;
  if (typeof value === "string") return f(value) as T;
  if (Array.isArray(value)) return value.map((v) => mapStrings(v, f, key)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapStrings(v, f, k)])) as T;
  }
  return value;
}
