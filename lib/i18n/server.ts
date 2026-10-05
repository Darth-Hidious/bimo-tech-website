// Translation on the server, at build time. Every page in every language is rendered from these
// dictionaries, keyed by the English text. A missing translation fails the build, so no page ships
// half in English. Set I18N_LENIENT=1 to fall back to English while translations are being written.

import { fill, type Lang, type OtherLang } from "./config";
import { mapStrings } from "./walk";
import keys from "./keys.json";
import pl from "./dict/pl.json";
import de from "./dict/de.json";
import fr from "./dict/fr.json";
import es from "./dict/es.json";
import it from "./dict/it.json";
import cs from "./dict/cs.json";
import sk from "./dict/sk.json";
import hu from "./dict/hu.json";
import ja from "./dict/ja.json";

type Dict = Record<string, string>;
const DICTS: Record<OtherLang, Dict> = { pl, de, fr, es, it, cs, sk, hu, ja };
const LENIENT = process.env.I18N_LENIENT === "1";

export type T = (s: string, vars?: Record<string, string | number>) => string;

/** The translate function for a language: t("Materials") is "Werkstoffe" in German. */
export function tr(lang: Lang): T {
  if (lang === "en") return fill;
  const dict = DICTS[lang];
  return (s, vars) => {
    const hit = dict[s];
    if (hit === undefined) {
      if (!LENIENT) throw new Error(`No ${lang} translation for "${s}". Add it to lib/i18n/dict/${lang}.json.`);
      return fill(s, vars);
    }
    return fill(hit, vars);
  };
}

/** The same data with its text translated (see lib/i18n/walk.ts for what counts as text). */
export function localize<D>(lang: Lang, data: D): D {
  if (lang === "en") return data;
  return mapStrings(data, tr(lang));
}

/** The strings client components need, for one language. Sent with each page instead of the whole dictionary. */
export function clientDict(lang: Lang): Dict {
  if (lang === "en") return {};
  const t = tr(lang);
  return Object.fromEntries(keys.client.map((k) => [k, t(k)]));
}
