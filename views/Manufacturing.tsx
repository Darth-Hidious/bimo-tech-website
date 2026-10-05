import Link from "next/link";
import Photo from "@/components/Photo";
import QuoteButton from "@/components/QuoteButton";
import { content } from "@/lib/content";
import { href, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { tr } from "@/lib/i18n/server";

export function manufacturingMeta(lang: Lang) {
  const t = tr(lang);
  return pageMeta(lang, "/manufacturing/", {
    title: t("Manufacturing"),
    description: t("CNC machining of refractory metals to ±0.01 mm, forging, casting and metal 3D printing, PVD coating, cold spray and testing."),
  });
}

export default function Manufacturing({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const to = (p: string) => href(lang, p);
  const { services, projectSteps } = content(lang);
  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <nav className="crumbs" aria-label={t("Breadcrumb")}>
            <Link href={to("/")}>{t("Home")}</Link> / <span>{t("Manufacturing")}</span>
          </nav>
          <div className="head">
            <h1 className="display">{t("Manufacturing")}</h1>
            <p className="lead">{t("We also make parts from the metals we supply: machined, forged, cast, printed, coated and tested to your drawing.")}</p>
          </div>
          <div className="grid grid--3 services">
            {services.map((s) => (
              <article key={s.id} id={s.id} className="service">
                <Photo img={s.img} lang={lang} ratio="4 / 3" />
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
            <p className="kicker">{t("Components and devices")}</p>
            <h2 className="title">{t("From the first calculation to commissioning.")}</h2>
            <p className="lead">{t("Precision parts in metals, plastics and other materials, and complete devices built and handed over working.")}</p>
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
            <Link href={to(`/contact/?item=${encodeURIComponent(t("Components and devices"))}`)} className="btn btn--primary">
              {t("Start a project")} <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
