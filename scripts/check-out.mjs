// Checks the built site (the pre-rendered HTML in .next/server/app) for each language:
//   - <html lang>, canonical and the 11 hreflang links (10 languages + x-default) on every page
//   - no English left on translated pages: visible text, alt texts, labels, placeholders, <title>
//     and meta descriptions are searched for English sentences that have a different translation.
// Run after `npm run build`: node scripts/check-out.mjs

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, IS_LIVE } from "../lib/site-url.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, ".next/server/app");
const LANGS = ["en", "pl", "de", "fr", "es", "it", "cs", "sk", "hu", "ja"];
const HTML_LANG = { en: "en-GB" };
const keys = JSON.parse(readFileSync(join(root, "lib/i18n/keys.json"), "utf8")).all;

// Pre-rendered pages: /materials/powders/ is materials/powders.html, / is index.html, /de/ is de.html.
const SKIP = new Set(["_not-found", "_global-error", "api", "404", "500", "index"]);
const pages = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return dir === out && (LANGS.includes(n) || SKIP.has(n)) ? [] : pages(p);
    return n.endsWith(".html") && !(dir === out && (SKIP.has(n.slice(0, -5)) || LANGS.includes(n.slice(0, -5)))) ? [p] : [];
  });
const fileFor = (lang, path) => {
  const rest = path === "/" ? "" : path.slice(1, -1);
  if (lang === "en") return join(out, rest ? `${rest}.html` : "index.html");
  return join(out, rest ? `${lang}/${rest}.html` : `${lang}.html`);
};

const decode = (s) =>
  s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

/** What a reader or a search engine sees: text, alt, aria-label, placeholder, title and description. */
function readable(html) {
  const body = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");
  const attrs = [...body.matchAll(/\s(?:alt|aria-label|placeholder|title)="([^"]*)"/g)].map((m) => m[1]);
  const meta = [...html.matchAll(/<meta (?:name="description"|property="og:(?:title|description)") content="([^"]*)"/g)].map((m) => m[1]);
  const text = body.replace(/<[^>]+>/g, "\n");
  return decode([text, ...attrs, ...meta].join("\n")).replace(/[ \t ]+/g, " ");
}

const problems = [];
const englishPages = ["/", ...pages(out).map((p) => "/" + relative(out, p).replace(/\\/g, "/").slice(0, -5) + "/")];
for (const lang of LANGS) {
  const dict = lang === "en" ? {} : JSON.parse(readFileSync(join(root, `lib/i18n/dict/${lang}.json`), "utf8"));
  // English sentences whose translation differs: finding one on a translated page means a string was not translated.
  // (Skip English that a translation keeps on purpose, such as a postal address in Latin script.)
  const kept = Object.values(dict).join("\n");
  const tells = keys.filter((k) => k.length >= 14 && /\s/.test(k) && !/[{<]/.test(k) && dict[k] && dict[k] !== k && !kept.includes(k));
  let leaks = 0;
  for (const path of englishPages) {
    const file = fileFor(lang, path);
    if (!existsSync(file)) { problems.push(`${lang}: missing page ${path}`); continue; }
    const html = readFileSync(file, "utf8");
    const want = HTML_LANG[lang] ?? lang;
    if (!html.includes(`<html lang="${want}"`)) problems.push(`${lang}${path}: html lang is not ${want}`);
    const url = `${SITE}${lang === "en" ? "" : "/" + lang}${path}`;
    if (!html.includes(`<link rel="canonical" href="${url}"/>`)) problems.push(`${lang}${path}: canonical is not ${url}`);
    // Before launch every page is noindex; once live, none is.
    const noindex = /<meta name="robots" content="noindex/.test(html);
    if (noindex !== !IS_LIVE) problems.push(`${lang}${path}: robots noindex is ${noindex}, expected ${!IS_LIVE}`);
    const alts = html.match(/<link rel="alternate" hrefLang="[^"]+" href="[^"]+"\/>/g) ?? [];
    if (alts.length !== 11) problems.push(`${lang}${path}: ${alts.length} hreflang links, expected 11`);
    if (lang === "en") continue;
    const text = readable(html);
    for (const k of tells) {
      if (text.includes(k)) {
        if (leaks++ < 15) problems.push(`${lang}${path}: English left: "${k}"`);
      }
    }
  }
  if (leaks > 15) problems.push(`${lang}: … ${leaks - 15} more English strings`);
}
console.log(`${englishPages.length} pages × ${LANGS.length} languages checked for ${SITE} (${IS_LIVE ? "live: indexable" : "before launch: noindex"})`);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("No problems: every page has its language, canonical and hreflang links, and no English left.");
