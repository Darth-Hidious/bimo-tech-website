// Permanent redirects from the retired site that ran on this domain until October 2026 (the Bimo Tech
// app: /en/products, /pl/services/cnc-milling, /en/news/spark-esa-award …) to the matching page here,
// in the same language. Google still lists those addresses; a 308 passes their ranking to the new page
// instead of a 404. Used by next.config.ts. Data only, no imports.
//
// The old site served English and Polish (/en/…, /pl/…) and kept files for more languages. Each old
// language goes to the same language here, or to English where this site has no such language.

type Redirect = {
  source: string;
  destination: string;
  permanent: true;
  has?: { type: "query"; key: string; value: string }[];
};

/** Old language segment → this site's prefix ("" is English, at the root). */
export const OLD_LANGS: Record<string, string> = {
  en: "", pl: "/pl", de: "/de", fr: "/fr", es: "/es", it: "/it", cz: "/cs",
  da: "", fi: "", nl: "", pt: "", sv: "",
};

/** Languages this site also has: their home, contact and privacy pages exist at the same address. */
const SAME_ADDRESS = new Set(["pl", "de", "fr", "es", "it"]);

/** /products?material=… on the old site → the material's page here. */
export const OLD_MATERIALS: Record<string, string> = {
  tungsten: "/materials/refractory-metals/tungsten/",
  molybdenum: "/materials/refractory-metals/molybdenum/",
  tantalum: "/materials/refractory-metals/tantalum/",
  niobium: "/materials/refractory-metals/niobium/",
  rhenium: "/materials/refractory-metals/rhenium/",
  zirconium: "/materials/refractory-metals/zirconium/",
  "tungsten-carbide": "/materials/refractory-metals/tungsten-carbide/",
  titanium: "/materials/specialty-alloys/titanium/",
  nickel: "/materials/specialty-alloys/nickel-alloys/",
  stellite: "/materials/specialty-alloys/stellite/",
  copper: "/materials/specialty-alloys/copper-alloys/",
  "aluminum-bronze": "/materials/specialty-alloys/aluminium-bronzes/",
  "sputtering-targets": "/materials/sputtering-targets/",
};

/** Old news articles → where that story lives now. Others go to the news list. */
export const OLD_NEWS: Record<string, string> = {
  "spark-esa-award": "/new-alloys/#spark",
  "rhea-research-breakthrough": "/new-alloys/",
  "sputtering-targets-launch": "/materials/sputtering-targets/",
  "iter-partnership": "/industries/fusion-nuclear/",
};

/** Old pages (after the language) → their counterpart here. */
export const OLD_PAGES: Record<string, string> = {
  products: "/materials/",
  services: "/manufacturing/",
  "services/cnc-milling": "/manufacturing/#machining",
  "services/cnc-turning": "/manufacturing/#machining",
  "services/:slug": "/manufacturing/",
  news: "/company/#news",
  "news/:slug": "/company/#news",
  quote: "/contact/",
  "track/:id": "/contact/",
  careers: "/company/",
  terms: "/privacy/",
  impressum: "/contact/",
};

export function legacyRedirects(): Redirect[] {
  const out: Redirect[] = [];
  const add = (source: string, destination: string, has?: Redirect["has"]) =>
    out.push({ source, destination, permanent: true, ...(has ? { has } : {}) });

  for (const [old, prefix] of Object.entries(OLD_LANGS)) {
    // Most specific first: a material filter, then single news stories, then whole pages.
    for (const [material, to] of Object.entries(OLD_MATERIALS)) {
      add(`/${old}/products`, prefix + to, [{ type: "query", key: "material", value: material }]);
    }
    for (const [slug, to] of Object.entries(OLD_NEWS)) add(`/${old}/news/${slug}`, prefix + to);
    for (const [page, to] of Object.entries(OLD_PAGES)) add(`/${old}/${page}`, prefix + to);
    if (!SAME_ADDRESS.has(old)) {
      add(`/${old}`, prefix + "/");
      add(`/${old}/contact`, prefix + "/contact/");
      add(`/${old}/privacy`, prefix + "/privacy/");
    }
  }
  add("/investors", "/company/");
  add("/admin", "/");
  add("/admin/:path*", "/");
  return out;
}
