// Every page as Markdown, for AI agents and other clients that ask for text/markdown (acceptmarkdown.com).
// The same text as the HTML page, in the same language, from the same data and translations, without
// the photos, forms and layout. app/md/[[...path]]/route.ts pre-renders one file per page and language,
// and proxy.ts serves it at the page's own address, or at its .md address (lib/routes.ts → mdHref).
// The Markdown 404 is in lib/markdown-404.ts, which the proxy imports without the dictionaries.
//
// Only strings that the views already translate may go through t(): this file is not scanned by
// scripts/i18n.mjs, and a missing translation throws (the tests render every page in every language).

import { content } from "./content";
import { colon, comma, date, href, inSentence, LANGS, LOCALE, NATIVE, num, pct, QUOTES, type Lang } from "./i18n/config";
import { SITE } from "./site-url";
import { tr, type T } from "./i18n/server";
import { mdHref, PAGE_PATHS } from "./routes";
import { OWN, privacy as privacyFacts, type Img } from "./site";

/** Escapes the characters that would turn link text into something else. */
const esc = (s: string) => s.replace(/([\\[\]])/g, "\\$1");
const link = (text: string, url: string) => `[${esc(text)}](${url})`;
const blocks = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join("\n\n") + "\n";
const list = (items: string[]) => items.map((i) => `- ${i}`).join("\n");
const numbered = (items: string[]) => items.map((s, i) => `${i + 1}. ${s}`).join("\n");

/** <0>…</0> tags from rich() translations, as Markdown links. */
const richLinks = (s: string, urls: string[]) => s.replace(/<(\d+)>(.*?)<\/\1>/g, (_, i: string, text: string) => link(text, urls[Number(i)]));

type Ctx = { lang: Lang; t: T; url: (p: string) => string; c: ReturnType<typeof content>; kv: (k: string, v: string) => string };

function ctx(lang: Lang): Ctx {
  const t = tr(lang);
  return { lang, t, url: (p) => (p.startsWith("/") ? SITE + href(lang, p) : p), c: content(lang), kv: (k, v) => `**${k}**${colon(lang)}${v}` };
}

const quote = (x: Ctx, item?: string) => x.url(item ? `/contact/?item=${encodeURIComponent(item)}` : "/contact/");

function home(x: Ctx): string {
  const { t, url, c, lang, kv } = x;
  const ways = [
    { t: t("Buy materials"), l: t("Metals, powders and targets from stock or to order, from a test batch to a container."), href: "/materials/", c: t("Browse materials") },
    { t: t("Get parts made"), l: t("Machined, forged, printed, coated and tested to your drawing."), href: "/manufacturing/", c: t("Manufacturing") },
    { t: t("Develop a new alloy"), l: t("When nothing on the shelf survives the job. From your requirement to a tested part."), href: "/new-alloys/", c: t("New alloys") },
  ];
  return blocks(
    `# Bimo Materials · ${t("Specialty metals, powders and new alloys")}`,
    `**${t("Specialty metals, from raw stock to finished part.")}** ${t("Refractory metals, powders, sputtering targets and new alloys for space, fusion and industry.")}`,
    `${link(t("Browse materials"), url("/materials/"))} · ${link(t("Request a quote"), url("/contact/"))}`,
    t("The Bimo group has supplied metals to science and industry since 1992. Bimo Materials also melts, powders, prints, coats and tests them."),
    list([
      kv(t("Trusted on"), "ESA, ArianeGroup, Fusion for Energy, ITER"),
      kv(t("ESA FIRST! Propulsion award"), "2025"),
      kv(t("Titanium and steel for ITER"), "2022"),
      kv(t("Quality and environment"), "ISO 9001 · ISO 14001"),
      kv(t("Purity up to"), `7N · ${pct(lang, 99.99999)}`),
    ]),
    `## ${t("From raw metal to tested part.")}`,
    t("Everything we sell sits on one path. Follow it, and stop wherever you need us."),
    numbered(c.path.map((s) => `**${s.title}**${colon(lang)}${s.line} ${link(s.link.label, url(s.link.href))}`)),
    `## ${t("Three ways to work with us.")}`,
    list(ways.map((w) => `**${w.t}**${colon(lang)}${w.l} ${link(w.c, url(w.href))}`)),
    `## ${t("Materials")}`,
    list(c.families.map((f) => `${link(f.name, url(`/materials/${f.slug}/`))}${colon(lang)}${f.short}`)),
    `## ${t("What it means for your part.")}`,
    list(c.outcomes.map((o) => `${link(o.word, url(o.href))} (${o.tag})${colon(lang)}${o.line}`)),
    `## ${t("When nothing on the shelf survives the job, we develop a new alloy.")}`,
    t("In SPARK we are developing refractory high-entropy alloys for rocket engines, with ArianeGroup. ESA chose it as one of 16 winners from 40 proposals."),
    t("New alloys are designed with PRISM, the platform of our group company Mirdyne in Giessen."),
    `${link(t("The SPARK project"), url("/new-alloys/"))} · ${link(t("PRISM by Mirdyne"), "https://prism.mirdyne.com/")}`,
    `## ${t("Wrocław and Oxford.")}`,
    t("Made in Wrocław, where the Bimo group has worked since 1992. Oxford is our contact point for UK customers and research partners."),
    list(c.group.map((g) => `**${g.brand}** (${g.place})${colon(lang)}${g.role}. ${g.line} ${g.href.startsWith("http") ? g.href : url(g.href)}`)),
    list(c.timeline.map((e) => `**${e.year}**${colon(lang)}${e.text}`)),
    link(t("About us"), url("/company/")),
    `## ${t("Request a quote")}`,
    `${t("Send us a drawing or a specification.")} ${t("We reply with a price and a lead time.")}`,
    list([kv(t("Email"), c.company.email), link(t("Request a quote"), url("/contact/"))]),
  );
}

