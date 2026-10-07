import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/quote/route";

let ip = 0;
const send = (fields: [string, string][]) => {
  const body = new FormData();
  for (const [k, v] of fields) body.append(k, v);
  return POST(new Request("https://www.example.com/api/quote/", { method: "POST", body, headers: { "x-forwarded-for": `10.0.0.${++ip}` } }));
};
const base: [string, string][] = [
  ["started", String(Date.now() - 10_000)],
  ["email", "buyer@example.org"],
  ["name", "Ada Buyer"],
  ["need", "A material"],
];

describe("the quote mail sender", () => {
  const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockClear();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
  const sent = () => JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);

  it("lists each basket item with its own form, size and quantity", async () => {
    const res = await send([
      ...base,
      ["item", "Tungsten"], ["item_form", "rod Ø20 × 300 mm"], ["item_quantity", "5 pieces"],
      ["item", "TZM"], ["item_form", ""], ["item_quantity", "2 kg"],
    ]);
    expect(res.status).toBe(200);
    const mail = sent();
    expect(mail.to).toEqual(["info@example.com"]);
    expect(mail.reply_to).toBe("buyer@example.org");
    expect(mail.subject).toBe("Quote request: Tungsten, TZM");
    expect(mail.text).toContain("Quote basket:\n- Tungsten: form and size rod Ø20 × 300 mm, quantity 5 pieces\n- TZM: form and size (not given), quantity 2 kg");
  });

  it("works without a basket, as before", async () => {
    await send([...base, ["material", "6N copper"], ["form", "pellets"], ["quantity", "1 kg"]]);
    const mail = sent();
    expect(mail.subject).toBe("Quote request: 6N copper");
    expect(mail.text).toContain("Material or grade: 6N copper\nForm and size: pellets\nQuantity: 1 kg");
    expect(mail.text).not.toContain("Quote basket");
  });

  it("keeps item fields to one line and caps the number of items", async () => {
    const many: [string, string][] = Array.from({ length: 40 }, (_, i) => ["item", `Metal ${i}`]);
    await send([...base, ["item", "Nickel\nBcc: x@example.net"], ...many]);
    const text: string = sent().text;
    expect(text).toContain("- Nickel Bcc: x@example.net: form and size (not given)");
    expect(text.match(/^- /gm)).toHaveLength(30);
  });

  it("answers 503 without an API key, so the form opens the visitor's email program", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await send(base)).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
