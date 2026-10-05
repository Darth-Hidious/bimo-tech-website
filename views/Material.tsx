import Link from "next/link";
import { notFound } from "next/navigation";
import Element from "@/components/Element";
import Photo from "@/components/Photo";
import QuoteButton from "@/components/QuoteButton";
import { content } from "@/lib/content";
import { href, inSentence, num, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { tr } from "@/lib/i18n/server";
import type { ImageKey } from "@/lib/site";

const find = (lang: Lang, family: string, material: string) =>
  content(lang).allMaterials.find((m) => m.family.slug === family && m.slug === material);

export function materialMeta(lang: Lang, family: string, material: string) {
  const m = find(lang, family, material);
  if (!m) return {};
  // "Tungsten: sheet, plate, rod": the name and the forms people search for, in their language.
  const forms = m.forms.slice(0, 3).map((x) => inSentence(lang, x)).join(", ");
  return pageMeta(lang, `/materials/${family}/${material}/`, { title: `${m.name}: ${forms}`, description: m.summary });
}

export default function Material({ lang, family, material }: { lang: Lang; family: string; material: string }) {
  const t = tr(lang);
  const to = (p: string) => href(lang, p);
  const m = find(lang, family, material);
  if (!m) notFound();
  const siblings = content(lang).allMaterials.filter((x) => x.family.slug === m.family.slug && x.slug !== m.slug);
  const ask = to(`/contact/?item=${encodeURIComponent(m.name)}`);

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <nav className="crumbs" aria-label={t("Breadcrumb")}>
            <Link href={to("/")}>{t("Home")}</Link> / <Link href={to("/materials/")}>{t("Materials")}</Link> /{" "}
            <Link href={to(`/materials/${m.family.slug}/`)}>{m.family.name}</Link> / <span>{m.name}</span>
          </nav>
          <div className="material">
            <div className="material__id">
              <Element symbol={m.symbol} z={m.z ?? null} size="lg" />
              <h1 className="display">{m.name}</h1>
              <p className="lead">{m.summary}</p>
              <div className="btns">
                <QuoteButton item={m.name} />
                <Link href={ask} className="btn btn--ghost">
                  {t("Ask an engineer")}
                </Link>
              </div>
            </div>
            <div className="material__side">
              {m.img ? <Photo img={m.img as ImageKey} lang={lang} ratio="16 / 10" priority /> : null}
              <dl className="rows material__facts">
                {m.z ? (
                  <div className="kv"><dt>{t("Atomic number")}</dt><dd className="mono num">{m.z}</dd></div>
                ) : null}
                {m.meltingC ? (
                  <div className="kv"><dt>{t("Melting point")}</dt><dd className="mono num">{num(lang, m.meltingC)} °C</dd></div>
                ) : null}
                {m.density ? (
                  <div className="kv"><dt>{t("Density")}</dt><dd className="mono num">{num(lang, m.density)} g/cm³</dd></div>
                ) : null}
                <div className="kv"><dt>{t("Forms")}</dt><dd>{m.forms.join(" · ")}</dd></div>
                {m.standards ? (
                  <div className="kv"><dt>{t("Standards")}</dt><dd className="mono">{m.standards.join(" · ")}</dd></div>
                ) : null}
                <div className="kv"><dt>{t("Used for")}</dt><dd>{m.uses.join(" · ")}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {m.grades ? (
        <section className="section--white section--tight">
          <div className="wrap">
            <h2 className="label" style={{ marginBottom: 16 }}>{t("Grades we supply")} · {m.grades.length}</h2>
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
            <h2 className="label">{t("We can also")}</h2>
            <ul className="also">
              <li><Link href={to("/manufacturing/#machining")}>{t("Machine it to drawing, to ±0.01 mm")}</Link></li>
              <li><Link href={to("/manufacturing/#pvd-coating")}>{t("Coat it")}</Link></li>
              <li><Link href={to("/manufacturing/#testing")}>{t("Test it, with records per lot")}</Link></li>
              <li><Link href={to("/new-alloys/")}>{t("Develop a new alloy when no grade does the job")}</Link></li>
            </ul>
          </div>
          <div className="card pad">
            <h2 className="label">{t("Stock sizes and lead times")}</h2>
            <p className="muted" style={{ marginTop: 12 }}>
              {t("Sizes and lead times depend on stock on the day. Send the form, size and quantity you need and we reply with a price and a date.")}
            </p>
            <Link href={ask} className="link-arrow" style={{ marginTop: 14 }}>
              {t("Request a quote for {name}", { name: inSentence(lang, m.name) })} →
            </Link>
          </div>
        </div>
      </section>

      {siblings.length ? (
        <section className="section--white section--tight">
          <div className="wrap">
            <h2 className="label" style={{ marginBottom: 16 }}>{t("Also in {family}", { family: inSentence(lang, m.family.name) })}</h2>
            <div className="siblings">
              {siblings.map((s) => (
                <Link href={to(`/materials/${s.family.slug}/${s.slug}/`)} key={s.slug} className="sibling">
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
