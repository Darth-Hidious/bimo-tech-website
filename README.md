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
node scripts/check-out.mjs   # after a build: hreflang, canonicals, and no English left on translated pages
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
| `public/img/own/` | Our own photographs (Bimo group, project SPARK) |
| `public/img/ext/`, `public/img/web/` | Licensed photographs from PRISM's library, Wikimedia Commons and Flickr. Each one's author, licence and source is in `lib/site.ts` and listed on /credits |

To add a material, add an entry to its family in `lib/catalog.ts`, run `npm run i18n` and translate the new strings in `lib/i18n/dict/*.json`. Its page, its card, the search index, the sitemap and the periodic table update on the next build, in every language.

## Languages

English, Polish, German, French, Spanish, Italian, Czech, Slovak, Hungarian and Japanese, the languages of the old bimomaterials.com. Every language is a full set of pre-rendered pages at its own address (`/de/materials/refractory-metals/tungsten/`), not a translation made in the browser, so search engines index each one in its language:

- `<html lang>`, a canonical link and `hreflang` links to the same page in all ten languages (plus `x-default`, English) on every page, and the same pairs in `sitemap.xml`.
- Titles, descriptions, headings and image alt texts are translated with the product terms buyers search for in each country, not word for word.
- Numbers and dates follow each language (3.422 °C in German, 3 422 °C in French).
- The language menu links to the same page in each language. Nobody is redirected by browser language.

Translations are keyed by the English text. Pages and data call `t("…")`; data text in `lib/catalog.ts` and `lib/site.ts` is translated automatically (identifiers, codes, links and credits are left alone, see `lib/i18n/walk.ts`). The build stops if any language misses a string or breaks a `{placeholder}`. Product slugs stay English in every language.

The translations were drafted with Claude ahead of time (not by a live translation service), with the main product terms checked against suppliers' sites in each language. Before launch, have a native speaker in the sales team read each language, Polish and German first.

## Design

A sibling of the PRISM design system with its own identity:

- Steel ground `#f3f4f5`, graphite story sections `#11161b`, logo blue `#1b6cb6`, copper `#d9823f` for the one main action per screen.
- Google Sans for text and headlines, Google Sans Code for grades, purities and standards. Both open source (SIL OFL) and self-hosted through Fontsource, so no requests go to Google.
- A real globe (WebGL 2, EOxCloudless satellite map) in the Company sections, ported from the PRISM site (`lib/globe.ts`, `components/Globe.tsx`).
- The periodic-table element tile is the brand's own mark.
- Photo credits are collected on one page, /credits, generated from `lib/site.ts`.

## Quote form email

When someone sends the quote form, the site emails the request to the sales inbox. The reply-to is the visitor's address, so answering the email answers them. Sending goes through [Resend](https://resend.com), an email API whose free plan is enough for a quote form.

To set it up on a Vercel account:

1. **Deploy the site.** In Vercel: Add New → Project → import this GitHub repository. The defaults work: framework Next.js, build command `npm run build`. The Vercel account needs access to the repository, so invite it or transfer the repository.
2. **Create a Resend account** and add the domain `bimomaterials.com` (Domains → Add domain). Resend lists a few DNS records (SPF and DKIM). Add them wherever the domain's DNS is managed and wait until Resend shows the domain as verified. This is what stops the emails landing in spam.
3. **Create an API key** in Resend (API Keys → Create, "Sending access").
4. **In the Vercel project**, open Settings → Environment Variables and add these for Production:
   - `RESEND_API_KEY`: the key from step 3
   - `QUOTE_TO`: the inbox that receives requests, e.g. `info@bimomaterials.com`. Separate several with commas.
   - `QUOTE_FROM`: the sender, on the verified domain, e.g. `Bimo Materials website <quotes@bimomaterials.com>`
5. **Redeploy** (Deployments → ⋯ → Redeploy). Then send a test request from the live site.

Junk handling: a hidden field that only bots fill in, a minimum of 3 seconds between opening the page and sending, length limits on every field, and a cap of 5 requests a minute per address. If spam still gets through, add a rate-limit or bot-protection rule for `/api/quote/` in the Vercel project's Firewall. If Resend is ever down, visitors see a message asking them to write to the sales address directly. Failures are logged in the Vercel project's Logs.

## Before launch

1. **Quote form email.** See "Quote form email" below. Until it is set up, the form opens the visitor's own email program instead.
2. **Contact details.** `lib/site.ts → company`: Bimo Materials' own email and phone.
3. **Photographs.** Several pages use licensed stand-ins (forging, cold spray, delivery, nuclear steel, water treatment). Replace them with your own shots when you have them: change `src` in `lib/site.ts` and drop the licence fields.
4. **Logo permissions** for ESA, ArianeGroup, Fusion for Energy and ITER on the homepage.
5. **Privacy notice.** `views/Privacy.tsx` is a draft and is set to noindex.
6. **Facts to confirm** with the team: stocked grades (TZM, WLa, WCu), which manufacturing services run in-house, testing scope.
7. **Redirects from the old site.** The old bimomaterials.com keeps English under `/en/` and has its own page addresses in every language. Map each old address that Google has indexed to its new page with a permanent (301) redirect, so rankings carry over. On Vercel this goes in `vercel.json`, on nginx or Apache in the server configuration.
8. **Native-speaker read.** Have someone in sales read each language before launch, Polish and German first. Open choices: Polish addresses the reader as "Ty" (informal); Czech and Slovak write Wrocław as Vratislav and Vroclav, Polish writes Oxford as Oksford.
