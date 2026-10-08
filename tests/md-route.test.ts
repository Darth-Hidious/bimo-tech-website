import { describe, expect, it } from "vitest";
import { GET, generateStaticParams } from "@/app/md/[[...path]]/route";
import { LANGS } from "@/lib/i18n/config";
import { PAGE_PATHS } from "@/lib/routes";

const call = (path: string[]) => GET(new Request("https://www.example.com/"), { params: Promise.resolve({ path }) });

describe("the Markdown route", () => {
  it("pre-renders every page in every language", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(LANGS.length * PAGE_PATHS.length);
    expect(params).toContainEqual({ path: [] });
    expect(params).toContainEqual({ path: ["de"] });
    expect(params).toContainEqual({ path: ["fr", "materials", "powders"] });
  });

  it("answers with Markdown, Vary: Accept and the canonical HTML page", async () => {
    const res = await call([]);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(res.headers.get("vary")).toBe("Accept");
    expect(res.headers.get("link")).toBe('<https://www.example.com/>; rel="canonical"');
    expect(await res.text()).toMatch(/^# Bimo Materials/);

    const de = await call(["de", "materials"]);
    expect(de.headers.get("link")).toBe('<https://www.example.com/de/materials/>; rel="canonical"');
  });

  it("has nothing for an unknown path", async () => {
    expect((await call(["nope"])).status).toBe(404);
  });
});
