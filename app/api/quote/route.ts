// Sends a quote request from the site's form through Resend (resend.com), as two emails:
//   1. the request, to the sales inbox. Replying answers the visitor (Reply-To).
//   2. a copy for the visitor, in the site language they used. Replying reaches the sales inbox.
//
// The only setting needed is RESEND_API_KEY (Vercel → Settings → Environment Variables), for a Resend
// account where bimomaterials.com is verified. The address is the company's (lib/site.ts):
//   to    info@bimomaterials.com, or CONTACT_EMAIL, or QUOTE_TO (several: comma-separated)
//   from  "Bimo Materials <info@bimomaterials.com>", or QUOTE_FROM
// Without a key this answers 503 and the form falls back to opening the visitor's email program.
//
// Junk is dropped quietly: a hidden field only bots fill in, a minimum time between page load and
// sending, and limits on every field. The visitor's copy repeats only the short fields, never the free
// text, so the form cannot be used to send someone else a message.

import { contactEmail } from "@/lib/site-url";
import { company } from "@/lib/site";
import { colon, isLang, type Lang } from "@/lib/i18n/config";
import { tr } from "@/lib/i18n/server";

const MAX = { short: 200, message: 5000, items: 30 };
const EMAIL = /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[^\s@<>()"',;:]{2,}$/;

const field = (data: FormData, name: string, max = MAX.short) =>
  String(data.get(name) ?? "").replace(/\r/g, "").trim().slice(0, max);
const oneLine = (s: string) => s.replace(/\s+/g, " ");
const fieldAll = (data: FormData, name: string) => data.getAll(name).map((v) => oneLine(String(v).trim().slice(0, MAX.short)));

// Best effort per running instance: a few requests a minute per address.
const recent = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 60_000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
}

type Mail = { from: string; to: string[]; reply_to: string; subject: string; text: string };

async function sendMail(key: string, mail: Mail): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(mail),
    });
    if (res.ok) return true;
    console.error("quote: Resend answered", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.error("quote: could not reach Resend", err);
  }
  return false;
}

type Items = { name: string; form: string; quantity: string }[];
type Fields = { need: string; material: string; form: string; quantity: string };

/** The visitor's copy, in their language, from strings the site already translates. */
function visitorCopy(lang: Lang, f: Fields, items: Items, contact: string): { subject: string; text: string } {
  const t = tr(lang);
  const c = colon(lang);
  // "need" is one of the form's options; anything else (a bot, an old form) is left out rather than failing.
  let need = "";
  try {
    need = f.need ? t(f.need) : "";
  } catch {}
  const text = [
    t("Thank you. Your request is with our team, and we will reply by email."),
    "",
    need ? `${t("I need")}${c}${need}` : "",
    f.material ? `${t("Material or grade")}${c}${f.material}` : "",
    f.form ? `${t("Form and size")}${c}${f.form}` : "",
    f.quantity ? `${t("Quantity")}${c}${f.quantity}` : "",
    ...(items.length ? ["", `${t("In your quote")}${c}`, ...items.map((it) => ["- " + it.name, it.form, it.quantity].filter(Boolean).join(" · "))] : []),
    "",
    "Bimo Materials",
    contact,
  ]
    .filter((l, i, a) => l !== "" || (i > 0 && a[i - 1] !== ""))
    .join("\n");
  return { subject: `Bimo Materials · ${t("Quote request")}`, text };
}

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ error: "not-configured" }, { status: 503 });
  const inbox = contactEmail(company.email);
  const to = process.env.QUOTE_TO || inbox;
  const from = process.env.QUOTE_FROM || `Bimo Materials <${inbox}>`;

  let data: FormData;
  try {
    data = await req.formData();
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  // Bots: the hidden "website" field is filled, or the form was sent within 3 s of loading.
  // Answer as if it worked, so they learn nothing.
  const started = Number(field(data, "started"));
  if (field(data, "website") || !started || Date.now() - started < 3000) return Response.json({ ok: true });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (tooMany(ip)) return Response.json({ error: "too-many" }, { status: 429 });

  const email = field(data, "email");
  if (!EMAIL.test(email)) return Response.json({ error: "email" }, { status: 400 });

  const f = {
    need: oneLine(field(data, "need")),
    material: oneLine(field(data, "material")),
    form: oneLine(field(data, "form")),
    quantity: oneLine(field(data, "quantity")),
    name: oneLine(field(data, "name")),
    organisation: oneLine(field(data, "organisation")),
    message: field(data, "message", MAX.message),
    language: oneLine(field(data, "language", 5)),
    page: oneLine(field(data, "page", 300)),
  };

  // The materials added with "Add to quote": one row each, with its own form, size and quantity.
  const forms = fieldAll(data, "item_form");
  const quantities = fieldAll(data, "item_quantity");
  const items = fieldAll(data, "item")
    .slice(0, MAX.items)
    .map((name, i) => ({ name, form: forms[i] ?? "", quantity: quantities[i] ?? "" }))
    .filter((it) => it.name);

  const text = [
    `Need: ${f.need}`,
    `Material or grade: ${f.material}`,
    `Form and size: ${f.form}`,
    `Quantity: ${f.quantity}`,
    ...(items.length
      ? ["", "Quote basket:", ...items.map((it) => `- ${it.name}: form and size ${it.form || "(not given)"}, quantity ${it.quantity || "(not given)"}`)]
      : []),
    "",
    f.message || "(no message)",
    "",
    `From: ${[f.name, f.organisation].filter(Boolean).join(", ") || "(no name)"} <${email}>`,
    `Site language: ${f.language || "en"}`,
    f.page ? `Sent from: ${f.page}` : "",
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");

  const subject = `Quote request: ${f.material || items.map((it) => it.name).join(", ") || f.need || "website"}`.slice(0, 150);

  const sent = await sendMail(key, { from, to: to.split(",").map((s) => s.trim()), reply_to: email, subject, text });
  if (!sent) return Response.json({ error: "send-failed" }, { status: 502 });

  // The request reached the team; the visitor's copy is a courtesy, so a failure here is only logged.
  const lang: Lang = isLang(f.language) ? f.language : "en";
  const copy = visitorCopy(lang, f, items, inbox);
  await sendMail(key, { from, to: [email], reply_to: inbox, ...copy });

  return Response.json({ ok: true });
}
