import Link from "next/link";
import MaterialsExplorer, { type FamilySummary } from "@/components/MaterialsExplorer";
import { content } from "@/lib/content";
import { href, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { tr } from "@/lib/i18n/server";

export function materialsMeta(lang: Lang) {
  const t = tr(lang);
  return pageMeta(lang, "/materials/", {
    title: t("Materials"),
    description: t("Refractory metals, specialty alloys, powders, sputtering targets, high-purity metals, nuclear-grade steel, high-entropy alloys and welding electrodes."),
  });
}

export default function Materials({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const to = (p: string) => href(lang, p);
  const { families } = content(lang);
  const english = content("en").families;

  const summaries: FamilySummary[] = families.map((f, fi) => {
    const en = english[fi];
    const items = [
      ...(f.materials ?? []).flatMap((m, mi) => [
        { name: m.name, en: en.materials![mi].name, href: to(`/materials/${f.slug}/${m.slug}/`) },
        ...(m.grades ?? []).map((g, gi) => ({ name: g, en: en.materials![mi].grades![gi], href: to(`/materials/${f.slug}/${m.slug}/`) })),
      ]),
      ...(f.groups ?? []).map((g, gi) => ({ name: g.title, en: en.groups![gi].title })),
    ];
    // Search in this language and in English: grades and standards are written the same everywhere,
    // and many buyers search in English whatever their language.
    const searchText = [f, ...(lang === "en" ? [] : [en])]
      .flatMap((x) => [
        x.name, x.short, x.intro, ...x.elements,
        ...(x.materials ?? []).flatMap((m) => [m.name, m.symbol, m.summary, ...(m.grades ?? []), ...(m.standards ?? []), ...m.forms]),
        ...(x.groups ?? []).flatMap((g) => [g.title, g.body]),
      ])
      .join(" ")
      .toLowerCase();
    return { slug: f.slug, name: f.name, short: f.short, elements: f.elements, tiles: f.tiles, items, searchText };
  });

  return (
    <section className="section">
      <div className="wrap">
        <nav className="crumbs" aria-label={t("Breadcrumb")}>
          <Link href={to("/")}>{t("Home")}</Link> / <span>{t("Materials")}</span>
        </nav>
        <div className="head">
          <h1 className="display">{t("Materials")}</h1>
          <p className="lead">{t("Metals, alloys, powders and targets, from a few grams to full containers, including hard-to-find materials.")}</p>
        </div>
        <MaterialsExplorer families={summaries} />
      </div>
    </section>
  );
}
