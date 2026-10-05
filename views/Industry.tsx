import Link from "next/link";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { href, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { tr } from "@/lib/i18n/server";
import type { Img } from "@/lib/site";

export function industryMeta(lang: Lang, slug: string) {
  const i = content(lang).industries.find((x) => x.slug === slug);
  return i ? pageMeta(lang, `/industries/${slug}/`, { title: i.name, description: i.intro }) : {};
}

export default function Industry({ lang, slug }: { lang: Lang; slug: string }) {
  const t = tr(lang);
  const to = (p: string) => href(lang, p);
  const { industries, images } = content(lang);
  const i = industries.find((x) => x.slug === slug);
  if (!i) notFound();
  const img: Img = images[i.img];

  return (
    <>
      <section className="pagehero">
        {img.src ? <img className="pagehero__img" src={img.src} alt={img.alt} /> : null}
        <div className="pagehero__shade" />
        <div className="wrap pagehero__content">
          <nav className="crumbs crumbs--light" aria-label={t("Breadcrumb")}>
            <Link href={to("/")}>{t("Home")}</Link> / <Link href={to("/industries/")}>{t("Industries")}</Link> / <span>{i.name}</span>
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
              <span className="label">{t("Programmes")}</span> {i.programmes.join(" · ")}
            </p>
          ) : null}
        </div>
      </section>

      <section className="section--white section--tight">
        <div className="wrap grid grid--2">
          <div>
            <h2 className="label" style={{ marginBottom: 10 }}>{t("Materials used here")}</h2>
            <ul className="rows linklist">
              {i.materials.map((m) => (
                <li key={m.href}><Link href={to(m.href)}>{m.label} <span aria-hidden="true">→</span></Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="label" style={{ marginBottom: 10 }}>{t("Services used here")}</h2>
            <ul className="rows linklist">
              {i.services.map((s) => (
                <li key={s.href}><Link href={to(s.href)}>{s.label} <span aria-hidden="true">→</span></Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section--graphite section--tight">
        <div className="wrap cta-band">
          <h2 className="subtitle">{t("Tell us what your project needs.")}</h2>
          <Link href={to(`/contact/?item=${encodeURIComponent(i.name)}`)} className="btn btn--primary">
            {t("Request a quote")} <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
