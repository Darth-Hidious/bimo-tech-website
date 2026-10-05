// The 404 page for any address that matches no page. It renders outside the two root layouts, so it
// brings its own <html>; components/NotFound.tsx shows it in the visitor's language.
import "@fontsource/google-sans/400.css";
import "@fontsource/google-sans/500.css";
import "@fontsource/google-sans/700.css";
import "./globals.css";
import type { Metadata } from "next";
import NotFound from "@/components/NotFound";
import { LANGS, type Lang } from "@/lib/i18n/config";
import { clientDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "404 · Bimo Materials",
  robots: { index: false },
};

const dicts = Object.fromEntries(LANGS.map((l) => [l, clientDict(l)])) as Record<Lang, Record<string, string>>;

export default function GlobalNotFound() {
  return (
    <html lang="en-GB">
      <body>
        <NotFound dicts={dicts} />
      </body>
    </html>
  );
}
