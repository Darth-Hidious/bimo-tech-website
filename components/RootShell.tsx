import "@fontsource/google-sans/400.css";
import "@fontsource/google-sans/500.css";
import "@fontsource/google-sans/700.css";
import "@fontsource-variable/google-sans-code/wght.css";
import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LangProvider from "@/components/LangProvider";
import { HTML_LANG, type Lang } from "@/lib/i18n/config";
import { OG_IMAGE, SITE } from "@/lib/i18n/meta";
import { IS_LIVE } from "@/lib/site-url";
import { clientDict, tr } from "@/lib/i18n/server";

/** Site-wide metadata for a language. Pages add their own title, description and hreflang links. */
export function rootMetadata(lang: Lang): Metadata {
  const t = tr(lang);
  return {
    metadataBase: new URL(SITE),
    title: { default: `Bimo Materials · ${t("Specialty metals, powders and new alloys")}`, template: "%s · Bimo Materials" },
    icons: {
      icon: [{ url: "/favicon.ico" }, { url: "/img/brand/favicon-32.png", sizes: "32x32", type: "image/png" }],
      apple: "/img/brand/apple-touch-icon.png",
    },
    openGraph: { type: "website", siteName: "Bimo Materials", images: [OG_IMAGE] },
    ...(IS_LIVE ? {} : { robots: { index: false, follow: false } }),
  };
}

export const viewport: Viewport = { themeColor: "#11161b" };

/** <html> and <body> for one language: the two root layouts, (en) and [lang], both render this. */
export default function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = tr(lang);
  return (
    <html lang={HTML_LANG[lang]}>
      <body>
        <LangProvider lang={lang} dict={clientDict(lang)}>
          <a className="skip" href="#main">
            {t("Skip to content")}
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer lang={lang} />
        </LangProvider>
      </body>
    </html>
  );
}