function materials(x: Ctx): string {
  const { t, url, c, lang, kv } = x;
  return blocks(
    `# ${t("Materials")}`,
    t("Metals, alloys, powders and targets, from a few grams to full containers, including hard-to-find materials."),
    ...c.families.map((f) =>
      blocks(
        `## ${link(f.name, url(`/materials/${f.slug}/`))}`,
        f.intro,
        list([
          ...(f.materials ?? []).map(
            (m) => `${link(m.name, url(`/materials/${f.slug}/${m.slug}/`))}${colon(lang)}${m.summary}${m.grades?.length ? ` ${kv(t("Grades we supply"), m.grades.join(comma(lang)))}` : ""}`,
          ),
          ...(f.groups ?? []).map((g) => `**${g.title}**${colon(lang)}${g.body}`),
        ]),
      ).trim(),
    ),
    link(t("Request a quote"), quote(x)),
  );
}

function family(x: Ctx, slug: string): string {
  const { t, url, c, lang, kv } = x;
  const f = c.familyBySlug(slug)!;
  const withMelting = (f.materials ?? []).filter((m) => m.meltingC).sort((a, b) => b.meltingC! - a.meltingC!);
  const groups = f.slug === "high-purity" ? [...(f.groups ?? [])].sort((a, b) => a.title.localeCompare(b.title, LOCALE[lang])) : (f.groups ?? []);
  return blocks(
    `# ${f.name}`,
    f.intro,
    `${link(t("Request a quote"), quote(x, f.name))} · ${link(t("Ask an engineer"), quote(x, f.name))}`,
    withMelting.length > 1 && `## ${t("Melting point, °C")}`,
    withMelting.length > 1 && list(withMelting.map((m) => kv(m.chartName ?? m.name, `${num(lang, m.meltingC!)} °C`))),
    ...(f.materials ?? []).map((m) =>
      blocks(
        `## ${link(m.name, url(`/materials/${f.slug}/${m.slug}/`))}`,
        m.summary,
        list(
          [
            m.density ? kv(t("Density"), `${num(lang, m.density)} g/cm³`) : "",
            m.grades?.length ? kv(t("Grades we supply"), m.grades.join(comma(lang))) : "",
            kv(t("Forms"), m.forms.join(comma(lang))),
          ].filter(Boolean),
        ),
      ).trim(),
    ),
    ...groups.map((g) => `## ${g.title}\n\n${g.body}`),
    `**${t("Need a size, purity or grade you don’t see here?")}** ${link(t("Request a quote"), quote(x, f.name))}`,
  );
}

