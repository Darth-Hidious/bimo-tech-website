import type { MetadataRoute } from "next";
import { allMaterials, families } from "@/lib/catalog";
import { industries } from "@/lib/site";

export const dynamic = "force-static";

const BASE = "https://bimomaterials.com";

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
  return paths.map((p) => ({ url: BASE + p }));
}
