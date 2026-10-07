import type { MetadataRoute } from "next";
import { href, LANGS } from "@/lib/i18n/config";
import { languages, SITE } from "@/lib/i18n/meta";
import { SITEMAP_PATHS } from "@/lib/routes";

export const dynamic = "force-static";

// Every page in every language, each listing its translations so search engines pair them up.
export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_PATHS.flatMap((p) => {
    const alternates = { languages: Object.fromEntries(Object.entries(languages(p)).map(([l, u]) => [l, SITE + u])) };
    return LANGS.map((l) => ({ url: SITE + href(l, p), alternates }));
  });
}
