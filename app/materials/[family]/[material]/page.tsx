import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Element from "@/components/Element";
import QuoteButton from "@/components/QuoteButton";
import { allMaterials } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return allMaterials.map((m) => ({ family: m.family.slug, material: m.slug }));
}

type Params = Promise<{ family: string; material: string }>;

const find = async (params: Params) => {
  const p = await params;
  return allMaterials.find((m) => m.family.slug === p.family && m.slug === p.material);
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const m = await find(params);
  return m ? { title: `${m.name}: ${m.forms.slice(0, 3).join(", ").toLowerCase()}`, description: m.summary } : {};
}

export default async function MaterialPage({ params }: { params: Params }) {
  const m = await find(params);
  if (!m) notFound();
  const siblings = allMaterials.filter((x) => x.family.slug === m.family.slug && x.slug !== m.slug);

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href="/materials/">Materials</Link> /{" "}
            <Link href={`/materials/${m.family.slug}/`}>{m.family.name}</Link> / <span>{m.name}</span>
          </nav>
          <div className="material">
            <div className="material__id">
              <Element symbol={m.symbol} z={m.z ?? null} size="lg" />
              <h1 className="display">{m.name}</h1>
              <p className="lead">{m.summary}</p>
              <div className="btns">
                <QuoteButton item={m.name} />
                <Link href={`/contact/?item=${encodeURIComponent(m.name)}`} className="btn btn--ghost">
                  Ask an engineer
                </Link>
              </div>
            </div>
            <dl className="rows material__facts">
              {m.z ? (
                <div className="kv"><dt>Atomic number</dt><dd className="mono num">{m.z}</dd></div>
              ) : null}
              {m.meltingC ? (
                <div className="kv"><dt>Melting point</dt><dd className="mono num">{m.meltingC.toLocaleString("en-GB")} °C</dd></div>
              ) : null}
              {m.density ? (
                <div className="kv"><dt>Density</dt><dd className="mono num">{m.density} g/cm³</dd></div>
              ) : null}
              <div className="kv"><dt>Forms</dt><dd>{m.forms.join(" · ")}</dd></div>
              {m.standards ? (
                <div className="kv"><dt>Standards</dt><dd className="mono">{m.standards.join(" · ")}</dd></div>
              ) : null}
              <div className="kv"><dt>Used for</dt><dd>{m.uses.join(" · ")}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {m.grades ? (
        <section className="section--white section--tight">
          <div className="wrap">
            <h2 className="label" style={{ marginBottom: 16 }}>Grades we supply · {m.grades.length}</h2>
            <ul className="grades">
              {m.grades.map((g) => (
                <li key={g} className="chip mono">{g}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section section--tight">
        <div className="wrap grid grid--2">
          <div className="card pad">
            <h2 className="label">We can also</h2>
            <ul className="also">
              <li><Link href="/manufacturing/#machining">Machine it to drawing, to ±0.01 mm</Link></li>
              <li><Link href="/manufacturing/#pvd-coating">Coat it</Link></li>
              <li><Link href="/manufacturing/#testing">Test it, with records per lot</Link></li>
              <li><Link href="/new-alloys/">Develop a new alloy when no grade does the job</Link></li>
            </ul>
          </div>
          <div className="card pad">
            <h2 className="label">Stock sizes and lead times</h2>
            <p className="muted" style={{ marginTop: 12 }}>
              Sizes and lead times depend on stock on the day. Send the form, size and quantity you need and we reply with a price
              and a date.
            </p>
            <Link href={`/contact/?item=${encodeURIComponent(m.name)}`} className="link-arrow" style={{ marginTop: 14 }}>
              Request a quote for {m.name.toLowerCase()} →
            </Link>
          </div>
        </div>
      </section>

      {siblings.length ? (
        <section className="section--white section--tight">
          <div className="wrap">
            <h2 className="label" style={{ marginBottom: 16 }}>Also in {m.family.name.toLowerCase()}</h2>
            <div className="siblings">
              {siblings.map((s) => (
                <Link href={`/materials/${s.family.slug}/${s.slug}/`} key={s.slug} className="sibling">
                  <Element symbol={s.symbol} z={s.z ?? null} size="sm" />
                  <span>{s.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
