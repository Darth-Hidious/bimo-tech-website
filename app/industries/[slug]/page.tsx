import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { images, industries, type Img } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const i = industries.find((x) => x.slug === slug);
  return i ? { title: i.name, description: i.intro } : {};
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const i = industries.find((x) => x.slug === slug);
  if (!i) notFound();
  const img: Img = images[i.img];

  return (
    <>
      <section className="pagehero">
        {img.src ? <img className="pagehero__img" src={img.src} alt={img.alt} /> : null}
        <div className="pagehero__shade" />
        <div className="wrap pagehero__content">
          <nav className="crumbs crumbs--light" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href="/industries/">Industries</Link> / <span>{i.name}</span>
          </nav>
          <h1 className="display">{i.name}</h1>
          <p className="hero__lead">{i.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid grid--3 industry-cols">
            {i.columns.map((c) => (
              <div key={c.title}>
                <h2 className="subtitle">{c.title}</h2>
                <p className="muted">{c.body}</p>
              </div>
            ))}
          </div>
          {i.programmes ? (
            <p className="programmes">
              <span className="label">Programmes</span> {i.programmes.join(" · ")}
            </p>
          ) : null}
        </div>
      </section>

      <section className="section--white section--tight">
        <div className="wrap grid grid--2">
          <div>
            <h2 className="label" style={{ marginBottom: 10 }}>Materials used here</h2>
            <ul className="rows linklist">
              {i.materials.map((m) => (
                <li key={m.href}><Link href={m.href}>{m.label} <span aria-hidden="true">→</span></Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="label" style={{ marginBottom: 10 }}>Services used here</h2>
            <ul className="rows linklist">
              {i.services.map((s) => (
                <li key={s.href}><Link href={s.href}>{s.label} <span aria-hidden="true">→</span></Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section--graphite section--tight">
        <div className="wrap cta-band">
          <h2 className="subtitle">Tell us what your project needs.</h2>
          <Link href={`/contact/?item=${encodeURIComponent(i.name + " project")}`} className="btn btn--primary">
            Request a quote <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
