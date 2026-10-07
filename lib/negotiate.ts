// Content negotiation for the Markdown versions of the pages (acceptmarkdown.com). Data only:
// proxy.ts imports this.

type Range = { type: string; subtype: string; q: number };

function parse(accept: string): Range[] {
  return accept
    .split(",")
    .map((part) => {
      const [range, ...params] = part.trim().toLowerCase().split(";");
      const [type, subtype] = range.trim().split("/");
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const q = qParam ? Number(qParam.slice(2)) : 1;
      return { type, subtype, q: Number.isFinite(q) ? Math.min(Math.max(q, 0), 1) : 1 };
    })
    .filter((r) => r.type && r.subtype);
}

/** The quality the Accept header gives a media type, from its most specific matching range (RFC 9110 §12.5.1). */
function quality(ranges: Range[], type: string, subtype: string): number {
  const exact = ranges.find((r) => r.type === type && r.subtype === subtype);
  if (exact) return exact.q;
  const sub = ranges.find((r) => r.type === type && r.subtype === "*");
  if (sub) return sub.q;
  const any = ranges.find((r) => r.type === "*" && r.subtype === "*");
  return any ? any.q : 0;
}

/**
 * True when the client asks for Markdown by name and likes it at least as much as HTML.
 * "text/markdown" and "text/markdown, text/html;q=0.9" get Markdown. Browsers, which ask for text/html
 * first, and clients that send only the any-type wildcard get HTML.
 */
export function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;
  const ranges = parse(accept);
  const named = ranges.find((r) => r.type === "text" && (r.subtype === "markdown" || r.subtype === "x-markdown"));
  if (!named || named.q <= 0) return false;
  return named.q >= quality(ranges, "text", "html");
}
