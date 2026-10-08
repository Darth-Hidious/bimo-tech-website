// Two jobs, each only for the requests that need it (see config.matcher); every other request goes
// straight to the pre-rendered HTML.
//
// 1. The visitor's language. Someone arriving from outside the site on an English page, whose browser
//    asks for another of the site's languages first, is sent to the same page in that language
//    (307, temporary): a Colombian visitor opening bimomaterials.com lands on /es/. Clicks inside the
//    site are never redirected, so choosing English in the language menu sticks. Search engine bots
//    are never redirected either, so every language stays indexed. No cookies.
//
// 2. Markdown for AI agents (acceptmarkdown.com):
//   GET /materials/  Accept: text/markdown  → the page as Markdown (app/md/[[...path]]/route.ts)
//   GET /materials.md                       → the same, for clients that cannot set headers
//   GET /no-such-page/  Accept: text/markdown → 404 with a Markdown body that links back into the site
//
// Markdown responses carry Vary: Accept, and so do the HTML pages (next.config.ts), so caches keep the two apart.

import { NextResponse, type NextRequest } from "next/server";
import { preferredLang, prefersMarkdown } from "@/lib/negotiate";
import { href, LANGS } from "@/lib/i18n/config";
import { notFoundMarkdown } from "@/lib/markdown-404";
import { findPage, fromMdHref } from "@/lib/routes";

const MARKDOWN = { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept" };

const notFound = (pathname: string) => new NextResponse(notFoundMarkdown(pathname), { status: 404, headers: MARKDOWN });

/** Hands the request to the pre-rendered Markdown of a page (a localized path such as "/de/materials/"). */
const markdown = (req: NextRequest, path: string) =>
  NextResponse.rewrite(new URL(`/md${path}`, req.url), { headers: { Vary: "Accept" } });

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|lighthouse|pagespeed|headless/i;

/** The same page in the browser's language, for a visitor arriving on an English page from outside. */
function languageRedirect(req: NextRequest): NextResponse | null {
  const page = findPage(req.nextUrl.pathname);
  if (!page || page.lang !== "en") return null;
  // A page load, not a client-side navigation or a prefetch.
  if (req.headers.get("rsc") || req.headers.get("next-router-prefetch") || req.headers.get("purpose") === "prefetch") return null;
  if (!req.headers.get("accept")?.includes("text/html")) return null;
  if (BOT.test(req.headers.get("user-agent") ?? "")) return null;
  // Coming from one of our own pages (e.g. the language menu): the visitor chose this language.
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      if (new URL(referer).host === req.nextUrl.host) return null;
    } catch {}
  }
  const lang = preferredLang(req.headers.get("accept-language"), LANGS);
  if (!lang || lang === "en") return null;
  const url = new URL(href(lang, page.path), req.url);
  url.search = req.nextUrl.search;
  return NextResponse.redirect(url, { status: 307, headers: { Vary: "Accept-Language, Referer" } });
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (req.method !== "GET" && req.method !== "HEAD") return NextResponse.next();

  // The internal route is reached only through a rewrite.
  if (pathname === "/md" || pathname.startsWith("/md/")) return notFound(pathname);

  if (pathname.endsWith(".md")) {
    const path = fromMdHref(pathname);
    return path && findPage(path) ? markdown(req, path) : notFound(pathname);
  }

  if (!prefersMarkdown(req.headers.get("accept"))) return languageRedirect(req) ?? NextResponse.next();
  return findPage(pathname) ? markdown(req, pathname.endsWith("/") ? pathname : `${pathname}/`) : notFound(pathname);
}

export const config = {
  matcher: [
    // Pages and missing pages asked for as Markdown. Static files, images and the API are left alone.
    {
      source: "/((?!_next/|api/|img/|favicon\\.ico|robots\\.txt|sitemap\\.xml|llms\\.txt).*)",
      has: [{ type: "header", key: "accept", value: ".*(?:text/markdown|text/x-markdown).*" }],
    },
    // English pages opened by a browser that asks for one of the other languages.
    {
      source: "/((?!_next/|api/|img/|md/|(?:pl|de|fr|es|it|cs|sk|hu|ja)(?:/|$)|favicon\\.ico|robots\\.txt|sitemap\\.xml|llms\\.txt).*)",
      has: [{ type: "header", key: "accept-language", value: ".*(?:pl|de|fr|es|it|cs|sk|hu|ja).*" }],
      missing: [{ type: "header", key: "rsc" }],
    },
    "/(.*\\.md)",
    "/md",
    "/md/:path*",
  ],
};
