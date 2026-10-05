// The site's data in one language. Built once per language at build time.

import { families as FAMILIES, type Family, type Material } from "./catalog";
import * as site from "./site";
import type { Lang } from "./i18n/config";
import { localize } from "./i18n/server";

function build(lang: Lang) {
  const families: Family[] = localize(lang, FAMILIES);
  const allMaterials: (Material & { family: Family })[] = families.flatMap((f) =>
    (f.materials ?? []).map((m) => ({ ...m, family: f })),
  );
  return {
    families,
    allMaterials,
    familyBySlug: (slug: string) => families.find((f) => f.slug === slug),
    images: localize(lang, site.images),
    path: localize(lang, site.path),
    outcomes: localize(lang, site.outcomes),
    services: localize(lang, site.services),
    projectSteps: localize(lang, site.projectSteps),
    industries: localize(lang, site.industries),
    timeline: localize(lang, site.timeline),
    news: localize(lang, site.news),
    company: localize(lang, site.company),
    places: localize(lang, site.places),
  };
}

const cache = new Map<Lang, ReturnType<typeof build>>();

export function content(lang: Lang) {
  let c = cache.get(lang);
  if (!c) cache.set(lang, (c = build(lang)));
  return c;
}
