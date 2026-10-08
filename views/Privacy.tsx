import Link from "next/link";
import { content } from "@/lib/content";
import { date, href, type Lang } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/i18n/meta";
import { rich } from "@/lib/i18n/rich";
import { tr } from "@/lib/i18n/server";
import { privacy } from "@/lib/site";

export function privacyMeta(lang: Lang) {
  const t = tr(lang);
  return pageMeta(lang, "/privacy/", {
    title: t("Privacy notice"),
    description: t("How Bimo Materials handles personal data on this website: what we collect, why, who processes it for us, and your rights under the GDPR."),
  });
}

// The facts behind this notice: the only data the site receives is what people type into the quote
// form (sent by Resend to mailboxes on home.pl); pages are hosted on Vercel; no cookies, analytics or
// third-party requests; the quote basket lives in the visitor's own localStorage (lib/basket.ts).
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
        <h1 className="display">{t("Privacy notice")}</h1>
        <p className="lead">{t("How Bimo Materials handles personal data on this website: what we collect, why, who processes it for us, and your rights under the GDPR.")}</p>
        <p className="muted">{t("Last updated: {date}", { date: date(lang, privacy.updated) })}</p>

        <h2 className="subtitle">{t("Who is responsible")}</h2>
        <p>{rich(t("The controller of your personal data is {controller}. You can reach us about anything in this notice at <0>{email}</0> or by post:", { controller: privacy.controller, email: company.email }), [mail])}</p>
        <p>
          {privacy.controller}
          {privacy.registeredOffice ? <><br />{privacy.registeredOffice}</> : null}
          {privacy.companyNumber ? <><br />{t("Company number")}: {privacy.companyNumber}</> : null}
          <br />
          {company.address.join(", ")}
          <br />
          {company.oxford}
        </p>

        <h2 className="subtitle">{t("What we collect and why")}</h2>
        <h3>{t("When you send the quote form")}</h3>
        <p>{t("We receive what you enter: your email address and, if you give them, your name, organisation, the material, form, size and quantity you need, your message and the items in your quote basket. We also record the language and address of the page you sent it from, so we know what you were looking at.")}</p>
        <p>{t("We use this only to answer your request and to prepare and carry out any order that follows. The legal basis is Article 6(1)(b) GDPR, steps taken at your request before entering into a contract, and, for correspondence with you as a contact at a company, Article 6(1)(f) GDPR, our legitimate interest in answering business enquiries.")}</p>
        <p>{t("Giving these details is voluntary, but without an email address we cannot reply.")}</p>
        <h3>{t("When you email us")}</h3>
        <p>{t("We use your message and contact details in the same way and on the same legal basis.")}</p>
        <h3>{t("When you visit the site")}</h3>
        <p>{t("Like any website, the servers of our hosting provider receive technical data with each request: your IP address, the page requested, the time and your browser’s identification. This is needed to deliver the site and protect it against attacks (Article 6(1)(f) GDPR). We do not use it to identify you or to build profiles.")}</p>

        <h2 className="subtitle">{t("Who processes data for us")}</h2>
        <p>{t("We use these providers, each bound by a data processing agreement with us:")}</p>
        <ul>
          <li>{t("Vercel Inc. (United States) hosts the website and delivers its pages.")}</li>
          <li>{t("Resend (United States) delivers the messages sent with the quote form to our inbox.")}</li>
          <li>{t("home.pl S.A. (Poland) runs our email servers, where your messages are received and kept.")}</li>
        </ul>
        <p>{t("Where data goes to the United States, it is protected by the European Commission’s standard contractual clauses and, where the provider is certified, the EU–US Data Privacy Framework (Articles 45 and 46 GDPR).")}</p>
        <p>{t("We do not sell personal data or pass it to anyone else, unless the law requires it.")}</p>

        <h2 className="subtitle">{t("Cookies and tracking")}</h2>
        <p>{t("This site sets no cookies and uses no analytics, advertising or tracking tools. Fonts, images and the map on the globe are served from this website, so opening a page sends nothing to third parties.")}</p>
        <p>{t("The quote basket is kept in your browser’s local storage, on your device only. It is not sent to us until you send the form, and you can clear it at any time by removing the items or clearing your browser’s data for this site.")}</p>

        <h2 className="subtitle">{t("How long we keep it")}</h2>
        <p>{t("Quote requests and emails: as long as needed to handle your request and any business that follows, then up to three years after our last contact, so that we can answer follow-up questions. If you place an order, we keep the related records as long as tax and accounting law requires. Server logs at our hosting provider: for a short period only.")}</p>

        <h2 className="subtitle">{t("Your rights")}</h2>
        <p>{rich(t("Under the GDPR you can ask us for access to your data and a copy of it, to correct or delete it, to restrict how we use it, or to send it to you or another company in a common format. You can object at any time to processing based on our legitimate interests. Write to <0>{email}</0>; we reply within one month.", { email: company.email }), [mail])}</p>
        <p>{t("If you think we handle your data unlawfully, you can complain to a data protection authority, in particular where you live or work. In Poland this is the President of the Personal Data Protection Office (UODO), ul. Stawki 2, 00-193 Warsaw; in the United Kingdom, the Information Commissioner’s Office (ICO).")}</p>
        <p>{t("We do not use your data for automated decisions or profiling.")}</p>

        <h2 className="subtitle">{t("Changes to this notice")}</h2>
        <p>{t("We update this notice when the website or our providers change. The date at the top shows the current version.")}</p>
      </div>
    </section>
  );
}
