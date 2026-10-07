import Link from "next/link";
import { content } from "@/lib/content";
import { href, type Lang } from "@/lib/i18n/config";
import { tr } from "@/lib/i18n/server";

export default function Footer({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const to = (p: string) => href(lang, p);
  const { families, industries, company } = content(lang);
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <img src="/img/brand/bimo-materials-logo-white-header.png" alt="Bimo Materials" width={125} height={40} style={{ height: 40, width: "auto", alignSelf: "flex-start" }} />
            <p>{t("Specialty metals, powders, targets and new alloys. Wrocław and Oxford.")}</p>
            <p>
              {company.address.join(", ")}
              <br />
              {company.oxford}
            </p>
            <p>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
            <p>ISO 9001:2015 · ISO 14001:2015</p>
          </div>
          <div>
            <h3>{t("Materials")}</h3>
            <ul>
              {families.map((f) => (
                <li key={f.slug}>
                  <Link href={to(`/materials/${f.slug}/`)}>{f.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{t("Industries")}</h3>
            <ul>
              {industries.map((i) => (
                <li key={i.slug}>
                  <Link href={to(`/industries/${i.slug}/`)}>{i.name}</Link>
                </li>
              ))}
            </ul>
            <h3 style={{ marginTop: 28 }}>{t("Work with us")}</h3>
            <ul>
              <li><Link href={to("/manufacturing/")}>{t("Manufacturing")}</Link></li>
              <li><Link href={to("/new-alloys/")}>{t("New alloys")}</Link></li>
              <li><Link href={to("/contact/")}>{t("Request a quote")}</Link></li>
            </ul>
          </div>
          <div>
            <h3>{t("Company")}</h3>
            <ul>
              <li><Link href={to("/company/")}>{t("About")}</Link></li>
              <li><Link href={to("/company/#news")}>{t("News")}</Link></li>
              <li><Link href={to("/credits/")}>{t("Picture credits")}</Link></li>
            </ul>
            <h3 style={{ marginTop: 28 }}>{t("The Bimo group")}</h3>
            <ul>
              <li><a href="https://www.bimotech.pl/">Bimo Tech ↗</a></li>
              <li><a href="https://prism.mirdyne.com/">{t("PRISM by Mirdyne")} ↗</a></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© 2026 Bimo Materials Ltd</span>
          <span>
            <Link href={to("/privacy/")}>{t("Privacy")}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
