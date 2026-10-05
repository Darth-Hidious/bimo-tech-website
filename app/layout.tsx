import type { Metadata, Viewport } from "next";
import "@fontsource/google-sans/400.css";
import "@fontsource/google-sans/500.css";
import "@fontsource/google-sans/700.css";
import "@fontsource-variable/google-sans-code/wght.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://bimomaterials.com"),
  title: {
    default: "Bimo Materials · Specialty metals, powders and new alloys",
    template: "%s · Bimo Materials",
  },
  description:
    "Refractory metals, powders, sputtering targets, high-purity metals and new alloys for space, fusion and industry. Made in Wrocław and Oxford.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/img/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/img/brand/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Bimo Materials",
    images: ["/img/brand/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#11161b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
