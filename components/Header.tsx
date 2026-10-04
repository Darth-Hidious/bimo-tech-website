"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { onBasketChange, readBasket } from "@/lib/basket";

export const NAV = [
  { href: "/materials/", label: "Materials" },
  { href: "/manufacturing/", label: "Manufacturing" },
  { href: "/new-alloys/", label: "New alloys" },
  { href: "/industries/", label: "Industries" },
  { href: "/company/", label: "Company" },
];

export default function Header() {
  const path = usePathname() ?? "/";
  const [count, setCount] = useState(0);
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const sync = () => setCount(readBasket().length);
    sync();
    return onBasketChange(sync);
  }, []);

  // Close the phone menu after navigating.
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [path]);

  const current = (href: string) => (path.startsWith(href) ? "page" : undefined);

  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <Link href="/" className="site-header__logo" aria-label="Bimo Materials, home">
          <img src="/img/brand/bimo-materials-logo-header.png" alt="Bimo Materials" width={125} height={40} />
        </Link>
        <nav className="site-nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={current(n.href)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="site-header__actions">
          {count > 0 ? (
            <Link href="/contact/" className="basket">
              Quote · {count}
            </Link>
          ) : null}
          <Link href="/contact/" className="btn btn--primary">
            Request a quote
          </Link>
        </div>
        <details className="menu" ref={menu}>
          <summary aria-label="Menu">
            Menu <span aria-hidden="true">☰</span>
          </summary>
          <div className="menu__panel">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={current(n.href)}>
                {n.label}
              </Link>
            ))}
            <Link href="/contact/" className="btn btn--primary">
              Request a quote{count > 0 ? ` · ${count}` : ""}
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
