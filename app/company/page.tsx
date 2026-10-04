import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import { company, news, timeline } from "@/lib/site";

export const metadata: Metadata = {
  title: "Company",
  description: "Bimo Materials: Wrocław and Oxford. Part of the Bimo group, in metals since 1992. ISO 9001 and ISO 14001.",
};

const fmt = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function CompanyPage() {
  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <span>Company</span>
          </nav>
          <div className="head">
            <h1 className="display">Wrocław and Oxford.</h1>
            <p className="lead">
              Bimo Materials is part of the Bimo group, which has supplied metals to science and industry since 1992. We make in
              Wrocław and work with UK customers and research partners from Oxford.
            </p>
          </div>
          <div className="grid grid--2">
            <div className="place">
              <Photo img="wroclaw" ratio="16 / 10" />
              <h2 className="subtitle">Wrocław, Poland</h2>
              <p className="muted">Melting, powder, machining and testing. {company.address.join(", ")}.</p>
            </div>
            <div className="place">
              <Photo img="oxford" ratio="16 / 10" />
              <h2 className="subtitle">Oxford, United Kingdom</h2>
              <p className="muted">Bimo Materials Ltd. The contact point for UK customers, programmes and research partners.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="wrap">
          <div className="head">
            <p className="kicker">History</p>
            <h2 className="title">More than thirty years in metals.</h2>
          </div>
          <ol className="history rows">
            {timeline.map((t) => (
              <li key={t.year}>
                <span className="timeline__year num">{t.year}</span>
                <span>{t.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid grid--3">
          <div className="card pad">
            <p className="kicker">Certificates</p>
            <h2 className="subtitle" style={{ margin: "10px 0" }}>ISO 9001:2015 and ISO 14001:2015</h2>
            <p className="muted">Quality and environmental management.</p>
          </div>
          <div className="card pad">
            <p className="kicker">Award</p>
            <h2 className="subtitle" style={{ margin: "10px 0" }}>ESA FIRST! Propulsion, 2025</h2>
            <p className="muted">Materials and Processes category, for the SPARK project.</p>
            <Link href="/new-alloys/#spark" className="link-arrow" style={{ marginTop: 10 }}>Read about SPARK →</Link>
          </div>
          <div className="card pad">
            <p className="kicker">The Bimo group</p>
            <h2 className="subtitle" style={{ margin: "10px 0" }}>Three companies, one chain.</h2>
            <p className="muted">
              <a href="https://prism.mirdyne.com/">PRISM by Mirdyne</a> designs alloys. Bimo Materials develops and makes them.{" "}
              <a href="https://www.bimotech.pl/">Bimo Tech</a> has supplied metals and parts since 1992.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--white" id="news">
        <div className="wrap">
          <div className="head">
            <p className="kicker">News</p>
            <h2 className="title">Latest from the workshop.</h2>
          </div>
          <ul className="news rows">
            {news.map((n) => (
              <li key={n.date}>
                <time className="mono" dateTime={n.date}>{fmt(n.date)}</time>
                <span className="label">{n.tag}</span>
                <div>
                  <h3 className="news__title">{n.title}</h3>
                  <p className="muted">{n.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
