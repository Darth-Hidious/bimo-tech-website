// The body of a 404 for clients that asked for Markdown (see proxy.ts). Plain English and no
// dictionaries, so the proxy stays small.

import { SITE } from "./site-url";

export function notFoundMarkdown(pathname: string): string {
  const safe = pathname.replace(/[`\r\n]/g, "").slice(0, 300);
  return [
    "# 404: page not found",
    `There is no page at \`${safe}\` on the Bimo Materials website. It may have moved when the site was rebuilt.`,
    "These will get you back on track:",
    [
      `- [Home](${SITE}/index.md): what Bimo Materials makes and supplies`,
      `- [Materials](${SITE}/materials.md): the catalog of specialty metals, powders, sputtering targets and new alloys`,
      `- [Request a quote](${SITE}/contact.md): how to ask for a price and a lead time`,
      `- [llms.txt](${SITE}/llms.txt): a guide to this site for AI agents`,
      `- [Sitemap](${SITE}/sitemap.xml): every page in every language`,
    ].join("\n"),
  ].join("\n\n") + "\n";
}
