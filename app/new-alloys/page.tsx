import type { Metadata } from "next";
import Link from "next/link";
import Photo, { creditText } from "@/components/Photo";
import { images, type ImageKey } from "@/lib/site";

export const metadata: Metadata = {
  title: "New alloys",
  description:
    "When no existing alloy survives the job, we develop one. SPARK: refractory high-entropy alloys for rocket engines, an ESA FIRST! Propulsion award winner.",
};

const STEPS: { t: string; l: string; img: ImageKey }[] = [
  { t: "Requirement", l: "What the part must survive: temperature, atmosphere, loads, the material it has to beat.", img: "drawing" },
  { t: "Design", l: "PRISM, from our group company Mirdyne, proposes candidate compositions.", img: "prism" },
  { t: "Melt", l: "Test buttons, arc-melted in a copper hearth.", img: "melt" },
  { t: "Powder", l: "The best few, made into powder.", img: "powder" },
  { t: "Print", l: "Test parts built by laser powder-bed fusion.", img: "printer" },
  { t: "Test", l: "Coupons tested against your numbers.", img: "coupon" },
];

export default function NewAlloysPage() {
  return (
    <>
      <section className="pagehero">
        <img className="pagehero__img" src={images.buttonDark.src} alt={images.buttonDark.alt} />
        <div className="pagehero__shade" />
        <div className="wrap pagehero__content">
          <nav className="crumbs crumbs--light" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <span>New alloys</span>
          </nav>
          <h1 className="display">New alloys</h1>
          <p className="hero__lead">When no existing alloy survives the job, we develop one, then make it in any form we sell.</p>
        </div>
        <p className="hero__credit">{creditText(images.buttonDark)}</p>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head">
            <p className="kicker">How a project runs</p>
            <h2 className="title">From your requirement to a tested part.</h2>
          </div>
          <ol className="grid grid--3 runsteps">
            {STEPS.map((s, i) => (
              <li key={s.t}>
                <Photo img={s.img} ratio="3 / 2" />
                <h3 className="subtitle">
                  <span className="kicker num">{String(i + 1).padStart(2, "0")}</span> {s.t}
                </h3>
                <p className="muted">{s.l}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--graphite" id="spark">
        <div className="wrap spark">
          <div className="spark__photos">
            <Photo img="coupons" ratio="4 / 5" />
            <Photo img="button" ratio="4 / 5" />
          </div>
          <div className="spark__text">
            <p className="kicker">Case · SPARK</p>
            <h2 className="title">Refractory high-entropy alloys for rocket engines.</h2>
            <p className="lead">
              SPARK, Space Propulsion Advanced Refractory alloys and Know-how, develops a new class of alloys for the heat,
              pressure and oxidising conditions inside next-generation rocket engines. We run it with ArianeGroup and European
              research institutions.
            </p>
            <dl className="rows facts facts--dark">
              <div className="kv"><dt>Programme</dt><dd>ESA FIRST! Propulsion, part of FLPP</dd></div>
              <div className="kv"><dt>Category</dt><dd>Materials and Processes</dd></div>
              <div className="kv"><dt>Selected</dt><dd>16 winners from 40 proposals</dd></div>
              <div className="kv"><dt>Partner</dt><dd>ArianeGroup</dd></div>
              <div className="kv"><dt>Announced</dt><dd className="mono">15 April 2025</dd></div>
            </dl>
            <blockquote className="quote-block">
              <p>“I believe our work is a vital step towards sustainable European propulsion.”</p>
              <footer>Marcin Orzechowski, CEO</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid grid--2">
          <div className="card pad">
            <p className="kicker">Writing a proposal?</p>
            <h2 className="subtitle" style={{ margin: "10px 0 12px" }}>We join funded projects as the materials partner.</h2>
            <p className="muted">ESA, Horizon Europe and national calls: we bring the melting, the powder and the test data.</p>
            <div className="btns" style={{ marginTop: 20 }}>
              <Link href="/contact/?item=Funded%20project" className="btn btn--dark">Invite us to a project</Link>
            </div>
          </div>
          <div className="card pad">
            <p className="kicker">The design side</p>
            <h2 className="subtitle" style={{ margin: "10px 0 12px" }}>PRISM, by Mirdyne.</h2>
            <p className="muted">Our group company’s platform proposes the alloys; we melt, make and test them.</p>
            <div className="btns" style={{ marginTop: 20 }}>
              <a href="https://prism.mirdyne.com/" className="btn btn--ghost">How PRISM works ↗</a>
              <Link href="/contact/?item=New%20alloy" className="btn btn--primary">Start an alloy project</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
