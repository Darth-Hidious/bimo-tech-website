import Link from "next/link";
import { content } from "@/lib/content";
import { href, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { rich } from "@/lib/i18n/rich";
import { tr } from "@/lib/i18n/server";

export function privacyMeta(lang: Lang) {
  const t = tr(lang);
  // Draft until the legal text is reviewed: keep it out of search results.
  return pageMeta(lang, "/privacy/", { title: t("Privacy"), description: t("How we handle the details you send us."), noindex: true });
}

export default function Privacy({ lang }: { lang: Lang }) {
  const t = tr(lang);
  const { company } = content(lang);
  const mail = <a href={`mailto:${company.email}`} />;
  return (
    <section className="section">
      <div className="wrap prose">
        <nav className="crumbs" aria-label={t("Breadcrumb")}>
          <Link href={href(lang, "/")}>{t("Home")}</Link> / <span>{t("Privacy")}</span>
        </nav>
        <h1 className="display">{t("Privacy")}</h1>
        <p className="lead">{t("Draft. The legally reviewed notice replaces this text before launch.")}</p>
        <h2 className="subtitle">{t("What we collect")}</h2>
        <p>
          {t("When you send the quote form we receive what you type into it. We use it only to answer your request. The quote basket is kept in your own browser and is not sent anywhere until you send the form.")}
        </p>
        <h2 className="subtitle">{t("Cookies and tracking")}</h2>
        <p>{t("This site sets no cookies and loads no third-party trackers. Fonts are served from our own server.")}</p>
        <h2 className="subtitle">{t("Contact")}</h2>
        <p>{rich(t("Questions about your data: <0>{email}</0>.", { email: company.email }), [mail])}</p>
      </div>
    </section>
  );
}