function material(x: Ctx, familySlug: string, slug: string): string {
  const { t, url, c, lang, kv } = x;
  const m = c.allMaterials.find((y) => y.family.slug === familySlug && y.slug === slug)!;
  const siblings = c.allMaterials.filter((y) => y.family.slug === m.family.slug && y.slug !== m.slug);
  return blocks(
    `# ${m.name}`,
    m.summary,
    `${link(t("Materials"), url("/materials/"))} / ${link(m.family.name, url(`/materials/${m.family.slug}/`))}`,
    list(
      [
        m.z ? kv(t("Atomic number"), String(m.z)) : "",
        m.meltingC ? kv(t("Melting point"), `${num(lang, m.meltingC)} °C`) : "",
        m.density ? kv(t("Density"), `${num(lang, m.density)} g/cm³`) : "",
        kv(t("Forms"), m.forms.join(comma(lang))),
        m.standards ? kv(t("Standards"), m.standards.join(comma(lang))) : "",
        kv(t("Used for"), m.uses.join(comma(lang))),
      ].filter(Boolean),
    ),
    m.grades && `## ${t("Grades we supply")} · ${m.grades.length}`,
    m.grades && list(m.grades),
    `## ${t("We can also")}`,
    list([
      link(t("Machine it to drawing, to ±0.01 mm"), url("/manufacturing/#machining")),
      link(t("Coat it"), url("/manufacturing/#pvd-coating")),
      link(t("Test it, with records per lot"), url("/manufacturing/#testing")),
      link(t("Develop a new alloy when no grade does the job"), url("/new-alloys/")),
    ]),
    `## ${t("Stock sizes and lead times")}`,
    t("Sizes and lead times depend on stock on the day. Send the form, size and quantity you need and we reply with a price and a date."),
    link(t("Request a quote for {name}", { name: inSentence(lang, m.name) }), quote(x, m.name)),
    siblings.length > 0 && `## ${t("Also in {family}", { family: inSentence(lang, m.family.name) })}`,
    siblings.length > 0 && list(siblings.map((s) => link(s.name, url(`/materials/${s.family.slug}/${s.slug}/`)))),
  );
}

function manufacturing(x: Ctx): string {
  const { t, url, c } = x;
  return blocks(
    `# ${t("Manufacturing")}`,
    t("We also make parts from the metals we supply: machined, forged, cast, printed, coated and tested to your drawing."),
    ...c.services.map((s) => blocks(`## ${s.name}`, s.line, list(s.detail), link(t("Request a quote"), quote(x, s.name))).trim()),
    `## ${t("Components and devices")}: ${t("From the first calculation to commissioning.")}`,
    t("Precision parts in metals, plastics and other materials, and complete devices built and handed over working."),
    numbered(c.projectSteps),
    link(t("Start a project"), quote(x, t("Components and devices"))),
    link(t("Materials"), url("/materials/")),
  );
}

