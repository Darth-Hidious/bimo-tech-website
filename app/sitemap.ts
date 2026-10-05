import type { MetadataRoute } from "next";
import { families, allMaterials } from "@/lib/catalog";
import { industries } from "@/lib/site";
import { href, LANGS } from "@/lib/i18n/config";
import { languages, SITE } from "@/lib/i18n/meta";

export const dynamic = "force-static";

// Every page in every language, each listing its translations so search engines pair them up.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
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
  ];
  return paths.flatMap((p) => {
    const alternates = { languages: Object.fromEntries(Object.entries(languages(p)).map(([l, u]) => [l, SITE + u])) };
    return LANGS.map((l) => ({ url: SITE + href(l, p), alternates }));
  });
}
