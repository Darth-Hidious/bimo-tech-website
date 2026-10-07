// Checks what AI agents see on a running site: Markdown content negotiation (acceptmarkdown.com),
// Markdown 404s, the .md addresses, /llms.txt and the homepage JSON-LD.
//
//   npm run check:agents -- http://localhost:3000     after `npm run build && npx next start`
//   npm run check:agents -- https://www.bimotech.dev  after a deploy
//
// Redirects are followed, as agents do, and every check reads the final response.

const base = (process.argv[2] || "http://localhost:3000").replace(/\/+$/, "");
const problems = [];
const warnings = [];
let passed = 0;

const check = (ok, what) => (ok ? passed++ : problems.push(what));
const get = (path, accept) => fetch(base + path, { headers: accept ? { Accept: accept } : {}, redirect: "follow" });
const varyHasAccept = (res) => res.headers.get("vary")?.split(",").some((v) => v.trim().toLowerCase() === "accept") ?? false;
const type = (res) => res.headers.get("content-type") ?? "";

// 1 · Homepage: Markdown for Accept: text/markdown, HTML for Accept: text/html, Vary: Accept on both.
{
  const md = await get("/", "text/markdown");
  const body = await md.text();
  check(md.status === 200, `homepage as Markdown: status ${md.status}, expected 200`);
  check(type(md).startsWith("text/markdown"), `homepage as Markdown: Content-Type ${type(md)}`);
  check(varyHasAccept(md), `homepage as Markdown: Vary is "${md.headers.get("vary")}", missing Accept`);
  check(body.startsWith("# ") && body.length > 500, "homepage as Markdown: body is not a Markdown page");

  const html = await get("/", "text/html");
  const page = await html.text();
  check(html.status === 200 && type(html).startsWith("text/html"), `homepage as HTML: ${html.status} ${type(html)}`);
  // Recommended, not required: on Vercel the proxy runs before the CDN cache, so HTML and Markdown are
  // cached apart anyway. `next start` replaces Vary on pre-rendered pages, so this warns locally.
  if (!varyHasAccept(html)) warnings.push(`homepage as HTML: Vary is "${html.headers.get("vary")}", without Accept`);
  check(/<html/i.test(page), "homepage as HTML: body is not HTML");

  // JSON-LD: Organization with contactPoint and PostalAddress, and WebSite.
  const blocks = [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const org = blocks.find((b) => b["@type"] === "Organization");
  check(!!org, "homepage: no Organization JSON-LD");
  check(org?.name && org?.url && org?.description, "Organization JSON-LD: name, url or description missing");
  check(org?.contactPoint?.some((c) => c["@type"] === "ContactPoint" && c.contactType && (c.email || c.telephone)), "Organization JSON-LD: no contactPoint with contactType and email or phone");
  check(org?.address?.["@type"] === "PostalAddress" && org.address.streetAddress && org.address.addressCountry, "Organization JSON-LD: no PostalAddress");
  check(blocks.some((b) => b["@type"] === "WebSite"), "homepage: no WebSite JSON-LD");
  check(/<link rel="alternate" type="text\/markdown" href="[^"]+\/index\.md"\/>/.test(page), "homepage: no <link rel=alternate type=text/markdown>");
}

// 2 · A missing page: 404, and a Markdown body for Accept: text/markdown.
{
  const path = `/__agent-check-404-${Date.now().toString(36)}`;
  const md = await get(path, "text/markdown");
  const body = await md.text();
  check(md.status === 404, `missing page as Markdown: status ${md.status}, expected 404`);
  check(type(md).startsWith("text/markdown"), `missing page as Markdown: Content-Type ${type(md)}`);
  check(body.length >= 20 && /llms\.txt|sitemap\.xml/.test(body), "missing page as Markdown: body does not explain the error and link to llms.txt or the sitemap");

  const html = await get(path, "text/html");
  check(html.status === 404 && type(html).startsWith("text/html"), `missing page as HTML: ${html.status} ${type(html)}`);
  check((await get(`${path}.md`)).status === 404, "missing .md address: not 404");
}

// 3 · Other pages and languages, by Accept and by .md address. The internal route stays hidden.
for (const [path, accept, h1] of [
  ["/materials/refractory-metals/tungsten/", "text/markdown", "# Tungsten"],
  ["/de/materials/refractory-metals/tungsten/", "text/markdown, text/html;q=0.8", "# Wolfram"],
  ["/materials/refractory-metals/tungsten.md", undefined, "# Tungsten"],
  ["/index.md", "text/html", "# Bimo Materials"],
  ["/ja.md", undefined, "# Bimo Materials"],
]) {
  const res = await get(path, accept);
  const body = await res.text();
  check(res.status === 200 && type(res).startsWith("text/markdown") && body.startsWith(h1), `${path} (${accept ?? "no Accept"}): ${res.status} ${type(res)} "${body.slice(0, 30)}"`);
  check(varyHasAccept(res), `${path}: Vary missing Accept`);
}
{
  const res = await get("/materials/", "text/html,application/xhtml+xml,*/*;q=0.8");
  check(res.status === 200 && type(res).startsWith("text/html"), `/materials/ for a browser: ${res.status} ${type(res)}`);
  check((await get("/md/")).status === 404, "/md/ is reachable directly");
}

// 4 · /llms.txt: H1, summary, when-to-use guidance, link lists whose links work.
{
  const res = await get("/llms.txt");
  const text = await res.text();
  check(res.status === 200 && type(res).startsWith("text/plain"), `/llms.txt: ${res.status} ${type(res)}`);
  check(text.startsWith("# ") && /\n> \S/.test(text), "/llms.txt: no H1 and blockquote summary");
  check(/when to use/i.test(text) && /## When to use/.test(text), "/llms.txt: no when-to-use guidance");
  const links = [...text.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => new URL(m[1]).pathname);
  check(links.length > 20, `/llms.txt: only ${links.length} links`);
  for (const p of [...new Set(links)].slice(0, 60)) {
    const r = await get(p);
    check(r.status === 200, `/llms.txt link ${p}: ${r.status}`);
  }
}

console.log(`${passed} checks passed on ${base}`);
if (warnings.length) console.warn(warnings.map((w) => `! ${w}`).join("\n"));
if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join("\n"));
  process.exit(1);
}
console.log("Agents get Markdown, a Markdown 404, llms.txt and the homepage JSON-LD.");
