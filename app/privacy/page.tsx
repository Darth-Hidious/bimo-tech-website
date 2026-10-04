import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  // Draft until the legal text is reviewed: keep it out of search results.
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="wrap prose">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>Privacy</span>
        </nav>
        <h1 className="display">Privacy</h1>
        <p className="lead">Draft. The legally reviewed notice replaces this text before launch.</p>
        <h2 className="subtitle">What we collect</h2>
        <p>
          When you send the quote form we receive what you type into it. We use it only to answer your request. The quote basket
          is kept in your own browser and is not sent anywhere until you send the form.
        </p>
        <h2 className="subtitle">Cookies and tracking</h2>
        <p>This site sets no cookies and loads no third-party trackers. Fonts are served from our own server.</p>
        <h2 className="subtitle">Contact</h2>
        <p>
          Questions about your data: <a href={`mailto:${company.email}`}>{company.email}</a>.
        </p>
      </div>
    </section>
  );
}
