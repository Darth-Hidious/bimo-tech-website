// Catalog search that forgives how people type: case, accents (molybdan finds Molybdän), full-width
// and half-width characters (ＴＺＭ, ﾀﾝｸﾞｽﾃﾝ), trade marks (Inconel 625 finds Inconel® 625), hyphens
// (rcc m finds RCC-M) and subscripts (Al2O3 finds Al₂O₃). Every word of the query must appear, in any order.
// Client-safe: used by the server to index and by the browser to search.

const FOLD: Record<string, string> = { ł: "l", ø: "o", ß: "ss", đ: "d", æ: "ae", œ: "oe" };

export function norm(s: string) {
  return s
    .normalize("NFKC") // full-width → ASCII, half-width kana → full-width, ₂ → 2
    .toLowerCase()
    .replace(/[łøßđæœ]/g, (c) => FOLD[c])
    .normalize("NFD")
    .replace(/(?<=\p{Script=Latin})\p{M}+/gu, "") // drop accents on Latin letters; keep kana voicing marks
    .normalize("NFC")
    .replace(/[®™©]/g, "")
    .replace(/[\s\-‐‑–—_/·,;:()（）・、。「」“”„"'’]+/g, " ")
    .trim();
}

// Japanese has no spaces: "6N銅" is two words, so split where Latin letters or digits meet Japanese script.
const JA = "\\p{Script=Han}\\p{Script=Katakana}\\p{Script=Hiragana}";
const SEAM = new RegExp(`(?<=[a-z0-9])(?=[${JA}])|(?<=[${JA}])(?=[a-z0-9])`, "gu");

export const words = (query: string) => norm(query).replace(SEAM, " ").split(" ").filter(Boolean);

/** True when every word is in the (already normalised) text. */
export const hasAll = (text: string, ws: string[]) => ws.every((w) => text.includes(w));
