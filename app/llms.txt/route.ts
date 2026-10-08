// /llms.txt: the site guide for AI agents (llmstxt.org), built from the catalog at build time.

import { llmsTxt } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
