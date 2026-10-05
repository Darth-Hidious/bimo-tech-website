"use client";

import { useEffect, useState } from "react";
import { onBasketChange, readBasket, removeFromBasket } from "@/lib/basket";
import { msg } from "@/lib/i18n/config";
import { rich } from "@/lib/i18n/rich";
import { useLang } from "@/components/LangProvider";

const NEEDS = [msg("A material"), msg("A part"), msg("A coating"), msg("A new alloy")];

// Where the form posts. Set NEXT_PUBLIC_QUOTE_ENDPOINT at build time to a
// form handler (CRM, Formspree, a serverless function). Without it the form
// opens the visitor's email program with the request filled in.
const ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "";

type Status = { kind: "idle" | "sending" | "sent" | "mail" | "error"; text?: string };

export default function QuoteForm({ email, compact = false }: { email: string; compact?: boolean }) {
  const { lang, t, href } = useLang();
  const [items, setItems] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    const sync = () => setItems(readBasket());
    sync();
    return onBasketChange(sync);
  }, []);

  // ?item=Tungsten from a material page prefills the material field.
  const [prefill, setPrefill] = useState("");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("item");
    if (q) setPrefill(q);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    data.set("basket", items.join("; "));
    data.set("language", lang);

    if (ENDPOINT) {
      setStatus({ kind: "sending" });
      try {
        const res = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(String(res.status));
        setStatus({ kind: "sent", text: t("Thank you. Your request is with our team, and we will reply by email.") });
        form.reset();
      } catch {
        setStatus({ kind: "error", text: t("Sending failed. Please email {email} instead.", { email }) });
      }
      return;
    }

    const lines = [
      `${t("I need")}: ${data.get("need") ?? ""}`,
      `${t("Material or grade")}: ${data.get("material") ?? ""}`,
      `${t("Form and size")}: ${data.get("form") ?? ""}`,
      `${t("Quantity")}: ${data.get("quantity") ?? ""}`,
      items.length ? `${t("In your quote")}: ${items.join("; ")}` : "",
      "",
      String(data.get("message") ?? ""),
      "",
      `${data.get("name") ?? ""}, ${data.get("organisation") ?? ""}`,
      String(data.get("email") ?? ""),
    ].filter((l, i, a) => l !== "" || a[i - 1] !== "");
    const mailto = `mailto:${email}?subject=${encodeURIComponent(t("Quote request"))}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = mailto;
    setStatus({ kind: "mail", text: t("Your email program should open with the request filled in. If it does not, write to {email}.", { email }) });
  }

  return (
    <form className="quote" onSubmit={onSubmit} noValidate={false}>
      <fieldset className="radio-chips">
        <legend>{t("I need")}</legend>
        {NEEDS.map((n, i) => (
          <label key={n}>
            <input type="radio" name="need" value={t(n)} defaultChecked={i === 0} />
            <span>{t(n)}</span>
          </label>
        ))}
      </fieldset>

      {items.length > 0 ? (
        <div className="quote__basket">
          <span className="field">{t("In your quote")}</span>
          <ul>
            {items.map((it) => (
              <li key={it}>
                {it}
                <button type="button" onClick={() => removeFromBasket(it)} aria-label={t("Remove {item}", { item: it })}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="quote__grid">
        <label className="field">
          {t("Material or grade")}
          <input className="input" name="material" key={prefill} defaultValue={prefill} placeholder={t("e.g. TZM, Inconel 625, 6N copper")} />
        </label>
        <label className="field">
          {t("Form and size")}
          <input className="input" name="form" placeholder={t("e.g. rod Ø20 × 300 mm")} />
        </label>
        <label className="field">
          {t("Quantity")}
          <input className="input" name="quantity" placeholder={t("e.g. 5 pieces, 2 kg")} />
        </label>
        <label className="field">
          {t("Work email")}
          <input className="input" type="email" name="email" required autoComplete="email" />
        </label>
        {!compact ? (
          <>
            <label className="field">
              {t("Name")}
              <input className="input" name="name" autoComplete="name" required />
            </label>
            <label className="field">
              {t("Organisation")}
              <input className="input" name="organisation" autoComplete="organization" />
            </label>
          </>
        ) : null}
      </div>
      <label className="field">
        {t("What must the material or part survive?")}
        <textarea className="textarea" name="message" placeholder={t("Temperature, atmosphere, loads, standards, timeline. Drawings can follow by email.")} />
      </label>
      <div className="quote__send">
        <button type="submit" className="btn btn--primary" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? t("Sending…") : t("Send request")} <span className="arrow">→</span>
        </button>
        <p className="quote__note" role="status">
          {status.text ?? rich(t("We use your details only to reply. See our <0>privacy notice</0>."), [<a href={href("/privacy/")} />])}
        </p>
      </div>
    </form>
  );
}
