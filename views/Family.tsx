import Link from "next/link";
import { notFound } from "next/navigation";
import Element from "@/components/Element";
import Photo from "@/components/Photo";
import QuoteButton from "@/components/QuoteButton";
import { content } from "@/lib/content";
import { comma, href, inSentence, LOCALE, num, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { tr } from "@/lib/i18n/server";
import type { ImageKey } from "@/lib/site";

export function familyMeta(lang: Lang, family: string) {
  const slug = family;
  const f = content(lang).familyBySlug(slug);
  return f ? pageMeta(lang, `/materials/${slug}/`, { title: f.name, description: f.intro }) : {};
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

export default function Family({ lang, family: slug }: { lang: Lang; family: string }) {
  const t = tr(lang);
  const to = (p: string) => href(lang, p);
  const f = content(lang).familyBySlug(slug);
  if (!f) notFound();
  const withMelting = (f.materials ?? []).filter((m) => m.meltingC).sort((a, b) => b.meltingC! - a.meltingC!);
  const ask = to(`/contact/?item=${encodeURIComponent(f.name)}`);
  // High-purity elements are listed alphabetically: re-sort them in each language.
  const groups = f.slug === "high-purity" ? [...(f.groups ?? [])].sort((a, b) => a.title.localeCompare(b.title, LOCALE[lang])) : (f.groups ?? []);

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <nav className="crumbs" aria-label={t("Breadcrumb")}>
            <Link href={to("/")}>{t("Home")}</Link> / <Link href={to("/materials/")}>{t("Materials")}</Link> / <span>{f.name}</span>
          </nav>
          <div className="family-hero">
            <div className="family-hero__text">
              <div className="tiles">
                {f.tiles.map((s) => (
                  <Element key={s} symbol={s} />
                ))}
              </div>
              <h1 className="display">{f.name}</h1>
              <p className="lead">{f.intro}</p>
              <div className="btns">
                <QuoteButton item={f.name} />
                <Link href={ask} className="btn btn--ghost">
                  {t("Ask an engineer")}
                </Link>
              </div>
            </div>
            <Photo img={FAMILY_IMAGE[f.slug] ?? "hearth"} lang={lang} ratio="4 / 3" priority />
          </div>
        </div>
      </section>

      {withMelting.length > 1 ? (
        <section className="section--white section--tight">
          <div className="wrap">
            <h2 className="label" style={{ marginBottom: 18 }}>{t("Melting point, °C")}</h2>
            <div className="mpchart" role="img" aria-label={withMelting.map((m) => `${m.chartName ?? m.name} ${num(lang, m.meltingC!)} °C`).join(comma(lang))}>
              {withMelting.map((m) => (
                <div className="mpchart__row" key={m.slug}>
                  <span className="mpchart__name">{m.chartName ?? m.name}</span>
                  <span className="mpchart__track">
                    <span className="mpchart__bar" style={{ width: `${(m.meltingC! / SCALE_MAX) * 100}%` }} />
                  </span>
                  <span className="mono num">{num(lang, m.meltingC!)}</span>
                </div>
              ))}
              <div className="mpchart__row mpchart__axis" aria-hidden="true">
                <span />
                <span className="mpchart__track">
                  {[0, 1000, 2000, 3000].map((v) => (
                    <span key={v} style={{ left: `${(v / SCALE_MAX) * 100}%` }}>{num(lang, v)}</span>
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
              <Link href={to(`/materials/${f.slug}/${m.slug}/`)} className="card material-card" key={m.slug}>
                <Element symbol={m.symbol} z={m.z ?? null} />
                <h2 className="subtitle">{m.name}</h2>
                <p className="mono muted">
                  {[m.density ? `${num(lang, m.density)} g/cm³` : null, m.grades?.length ? t("{n} grades", { n: m.grades.length }) : null, m.forms.slice(0, 3).join(" · ")]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="muted">{m.summary}</p>
                <span className="link-arrow">{t("Open {name}", { name: inSentence(lang, m.name) })} →</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {f.groups ? (
        <section className="section">
          <div className="wrap">
            <dl className="rows group-rows">
              {groups.map((g) => (
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
          <h2 className="subtitle">{t("Need a size, purity or grade you don’t see here?")}</h2>
          <Link href={ask} className="btn btn--primary">
            {t("Request a quote")} <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
