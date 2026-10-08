// Every page on the site, by its English path. The sitemap, the Markdown versions of the pages and
// the proxy (proxy.ts, which tells a page from a missing one) all read this list, so a new material or
// industry shows up in all three on the next build.
// Data only: proxy.ts imports this, so it must stay free of React and of the translation dictionaries.

import { families, allMaterials } from "./catalog";
import { industries } from "./site";
import { href, LANGS, splitPath, type Lang } from "./i18n/config";

/** The pages listed in the sitemap, in English. */
export const SITEMAP_PATHS: string[] = [
  "/",
  "/materials/",
  ...families.map((f) => `/materials/${f.slug}/`),
  ...allMaterials.map((m) => `/materials/${m.family.slug}/${m.slug}/`),
  "/manufacturing/",
  "/new-alloys/",
  "/industries/",
  ...industries.map((i) => `/industries/${i.slug}/`),
  "/company/",
  "/contact/",
  "/credits/",
  "/privacy/",
];

/** Every page, in English. Today the same as the sitemap. */
export const PAGE_PATHS: string[] = SITEMAP_PATHS;

const LOCALIZED = new Set(LANGS.flatMap((l) => PAGE_PATHS.map((p) => href(l, p))));

/** The page at a pathname such as "/de/materials/", or null when there is none. */
export function findPage(pathname: string): { lang: Lang; path: string } | null {
  const p = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (!LOCALIZED.has(p)) return null;
  const { lang, rest } = splitPath(p);
  return { lang, path: rest };
}

/**
 * The Markdown address of a page: "/" is /index.md, "/de/materials/" is /de/materials.md.
 * Every page also answers in Markdown at its own address to a request with Accept: text/markdown.
 */
export function mdHref(localizedPath: string): string {
  return localizedPath === "/" ? "/index.md" : `${localizedPath.replace(/\/$/, "")}.md`;
}

/** The page address for a Markdown address (the reverse of mdHref): "/materials.md" is "/materials/". */
export function fromMdHref(pathname: string): string | null {
  const m = pathname.match(/^(\/(?:[^/]+\/)*?)(?:index|([^/]+))\.md$/);
  if (!m) return null;
  return m[2] ? `${m[1]}${m[2]}/` : m[1];
}
