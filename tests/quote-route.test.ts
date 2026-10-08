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
  const sent = (n = 0) => JSON.parse((fetchMock.mock.calls[n] as unknown as [string, RequestInit])[1].body as string);

  it("lists each basket item with its own form, size and quantity", async () => {
    const res = await send([
      ...base,
      ["item", "Tungsten"], ["item_form", "rod Ø20 × 300 mm"], ["item_quantity", "5 pieces"],
      ["item", "TZM"], ["item_form", ""], ["item_quantity", "2 kg"],
    ]);
    expect(res.status).toBe(200);
    const mail = sent();
    expect(mail.from).toBe("Bimo Materials <info@bimomaterials.com>");
    expect(mail.to).toEqual(["info@bimomaterials.com"]);
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

  it("sends the visitor a copy from the company address, in their language, without the free text", async () => {
    const res = await send([
      ...base,
      ["language", "de"],
      ["material", "TZM"],
      ["message", "Visit https://spam.example now"],
      ["item", "Wolfram"], ["item_form", "Stab Ø20"], ["item_quantity", "5 Stück"],
    ]);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const copy = sent(1);
    expect(copy.from).toBe("Bimo Materials <info@bimomaterials.com>");
    expect(copy.to).toEqual(["buyer@example.org"]);
    expect(copy.reply_to).toBe("info@bimomaterials.com");
    expect(copy.subject).toBe("Bimo Materials · Angebotsanfrage");
    expect(copy.text).toContain("Werkstoff oder Sorte: TZM");
    expect(copy.text).toContain("- Wolfram · Stab Ø20 · 5 Stück");
    expect(copy.text).toContain("info@bimomaterials.com");
    expect(copy.text).not.toContain("spam.example");
  });

  it("still reports success when only the visitor's copy fails", async () => {
    fetchMock.mockImplementationOnce(async () => new Response("{}", { status: 200 }));
    fetchMock.mockImplementationOnce(async () => new Response("bad", { status: 422 }));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await send(base)).status).toBe(200);
    expect(error).toHaveBeenCalledOnce();
    error.mockRestore();
  });

  it("reports failure when the request cannot reach the team, and sends no copy", async () => {
    fetchMock.mockImplementationOnce(async () => new Response("bad", { status: 500 }));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await send(base)).status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    error.mockRestore();
  });

  it("answers 503 without an API key, so the form opens the visitor's email program", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await send(base)).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
