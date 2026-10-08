import { describe, expect, it } from "vitest";
import { preferredLang, prefersMarkdown } from "@/lib/negotiate";

describe("prefersMarkdown", () => {
  it.each([
    "text/markdown",
    "text/markdown; charset=utf-8",
    "TEXT/Markdown",
    "text/x-markdown",
    "text/markdown, text/html",
    "text/markdown, text/html;q=0.9, */*;q=0.1",
    "text/html;q=0.5, text/markdown",
    "text/plain, text/markdown;q=0.8, */*;q=0.5",
  ])("serves Markdown for %s", (accept) => expect(prefersMarkdown(accept)).toBe(true));

  it.each([
    null,
    "",
    "*/*",
    "text/html",
    "text/*",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "text/html, text/markdown;q=0.5",
    "text/markdown;q=0",
    "application/json",
  ])("serves HTML for %s", (accept) => expect(prefersMarkdown(accept)).toBe(false));
});

describe("preferredLang", () => {
  const LANGS = ["en", "pl", "de", "fr", "es", "it", "cs", "sk", "hu", "ja"] as const;
  it.each([
    ["es-CO,es;q=0.9,en;q=0.8", "es"],
    ["es-419", "es"],
    ["pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7", "pl"],
    ["en-US,en;q=0.9,es;q=0.8", "en"],
    ["en-GB", "en"],
    ["pt-BR,pt;q=0.9,es;q=0.8,en;q=0.7", "es"], // Portuguese is not offered: next choice
    ["de;q=0.5, fr", "fr"],
    ["ja", "ja"],
    ["zh-CN,zh;q=0.9", null],
    ["es;q=0", null],
    ["", null],
    [null, null],
  ])("%s → %s", (header, want) => expect(preferredLang(header, LANGS)).toBe(want));
});
