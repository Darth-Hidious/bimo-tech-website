// JSON-LD (schema.org) for search engines and AI assistants: who Bimo Materials is and how to reach
// it (on the homepage), and where each catalog page sits. Rendered by components/JsonLd.tsx.

import { content } from "./content";
import { HTML_LANG, href, LANGS, type Lang } from "./i18n/config";
import { tr } from "./i18n/server";
import { OG_IMAGE, SITE } from "./i18n/meta";
import { postalAddress } from "./site";

export type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE}/#organization`;
const url = (lang: Lang, path: string) => SITE + href(lang, path);

/** The company: name, address, sales contact and what it sells. */
export function organizationJsonLd(lang: Lang): JsonLd {
  const t = tr(lang);
  const { company, families } = content(lang);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Bimo Materials",
    url: `${SITE}/`,
    logo: `${SITE}/img/brand/bimo-materials-logo.png`,
    image: SITE + OG_IMAGE,
    description: t("Refractory metals, powders, sputtering targets, high-purity metals and new alloys for space, fusion and industry. Made in Wrocław, with an office in Oxford."),
    email: company.email,
    ...(company.phone ? { telephone: company.phone } : {}),
    address: { "@type": "PostalAddress", ...postalAddress },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: company.email,
        ...(company.phone ? { telephone: company.phone } : {}),
        url: url(lang, "/contact/"),
        availableLanguage: LANGS.map((l) => HTML_LANG[l]),
      },
    ],
    knowsAbout: families.map((f) => f.name),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t("Materials"),
      url: url(lang, "/materials/"),
      itemListElement: families.map((f) => ({
        "@type": "OfferCatalog",
        name: f.name,
        description: f.intro,
        url: url(lang, `/materials/${f.slug}/`),
      })),
    },
  };
}

/** The website itself, published by the company. */
export function websiteJsonLd(lang: Lang): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: "Bimo Materials",
    url: url(lang, "/"),
    inLanguage: HTML_LANG[lang],
    publisher: { "@id": ORG_ID },
  };
}

/**
 * The breadcrumb trail of a catalog page (Home / Materials / family / material), so search results show
 * where a material sits. No Product markup: Google requires a price or reviews for it, and prices are
 * quoted per request.
 */
export function catalogBreadcrumbJsonLd(lang: Lang, family: string, material?: string): JsonLd | null {
  const t = tr(lang);
  const c = content(lang);
  const f = c.familyBySlug(family);
  const m = material ? c.allMaterials.find((x) => x.family.slug === family && x.slug === material) : undefined;
  if (!f || (material && !m)) return null;
  const trail = [
    [t("Home"), "/"],
    [t("Materials"), "/materials/"],
    [f.name, `/materials/${family}/`],
    ...(m ? [[m.name, `/materials/${family}/${m.slug}/`]] : []),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: url(lang, path) })),
  };
}

/** JSON for a <script type="application/ld+json">, safe inside HTML (no "</script>" can close it early). */
export const jsonLdScript = (data: JsonLd) => JSON.stringify(data).replace(/</g, "\\u003c");
