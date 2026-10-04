import Link from "next/link";
import Photo from "@/components/Photo";
import Strip from "@/components/Strip";
import QuoteForm from "@/components/QuoteForm";
import { images, outcomes, path, timeline } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* 1 · Hero: real metal, two lines, two buttons */}
      <section className="hero">
        <img className="hero__img" src={images.hearth.src} alt={images.hearth.alt} fetchPriority="high" />
        <div className="hero__shade" />
        <div className="wrap hero__content">
          <h1 className="display">Specialty metals, from raw stock to finished part.</h1>
          <p className="hero__lead">
            Refractory metals, powders, sputtering targets and new alloys for space, fusion and industry. Made in Wrocław and
            Oxford, by a group in metals since 1992.
          </p>
          <div className="btns">
            <Link href="/materials/" className="btn btn--light">
              Browse materials <span className="arrow">→</span>
            </Link>
            <Link href="/contact/" className="btn btn--primary">
              Request a quote
            </Link>
          </div>
        </div>
      </section>

      {/* 2 · Who we are, in one breath */}
      <section className="section--white">
        <div className="wrap proof">
          <div className="proof__logos" aria-label="Customers and programmes">
            <span className="label">Trusted on</span>
            <img className="logo-esa" src="/img/logos/logo_esa.svg" alt="ESA" />
            <img className="logo-ariane" src="/img/logos/logo_arianegroup.svg" alt="ArianeGroup" />
            <img className="logo-f4e" src="/img/logos/logo_f4e.svg" alt="Fusion for Energy" />
            <img className="logo-iter" src="/img/logos/logo_iter.svg" alt="ITER" />
          </div>
          <div className="proof__body">
            <p className="subtitle">
              The Bimo group has supplied metals to science and industry since 1992. Bimo Materials also melts, powders,
              prints, coats and tests them.
            </p>
            <dl className="facts rows">
              <div className="kv"><dt>ESA FIRST! Propulsion award</dt><dd className="mono">2025</dd></div>
              <div className="kv"><dt>Titanium and steel for ITER</dt><dd className="mono">2022</dd></div>
              <div className="kv"><dt>Quality and environment</dt><dd className="mono">ISO 9001 · ISO 14001</dd></div>
              <div className="kv"><dt>Purity up to</dt><dd className="mono">7N · 99.99999%</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* 3 · The path: the whole business as one sequence of photos */}
      <section className="section section--graphite">
        <div className="wrap">
          <div className="head">
            <p className="kicker">How metal moves through Bimo</p>
            <h2 className="title">From raw metal to tested part.</h2>
            <p className="lead">Everything we sell sits on one path. Follow it, and stop wherever you need us.</p>
          </div>
          <Strip label="The path of the metal">
            {path.map((s) => (
              <article className="stop" role="listitem" key={s.n}>
                <Photo img={s.img} ratio="1 / 1" />
                <div className="stop__head">
                  <span className="kicker">{s.n}</span>
                  <h3>{s.title}</h3>
                </div>
                <p className="muted">{s.line}</p>
                <Link href={s.link.href} className="link-arrow">
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
            <p className="kicker">Work with us</p>
            <h2 className="title">Three ways to work with us.</h2>
            <form action="/materials/" method="get" className="search" role="search">
              <label htmlFor="q" className="label">
                Know the grade?
              </label>
              <div className="search__row">
                <input id="q" name="q" className="input" placeholder="TZM, Inconel 625, 6N copper" />
                <button className="btn btn--dark" type="submit">
                  Search
                </button>
              </div>
            </form>
          </div>
          <div className="grid grid--3 ways">
            {[
              { n: "01", t: "Buy materials", l: "Metals, powders and targets from stock or to order, from a test batch to a container.", href: "/materials/", c: "Browse materials", img: "tungstenCrystals" as const },
              { n: "02", t: "Get parts made", l: "Machined, forged, printed, coated and tested to your drawing.", href: "/manufacturing/", c: "Manufacturing", img: "machining" as const },
              { n: "03", t: "Develop a new alloy", l: "When nothing on the shelf survives the job. From your requirement to a tested part.", href: "/new-alloys/", c: "New alloys", img: "melt" as const },
            ].map((w) => (
              <Link href={w.href} className="way" key={w.n}>
                <Photo img={w.img} ratio="4 / 3" />
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
            <p className="kicker">Results</p>
            <h2 className="title">What it means for your part.</h2>
          </div>
          <Strip label="Results">
            {outcomes.map((o) => (
              <Link href={o.href} className="outcome" role="listitem" key={o.word}>
                <Photo img={o.img} ratio="1 / 1" />
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
            <Photo img="buttonDark" ratio="4 / 3" />
            <Photo img="coupons" ratio="4 / 3" />
          </div>
          <div className="spark__text">
            <p className="kicker">ESA FIRST! Propulsion · 2025</p>
            <h2 className="title">When nothing on the shelf survives the job, we develop a new alloy.</h2>
            <p className="lead">
              In SPARK we are developing refractory high-entropy alloys for rocket engines, with ArianeGroup. ESA chose it as one
              of 16 winners from 40 proposals.
            </p>
            <div className="btns">
              <Link href="/new-alloys/" className="btn btn--dark">
                The SPARK project <span className="arrow">→</span>
              </Link>
              <a href="https://prism.mirdyne.com/" className="btn btn--ghost">
                How PRISM designs alloys ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7 · Who makes it, and where */}
      <section className="section">
        <div className="wrap">
          <div className="head">
            <p className="kicker">Company</p>
            <h2 className="title">Wrocław and Oxford.</h2>
            <p className="lead">Made in Wrocław, where the Bimo group has worked since 1992. Oxford is our contact point for UK customers and research partners.</p>
          </div>
          <div className="grid grid--2">
            <Photo img="wroclaw" ratio="16 / 9" />
            <Photo img="oxford" ratio="16 / 9" />
          </div>
          <ol className="timeline">
            {timeline.map((t) => (
              <li key={t.year}>
                <span className="timeline__year num">{t.year}</span>
                <span>{t.text}</span>
              </li>
            ))}
          </ol>
          <Link href="/company/" className="link-arrow">
            About us →
          </Link>
        </div>
      </section>

      {/* 8 · Request a quote */}
      <section className="section section--graphite" id="quote">
        <div className="wrap quote-section">
          <div className="quote-section__intro">
            <p className="kicker">Request a quote</p>
            <h2 className="title">Send us a drawing or a specification.</h2>
            <p className="lead">We reply with a price and a lead time.</p>
          </div>
          <QuoteForm compact />
        </div>
      </section>
    </>
  );
}
