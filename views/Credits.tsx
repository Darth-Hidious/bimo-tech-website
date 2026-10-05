import Link from "next/link";
import { content } from "@/lib/content";
import { href, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { tr } from "@/lib/i18n/server";
import type { Img } from "@/lib/site";

export function creditsMeta(lang: Lang) {
  const t = tr(lang);
  return pageMeta(lang, "/credits/", {
    title: t("Picture credits"),
    description: t("Who took the photographs on this site, and under which licence."),
  });
}

export default function Credits({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const list = Object.values(content(lang).images as Record<string, Img>).filter((i) => i.src && i.credit);
  const own = list.filter((i) => !i.license);
  const licensed = list.filter((i) => i.license);
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 1040 }}>
        <nav className="crumbs" aria-label={t("Breadcrumb")}>
          <Link href={href(lang, "/")}>{t("Home")}</Link> / <span>{t("Picture credits")}</span>
        </nav>
        <h1 className="display" style={{ marginBottom: 24 }}>{t("Picture credits")}</h1>
        <p className="lead" style={{ marginBottom: 48 }}>
          {t("Every photograph on this site, who took it and how we may use it. Licensed photographs are cropped and resized to fit the layout.")}
        </p>

        <h2 className="subtitle" style={{ marginBottom: 16 }}>{t("Our own photographs")} · {own.length}</h2>
        <ul className="rows credits">
          {own.map((i) => (
            <li key={i.src}>
              <img src={i.src} alt="" loading="lazy" />
              <div>
                <p>{i.alt}</p>
                <p className="muted">{i.credit}</p>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="subtitle" style={{ margin: "56px 0 16px" }}>{t("Used under licence")} · {licensed.length}</h2>
        <ul className="rows credits">
          {licensed.map((i) => (
            <li key={i.src}>
              <img src={i.src} alt="" loading="lazy" />
              <div>
                <p>{i.alt}</p>
                <p className="muted">
                  {i.credit} · {i.licenseUrl ? <a href={i.licenseUrl}>{i.license}</a> : i.license}
                  {i.source ? <> · <a href={i.source}>{t("Source")}</a></> : null}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="muted" style={{ marginTop: 32 }}>{t("Partner and customer logos belong to their owners.")}</p>
      </div>
    </section>
  );
}
