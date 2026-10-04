"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { atomicNumber, cells } from "@/lib/elements";

export type FamilySummary = {
  slug: string;
  name: string;
  short: string;
  elements: string[];
  tiles: string[];
  items: { name: string; href?: string }[];
  searchText: string;
};

// The catalog's front door: search, or pick an element on the periodic table.
export default function MaterialsExplorer({ families }: { families: FamilySummary[] }) {
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
    needle ? f.items.filter((i) => i.name.toLowerCase().includes(needle)) : [];

  return (
    <div className="explorer">
      <div className="explorer__top">
        <label className="field explorer__search">
          Search by element, alloy, grade or standard
          <input
            className="input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="TZM, Inconel 625, 6N, RCC-M"
          />
        </label>
        {el || q ? (
          <button type="button" className="btn btn--ghost" onClick={() => { setEl(null); setQ(""); }}>
            Clear{el ? ` ${el}` : ""}
          </button>
        ) : null}
      </div>

      <div className="ptable-wrap">
        <div className="ptable" role="group" aria-label="Periodic table. Highlighted elements are in our catalog.">
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
                aria-label={`${c.symbol}, atomic number ${c.z}`}
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
          <span className="ptable__key" /> {listed.size} elements in the catalog. Pick one to see where we have it.
        </p>
      </div>

      <p className="explorer__count" role="status">
        {shown.length === families.length && !el && !needle
          ? `${families.length} families`
          : `${shown.length} of ${families.length} families${el ? ` with ${el}` : ""}${needle ? ` matching “${q.trim()}”` : ""}`}
      </p>

      <ul className="families">
        {shown.map((f) => {
          const hits = itemMatches(f);
          return (
            <li key={f.slug}>
              <Link href={`/materials/${f.slug}/`} className="family-row">
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
          Nothing in the published catalog matches. We source many materials to order: <Link href="/contact/">ask us</Link>.
        </p>
      ) : null}
    </div>
  );
}
