// The Markdown version of every page in every language (lib/markdown.ts), pre-rendered at build time.
// Nobody links here: proxy.ts rewrites to it when a client asks a page for text/markdown, or asks for
// the page's .md address, and answers a direct request for /md/… with a 404.

import { LANGS, splitPath, href } from "@/lib/i18n/config";
import { pageMarkdown } from "@/lib/markdown";
import { PAGE_PATHS } from "@/lib/routes";
import { SITE } from "@/lib/site-url";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.flatMap((l) => PAGE_PATHS.map((p) => ({ path: href(l, p).split("/").filter(Boolean) })));
}

type Props = { params: Promise<{ path?: string[] }> };

export async function GET(_req: Request, { params }: Props) {
  const { path = [] } = await params;
  const { lang, rest } = splitPath(path.length ? `/${path.join("/")}/` : "/");
  const md = pageMarkdown(lang, rest);
  if (md === null) return new Response("Not found\n", { status: 404 });
  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      Link: `<${SITE}${href(lang, rest)}>; rel="canonical"`,
    },
  });
}
