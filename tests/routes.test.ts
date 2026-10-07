import { describe, expect, it } from "vitest";
import { LANGS, href } from "@/lib/i18n/config";
import { findPage, fromMdHref, mdHref, PAGE_PATHS, SITEMAP_PATHS } from "@/lib/routes";

describe("routes", () => {
  it("lists every page once, and the sitemap leaves out only the privacy draft", () => {
    expect(new Set(PAGE_PATHS).size).toBe(PAGE_PATHS.length);
    expect(PAGE_PATHS.filter((p) => !SITEMAP_PATHS.includes(p))).toEqual(["/privacy/"]);
    expect(SITEMAP_PATHS).toContain("/materials/refractory-metals/tungsten/");
  });

  it("finds pages in every language, with or without the trailing slash", () => {
    expect(findPage("/")).toEqual({ lang: "en", path: "/" });
    expect(findPage("/de/")).toEqual({ lang: "de", path: "/" });
    expect(findPage("/de")).toEqual({ lang: "de", path: "/" });
    expect(findPage("/ja/materials/powders/")).toEqual({ lang: "ja", path: "/materials/powders/" });
    expect(findPage("/materials/refractory-metals/tungsten")).toEqual({ lang: "en", path: "/materials/refractory-metals/tungsten/" });
  });

  it("knows a missing page", () => {
    for (const p of ["/__ora-404-probe-fp9w8psn/", "/en/", "/materials/unobtainium/", "/xx/materials/", "/md/", "/llms.txt"]) {
      expect(findPage(p)).toBeNull();
    }
  });

  it("maps every page to a .md address and back", () => {
    expect(mdHref("/")).toBe("/index.md");
    expect(mdHref("/de/")).toBe("/de.md");
    expect(mdHref("/materials/powders/")).toBe("/materials/powders.md");
    for (const l of LANGS) for (const p of PAGE_PATHS) expect(fromMdHref(mdHref(href(l, p)))).toBe(href(l, p));
    expect(fromMdHref("/materials/index.md")).toBe("/materials/");
    expect(fromMdHref("/materials/")).toBeNull();
  });
});
