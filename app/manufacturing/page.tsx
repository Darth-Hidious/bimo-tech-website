import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/Photo";
import QuoteButton from "@/components/QuoteButton";
import { projectSteps, services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Manufacturing",
  description:
    "CNC machining of refractory metals to ±0.01 mm, forging, casting and metal 3D printing, PVD coating, cold spray and testing.",
};

export default function ManufacturingPage() {
  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <span>Manufacturing</span>
          </nav>
          <div className="head">
            <h1 className="display">Manufacturing</h1>
            <p className="lead">We also make parts from the metals we supply: machined, forged, cast, printed, coated and tested to your drawing.</p>
          </div>
          <div className="grid grid--3 services">
            {services.map((s) => (
              <article key={s.id} id={s.id} className="service">
                <Photo img={s.img} ratio="4 / 3" />
                <h2 className="subtitle">{s.name}</h2>
                <p className="muted">{s.line}</p>
                <ul className="ticks">
                  {s.detail.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <QuoteButton item={s.name} className="btn btn--ghost" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--graphite" id="components">
        <div className="wrap">
          <div className="head">
            <p className="kicker">Components and devices</p>
            <h2 className="title">From the first calculation to commissioning.</h2>
            <p className="lead">Precision parts in metals, plastics and other materials, and complete devices built and handed over working.</p>
          </div>
          <ol className="steps">
            {projectSteps.map((s, i) => (
              <li key={s}>
                <span className="kicker num">{String(i + 1).padStart(2, "0")}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <div className="btns" style={{ marginTop: 40 }}>
            <Link href="/contact/?item=Components%20and%20devices" className="btn btn--primary">
              Start a project <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
