import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Element from "@/components/Element";
import Photo from "@/components/Photo";
import QuoteButton from "@/components/QuoteButton";
import { families, familyBySlug } from "@/lib/catalog";
import type { ImageKey } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return families.map((f) => ({ family: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ family: string }> }): Promise<Metadata> {
  const f = familyBySlug((await params).family);
  return f ? { title: f.name, description: f.intro } : {};
}

// Family image keys map onto the site image registry.
const FAMILY_IMAGE: Record<string, ImageKey> = {
  "refractory-metals": "refractoryStock",
  "specialty-alloys": "specialty",
  powders: "powderJars",
  "sputtering-targets": "targets",
  "high-purity": "highPurity",
  "nuclear-grade": "nuclearSteel",
  "high-entropy-alloys": "coupons",
  "welding-electrodes": "electrode",
};

const SCALE_MAX = 3500; // °C, the right end of the melting-point chart

export default async function FamilyPage({ params }: { params: Promise<{ family: string }> }) {
  const f = familyBySlug((await params).family);
  if (!f) notFound();
  const withMelting = (f.materials ?? []).filter((m) => m.meltingC).sort((a, b) => b.meltingC! - a.meltingC!);

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href="/materials/">Materials</Link> / <span>{f.name}</span>
          </nav>
          <div className="family-hero">
            <div className="family-hero__text">
              <div className="tiles">
                {f.tiles.map((t) => (
                  <Element key={t} symbol={t} />
                ))}
              </div>
              <h1 className="display">{f.name}</h1>
              <p className="lead">{f.intro}</p>
              <div className="btns">
                <QuoteButton item={f.name} />
                <Link href={`/contact/?item=${encodeURIComponent(f.name)}`} className="btn btn--ghost">
                  Ask about {f.name.toLowerCase()}
                </Link>
              </div>
            </div>
            <Photo img={FAMILY_IMAGE[f.slug] ?? "hearth"} ratio="4 / 3" priority />
          </div>
        </div>
      </section>

      {withMelting.length > 1 ? (
        <section className="section--white section--tight">
          <div className="wrap">
            <h2 className="label" style={{ marginBottom: 18 }}>Melting point, °C</h2>
            <div className="mpchart" role="img" aria-label={withMelting.map((m) => `${m.name} ${m.meltingC} °C`).join(", ")}>
              {withMelting.map((m) => (
                <div className="mpchart__row" key={m.slug}>
                  <span className="mpchart__name">{m.name.replace(/ and .*/, "")}</span>
                  <span className="mpchart__track">
                    <span className="mpchart__bar" style={{ width: `${(m.meltingC! / SCALE_MAX) * 100}%` }} />
                  </span>
                  <span className="mono num">{m.meltingC!.toLocaleString("en-GB")}</span>
                </div>
              ))}
              <div className="mpchart__row mpchart__axis" aria-hidden="true">
                <span />
                <span className="mpchart__track">
                  {[0, 1000, 2000, 3000].map((t) => (
                    <span key={t} style={{ left: `${(t / SCALE_MAX) * 100}%` }}>{t.toLocaleString("en-GB")}</span>
                  ))}
                </span>
                <span />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {f.materials ? (
        <section className="section">
          <div className="wrap grid grid--3">
            {f.materials.map((m) => (
              <Link href={`/materials/${f.slug}/${m.slug}/`} className="card material-card" key={m.slug}>
                <Element symbol={m.symbol} z={m.z ?? null} />
                <h2 className="subtitle">{m.name}</h2>
                <p className="mono muted">
                  {[m.density ? `${m.density} g/cm³` : null, m.grades?.length ? `${m.grades.length} grades` : null, m.forms.slice(0, 3).join(" · ")]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="muted">{m.summary}</p>
                <span className="link-arrow">Open {m.name.toLowerCase()} →</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {f.groups ? (
        <section className="section">
          <div className="wrap">
            <dl className="rows group-rows">
              {f.groups.map((g) => (
                <div key={g.title} className="group-row">
                  <dt className="subtitle">{g.title}</dt>
                  <dd>{g.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <section className="section--graphite section--tight">
        <div className="wrap cta-band">
          <h2 className="subtitle">Need a size, purity or grade you don’t see here?</h2>
          <Link href={`/contact/?item=${encodeURIComponent(f.name)}`} className="btn btn--primary">
            Request a quote <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
