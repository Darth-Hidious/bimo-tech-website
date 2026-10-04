import type { Metadata } from "next";
import Link from "next/link";
import QuoteForm from "@/components/QuoteForm";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a quote",
  description: "Send a drawing or a specification. We reply with a price and a lead time.",
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="wrap quote-section">
        <div className="quote-section__intro">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <span>Request a quote</span>
          </nav>
          <h1 className="display">Request a quote.</h1>
          <p className="lead">Send a drawing or a specification. We reply with a price and a lead time.</p>
          <dl className="rows contact-list">
            <div className="kv"><dt>Email</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
            {company.phone ? (
              <div className="kv"><dt>Phone</dt><dd><a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a></dd></div>
            ) : null}
            <div className="kv"><dt>Wrocław</dt><dd>{company.address.join(", ")}</dd></div>
            <div className="kv"><dt>Oxford</dt><dd>{company.oxford}</dd></div>
          </dl>
          <p className="muted" style={{ fontSize: 15 }}>
            A mutual NDA is available before any technical exchange. Say so in your message.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
