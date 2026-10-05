import Link from "next/link";
import QuoteForm from "@/components/QuoteForm";
import { content } from "@/lib/content";
import { href, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { tr } from "@/lib/i18n/server";

export function contactMeta(lang: Lang) {
  const t = tr(lang);
  return pageMeta(lang, "/contact/", {
    title: t("Request a quote"),
    description: t("Send a drawing or a specification. We reply with a price and a lead time."),
  });
}

export default function Contact({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const { company } = content(lang);
  return (
    <section className="section">
      <div className="wrap quote-section">
        <div className="quote-section__intro">
          <nav className="crumbs" aria-label={t("Breadcrumb")}>
            <Link href={href(lang, "/")}>{t("Home")}</Link> / <span>{t("Request a quote")}</span>
          </nav>
          <h1 className="display">{t("Request a quote.")}</h1>
          <p className="lead">{t("Send a drawing or a specification. We reply with a price and a lead time.")}</p>
          <dl className="rows contact-list">
            <div className="kv"><dt>{t("Email")}</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
            {company.phone ? (
              <div className="kv"><dt>{t("Phone")}</dt><dd><a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a></dd></div>
            ) : null}
            <div className="kv"><dt>{t("Wrocław")}</dt><dd>{company.address.join(", ")}</dd></div>
            <div className="kv"><dt>{t("Oxford")}</dt><dd>{company.oxford}</dd></div>
          </dl>
          <p className="muted" style={{ fontSize: 15 }}>
            {t("A mutual NDA is available before any technical exchange. Say so in your message.")}
          </p>
        </div>
        <QuoteForm email={company.email} />
      </div>
    </section>
  );
}
