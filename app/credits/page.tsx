import type { Metadata } from "next";
import Link from "next/link";
import { images, type Img } from "@/lib/site";

export const metadata: Metadata = {
  title: "Picture credits",
  description: "Who took the photographs on this site, and under which licence.",
};

export default function CreditsPage() {
  const list = Object.values(images as Record<string, Img>).filter((i) => i.src && i.credit);
  const own = list.filter((i) => !i.license);
  const licensed = list.filter((i) => i.license);
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 1040 }}>
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>Picture credits</span>
        </nav>
        <h1 className="display" style={{ marginBottom: 24 }}>Picture credits</h1>
        <p className="lead" style={{ marginBottom: 48 }}>
          Every photograph on this site, who took it and how we may use it. Licensed photographs are cropped and resized to fit
          the layout.
        </p>

        <h2 className="subtitle" style={{ marginBottom: 16 }}>Our own photographs · {own.length}</h2>
        <ul className="rows credits">
          {own.map((i) => (
            <li key={i.src}>
              <img src={i.src} alt="" loading="lazy" />
              <div>
                <p>{i.alt}</p>
                <p className="muted">{i.credit}</p>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="subtitle" style={{ margin: "56px 0 16px" }}>Used under licence · {licensed.length}</h2>
        <ul className="rows credits">
          {licensed.map((i) => (
            <li key={i.src}>
              <img src={i.src} alt="" loading="lazy" />
              <div>
                <p>{i.alt}</p>
                <p className="muted">
                  {i.credit} · {i.licenseUrl ? <a href={i.licenseUrl}>{i.license}</a> : i.license}
                  {i.source ? <> · <a href={i.source}>Source</a></> : null}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="muted" style={{ marginTop: 32 }}>Partner and customer logos belong to their owners.</p>
      </div>
    </section>
  );
}