function newAlloys(x: Ctx): string {
  const { t, lang, kv } = x;
  const steps = [
    [t("Requirement"), t("What the part must survive: temperature, atmosphere, loads, the material it has to beat.")],
    [t("Design"), t("PRISM, from our group company Mirdyne, proposes candidate compositions.")],
    [t("Melt"), t("Test buttons, arc-melted in a copper hearth.")],
    [t("Powder"), t("The best few, made into powder.")],
    [t("Print"), t("Test parts built by laser powder-bed fusion.")],
    [t("Test"), t("Coupons tested against your numbers.")],
  ];
  return blocks(
    `# ${t("New alloys")}`,
    t("When no existing alloy survives the job, we develop one, then make it in any form we sell."),
    `## ${t("How a project runs")}: ${t("From your requirement to a tested part.")}`,
    numbered(steps.map(([a, b]) => `**${a}**${colon(lang)}${b}`)),
    `## SPARK: ${t("Refractory high-entropy alloys for rocket engines.")}`,
    t("SPARK, Space Propulsion Advanced Refractory alloys and Know-how, develops a new class of alloys for the heat, pressure and oxidising conditions inside next-generation rocket engines. We run it with ArianeGroup and European research institutions."),
    list([
      kv(t("Programme"), t("ESA FIRST! Propulsion, part of FLPP")),
      kv(t("Category"), t("Materials and Processes")),
      kv(t("Selected"), t("16 winners from 40 proposals")),
      kv(t("Partner"), "ArianeGroup"),
      kv(t("Announced"), date(lang, "2025-04-15")),
    ]),
    `> ${QUOTES[lang][0]}${t("I believe our work is a vital step towards sustainable European propulsion.")}${QUOTES[lang][1]}\n> — Marcin Orzechowski${comma(lang)}${t("CEO")}`,
    `## ${t("We join funded projects as the materials partner.")}`,
    t("ESA, Horizon Europe and national calls: we bring the melting, the powder and the test data."),
    link(t("Invite us to a project"), quote(x, t("Funded project"))),
    `## ${t("PRISM, by Mirdyne.")}`,
    t("Our group company’s platform proposes the alloys; we melt, make and test them."),
    `${link(t("How PRISM works"), "https://prism.mirdyne.com/")} · ${link(t("Start an alloy project"), quote(x, t("New alloy")))}`,
  );
}

function industriesPage(x: Ctx): string {
  const { t, url, c, lang } = x;
  return blocks(
    `# ${t("Where our metals go")}`,
    t("The same catalog and workshop serve very different jobs. Pick yours to see what we supply and make for it."),
    list(c.industries.map((i) => `${link(i.name, url(`/industries/${i.slug}/`))}${colon(lang)}${i.line}`)),
  );
}

function industry(x: Ctx, slug: string): string {
  const { t, url, c, lang, kv } = x;
  const i = c.industries.find((y) => y.slug === slug)!;
  return blocks(
    `# ${i.name}`,
    i.intro,
    ...i.columns.map((col) => `## ${col.title}\n\n${col.body}`),
    i.programmes && kv(t("Programmes"), i.programmes.join(comma(lang))),
    `## ${t("Materials used here")}`,
    list(i.materials.map((m) => link(m.label, url(m.href)))),
    `## ${t("Services used here")}`,
    list(i.services.map((s) => link(s.label, url(s.href)))),
    `**${t("Tell us what your project needs.")}** ${link(t("Request a quote"), quote(x, i.name))}`,
  );
}

function company(x: Ctx): string {
  const { t, url, c, lang } = x;
  return blocks(
    `# ${t("Wrocław and Oxford.")}`,
    t("Bimo Materials is part of the Bimo group, which has supplied metals to science and industry since 1992."),
    `## ${t("Wrocław, Poland")}`,
    `${t("Melting, powder, machining and testing.")} ${c.company.address.join(", ")}.`,
    `## ${t("Oxford, United Kingdom")}`,
    t("Bimo Materials Ltd. The contact point for UK customers, programmes and research partners."),
    `## ${t("History")}: ${t("More than thirty years in metals.")}`,
    list(c.timeline.map((e) => `**${e.year}**${colon(lang)}${e.text}`)),
    `## ${t("Certificates")}`,
    `ISO 9001:2015 · ISO 14001:2015. ${t("Quality and environmental management.")}`,
    `## ${t("Award")}`,
    `ESA FIRST! Propulsion, 2025. ${t("Materials and Processes category, for the SPARK project.")} ${link(t("Read about SPARK"), url("/new-alloys/#spark"))}`,
    `## ${t("The Bimo group")}: ${t("Three companies, one chain.")}`,
    richLinks(t("<0>PRISM by Mirdyne</0> designs alloys. Bimo Materials develops and makes them. <1>Bimo Tech</1> has supplied metals and parts since 1992."), [
      "https://prism.mirdyne.com/",
      "https://www.bimotech.pl/",
    ]),
    `## ${t("News")}: ${t("Latest from the Bimo Group.")}`,
    list(c.news.map((n) => `**${date(lang, n.date)} · ${n.tag}**${colon(lang)}${n.title}. ${n.body}`)),
  );
}

