// Sends a quote request from the site's form to the sales inbox, through Resend (resend.com).
//
// Set in the Vercel project (Settings → Environment Variables), then redeploy:
//   RESEND_API_KEY   API key from resend.com, for a domain verified there (bimomaterials.com)
//   QUOTE_TO         where requests go, e.g. info@bimomaterials.com (several: comma-separated)
//   QUOTE_FROM       the sender, on the verified domain, e.g. "Bimo Materials website <quotes@bimomaterials.com>"
// Without them this answers 503 and the form falls back to opening the visitor's email program.
//
// Junk is dropped quietly: a hidden field only bots fill in, a minimum time between page load and
// sending, and limits on every field. Replies go straight to the visitor (Reply-To).

const MAX = { short: 200, message: 5000, basket: 2000 };
const EMAIL = /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[^\s@<>()"',;:]{2,}$/;

const field = (data: FormData, name: string, max = MAX.short) =>
  String(data.get(name) ?? "").replace(/\r/g, "").trim().slice(0, max);
const oneLine = (s: string) => s.replace(/\s+/g, " ");

// Best effort per running instance: a few requests a minute per address.
const recent = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 60_000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
}

export async function POST(req: Request) {
  const { RESEND_API_KEY: key, QUOTE_TO: to, QUOTE_FROM: from } = process.env;
  if (!key || !to || !from) return Response.json({ error: "not-configured" }, { status: 503 });

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
    basket: oneLine(field(data, "basket", MAX.basket)),
    message: field(data, "message", MAX.message),
    language: oneLine(field(data, "language", 5)),
    page: oneLine(field(data, "page", 300)),
  };

  const text = [
    `Need: ${f.need}`,
    `Material or grade: ${f.material}`,
    `Form and size: ${f.form}`,
    `Quantity: ${f.quantity}`,
    f.basket ? `Quote basket: ${f.basket}` : "",
    "",
    f.message || "(no message)",
    "",
    `From: ${[f.name, f.organisation].filter(Boolean).join(", ") || "(no name)"} <${email}>`,
    `Site language: ${f.language || "en"}`,
    f.page ? `Sent from: ${f.page}` : "",
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");

  const subject = `Quote request: ${f.material || f.basket || f.need || "website"}`.slice(0, 150);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), reply_to: email, subject, text }),
    });
    if (!res.ok) {
      console.error("quote: Resend answered", res.status, await res.text().catch(() => ""));
      return Response.json({ error: "send-failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("quote: could not reach Resend", err);
    return Response.json({ error: "send-failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
