import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "@/proxy";

const req = (path: string, accept?: string, method = "GET") =>
  new NextRequest(`https://www.example.com${path}`, { method, headers: accept ? { accept } : {} });
const rewrittenTo = (res: Response) => {
  const to = res.headers.get("x-middleware-rewrite");
  // The home rewrite reads /md or /md/ depending on the trailingSlash setting; both reach the same route.
  return to ? new URL(to).pathname.replace(/^\/md$/, "/md/") : null;
};

describe("proxy", () => {
  it("serves the homepage as Markdown to Accept: text/markdown", () => {
    const res = proxy(req("/", "text/markdown"));
    expect(rewrittenTo(res)).toBe("/md/");
    expect(res.headers.get("vary")).toBe("Accept");
  });

  it("serves any page, in any language, as Markdown", () => {
    expect(rewrittenTo(proxy(req("/de/materials/powders/", "text/markdown, text/html;q=0.5")))).toBe("/md/de/materials/powders/");
    expect(rewrittenTo(proxy(req("/materials/refractory-metals/tungsten/?q=1", "text/markdown")))).toBe("/md/materials/refractory-metals/tungsten/");
  });

  it("leaves HTML requests alone", () => {
    for (const accept of [undefined, "text/html,application/xhtml+xml,*/*;q=0.8", "*/*", "text/html, text/markdown;q=0.1"]) {
      const res = proxy(req("/", accept));
      expect(rewrittenTo(res)).toBeNull();
      expect(res.headers.get("x-middleware-next")).toBe("1");
    }
  });

  it("answers a missing page with a Markdown 404", async () => {
    const res = proxy(req("/__ora-404-probe-fp9w8psn/", "text/markdown"));
    expect(res.status).toBe(404);
    expect(res.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(res.headers.get("vary")).toBe("Accept");
    const body = await res.text();
    expect(body).toContain("# 404");
    expect(body).toContain("https://www.example.com/llms.txt");
  });

  it("serves .md addresses whatever the Accept header", async () => {
    expect(rewrittenTo(proxy(req("/index.md")))).toBe("/md/");
    expect(rewrittenTo(proxy(req("/materials.md", "text/html")))).toBe("/md/materials/");
    expect(rewrittenTo(proxy(req("/ja/industries/space.md")))).toBe("/md/ja/industries/space/");
    expect(proxy(req("/nothing-here.md")).status).toBe(404);
  });

  it("hides the internal Markdown route", () => {
    expect(proxy(req("/md/")).status).toBe(404);
    expect(proxy(req("/md/materials/", "text/markdown")).status).toBe(404);
  });

  it("does not touch other methods", () => {
    expect(rewrittenTo(proxy(req("/", "text/markdown", "POST")))).toBeNull();
  });
});
