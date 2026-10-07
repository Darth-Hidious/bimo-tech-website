import { describe, expect, it } from "vitest";
import { GET } from "@/app/llms.txt/route";
import { llmsTxt } from "@/lib/llms";
import { findPage, fromMdHref } from "@/lib/routes";
import { allMaterials, families } from "@/lib/catalog";

const SITE = "https://www.example.com";

describe("llms.txt", () => {
  const text = llmsTxt();
  const lines = text.split("\n");

  it("follows the llmstxt.org layout: H1, blockquote summary, free text, then H2 file lists", () => {
    expect(lines[0]).toBe("# Bimo Materials");
    expect(lines[1]).toBe("");
    expect(lines[2].startsWith("> ")).toBe(true);
    expect(text.match(/^# /gm)).toHaveLength(1);
    expect(text).not.toMatch(/^#{3,} /m);
    // Before the first H2: paragraphs and lists only.
    const intro = text.slice(0, text.indexOf("\n## "));
    expect(intro.split("\n").slice(1).filter((l) => l.startsWith("#"))).toEqual([]);
    // Each H2 section is a list of links: "- [name](url)" with an optional ": notes".
    const sections = text.split(/^## /m).slice(1);
    expect(sections.map((s) => s.split("\n")[0])).toEqual(["When to use", "Materials", "Material pages", "Manufacturing services", "Industries", "Company", "Optional"]);
    for (const s of sections) {
      for (const line of s.split("\n").slice(1).filter(Boolean)) expect(line).toMatch(/^- \[[^\]]+\]\(https:\/\/[^)\s]+\)(: .+)?$/);
    }
  });

  it("says when to use the site and how an agent should act", () => {
    expect(text).toContain("**When to use Bimo Materials.**");
    expect(text).toContain("**How an agent should act.**");
    expect(text).toContain("info@bimomaterials.com");
    expect(text).toContain("Accept: text/markdown");
  });

  it("lists every family and material, and every link leads to a real page", () => {
    for (const f of families) expect(text).toContain(`[${f.name}](${SITE}/materials/${f.slug}.md)`);
    for (const m of allMaterials) expect(text).toContain(`(${SITE}/materials/${m.family.slug}/${m.slug}.md)`);
    for (const [, url] of text.matchAll(/\]\((https:\/\/[^)]+)\)/g)) {
      const { pathname } = new URL(url);
      if (pathname.endsWith(".md")) expect(findPage(fromMdHref(pathname)!), url).not.toBeNull();
      else expect(findPage(pathname) ?? pathname, url).toSatisfy((p: unknown) => p === "/sitemap.xml" || typeof p === "object");
    }
  });

  it("is served as plain text", async () => {
    const res = GET();
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(await res.text()).toBe(text);
  });
});
