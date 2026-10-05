// Languages, their names and URLs. Safe to import from client components.
//
// English lives at the root (/materials/), every other language under its own
// prefix (/de/materials/). Each language is a full set of pre-rendered pages,
// so search engines index it in that language.

export const LANGS = ["en", "pl", "de", "fr", "es", "it", "cs", "sk", "hu", "ja"] as const;
export type Lang = (typeof LANGS)[number];
export type OtherLang = Exclude<Lang, "en">;
export const OTHER_LANGS = LANGS.filter((l): l is OtherLang => l !== "en");

export const isLang = (s: string | undefined): s is Lang => !!s && (LANGS as readonly string[]).includes(s);

/** Each language's name in that language, for the language menu. */
export const NATIVE: Record<Lang, string> = {
  en: "English",
  pl: "Polski",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  cs: "Čeština",
  sk: "Slovenčina",
  hu: "Magyar",
  ja: "日本語",
};

/** <html lang>. */
export const HTML_LANG: Record<Lang, string> = {
  en: "en-GB", pl: "pl", de: "de", fr: "fr", es: "es", it: "it", cs: "cs", sk: "sk", hu: "hu", ja: "ja",
};

/** Number and date formatting. */
export const LOCALE: Record<Lang, string> = {
  en: "en-GB", pl: "pl-PL", de: "de-DE", fr: "fr-FR", es: "es-ES", it: "it-IT", cs: "cs-CZ", sk: "sk-SK", hu: "hu-HU", ja: "ja-JP",
};

/** Open Graph og:locale. */
export const OG_LOCALE: Record<Lang, string> = {
  en: "en_GB", pl: "pl_PL", de: "de_DE", fr: "fr_FR", es: "es_ES", it: "it_IT", cs: "cs_CZ", sk: "sk_SK", hu: "hu_HU", ja: "ja_JP",
};

/** A site path in a language: href("de", "/materials/") is "/de/materials/". Hashes and queries pass through. */
export function href(lang: Lang, path: string) {
  if (!path.startsWith("/")) return path; // external or mailto
  return lang === "en" ? path : `/${lang}${path}`;
}

/** Splits a pathname into its language and the path without the prefix. */
export function splitPath(pathname: string): { lang: Lang; rest: string } {
  const m = pathname.match(/^\/([a-z]{2})(\/.*|$)/);
  if (m && isLang(m[1]) && m[1] !== "en") return { lang: m[1], rest: m[2] || "/" };
  return { lang: "en", rest: pathname || "/" };
}

/** Fills {name} placeholders. */
export function fill(s: string, vars?: Record<string, string | number>) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (all, k: string) => (k in vars ? String(vars[k]) : all));
}

/** Trade names that keep their capital inside a sentence. */
const PROPER = ["Stellite"];

/**
 * Lower-cases a name for use inside a sentence. German nouns keep their capital, and Japanese
 * has no case.
 */
export function inSentence(lang: Lang, s: string) {
  if (lang === "de" || lang === "ja") return s;
  // Leave words that start with an acronym ("PVD coating") or a trade name ("Stellite") alone.
  if (/^.\p{Lu}/u.test(s) || PROPER.some((p) => s.startsWith(p))) return s;
  return s.charAt(0).toLocaleLowerCase(LOCALE[lang]) + s.slice(1);
}

/** Marks a string for translation where it is defined, for strings translated later with t(). */
export const msg = (s: string) => s;

/** A number in the language's format: 3,422 in English, 3.422 in German, 3 422 in Polish. */
export const num = (lang: Lang, n: number, digits = 2) =>
  n.toLocaleString(LOCALE[lang], { maximumFractionDigits: digits });

/** A date such as 15 April 2025, in the language's format. */
export const date = (lang: Lang, iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString(LOCALE[lang], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Quotation marks around a quoted sentence, as each language writes them. */
export const QUOTES: Record<Lang, [string, string]> = {
  en: ["“", "”"], pl: ["„", "”"], de: ["„", "“"], fr: ["«\u00a0", "\u00a0»"], es: ["«", "»"], it: ["«", "»"],
  cs: ["„", "“"], sk: ["„", "“"], hu: ["„", "”"], ja: ["「", "」"],
};

/** A percentage in the language's format: 99.99999% in English, 99,99999 % in German and French. */
export const pct = (lang: Lang, n: number, digits = 5) =>
  (n / 100).toLocaleString(LOCALE[lang], { style: "percent", maximumFractionDigits: digits });

/** "Label: value" with the language's colon: a space before it in French, full width in Japanese. */
export const colon = (lang: Lang) => (lang === "fr" ? " : " : lang === "ja" ? "：" : ": ");

/** The separator for a short list: "sheet, plate, rod" — 板、厚板、棒 in Japanese. */
export const comma = (lang: Lang) => (lang === "ja" ? "、" : ", ");
