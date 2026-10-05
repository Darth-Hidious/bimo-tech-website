// Page metadata in each language: title, description, the canonical URL, and hreflang links to the
// same page in every other language, so search engines show each country its own language.

import type { Metadata } from "next";
import { href, LANGS, OG_LOCALE, type Lang } from "./config";
import { IS_LIVE, SITE } from "../site-url";

export { SITE };

export const OG_IMAGE = "/img/brand/og-image.jpg";

/** hreflang alternates for a path: every language plus x-default (English). */
export function languages(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(LANGS.map((l) => [l, href(l, path)])),
    "x-default": path,
  };
}

type Options = { title: string; description: string; absoluteTitle?: boolean; noindex?: boolean };

export function pageMeta(lang: Lang, path: string, { title, description, absoluteTitle, noindex }: Options): Metadata {
  const url = href(lang, path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languages(path) },
    openGraph: {
      type: "website",
      siteName: "Bimo Materials",
      title: absoluteTitle ? title : `${title} · Bimo Materials`,
      description,
      url,
      locale: OG_LOCALE[lang],
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [OG_IMAGE],
    },
    // Hidden from search engines until the site runs on its own domain (see lib/site-url.ts).
    ...(noindex || !IS_LIVE ? { robots: { index: false, follow: IS_LIVE } } : {}),
  };
}
