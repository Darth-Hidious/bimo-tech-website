"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { atomicNumber, cells } from "@/lib/elements";
import { rich } from "@/lib/i18n/rich";
import { useLang } from "@/components/LangProvider";

export type FamilySummary = {
  slug: string;
  name: string;
  short: string;
  elements: string[];
  tiles: string[];
  items: { name: string; en: string; href?: string }[]; // en: the English name, so English searches work in every language
  searchText: string; // this language and English
};

// The catalog's front door: search, or pick an element on the periodic table.
export default function MaterialsExplorer({ families }: { families: FamilySummary[] }) {
  const { t, href } = useLang();
  const [q, setQ] = useState("");
  const [el, setEl] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const query = p.get("q");
    if (query) setQ(query);
    const e = p.get("element");
    if (e) setEl(e);
  }, []);

  const listed = useMemo(() => new Set(families.flatMap((f) => f.elements)), [families]);

  const needle = q.trim().toLowerCase();
  const shown = families.filter(
    (f) => (!el || f.elements.includes(el)) && (!needle || f.searchText.includes(needle)),
  );
  // Show the matching items inside a family when searching.
  const itemMatches = (f: FamilySummary) =>
    needle ? f.items.filter((i) => i.name.toLowerCase().includes(needle) || i.en.toLowerCase().includes(needle)) : [];

  return (
    <div className="explorer">
      <div className="explorer__top">
        <label className="field explorer__search">
          {t("Search by element, alloy, grade or standard")}
          <input
            className="input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="TZM, Inconel 625, 6N, RCC-M"
          />
        </label>
        <label className="field explorer__select">
          {t("Element")}
          <select className="input" value={el ?? ""} onChange={(e) => setEl(e.target.value || null)}>
            <option value="">{t("All elements")}</option>
            {cells
              .filter((c) => c.symbol && listed.has(c.symbol))
              .sort((a, b) => (a.z ?? 0) - (b.z ?? 0))
              .map((c) => (
                <option key={c.symbol} value={c.symbol}>
                  {c.symbol} · {c.z}
                </option>
              ))}
          </select>
        </label>
        {el || q ? (
          <button type="button" className="btn btn--ghost" onClick={() => { setEl(null); setQ(""); }}>
            {el ? t("Clear {element}", { element: el }) : t("Clear")}
          </button>
        ) : null}
      </div>

      <div className="ptable-wrap">
        <div className="ptable" role="group" aria-label={t("Periodic table. Highlighted elements are in our catalog.")}>
          {cells.map((c, i) =>
            c.gap || !c.symbol ? (
              <span key={i} className="ptable__gap" style={{ gridRow: c.row, gridColumn: c.col }} aria-hidden="true" />
            ) : listed.has(c.symbol) ? (
              <button
                key={c.symbol}
                type="button"
                className={`ptable__cell is-listed${el === c.symbol ? " is-active" : ""}`}
                style={{ gridRow: c.row, gridColumn: c.col }}
                onClick={() => setEl(el === c.symbol ? null : c.symbol)}
                aria-pressed={el === c.symbol}
                aria-label={t("{symbol}, atomic number {z}", { symbol: c.symbol, z: c.z ?? "" })}
              >
                <small>{c.z}</small>
                {c.symbol}
              </button>
            ) : (
              <span key={c.symbol} className="ptable__cell" style={{ gridRow: c.row, gridColumn: c.col }} aria-hidden="true">
                <small>{c.z}</small>
                {c.symbol}
              </span>
            ),
          )}
        </div>
        <p className="ptable__legend">
          <span className="ptable__key" /> {t("{n} elements in the catalog. Pick one to see where we have it.", { n: listed.size })}
        </p>
      </div>

      <p className="explorer__count" role="status">
        {shown.length === families.length && !el && !needle
          ? t("{n} material families", { n: families.length })
          : [
              t("{shown} of {total} material families", { shown: shown.length, total: families.length }),
              el ? t("with {element}", { element: el }) : "",
              needle ? t("matching “{query}”", { query: q.trim() }) : "",
            ].filter(Boolean).join(" ")}
      </p>

      <ul className="families">
        {shown.map((f) => {
          const hits = itemMatches(f);
          return (
            <li key={f.slug}>
              <Link href={href(`/materials/${f.slug}/`)} className="family-row">
                <span className="tiles" aria-hidden="true">
                  {f.tiles.map((t) => (
                    <span key={t} className={`el el--sm${t === el ? " el--dark" : ""}`}>
                      <small>{atomicNumber(t)}</small>
                      <b>{t}</b>
                    </span>
                  ))}
                </span>
                <span className="family-row__name">{f.name}</span>
                <span className="family-row__short">{f.short}</span>
                <span aria-hidden="true">→</span>
              </Link>
              {hits.length ? (
                <ul className="family-hits">
                  {hits.map((h) => (
                    <li key={h.name}>
                      {h.href ? <Link href={h.href}>{h.name}</Link> : h.name}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
      {shown.length === 0 ? (
        <p className="muted">
          {rich(t("Nothing in the published catalog matches. We source many materials to order: <0>ask us</0>."), [<Link href={href("/contact/")} />])}
        </p>
      ) : null}
    </div>
  );
}