function contact(x: Ctx): string {
  const { t, c, kv } = x;
  return blocks(
    `# ${t("Request a quote.")}`,
    t("Send a drawing or a specification. We reply with a price and a lead time."),
    list(
      [
        kv(t("Email"), `[${c.company.email}](mailto:${c.company.email})`),
        c.company.phone ? kv(t("Phone"), c.company.phone) : "",
        kv(t("Wrocław"), c.company.address.join(", ")),
        kv(t("Oxford"), c.company.oxford),
      ].filter(Boolean),
    ),
    t("A mutual NDA is available before any technical exchange. Say so in your message."),
  );
}

function credits(x: Ctx): string {
  const { t, c } = x;
  const all = Object.values(c.images as Record<string, Img>).filter((i) => i.src && i.credit);
  const own = all.filter((i) => !i.license);
  const licensed = all.filter((i) => i.license);
  return blocks(
    `# ${t("Picture credits")}`,
    t("Every photograph on this site, who took it and how we may use it. Licensed photographs are cropped and resized to fit the layout."),
    `## ${t("Our own photographs")} · ${own.length}`,
    list(own.map((i) => `${i.alt}. ${i.credit === OWN ? t("Bimo group, project SPARK") : i.credit}`)),
    `## ${t("Used under licence")} · ${licensed.length}`,
    list(
      licensed.map((i) =>
        [`${i.alt}. ${i.credit}`, i.licenseUrl ? link(i.license!, i.licenseUrl) : i.license, i.source ? link(t("Source"), i.source) : ""].filter(Boolean).join(" · "),
      ),
    ),
    t("Partner and customer logos belong to their owners."),
  );
}

