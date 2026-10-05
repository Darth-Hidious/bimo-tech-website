"use client";

import { createContext, useContext, useMemo } from "react";
import { fill, href, type Lang } from "@/lib/i18n/config";

type Ctx = { lang: Lang; dict: Record<string, string> };
const LangContext = createContext<Ctx>({ lang: "en", dict: {} });

/** Gives client components their language and the strings they use (see clientDict in lib/i18n/server.ts). */
export default function LangProvider({ lang, dict, children }: Ctx & { children: React.ReactNode }) {
  const value = useMemo(() => ({ lang, dict }), [lang, dict]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const { lang, dict } = useContext(LangContext);
  return useMemo(
    () => ({
      lang,
      t: (s: string, vars?: Record<string, string | number>) => fill(lang === "en" ? s : (dict[s] ?? s), vars),
      href: (path: string) => href(lang, path),
    }),
    [lang, dict],
  );
}
