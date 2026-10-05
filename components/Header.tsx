"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { onBasketChange, readBasket } from "@/lib/basket";
import { href, LANGS, msg, NATIVE, splitPath } from "@/lib/i18n/config";
import { useLang } from "@/components/LangProvider";

const NAV = [
  { href: "/materials/", label: msg("Materials") },
  { href: "/manufacturing/", label: msg("Manufacturing") },
  { href: "/new-alloys/", label: msg("New alloys") },
  { href: "/industries/", label: msg("Industries") },
  { href: "/company/", label: msg("Company") },
];

/** The same page in every language. Plain links, so they work without JavaScript and search engines follow them. */
function Languages({ rest, className }: { rest: string; className: string }) {
  const { lang } = useLang();
  return (
    <ul className={className}>
      {LANGS.map((l) => (
        <li key={l}>
          <a href={href(l, rest)} hrefLang={l} lang={l} aria-current={l === lang ? "true" : undefined}>
            {NATIVE[l]}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Header() {
  const path = usePathname() ?? "/";
  const { lang, t, href: to } = useLang();
  const { rest } = splitPath(path);
  const [count, setCount] = useState(0);
  const menu = useRef<HTMLDetailsElement>(null);
  const langMenu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const sync = () => setCount(readBasket().length);
    sync();
    return onBasketChange(sync);
  }, []);

  // Close the menus after navigating.
  useEffect(() => {
    if (menu.current) menu.current.open = false;
    if (langMenu.current) langMenu.current.open = false;
  }, [path]);

  const current = (h: string) => (rest.startsWith(h) ? "page" : undefined);

  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <Link href={to("/")} className="site-header__logo" aria-label={t("Bimo Materials, home")}>
          <img src="/img/brand/bimo-materials-logo-header.png" alt="Bimo Materials" width={125} height={40} />
        </Link>
        <nav className="site-nav" aria-label={t("Main")}>
          {NAV.map((n) => (
            <Link key={n.href} href={to(n.href)} aria-current={current(n.href)}>
              {t(n.label)}
            </Link>
          ))}
        </nav>
        <div className="site-header__actions">
          <details className="langs" ref={langMenu}>
            <summary aria-label={t("Language: {name}", { name: NATIVE[lang] })}>
              <span aria-hidden="true">{lang.toUpperCase()}</span>
            </summary>
            <Languages rest={rest} className="langs__panel" />
          </details>
          {count > 0 ? (
            <Link href={to("/contact/")} className="basket">
              {t("Quote")} · {count}
            </Link>
          ) : null}
          <Link href={to("/contact/")} className="btn btn--primary">
            {t("Request a quote")}
          </Link>
        </div>
        <Link href={to("/contact/")} className="btn btn--primary header-quote">
          {t("Quote")}
          {count > 0 ? ` · ${count}` : ""}
        </Link>
        <details className="menu" ref={menu}>
          <summary aria-label={t("Menu")}>
            {t("Menu")} <span aria-hidden="true">☰</span>
          </summary>
          <div className="menu__panel">
            {NAV.map((n) => (
              <Link key={n.href} href={to(n.href)} aria-current={current(n.href)}>
                {t(n.label)}
              </Link>
            ))}
            <Link href={to("/contact/")} className="btn btn--primary">
              {t("Request a quote")}
              {count > 0 ? ` · ${count}` : ""}
            </Link>
            <Languages rest={rest} className="menu__langs" />
          </div>
        </details>
      </div>
    </header>
  );
}
