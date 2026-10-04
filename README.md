# Bimo Materials website

The website for Bimo Materials (bimomaterials.com): specialty metals, powders, sputtering targets, high-purity metals and new alloys. Part of the Bimo group, alongside Bimo Tech and PRISM by Mirdyne.

Built with Next.js 16 (App Router) as a **static export**: every page is pre-rendered HTML, so the full text is in the initial response for visitors, search engines and AI assistants. The `out/` folder can be served by nginx or Apache as plain files, or the repository can be deployed to Vercel as it is.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # writes the static site to out/
npm run lint     # type check
```

## Where things live

| Path | What |
| --- | --- |
| `lib/catalog.ts` | The catalog: 8 material families, 14 material pages, grades, forms, properties |
| `lib/site.ts` | Images and their credits, the homepage path and outcomes, services, industries, history, news, contact details |
| `lib/elements.ts` | Periodic table layout and atomic numbers |
| `app/` | One folder per page. `materials/[family]/[material]` generates a page per material |
| `components/` | Header, footer, photo with credit line, element tile, strips, quote form, materials explorer |
| `app/globals.css` | The design system: tokens at the top, then components |
| `public/img/own/` | Our own photographs (Bimo group, project SPARK) |
| `public/img/ext/`, `public/img/web/` | Licensed photographs from PRISM's library, Wikimedia Commons and Flickr. Each one's author, licence and source is in `lib/site.ts` and listed on /credits |

To add a material, add an entry to its family in `lib/catalog.ts`. Its page, its card, the search index, the sitemap and the periodic table update on the next build.

## Design

A sibling of the PRISM design system with its own identity:

- Steel ground `#f3f4f5`, graphite story sections `#11161b`, logo blue `#1b6cb6`, copper `#d9823f` for the one main action per screen.
- Archivo, set at 110 % width for headlines to echo the wide logo; IBM Plex Mono for grades, purities and standards. Both self-hosted, no Google requests.
- The periodic-table element tile is the brand's own mark.
- Photo credits are collected on one page, /credits, generated from `lib/site.ts`.

## Before launch

1. **Quote form delivery.** Set `NEXT_PUBLIC_QUOTE_ENDPOINT` at build time to a form handler (CRM webhook, Formspree, a serverless function). Without it the form opens the visitor's email program.
2. **Contact details.** `lib/site.ts → company`: Bimo Materials' own email and phone.
3. **Photographs.** Several pages use licensed stand-ins (forging, cold spray, delivery, nuclear steel, water treatment). Replace them with your own shots when you have them: change `src` in `lib/site.ts` and drop the licence fields.
4. **Logo permissions** for ESA, ArianeGroup, Fusion for Energy and ITER on the homepage.
5. **Privacy notice.** `app/privacy` is a draft and is set to noindex.
6. **Facts to confirm** with the team: stocked grades (TZM, WLa, WCu), which manufacturing services run in-house, testing scope.
