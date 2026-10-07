import { describe, expect, it } from "vitest";
import { prefersMarkdown } from "@/lib/negotiate";

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
