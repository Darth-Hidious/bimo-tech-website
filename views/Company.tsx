import Link from "next/link";
import Globe from "@/components/Globe";
import Photo from "@/components/Photo";
import { content } from "@/lib/content";
import { date, href, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { rich } from "@/lib/i18n/rich";
import { tr } from "@/lib/i18n/server";

export function companyMeta(lang: Lang) {
  const t = tr(lang);
  return pageMeta(lang, "/company/", {
    title: t("Company"),
    description: t("Bimo Materials: Wrocław and Oxford. Part of the Bimo group, in metals since 1992. ISO 9001 and ISO 14001."),
  });
}

export default function Company({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const to = (p: string) => href(lang, p);
  const { company, news, places, timeline } = content(lang);
  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <nav className="crumbs" aria-label={t("Breadcrumb")}>
            <Link href={to("/")}>{t("Home")}</Link> / <span>{t("Company")}</span>
          </nav>
          <div className="head">
            <h1 className="display">{t("Wrocław and Oxford.")}</h1>
            <p className="lead">
              {t("Bimo Materials is part of the Bimo group, which has supplied metals to science and industry since 1992. We make in Wrocław and work with UK customers and research partners from Oxford.")}
            </p>
          </div>
          <div className="where where--page">
            <Globe places={places} label={t("A satellite view of the Earth turning to Europe, with Wrocław, Oxford and Giessen marked.")} />
          </div>
          <div className="grid grid--2 pair">
            <div className="place">
              <Photo img="wroclaw" lang={lang} ratio="16 / 10" />
              <h2 className="subtitle">{t("Wrocław, Poland")}</h2>
              <p className="muted">{t("Melting, powder, machining and testing.")} {company.address.join(", ")}.</p>
            </div>
            <div className="place">
              <Photo img="oxford" lang={lang} ratio="16 / 10" />
              <h2 className="subtitle">{t("Oxford, United Kingdom")}</h2>
              <p className="muted">{t("Bimo Materials Ltd. The contact point for UK customers, programmes and research partners.")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="wrap">
          <div className="head">
            <p className="kicker">{t("History")}</p>
            <h2 className="title">{t("More than thirty years in metals.")}</h2>
          </div>
          <ol className="history rows">
            {timeline.map((e) => (
              <li key={e.year}>
                <span className="timeline__year num">{e.year}</span>
                <span>{e.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid grid--3">
          <div className="card pad">
            <p className="kicker">{t("Certificates")}</p>
            <h2 className="subtitle" style={{ margin: "10px 0" }}>ISO 9001:2015 · ISO 14001:2015</h2>
            <p className="muted">{t("Quality and environmental management.")}</p>
          </div>
          <div className="card pad">
            <p className="kicker">{t("Award")}</p>
            <h2 className="subtitle" style={{ margin: "10px 0" }}>ESA FIRST! Propulsion, 2025</h2>
            <p className="muted">{t("Materials and Processes category, for the SPARK project.")}</p>
            <Link href={to("/new-alloys/#spark")} className="link-arrow" style={{ marginTop: 10 }}>{t("Read about SPARK")} →</Link>
          </div>
          <div className="card pad">
            <p className="kicker">{t("The Bimo group")}</p>
            <h2 className="subtitle" style={{ margin: "10px 0" }}>{t("Three companies, one chain.")}</h2>
            <p className="muted">
              {rich(t("<0>PRISM by Mirdyne</0> designs alloys. Bimo Materials develops and makes them. <1>Bimo Tech</1> has supplied metals and parts since 1992."), [
                <a href="https://prism.mirdyne.com/" />,
                <a href="https://www.bimotech.pl/" />,
              ])}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--white" id="news">
        <div className="wrap">
          <div className="head">
            <p className="kicker">{t("News")}</p>
            <h2 className="title">{t("Latest from the workshop.")}</h2>
          </div>
          <ul className="news rows">
            {news.map((n) => (
              <li key={n.date}>
                <time className="mono" dateTime={n.date}>{date(lang, n.date)}</time>
                <span className="label">{n.tag}</span>
                <div>
                  <h3 className="news__title">{n.title}</h3>
                  <p className="muted">{n.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
