import Link from "next/link";
import Photo from "@/components/Photo";
import { content } from "@/lib/content";
import { href, inSentence, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { tr } from "@/lib/i18n/server";

export function industriesMeta(lang: Lang) {
  const t = tr(lang);
  return pageMeta(lang, "/industries/", {
    title: t("Industries"),
    description: t("Space, fusion and nuclear, aerospace and defence, electronics and thin film, water treatment."),
  });
}

export default function Industries({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const to = (p: string) => href(lang, p);
  const { industries } = content(lang);
  return (
    <section className="section">
      <div className="wrap">
        <nav className="crumbs" aria-label={t("Breadcrumb")}>
          <Link href={to("/")}>{t("Home")}</Link> / <span>{t("Industries")}</span>
        </nav>
        <div className="head">
          <h1 className="display">{t("Where our metals go")}</h1>
          <p className="lead">{t("The same catalog and workshop serve very different jobs. Pick yours to see what we supply and make for it.")}</p>
        </div>
        <div className="grid grid--3 industries-grid">
          {industries.map((i) => (
            <Link href={to(`/industries/${i.slug}/`)} key={i.slug} className="way">
              <Photo img={i.img} lang={lang} ratio="4 / 3" />
              <h2 className="subtitle">{i.name}</h2>
              <p className="muted">{i.line}</p>
              <span className="link-arrow">{t("Open {name}", { name: inSentence(lang, i.name) })} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
