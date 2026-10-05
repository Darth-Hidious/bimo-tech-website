// The 404 page for any address that matches no page, in any language. It renders outside the two
// root layouts, so it brings its own <html>, header and footer. English, with a way into every language.
import "@fontsource/google-sans/400.css";
import "@fontsource/google-sans/500.css";
import "@fontsource/google-sans/700.css";
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LangProvider from "@/components/LangProvider";
import { href, NATIVE, OTHER_LANGS } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Page not found · Bimo Materials",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en-GB">
      <body>
        <LangProvider lang="en" dict={{}}>
          <Header />
          <main id="main">
            <section className="section">
              <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
                <p className="kicker">404</p>
                <h1 className="display">This page is not here.</h1>
                <p className="lead">The page may have moved when we rebuilt the site. These will get you back on track:</p>
                <div className="btns">
                  <Link href="/materials/" className="btn btn--dark">Materials</Link>
                  <Link href="/manufacturing/" className="btn btn--ghost">Manufacturing</Link>
                  <Link href="/contact/" className="btn btn--primary">Request a quote</Link>
                </div>
                <p className="muted">
                  {OTHER_LANGS.map((l, i) => (
                    <span key={l}>
                      {i ? " · " : ""}
                      <a href={href(l, "/")} hrefLang={l} lang={l}>{NATIVE[l]}</a>
                    </span>
                  ))}
                </p>
              </div>
            </section>
          </main>
          <Footer lang="en" />
        </LangProvider>
      </body>
    </html>
  );
}
