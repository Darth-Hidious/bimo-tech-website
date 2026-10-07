import { describe, expect, it } from "vitest";
import { legacyRedirects, OLD_LANGS, OLD_MATERIALS, OLD_NEWS } from "@/lib/legacy-redirects";
import { findPage } from "@/lib/routes";

const rules = legacyRedirects();
const page = (destination: string) => destination.split("#")[0];

describe("redirects from the retired site", () => {
  it("all lead to a page that exists, permanently", () => {
    for (const r of rules) {
      expect(r.permanent, r.source).toBe(true);
      expect(findPage(page(r.destination)), `${r.source} → ${r.destination}`).not.toBeNull();
    }
  });

  it("never redirect an address this site serves itself", () => {
    for (const r of rules.filter((r) => !r.has && !r.source.includes(":"))) {
      expect(findPage(r.source), r.source).toBeNull();
    }
  });

  it("are unique", () => {
    const keys = rules.map((r) => r.source + JSON.stringify(r.has ?? []));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("keep the language: Polish to Polish, English to the root, Czech from /cz to /cs", () => {
    const to = (source: string, material?: string) =>
      rules.find((r) => r.source === source && (material ? r.has?.[0].value === material : !r.has))?.destination;
    expect(to("/en/products")).toBe("/materials/");
    expect(to("/pl/products")).toBe("/pl/materials/");
    expect(to("/cz/products")).toBe("/cs/materials/");
    expect(to("/en/products", "tungsten")).toBe("/materials/refractory-metals/tungsten/");
    expect(to("/pl/products", "nickel")).toBe("/pl/materials/specialty-alloys/nickel-alloys/");
    expect(to("/pl/news/spark-esa-award")).toBe("/pl/new-alloys/#spark");
    expect(to("/en")).toBe("/");
    expect(to("/pl")).toBeUndefined(); // /pl/ is this site's Polish homepage
  });

  it("cover every address in the old sitemap", () => {
    // From the retired site's src/app/sitemap.ts.
    const pages = ["", "/products", "/services", "/news", "/quote", "/contact", "/careers", "/privacy", "/terms", "/impressum",
      "/services/cnc-milling", "/services/cnc-turning", "/services/sheet-metal", ...Object.keys(OLD_NEWS).map((s) => `/news/${s}`)];
    for (const lang of ["en", "pl"]) {
      for (const p of pages) {
        const source = `/${lang}${p}`;
        const covered = rules.some((r) => !r.has && (r.source === source || new RegExp(`^${r.source.replace(/:\w+\*/g, ".*").replace(/:\w+/g, "[^/]+")}$`).test(source)));
        expect(covered || findPage(source) !== null, source).toBe(true);
      }
      for (const m of Object.keys(OLD_MATERIALS)) expect(rules.some((r) => r.source === `/${lang}/products` && r.has?.[0].value === m)).toBe(true);
    }
    expect(Object.keys(OLD_LANGS)).toContain("pl");
  });
});
