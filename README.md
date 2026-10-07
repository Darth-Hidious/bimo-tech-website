# Bimo Materials website

The website for Bimo Materials (bimomaterials.com): specialty metals, powders, sputtering targets, high-purity metals and new alloys. Part of the Bimo group, alongside Bimo Tech and PRISM by Mirdyne.

Built with Next.js 16 (App Router). Every page is pre-rendered to static HTML at build time, so the full text is in the first response for visitors, search engines and AI assistants. The only server code is the quote form's mail sender (`app/api/quote/route.ts`), which runs as a Vercel function. Hosted outside Vercel, run `npm run build && npx next start` on Node.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # checks the translations, then builds every page in every language
npm run lint     # type check
npm run i18n     # after changing any English text: refresh the list of strings to translate
npm run check    # after a build: hreflang, canonicals, noindex before launch, no English left on translated pages
npm test         # unit tests: Markdown pages, content negotiation, llms.txt, JSON-LD
npm run check:agents -- http://localhost:3000   # against a running site (or the live URL): what AI agents get
```

## Where things live

| Path | What |
| --- | --- |
| `lib/catalog.ts` | The catalog: 8 material families, 14 material pages, grades, forms, properties |
| `lib/site.ts` | Images and their credits, the homepage path and outcomes, services, industries, history, news, contact details |
| `lib/elements.ts` | Periodic table layout and atomic numbers |
| `views/` | The pages. Each takes a language and is rendered once per language |
| `app/(en)/`, `app/[lang]/` | Routes: English at the root, the other languages under `/pl/`, `/de/` … Thin files that render a view |
| `lib/i18n/` | Languages (`config.ts`), translation (`server.ts`), the strings to translate (`keys.json`) and one dictionary per language (`dict/*.json`) |
| `components/` | Header with language menu, footer, photo, element tile, strips, globe, quote form, materials explorer |
| `app/globals.css` | The design system: tokens at the top, then components |
| `proxy.ts`, `lib/markdown.ts`, `lib/llms.ts`, `lib/structured-data.ts` | What AI agents get: see "For AI agents" below |
| `public/img/own/` | Our own photographs (Bimo group, project SPARK) |
| `public/img/ext/`, `public/img/web/` | Licensed photographs from PRISM's library, Wikimedia Commons and Flickr. Each one's author, licence and source is in `lib/site.ts` and listed on /credits |

To add a material, add an entry to its family in `lib/catalog.ts`, run `npm run i18n` and translate the new strings in `lib/i18n/dict/*.json`. Its page, its card, the search index, the sitemap and the periodic table update on the next build, in every language.

## Languages

English, Polish, German, French, Spanish, Italian, Czech, Slovak, Hungarian and Japanese, the languages of the old bimomaterials.com. Every language is a full set of pre-rendered pages at its own address (`/de/materials/refractory-metals/tungsten/`), not a translation made in the browser, so search engines index each one in its language:

- `<html lang>`, a canonical link and `hreflang` links to the same page in all ten languages (plus `x-default`, English) on every page, and the same pairs in `sitemap.xml`.
- Titles, descriptions, headings and image alt texts are translated with the product terms buyers search for in each country, not word for word.
- Numbers and dates follow each language (3.422 °C in German, 3 422 °C in French).
- The language menu links to the same page in each language.
- A visitor who arrives from outside the site (Google, a link, a typed address) on an English page, with a browser set to one of the other nine languages, is sent to the same page in that language (`proxy.ts`, temporary 307). A Spanish phone in Colombia opening bimomaterials.com lands on `/es/`. The browser's language decides, not the visitor's location: it is what they read, and it works for travellers and VPNs. Clicks inside the site are never redirected, so choosing English in the menu sticks; search engine bots are never redirected, so every language stays indexed. No cookies.

Translations are keyed by the English text. Pages and data call `t("…")`; data text in `lib/catalog.ts` and `lib/site.ts` is translated automatically (identifiers, codes, links and credits are left alone, see `lib/i18n/walk.ts`). The build stops if any language misses a string or breaks a `{placeholder}`. Product slugs stay English in every language.

The translations were drafted with Claude ahead of time (not by a live translation service), with the main product terms checked against suppliers' sites in each language. Before launch, have a native speaker in the sales team read each language, Polish and German first.

## For AI agents

- **Markdown versions of every page.** A request with `Accept: text/markdown` gets the page as Markdown at its own address, with `Content-Type: text/markdown` and `Vary: Accept` (the [acceptmarkdown.com](https://acceptmarkdown.com) convention). Browsers still get HTML. The same Markdown is at the page's `.md` address for clients that cannot set headers: `/index.md`, `/materials/refractory-metals/tungsten.md`, `/de/materials.md`. It is written from the same data and translations as the HTML (`lib/markdown.ts`), pre-rendered at build time (`app/md/`), and served by `proxy.ts`, which runs only for Markdown requests.
- **Markdown 404s.** A missing page asked for as Markdown answers 404 with a short Markdown note linking to the catalog, `llms.txt` and the sitemap.
- **`/llms.txt`** ([llmstxt.org](https://llmstxt.org)): what Bimo Materials does, when an agent should recommend it, how to ask for a quote, and links to the Markdown of every page. Built from the catalog (`lib/llms.ts`), so new materials appear on the next build. Edit the "When to use" and "How an agent should act" text there.
- **JSON-LD** (`lib/structured-data.ts`): `Organization` (address, sales contact, product families) and `WebSite` on the homepage, `BreadcrumbList` on family and material pages. The postal address is `postalAddress` in `lib/site.ts`; keep it in step with `company.address`.

## Design

A sibling of the PRISM design system with its own identity:

- Steel ground `#f3f4f5`, graphite story sections `#11161b`, logo blue `#1b6cb6`, copper `#d9823f` for the one main action per screen.
- Google Sans for text and headlines, Google Sans Code for grades, purities and standards. Both open source (SIL OFL) and self-hosted through Fontsource, so no requests go to Google.
- A real globe (WebGL 2, EOxCloudless satellite map) in the Company sections, ported from the PRISM site (`lib/globe.ts`, `components/Globe.tsx`).
- The periodic-table element tile is the brand's own mark.
- Photo credits are collected on one page, /credits, generated from `lib/site.ts`.

## Hand-over: putting the site on a domain

The site finds its own address. On every build Vercel tells it the project's production domain, and canonical links, `hreflang`, the sitemap and `robots.txt` all follow (`lib/site-url.ts`). Nothing in the code names the site's domain. The email address is fixed instead: info@bimomaterials.com, whatever domain the site runs on (`lib/site.ts → company.email`).

- **On a `.vercel.app` address** (as now) every page is marked noindex. The link can be shared, but it does not appear in Google before launch.
- **On a real domain** the pages become indexable.

### Steps

1. **Take over the project.** In Vercel: Project → Settings → General → Transfer Project, to the new owner's team. The new owner also needs this GitHub repository (transferred, or their GitHub account added to it). Afterwards check under Settings → Git that the project is still connected to it, so every push deploys.
2. **Add the domain.** Settings → Domains → Add, and type the name, e.g. `www.bimomaterials.com` (Vercel offers to add the bare domain too and redirect it). Vercel shows two DNS records. Add them on your own DNS server. Do not switch the domain's nameservers to Vercel: adding the records is enough, and keeps the company's email records where they are. Vercel issues the HTTPS certificate itself.
3. **Redeploy once.** Deployments → the latest → ⋯ → Redeploy. The pages are pre-built, so they pick up the new address on this build. From then on the site is live and searchable on that domain. Every later push redeploys by itself.

### Quote form email (optional, recommended)

Without it the form still works: it opens the visitor's own email program, addressed to info@bimomaterials.com. To have requests arrive directly:

1. Create a free account at [resend.com](https://resend.com) and add `bimomaterials.com` (Domains → Add domain), even while the site runs on another domain. Resend shows three DNS records (on a `send.` subdomain plus a DKIM key, so the company's mailboxes are untouched). Add them on your DNS server and wait until Resend says Verified.
2. Create an API key (API Keys → Create, sending access) and add it in Vercel as the environment variable `RESEND_API_KEY` (Settings → Environment Variables, Production). Redeploy.

Each request then sends two emails, both from `Bimo Materials <info@bimomaterials.com>`:

- **The request**, to info@bimomaterials.com, with every field and each quote-basket item with its form, size and quantity. Replying answers the customer.
- **A copy for the customer**, in the language they used on the site: a thank-you and the material, form, size, quantity and basket items they sent (not their free-text message, so the form cannot be used to send strangers a message). Replying reaches info@bimomaterials.com. If this copy fails, the request still counts as sent and the failure is logged.

If spam gets through, add a rate-limit or bot-protection rule for `/api/quote/` in the Vercel project's Firewall. Failures are logged in the project's Logs.

**Testing before the domain is verified.** Resend can already send from its own test address, but only to the email of the Resend account owner, so the customer's copy is not delivered in this mode (it is logged as failed, and the form still says the request was sent). Set these three in Vercel (Settings → Environment Variables, Production), then redeploy:

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | the key from Resend → API Keys |
| `QUOTE_FROM` | `Bimo Materials website <onboarding@resend.dev>` |
| `QUOTE_TO` | the Resend account owner's email |

Once bimomaterials.com shows Verified in Resend, delete `QUOTE_FROM` and `QUOTE_TO` and redeploy. Keep the key only in Vercel, never in the code: the repository may change hands, the Vercel settings stay with the project.

### Vercel settings checklist

All variables are listed, with placeholders, in `.env.example`.

1. **Project → Settings → Git**: connected to this repository, production branch `main`.
2. **Project → Settings → Environment Variables**, environment Production: `RESEND_API_KEY` = the Resend key. Nothing else is required.
3. **Deployments → newest → ⋯ → Redeploy**, so the new variable takes effect.
4. Check: `npm run check:agents -- https://bimomaterials.com`, then send the contact form once.

Environment Variables is in the *project's* settings (open the project first), not the team's. If it is missing or read-only, your role in the Vercel team cannot manage production variables: ask the team owner to make you Owner or Member, or to add the variable.

### Optional settings (Vercel → Settings → Environment Variables)

| Variable | Default | Use it to |
| --- | --- | --- |
| `CONTACT_EMAIL` | `info@bimomaterials.com` | show, send from and receive at another address |
| `QUOTE_TO` | the contact address | send requests elsewhere, several separated by commas |
| `QUOTE_FROM` | `Bimo Materials <info@bimomaterials.com>` | change the sender (must be on the domain verified in Resend) |
| `SITE_URL` | the project's production domain | force an address, e.g. on a server outside Vercel |

Redeploy after changing any of them.

## Before launch

1. **Domain and quote email.** See "Hand-over" above.
2. **Contact details.** `lib/site.ts → company`: the email is info@bimomaterials.com; add the phone number.
3. **Photographs.** Several pages use licensed stand-ins (forging, cold spray, delivery, nuclear steel, water treatment). Replace them with your own shots when you have them: change `src` in `lib/site.ts` and drop the licence fields.
4. **Logo permissions** for ESA, ArianeGroup, Fusion for Energy and ITER on the homepage.
5. **Privacy notice.** `views/Privacy.tsx` is a draft and is set to noindex.
6. **Facts to confirm** with the team: stocked grades (TZM, WLa, WCu), which manufacturing services run in-house, testing scope.
7. **Redirects from the old site.** Done: the retired site that ran on this domain (`/en/products`, `/pl/services/cnc-milling`, `/en/news/…`, `/en/products?material=tungsten` …) redirects permanently to the matching page here, in the same language (`lib/legacy-redirects.ts`, used by `next.config.ts`). Add a line there if Search Console reports another old address as not found.
8. **Native-speaker read.** Have someone in sales read each language before launch, Polish and German first. Open choices: Polish addresses the reader as "Ty" (informal); Czech and Slovak write Wrocław as Vratislav and Vroclav, Polish writes Oxford as Oksford.
