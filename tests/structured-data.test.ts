import { describe, expect, it } from "vitest";
import { company, postalAddress } from "@/lib/site";
import { catalogBreadcrumbJsonLd, jsonLdScript, organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { LANGS } from "@/lib/i18n/config";

const SITE = "https://www.example.com";

describe("Organization JSON-LD", () => {
  it.each(LANGS)("is complete in %s", (lang) => {
    const org = organizationJsonLd(lang) as any;
    expect(org["@context"]).toBe("https://schema.org");
    expect(org["@type"]).toBe("Organization");
    expect(org.name).toBe("Bimo Materials");
    expect(org.url).toBe(`${SITE}/`);
    expect(org.description.length).toBeGreaterThan(40);
    expect(org.logo).toBe(`${SITE}/img/brand/bimo-materials-logo.png`);
    expect(org.address).toEqual({ "@type": "PostalAddress", streetAddress: "ul. Francuska 11", postalCode: "54-405", addressLocality: "Wrocław", addressCountry: "PL" });
    expect(org.contactPoint).toHaveLength(1);
    expect(org.contactPoint[0]).toMatchObject({ "@type": "ContactPoint", contactType: "sales", email: "info@example.com" });
    expect(org.hasOfferCatalog.itemListElement).toHaveLength(8);
  });

  it("uses the same address as the contact page", () => {
    expect(company.address[0]).toBe(postalAddress.streetAddress);
    expect(company.address[1]).toBe(`${postalAddress.postalCode} ${postalAddress.addressLocality}, Poland`);
  });

  it("names the website and its publisher", () => {
    expect(websiteJsonLd("de")).toMatchObject({ "@type": "WebSite", url: `${SITE}/de/`, inLanguage: "de", publisher: { "@id": `${SITE}/#organization` } });
  });
});

describe("catalog breadcrumbs", () => {
  it("trace Home / Materials / family / material", () => {
    const b = catalogBreadcrumbJsonLd("en", "refractory-metals", "tungsten") as any;
    expect(b["@type"]).toBe("BreadcrumbList");
    expect(b.itemListElement.map((i: any) => [i.position, i.name, i.item])).toEqual([
      [1, "Home", `${SITE}/`],
      [2, "Materials", `${SITE}/materials/`],
      [3, "Refractory metals", `${SITE}/materials/refractory-metals/`],
      [4, "Tungsten", `${SITE}/materials/refractory-metals/tungsten/`],
    ]);
    expect((catalogBreadcrumbJsonLd("pl", "powders") as any).itemListElement).toHaveLength(3);
    expect(catalogBreadcrumbJsonLd("en", "nope")).toBeNull();
    expect(catalogBreadcrumbJsonLd("en", "powders", "nope")).toBeNull();
  });
});

describe("jsonLdScript", () => {
  it("cannot close its <script> early", () => {
    const out = jsonLdScript({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });
});
