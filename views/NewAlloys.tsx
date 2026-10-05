import Link from "next/link";
import Photo from "@/components/Photo";
import { content } from "@/lib/content";
import { date, href, QUOTES, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { tr } from "@/lib/i18n/server";
import type { ImageKey } from "@/lib/site";

export function newAlloysMeta(lang: Lang) {
  const t = tr(lang);
  return pageMeta(lang, "/new-alloys/", {
    title: t("New alloys"),
    description: t("When no existing alloy survives the job, we develop one. SPARK: refractory high-entropy alloys for rocket engines, an ESA FIRST! Propulsion award winner."),
  });
}

export default function NewAlloys({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const to = (p: string) => href(lang, p);
  const { images } = content(lang);
  const steps: { t: string; l: string; img: ImageKey }[] = [
    { t: t("Requirement"), l: t("What the part must survive: temperature, atmosphere, loads, the material it has to beat."), img: "drawing" },
    { t: t("Design"), l: t("PRISM, from our group company Mirdyne, proposes candidate compositions."), img: "prism" },
    { t: t("Melt"), l: t("Test buttons, arc-melted in a copper hearth."), img: "melt" },
    { t: t("Powder"), l: t("The best few, made into powder."), img: "powder" },
    { t: t("Print"), l: t("Test parts built by laser powder-bed fusion."), img: "printer" },
    { t: t("Test"), l: t("Coupons tested against your numbers."), img: "coupon" },
  ];

  return (
    <>
      <section className="pagehero">
        <img className="pagehero__img" src={images.buttonDark.src} alt={images.buttonDark.alt} />
        <div className="pagehero__shade" />
        <div className="wrap pagehero__content">
          <nav className="crumbs crumbs--light" aria-label={t("Breadcrumb")}>
            <Link href={to("/")}>{t("Home")}</Link> / <span>{t("New alloys")}</span>
          </nav>
          <h1 className="display">{t("New alloys")}</h1>
          <p className="hero__lead">{t("When no existing alloy survives the job, we develop one, then make it in any form we sell.")}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head">
            <p className="kicker">{t("How a project runs")}</p>
            <h2 className="title">{t("From your requirement to a tested part.")}</h2>
          </div>
          <ol className="grid grid--3 runsteps">
            {steps.map((s, i) => (
              <li key={s.img}>
                <Photo img={s.img} lang={lang} ratio="3 / 2" />
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
            <Photo img="coupons" lang={lang} ratio="4 / 5" />
            <Photo img="button" lang={lang} ratio="4 / 5" />
          </div>
          <div className="spark__text">
            <p className="kicker">{t("Case")} · SPARK</p>
            <h2 className="title">{t("Refractory high-entropy alloys for rocket engines.")}</h2>
            <p className="lead">
              {t("SPARK, Space Propulsion Advanced Refractory alloys and Know-how, develops a new class of alloys for the heat, pressure and oxidising conditions inside next-generation rocket engines. We run it with ArianeGroup and European research institutions.")}
            </p>
            <dl className="rows facts facts--dark">
              <div className="kv"><dt>{t("Programme")}</dt><dd>{t("ESA FIRST! Propulsion, part of FLPP")}</dd></div>
              <div className="kv"><dt>{t("Category")}</dt><dd>{t("Materials and Processes")}</dd></div>
              <div className="kv"><dt>{t("Selected")}</dt><dd>{t("16 winners from 40 proposals")}</dd></div>
              <div className="kv"><dt>{t("Partner")}</dt><dd>ArianeGroup</dd></div>
              <div className="kv"><dt>{t("Announced")}</dt><dd className="mono">{date(lang, "2025-04-15")}</dd></div>
            </dl>
            <blockquote className="quote-block">
              <p>{QUOTES[lang][0]}{t("I believe our work is a vital step towards sustainable European propulsion.")}{QUOTES[lang][1]}</p>
              <footer>Marcin Orzechowski, CEO</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid grid--2">
          <div className="card pad">
            <p className="kicker">{t("Writing a proposal?")}</p>
            <h2 className="subtitle" style={{ margin: "10px 0 12px" }}>{t("We join funded projects as the materials partner.")}</h2>
            <p className="muted">{t("ESA, Horizon Europe and national calls: we bring the melting, the powder and the test data.")}</p>
            <div className="btns" style={{ marginTop: 20 }}>
              <Link href={to(`/contact/?item=${encodeURIComponent(t("Funded project"))}`)} className="btn btn--dark">{t("Invite us to a project")}</Link>
            </div>
          </div>
          <div className="card pad">
            <p className="kicker">{t("The design side")}</p>
            <h2 className="subtitle" style={{ margin: "10px 0 12px" }}>{t("PRISM, by Mirdyne.")}</h2>
            <p className="muted">{t("Our group company’s platform proposes the alloys; we melt, make and test them.")}</p>
            <div className="btns" style={{ marginTop: 20 }}>
              <a href="https://prism.mirdyne.com/" className="btn btn--ghost">{t("How PRISM works")} ↗</a>
              <Link href={to(`/contact/?item=${encodeURIComponent(t("New alloy"))}`)} className="btn btn--primary">{t("Start an alloy project")}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
