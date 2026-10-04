import Link from "next/link";

export default function NotFound() {
  return (
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
      </div>
    </section>
  );
}
