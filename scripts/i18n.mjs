// Collects every English string the site shows and checks the translations.
//
//   node scripts/i18n.mjs extract   writes lib/i18n/keys.json (all strings, and those client components use)
//   node scripts/i18n.mjs check     fails if keys.json is stale, or any language misses a string or
//                                   breaks a {placeholder} or <0>tag</0>. Runs before every build.
//
// Strings come from two places: t("…") and msg("…") calls in the code, and the text in the site's
// data (lib/catalog.ts, lib/site.ts), picked out by the same rules the site uses (lib/i18n/walk.ts).

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mapStrings } from "../lib/i18n/walk.ts";
import { families } from "../lib/catalog.ts";
import * as site from "../lib/site.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OTHER = ["pl", "de", "fr", "es", "it", "cs", "sk", "hu", "ja"];
const DATA = [families, site.images, site.path, site.outcomes, site.services, site.projectSteps, site.industries, site.timeline, site.news, site.company, site.places, site.group];

function files(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(n) ? [p] : [];
  });
}

const CALL = /\b(?:t|msg)\(\s*("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`[^`$\\]*`)/g;
const literal = (q) => (q[0] === "`" ? q.slice(1, -1) : q[0] === "'" ? JSON.parse(`"${q.slice(1, -1).replace(/"/g, '\\"')}"`) : JSON.parse(q));

function extract() {
  const all = new Set();
  const client = new Set();
  for (const f of ["app", "views", "components"].flatMap((d) => files(join(root, d)))) {
    const src = readFileSync(f, "utf8");
    const isClient = /^\s*["']use client["']/.test(src);
    for (const m of src.matchAll(CALL)) {
      const s = literal(m[1]);
      all.add(s);
      if (isClient) client.add(s);
    }
  }
  for (const d of DATA) mapStrings(d, (s) => (all.add(s), s));
  const sort = (set) => [...set].sort((a, b) => a.localeCompare(b, "en"));
  return { all: sort(all), client: sort(client) };
}

const tokens = (s) => [...s.matchAll(/\{\w+\}|<\/?\d+>/g)].map((m) => m[0]).sort().join(" ");

const mode = process.argv[2];
const keysPath = join(root, "lib/i18n/keys.json");
const fresh = extract();

if (mode === "extract") {
  writeFileSync(keysPath, JSON.stringify(fresh, null, 2) + "\n");
  console.log(`${fresh.all.length} strings, ${fresh.client.length} used by client components → lib/i18n/keys.json`);
} else if (mode === "check") {
  const problems = [];
  const saved = JSON.parse(readFileSync(keysPath, "utf8"));
  if (JSON.stringify(saved) !== JSON.stringify(fresh)) problems.push("lib/i18n/keys.json is out of date: run node scripts/i18n.mjs extract");
  for (const l of OTHER) {
    const dict = JSON.parse(readFileSync(join(root, `lib/i18n/dict/${l}.json`), "utf8"));
    const missing = fresh.all.filter((k) => typeof dict[k] !== "string" || !dict[k].trim());
    if (missing.length) problems.push(`${l}: ${missing.length} missing, e.g. "${missing[0]}"`);
    for (const k of fresh.all) if (dict[k] && tokens(dict[k]) !== tokens(k)) problems.push(`${l}: placeholders differ in "${k}" → "${dict[k]}"`);
    const extra = Object.keys(dict).filter((k) => !fresh.all.includes(k));
    if (extra.length) console.warn(`${l}: ${extra.length} unused strings (left in place), e.g. "${extra[0]}"`);
  }
  if (problems.length) {
    console.error(problems.join("\n"));
    if (process.env.I18N_LENIENT !== "1") process.exit(1);
  } else console.log(`i18n: ${fresh.all.length} strings, all ${OTHER.length} languages complete`);
} else {
  console.error("usage: node scripts/i18n.mjs extract|check");
  process.exit(2);
}
