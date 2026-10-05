import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // Crawling stays allowed before launch: the pages themselves say noindex until the site has its own domain.
    sitemap: `${SITE}/sitemap.xml`,
  };
}
