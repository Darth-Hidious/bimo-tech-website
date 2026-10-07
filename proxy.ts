// Markdown for AI agents (acceptmarkdown.com). Runs only for requests that name text/markdown in their
// Accept header, for .md addresses, and for the internal /md/ route; every other request goes straight
// to the pre-rendered HTML.
//
//   GET /materials/  Accept: text/markdown  → the page as Markdown (app/md/[[...path]]/route.ts)
//   GET /materials.md                       → the same, for clients that cannot set headers
//   GET /no-such-page/  Accept: text/markdown → 404 with a Markdown body that links back into the site
//
// Markdown responses carry Vary: Accept, and so do the HTML pages (next.config.ts), so caches keep the two apart.

import { NextResponse, type NextRequest } from "next/server";
import { prefersMarkdown } from "@/lib/negotiate";
import { notFoundMarkdown } from "@/lib/markdown-404";
import { findPage, fromMdHref } from "@/lib/routes";

const MARKDOWN = { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept" };

const notFound = (pathname: string) => new NextResponse(notFoundMarkdown(pathname), { status: 404, headers: MARKDOWN });

/** Hands the request to the pre-rendered Markdown of a page (a localized path such as "/de/materials/"). */
const markdown = (req: NextRequest, path: string) =>
  NextResponse.rewrite(new URL(`/md${path}`, req.url), { headers: { Vary: "Accept" } });

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (req.method !== "GET" && req.method !== "HEAD") return NextResponse.next();

  // The internal route is reached only through a rewrite.
  if (pathname === "/md" || pathname.startsWith("/md/")) return notFound(pathname);

  if (pathname.endsWith(".md")) {
    const path = fromMdHref(pathname);
    return path && findPage(path) ? markdown(req, path) : notFound(pathname);
  }

  if (!prefersMarkdown(req.headers.get("accept"))) return NextResponse.next();
  return findPage(pathname) ? markdown(req, pathname.endsWith("/") ? pathname : `${pathname}/`) : notFound(pathname);
}

export const config = {
  matcher: [
    // Pages and missing pages asked for as Markdown. Static files, images and the API are left alone.
    {
      source: "/((?!_next/|api/|img/|favicon\\.ico|robots\\.txt|sitemap\\.xml|llms\\.txt).*)",
      has: [{ type: "header", key: "accept", value: ".*(?:text/markdown|text/x-markdown).*" }],
    },
    "/(.*\\.md)",
    "/md",
    "/md/:path*",
  ],
};
