"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import LangProvider, { useLang } from "@/components/LangProvider";
import { HTML_LANG, href, LANGS, NATIVE, splitPath, type Lang } from "@/lib/i18n/config";

function Body() {
  const { lang, t, href: to } = useLang();
  return (
    <main id="main">
      <section className="section">
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
          <p className="kicker">404</p>
          <h1 className="display">{t("This page is not here.")}</h1>
          <p className="lead">{t("The page may have moved when we rebuilt the site. These will get you back on track:")}</p>
          <div className="btns">
            <Link href={to("/materials/")} className="btn btn--dark">{t("Materials")}</Link>
            <Link href={to("/manufacturing/")} className="btn btn--ghost">{t("Manufacturing")}</Link>
            <Link href={to("/contact/")} className="btn btn--primary">{t("Request a quote")}</Link>
          </div>
          <p className="muted">
            {LANGS.filter((l) => l !== lang).map((l, i) => (
              <span key={l}>
                {i ? " · " : ""}
                <a href={href(l, "/")} hrefLang={l} lang={l}>{NATIVE[l]}</a>
              </span>
            ))}
          </p>
        </div>
      </section>
    </main>
  );
}

/**
 * The 404 page in the visitor's language, read from the address they asked for (/de/… → German).
 * It is one static page for every address, so it starts in English and switches once it knows.
 */
export default function NotFound({ dicts }: { dicts: Record<Lang, Record<string, string>> }) {
  const path = usePathname() ?? "/";
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const l = splitPath(window.location.pathname).lang;
    setLang(l);
    document.documentElement.lang = HTML_LANG[l];
  }, [path]);
  return (
    <LangProvider lang={lang} dict={dicts[lang]}>
      <Header languagesToHome />
      <Body />
    </LangProvider>
  );
}
