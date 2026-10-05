import Link from "next/link";
import Photo from "@/components/Photo";
import Strip from "@/components/Strip";
import QuoteForm from "@/components/QuoteForm";
import Globe from "@/components/Globe";
import HeroSlides, { type Slide } from "@/components/HeroSlides";
import { content } from "@/lib/content";
import { href, num, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { tr } from "@/lib/i18n/server";
import type { ImageKey } from "@/lib/site";

export function homeMeta(lang: Lang) {
  const t = tr(lang);
  return pageMeta(lang, "/", {
    title: `Bimo Materials · ${t("Specialty metals, powders and new alloys")}`,
    absoluteTitle: true,
    description: t("Refractory metals, powders, sputtering targets, high-purity metals and new alloys for space, fusion and industry. Made in Wrocław and Oxford."),
  });
}

export default function Home({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const to = (p: string) => href(lang, p);
  const { images, outcomes, path, places, timeline, company } = content(lang);
  // The hero walks the path of the metal: the first six stops, each with its largest photo.
  const HERO: ImageKey[] = ["hearth", "melt", "powder", "printer", "pvd", "qualityLab"];
  const heroSlides: Slide[] = HERO.map((k, i) => ({ src: images[k].src!, alt: images[k].alt, n: path[i].n, title: path[i].title }));
  const ways: { n: string; t: string; l: string; href: string; c: string; img: ImageKey }[] = [
    { n: "01", t: t("Buy materials"), l: t("Metals, powders and targets from stock or to order, from a test batch to a container."), href: "/materials/", c: t("Browse materials"), img: "tungstenCrystals" },
    { n: "02", t: t("Get parts made"), l: t("Machined, forged, printed, coated and tested to your drawing."), href: "/manufacturing/", c: t("Manufacturing"), img: "machining" },
    { n: "03", t: t("Develop a new alloy"), l: t("When nothing on the shelf survives the job. From your requirement to a tested part."), href: "/new-alloys/", c: t("New alloys"), img: "melt" },
  ];

  return (
    <>
      {/* 1 · Hero: real metal, two lines, two buttons */}
      <section className="hero">
        <HeroSlides slides={heroSlides} />
        <div className="wrap hero__content">
          <h1 className="display">{t("Specialty metals, from raw stock to finished part.")}</h1>
          <p className="hero__lead">
            {t("Refractory metals, powders, sputtering targets and new alloys for space, fusion and industry. Made in Wrocław and Oxford, by a group in metals since 1992.")}
          </p>
          <div className="btns">
            <Link href={to("/materials/")} className="btn btn--light">
              {t("Browse materials")} <span className="arrow">→</span>
            </Link>
            <Link href={to("/contact/")} className="btn btn--primary">
              {t("Request a quote")}
            </Link>
          </div>
        </div>
      </section>

      {/* 2 · Who we are, in one breath */}
      <section className="section--white">
        <div className="wrap proof">
          <div className="proof__logos" aria-label={t("Customers and programmes")}>
            <span className="label proof__label">{t("Trusted on")}</span>
            <img className="logo-esa" src="/img/logos/logo_esa.svg" alt="ESA" />
            <img className="logo-ariane" src="/img/logos/logo_arianegroup.svg" alt="ArianeGroup" />
            <img className="logo-f4e" src="/img/logos/logo_f4e.svg" alt="Fusion for Energy" />
            <img className="logo-iter" src="/img/logos/logo_iter.svg" alt="ITER" />
          </div>
          <div className="proof__body">
            <p className="subtitle">
              {t("The Bimo group has supplied metals to science and industry since 1992. Bimo Materials also melts, powders, prints, coats and tests them.")}
            </p>
            <dl className="facts rows">
              <div className="kv"><dt>{t("ESA FIRST! Propulsion award")}</dt><dd className="mono">2025</dd></div>
              <div className="kv"><dt>{t("Titanium and steel for ITER")}</dt><dd className="mono">2022</dd></div>
              <div className="kv"><dt>{t("Quality and environment")}</dt><dd className="mono">ISO 9001 · ISO 14001</dd></div>
              <div className="kv"><dt>{t("Purity up to")}</dt><dd className="mono">7N · {num(lang, 99.99999, 5)}%</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* 3 · The path: the whole business as one sequence of photos */}
      <section className="section section--graphite">
        <div className="wrap">
          <div className="head">
            <p className="kicker">{t("How metal moves through Bimo")}</p>
            <h2 className="title">{t("From raw metal to tested part.")}</h2>
            <p className="lead">{t("Everything we sell sits on one path. Follow it, and stop wherever you need us.")}</p>
          </div>
          <Strip label={t("The path of the metal")}>
            {path.map((s) => (
              <article className="stop" role="listitem" key={s.n}>
                <Photo img={s.img} lang={lang} ratio="1 / 1" />
                <div className="stop__head">
                  <span className="kicker">{s.n}</span>
                  <h3>{s.title}</h3>
                </div>
                <p className="muted">{s.line}</p>
                <Link href={to(s.link.href)} className="link-arrow">
                  {s.link.label} →
                </Link>
              </article>
            ))}
          </Strip>
        </div>
      </section>

      {/* 4 · Three ways to work with us */}
      <section className="section">
        <div className="wrap">
          <div className="head">
            <p className="kicker">{t("Work with us")}</p>
            <h2 className="title">{t("Three ways to work with us.")}</h2>
            <form action={to("/materials/")} method="get" className="search" role="search">
              <label htmlFor="q" className="label">
                {t("Know the grade?")}
              </label>
              <div className="search__row">
                <input id="q" name="q" className="input" placeholder={t("TZM, Inconel 625, 6N copper")} />
                <button className="btn btn--dark" type="submit">
                  {t("Search")}
                </button>
              </div>
            </form>
          </div>
          <div className="grid grid--3 ways">
            {ways.map((w) => (
              <Link href={to(w.href)} className="way" key={w.n}>
                <Photo img={w.img} lang={lang} ratio="4 / 3" />
                <span className="kicker">{w.n}</span>
                <h3 className="subtitle">{w.t}</h3>
                <p className="muted">{w.l}</p>
                <span className="link-arrow">{w.c} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · What it means for your part */}
      <section className="section section--graphite">
        <div className="wrap">
          <div className="head">
            <p className="kicker">{t("Results")}</p>
            <h2 className="title">{t("What it means for your part.")}</h2>
          </div>
          <Strip label={t("Results")}>
            {outcomes.map((o) => (
              <Link href={to(o.href)} className="outcome" role="listitem" key={o.href + o.word}>
                <Photo img={o.img} lang={lang} ratio="1 / 1" />
                <span className="kicker">{o.tag}</span>
                <h3 className="title">{o.word}</h3>
                <p className="muted">{o.line}</p>
              </Link>
            ))}
          </Strip>
        </div>
      </section>

      {/* 6 · New alloys, with one real example */}
      <section className="section section--white">
        <div className="wrap spark">
          <div className="spark__photos">
            <Photo img="buttonDark" lang={lang} ratio="4 / 3" />
            <Photo img="coupons" lang={lang} ratio="4 / 3" />
          </div>
          <div className="spark__text">
            <p className="kicker">ESA FIRST! Propulsion · 2025</p>
            <h2 className="title">{t("When nothing on the shelf survives the job, we develop a new alloy.")}</h2>
            <p className="lead">
              {t("In SPARK we are developing refractory high-entropy alloys for rocket engines, with ArianeGroup. ESA chose it as one of 16 winners from 40 proposals.")}
            </p>
            <div className="btns">
              <Link href={to("/new-alloys/")} className="btn btn--dark">
                {t("The SPARK project")} <span className="arrow">→</span>
              </Link>
              <a href="https://prism.mirdyne.com/" className="btn btn--ghost">
                {t("How PRISM designs alloys")} ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7 · Who makes it, and where */}
      <section className="section">
        <div className="wrap">
          <div className="head">
            <p className="kicker">{t("Company")}</p>
            <h2 className="title">{t("Wrocław and Oxford.")}</h2>
            <p className="lead">{t("Made in Wrocław, where the Bimo group has worked since 1992. Oxford is our contact point for UK customers and research partners.")}</p>
          </div>
          <div className="where">
            <Globe places={places} label={t("A satellite view of the Earth turning to Europe, with Wrocław and Oxford marked.")} />
            <dl className="where__list">
              {places.map((p) => (
                <div key={p.lat}>
                  <dt>{p.name}</dt>
                  <dd>{p.role}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ol className="timeline">
            {timeline.map((e) => (
              <li key={e.year}>
                <span className="timeline__year num">{e.year}</span>
                <span>{e.text}</span>
              </li>
            ))}
          </ol>
          <Link href={to("/company/")} className="link-arrow">
            {t("About us")} →
          </Link>
        </div>
      </section>

      {/* 8 · Request a quote */}
      <section className="section section--graphite" id="quote">
        <div className="wrap quote-section">
          <div className="quote-section__intro">
            <p className="kicker">{t("Request a quote")}</p>
            <h2 className="title">{t("Send us a drawing or a specification.")}</h2>
            <p className="lead">{t("We reply with a price and a lead time.")}</p>
          </div>
          <QuoteForm email={company.email} compact />
        </div>
      </section>
    </>
  );
}
