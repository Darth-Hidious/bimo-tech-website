import { describe, expect, it } from "vitest";
import { LANGS, href } from "@/lib/i18n/config";
import { pageMarkdown } from "@/lib/markdown";
import { notFoundMarkdown } from "@/lib/markdown-404";
import { PAGE_PATHS } from "@/lib/routes";

const SITE = "https://www.example.com";

describe("pageMarkdown", () => {
  it.each(LANGS)("renders every page in %s", (lang) => {
    for (const path of PAGE_PATHS) {
      const md = pageMarkdown(lang, path);
      expect(md, `${lang} ${path}`).toBeTypeOf("string");
      expect(md!.startsWith("# "), `${lang} ${path} starts with an H1`).toBe(true);
      expect(md!.match(/^# /gm), `${lang} ${path} has one H1`).toHaveLength(1);
      expect(md, `${lang} ${path}`).not.toMatch(/\bundefined\b|\[object |\bnull\b|\bNaN\b|\{\w+\}|<\/?\d>/);
      expect(md!.length).toBeGreaterThan(200);
      // Links are absolute, so they work wherever the Markdown is read.
      for (const [, url] of md!.matchAll(/\]\(([^)]+)\)/g)) expect(url, `${lang} ${path}`).toMatch(/^(https:\/\/|mailto:)/);
      // The footer points to the HTML page and to the site guide.
      expect(md).toContain(`HTML: ${SITE}${href(lang, path)}`);
      expect(md).toContain(`${SITE}/llms.txt`);
    }
  });

  it("carries the page's content", () => {
    const home = pageMarkdown("en", "/")!;
    expect(home).toMatch(/^# Bimo Materials · Specialty metals, powders and new alloys\n/);
    expect(home).toContain("## From raw metal to tested part.");
    expect(home).toContain(`[Refractory metals](${SITE}/materials/refractory-metals/)`);
    expect(home).toContain("info@bimomaterials.com");

    const tungsten = pageMarkdown("en", "/materials/refractory-metals/tungsten/")!;
    expect(tungsten).toContain("# Tungsten");
    expect(tungsten).toContain("**Melting point**: 3,422 °C");
    expect(tungsten).toContain("- WLa (lanthanated)");
    expect(tungsten).toContain(`[Request a quote for tungsten](${SITE}/contact/?item=Tungsten)`);
  });

  it("is in the page's language", () => {
    const de = pageMarkdown("de", "/materials/refractory-metals/tungsten/")!;
    expect(de).toContain("# Wolfram");
    expect(de).toContain("3.422 °C");
    expect(de).toContain(`${SITE}/de/materials/refractory-metals/`);
    expect(pageMarkdown("ja", "/")!).toContain(`${SITE}/ja/materials/`);
  });

  it("has no Markdown for a missing page", () => {
    expect(pageMarkdown("en", "/nope/")).toBeNull();
    expect(pageMarkdown("en", "/materials/refractory-metals/unobtainium/")).toBeNull();
  });
});

describe("notFoundMarkdown", () => {
  it("explains the error and links to the docs", () => {
    const md = notFoundMarkdown("/__ora-404-probe-fp9w8psn/");
    expect(md.startsWith("# 404")).toBe(true);
    expect(md.length).toBeGreaterThan(20);
    expect(md).toContain("`/__ora-404-probe-fp9w8psn/`");
    expect(md).toContain(`(${SITE}/llms.txt)`);
    expect(md).toContain(`(${SITE}/sitemap.xml)`);
  });

  it("cannot be broken out of by the requested path", () => {
    const md = notFoundMarkdown("/a`b\n# injected");
    expect(md).not.toContain("\n# injected");
    expect(md).toContain("`/ab# injected`");
  });
});
