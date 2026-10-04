import type { Metadata } from "next";
import Link from "next/link";
import MaterialsExplorer, { type FamilySummary } from "@/components/MaterialsExplorer";
import { families } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Materials",
  description:
    "Refractory metals, specialty alloys, powders, sputtering targets, high-purity metals, nuclear-grade steel, high-entropy alloys and welding electrodes.",
};

export default function MaterialsPage() {
  const summaries: FamilySummary[] = families.map((f) => {
    const items = [
      ...(f.materials ?? []).flatMap((m) => [
        { name: m.name, href: `/materials/${f.slug}/${m.slug}/` },
        ...(m.grades ?? []).map((g) => ({ name: g, href: `/materials/${f.slug}/${m.slug}/` })),
      ]),
      ...(f.groups ?? []).map((g) => ({ name: g.title })),
    ];
    const searchText = [
      f.name, f.short, f.intro, ...f.elements,
      ...(f.materials ?? []).flatMap((m) => [m.name, m.symbol, m.summary, ...(m.grades ?? []), ...(m.standards ?? []), ...m.forms]),
      ...(f.groups ?? []).flatMap((g) => [g.title, g.body]),
    ].join(" ").toLowerCase();
    return { slug: f.slug, name: f.name, short: f.short, elements: f.elements, tiles: f.tiles, items, searchText };
  });

  return (
    <section className="section">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>Materials</span>
        </nav>
        <div className="head">
          <h1 className="display">Materials</h1>
          <p className="lead">
            Metals, alloys, powders and targets, from a few grams to full containers, including hard-to-find materials.
          </p>
        </div>
        <MaterialsExplorer families={summaries} />
      </div>
    </section>
  );
}