function privacy(x: Ctx): string {
  const { t, c, lang } = x;
  const email = c.company.email;
  const mail = [`mailto:${email}`];
  return blocks(
    `# ${t("Privacy notice")}`,
    t("How Bimo Materials handles personal data on this website: what we collect, why, who processes it for us, and your rights under the GDPR."),
    `*${t("Last updated: {date}", { date: date(lang, privacyFacts.updated) })}*`,
    `## ${t("Who is responsible")}`,
    richLinks(t("The controller of your personal data is {controller}. You can reach us about anything in this notice at <0>{email}</0>.", { controller: privacyFacts.controller, email }), mail),
    [
      privacyFacts.controller,
      privacyFacts.registeredOffice,
      privacyFacts.companyNumber && `${t("Company number")}${colon(lang)}${privacyFacts.companyNumber}`,
      c.company.address.join(", "),
      c.company.oxford,
    ]
      .filter(Boolean)
      .join("  \n"),
    `## ${t("What we collect and why")}`,
    `### ${t("When you send the quote form")}`,
    t("We receive what you enter: your email address and, if you give them, your name, organisation, the material, form, size and quantity you need, your message and the items in your quote basket. We also record the language and address of the page you sent it from, so we know what you were looking at."),
    t("We use this only to answer your request and to prepare and carry out any order that follows. The legal basis is Article 6(1)(b) GDPR: steps taken at your request before entering into a contract, and the performance of the contract once you order. For correspondence with you as a contact at a company, it is Article 6(1)(f) GDPR, our legitimate interest in answering business enquiries. Records that tax and accounting law requires us to keep are kept under Article 6(1)(c) GDPR, a legal obligation."),
    t("Giving these details is voluntary, but without an email address we cannot reply."),
    `### ${t("When you email us")}`,
    t("We use your message and contact details in the same way and on the same legal basis."),
    `### ${t("When you visit the site")}`,
    t("Like any website, the servers of our hosting provider receive technical data with each request: your IP address, the page requested, the time and your browser’s identification. This is needed to deliver the site and protect it against attacks, which is our legitimate interest under Article 6(1)(f) GDPR. We do not use it to identify you or to build profiles."),
    `## ${t("Who processes data for us")}`,
    t("We use these providers, each bound by a data processing agreement with us:"),
    list([
      t("Vercel Inc. (United States) hosts the website and delivers its pages."),
      t("Resend (United States) delivers the messages sent with the quote form to our inbox."),
      t("home.pl S.A. (Poland) runs our email servers, where your messages are received and kept."),
    ]),
    t("Vercel and Resend process data in the United States. These transfers are protected by the European Commission’s standard contractual clauses (Article 46(2)(c) GDPR), which are part of our data processing agreements with them. You can ask us for a copy."),
    t("We do not sell personal data or disclose it to any other recipients, unless the law requires it."),
    `## ${t("Cookies and tracking")}`,
    t("This site sets no cookies and uses no analytics, advertising or tracking tools. Fonts, images and the map on the globe are served from this website, so opening a page sends nothing to third parties."),
    t("The quote basket is kept in your browser’s local storage, on your device only. It is not sent to us until you send the form, and you can clear it at any time by removing the items or clearing your browser’s data for this site."),
    `## ${t("How long we keep it")}`,
    t("Quote requests and emails: deleted automatically 12 months after we receive them. You can ask us to delete them sooner at any time. If you place an order, we keep the records that tax and accounting law requires, such as invoices, for as long as that law requires. Server logs: kept by our hosting provider only as long as needed to run and secure the site, then deleted automatically."),
    `## ${t("Your rights")}`,
    richLinks(t("Under the GDPR and the UK GDPR you can ask us for access to your data and a copy of it, and to correct it. Under the conditions the GDPR sets, you can also ask us to delete it, to restrict how we use it, and, for data you gave us to prepare or carry out a contract, to send it to you or another company in a structured, commonly used, machine-readable format. You can object at any time, on grounds relating to your particular situation, to processing based on our legitimate interests. Write to <0>{email}</0>. We reply within one month; if a request is complex, we may need up to two months more and will tell you within the first month.", { email }), mail),
    t("If you think we handle your data unlawfully, you can complain to a supervisory authority, in particular in the country where you live or work or where you believe the infringement took place. In Poland this is the President of the Personal Data Protection Office (UODO), ul. Stawki 2, 00-193 Warsaw; in the United Kingdom, the Information Commissioner’s Office (ICO)."),
    t("We do not use your data for automated decisions or profiling."),
    `## ${t("Changes to this notice")}`,
    t("We update this notice when the website or our providers change. The date at the top shows the current version."),
  );
}

/** The footer of every Markdown page: where the page lives, its other languages, and the site guide. */
function footer(lang: Lang, path: string): string {
  const others = LANGS.filter((l) => l !== lang).map((l) => link(NATIVE[l], SITE + mdHref(href(l, path))));
  return blocks(
    "---",
    `HTML: ${SITE + href(lang, path)}`,
    others.join(" · "),
    `Bimo Materials · ${link("llms.txt", `${SITE}/llms.txt`)} · ${link("sitemap.xml", `${SITE}/sitemap.xml`)}`,
  );
}

/** The Markdown for a page (an English path such as "/materials/powders/") in a language, or null if there is no such page. */
export function pageMarkdown(lang: Lang, path: string): string | null {
  if (!PAGE_PATHS.includes(path)) return null;
  const x = ctx(lang);
  const parts = path.split("/").filter(Boolean);
  let body: string;
  if (path === "/") body = home(x);
  else if (path === "/materials/") body = materials(x);
  else if (parts[0] === "materials" && parts.length === 2) body = family(x, parts[1]);
  else if (parts[0] === "materials" && parts.length === 3) body = material(x, parts[1], parts[2]);
  else if (path === "/manufacturing/") body = manufacturing(x);
  else if (path === "/new-alloys/") body = newAlloys(x);
  else if (path === "/industries/") body = industriesPage(x);
  else if (parts[0] === "industries" && parts.length === 2) body = industry(x, parts[1]);
  else if (path === "/company/") body = company(x);
  else if (path === "/contact/") body = contact(x);
  else if (path === "/credits/") body = credits(x);
  else if (path === "/privacy/") body = privacy(x);
  else return null;
  return `${body}\n${footer(lang, path)}`;
}
