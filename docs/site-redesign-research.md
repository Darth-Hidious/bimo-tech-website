# Bimo Tech Site Redesign — Research & Technical Analysis

> Research compiled 2026-02-07. Based on live analysis of the current Bimo Tech codebase, the TrumpRx / National Design Studio reference, and current scroll-driven animation techniques.

---

## 1. TrumpRx / National Design Studio — What It Actually Is

### Tech Stack

Next.js, Tailwind CSS, ShadCN. The retirement interface projects were built using the same combo. Figma Make (AI-powered prototyping) was used for design.

- Source: [National Design Studio — Wikipedia](https://en.wikipedia.org/wiki/National_Design_Studio)

### Typography

The NDS sites use **Instrument Serif** — a condensed serif revival originally inspired by Apple's 1980s typefaces. This is the same font used by Perplexity, Graza, and Vacation Sunscreen. It's a deliberate "editorial luxury" choice. Notably **serif, not sans-serif**.

Trump separately ordered all government documents reverted to Times New Roman (the prior sans-serif Calibri was described as "yet another wasteful DEI program").

- Source: [Architect's Newspaper — NDS Rebrand](https://www.archpaper.com/2025/12/national-design-studio-rebrand/)

### Layout & Visual Language

- americabydesign.gov is a **dark-themed, single-page scroll narrative**
- Long vertical scroll, large cinematic text that reveals as you scroll
- "Moody images" overlaid by serif talking points
- Ships ~3MB of code for a single page of styled text — described as "comically outsized" by former federal designer Ethan Marcotte
- Gebbia's stated goal: government sites should feel like "an Apple Store — beautifully designed, great user experience, run on modern software"

- Source: [NOTUS — 'Sloppy' Code and Accessibility Issues](https://www.notus.org/trump-white-house/silicon-valley-government-websites-national-design-studio)
- Source: [Dezeen — Joe Gebbia Interview](https://www.dezeen.com/2025/11/18/america-first-chief-design-officer-joe-gebbia-interview/)

### TrumpRx Specific UX

TrumpRx is a **search/browse catalog of ~43 drugs** with coupon cards. It does not sell medications directly. It's a landing page with links to pharmaceutical companies' DTC platforms or printable/digital-wallet coupons.

Each drug listing shows:

- Original list price
- TrumpRx discount price
- Percentage savings
- Printable / digital-wallet coupon (Apple Wallet + Android)
- List of participating pharmacies
- Commonly co-prescribed medications

**User flow:**

1. Browse/search the ~43 medications
2. Confirm eligibility (not on government insurance)
3. Get a coupon or click through to manufacturer DTC site
4. Redeem coupon at pharmacy (print or phone wallet)
5. Prescription validated by pharmacist

**Backend:** Powered by GoodRx API integration. GoodRx hosts self-pay prices; their API feeds into TrumpRx for real-time pricing.

**Two pathways:**

| Pathway | Example | How It Works |
|---|---|---|
| Coupon card | Wegovy, most drugs | Print/save coupon, take to pharmacy |
| Manufacturer DTC | Zepbound (Eli Lilly) | Links to LillyDirect, order + submit Rx |

- Source: [Axios — TrumpRx Is Live](https://www.axios.com/2026/02/06/trump-trumprx-drug-prices-site-live-online)
- Source: [CNBC — White House Launches TrumpRx](https://www.cnbc.com/2026/02/05/trump-rx-white-house-launches-direct-to-consumer-drug-site.html)
- Source: [STAT News — What To Know About TrumpRx](https://www.statnews.com/2026/02/05/trumprx-what-to-know-drug-prices/)

### Known Problems

- **Accessibility:** Three NDS websites failed Equalize Digital's accessibility audit. Low-contrast text, broken heading structures, WCAG non-compliance.
- **AI imagery:** AI-generated images included a child with six toes. Content appears unreviewed.
- **Code quality:** Described as "heavy reliance on unedited AI-generated code" that "could introduce vulnerabilities."
- **Privacy:** No clear HIPAA compliance for medication browsing data.

- Source: [NOTUS](https://www.notus.org/trump-white-house/silicon-valley-government-websites-national-design-studio)

---

## 2. Current Bimo Tech Codebase — What We Already Have

### Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.0.10 |
| UI | React | 19.2.0 |
| Styling | Tailwind CSS + CSS Modules | 4.1.18 |
| Components | ShadCN/UI (Radix) | New York style |
| 3D / Animation | Three.js + GSAP | 0.181 / 3.13 |
| AI | Google Genkit + Gemini 2.0 Flash | 1.27 |
| Backend | Firebase (Firestore, Auth, Storage) | 12.7 |
| Language | TypeScript (strict) | 5.x |
| i18n | 13 languages, context-based | Custom |

### Existing Hero (Hero.tsx — ~1300 lines)

The current hero is a **full-screen ray-marched metaball shader** rendered via Three.js:

- Custom GLSL fragment shader with ray marching, soft shadows, ambient occlusion, fresnel reflections, smooth min blending
- 11 visual presets (holographic, moody, cosmic, minimal, vibrant, neon, sunset, midnight, toxic, pastel, psychedelic)
- Cursor-reactive: metaballs attract toward mouse/touch position
- Performance-adaptive: reduced ray march steps, shadow samples, and sphere counts for mobile/Safari/low-power devices
- Intersection Observer pauses rendering when hero is off-screen
- Scroll-linked mask effect already exists (rounds corners and shrinks hero viewport on scroll)
- Tweakpane UI for theme switching (currently commented out)

### Content & Data

- **Materials:** Rhenium (3180C), Tungsten (3422C), Molybdenum, Tantalum, Niobium + alloys. Each with properties, product forms, applications, standards.
- **Products:** 50+ items across categories: Refractory Metals, Sputtering Targets, Powders & Nanomaterials, Custom Components, High-Entropy Alloys.
- **Services:** CNC milling (5-axis, ±0.02mm), CNC turning (±0.01mm), sheet metal, 3D printing (SLS/SLA/FDM/DMLS), injection molding.
- **Partners:** ESA, ArianeGroup, Fusion for Energy (F4E), IPPT PAN, NCBJ.

### Existing AI Integration

- `BimoAIChat.tsx` — chat widget connected to Genkit/Gemini
- `AIConsultation.tsx` — consultation panel
- `CommandPalette.tsx` — Cmd+K interface
- API routes: `/api/chat`, `/api/agent/analyze-quote`, `/api/quote/extract-specs`

### Homepage Sections (current)

1. Hero (sticky, 200vh scroll container)
2. Mission statement ("We engineer the materials...")
3. Stats (15+ years, 99.9% purity, 50+ projects, 20+ partners)
4. Partner logos (BrandCarousel)
5. Capabilities grid (Refractory Metals, Sputtering Targets, HEAs, Custom Components)
6. Featured project (SPARK / ESA FIRST! Award)
7. Applications (Space, Fusion Energy, Aerospace)
8. About ("Built by scientists")
9. CTA ("Let's build something")
10. Footer

---

## 3. Scroll-Driven Animation — Technical Options

### Option A: CSS Scroll-Driven Animations (Native)

Uses `animation-timeline: scroll()` and `animation-timeline: view()`. Runs on the compositor thread — 120fps, no main thread blocking.

**Browser support (as of Feb 2026):**

- Chrome: Full support
- Firefox: Behind flag
- Safari 26+: Full support (shipped September 2025)

**Key properties:**

```css
.hero-element {
  animation: fadeScale 1s linear both;
  animation-timeline: scroll();
  animation-range: 0% 50%;
}

@keyframes fadeScale {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.8); }
}
```

**Progressive enhancement:**

```css
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    /* scroll-driven animations here */
  }
}
```

**Pros:** Zero JS, compositor thread, perfect scroll sync, no stutter on fast fling.
**Cons:** Limited to CSS-animatable properties. Can't drive canvas/WebGL directly.

- Source: [MDN — CSS Scroll-driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- Source: [Chrome DevRel — Scroll-driven Animation Case Studies](https://developer.chrome.com/blog/css-ui-ecommerce-sda)
- Source: [scroll-driven-animations.style](https://scroll-driven-animations.style/)

### Option B: Pre-rendered Frame Sequence (Apple Approach)

Pre-render a 3D animation (e.g., hammer striking metal) as 150-300 individual JPEG/WebP frames. Draw to `<canvas>`, map scroll position to frame index.

**How Apple does it:**

1. Render animation in Cinema 4D / Blender / After Effects
2. Export as image sequence (e.g., `frame_001.webp` through `frame_300.webp`)
3. Preload images on page load
4. On scroll, calculate: `frameIndex = Math.floor(scrollProgress * (totalFrames - 1))`
5. Draw corresponding image to canvas

**Formula:**

```js
const scrollTop = document.documentElement.scrollTop;
const maxScroll = scrollHeight - windowHeight;
const scrollFraction = scrollTop / maxScroll;
const frameIndex = Math.min(totalFrames - 1, Math.ceil(scrollFraction * totalFrames));

context.drawImage(images[frameIndex], 0, 0);
```

**Why not video scrubbing?** Video codecs use inter-frame compression (only encoding deltas between frames). Seeking to a random position requires reconstructing from the nearest keyframe — too slow for smooth scroll-linked playback, especially on mobile.

**Asset requirements:** 150 frames at 1920x1080 in WebP ≈ 3-5MB total. Needs preloading strategy (progressive or eager).

**Pros:** Exact creative control, any visual is possible, reliable cross-browser.
**Cons:** Requires 3D asset production (Blender/C4D render), large payload, not procedural.

- Source: [CSS-Tricks — Apple-style Scroll Animations](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/)
- Source: [Scrollsequence — How to Make Scroll Image Animation](https://scrollsequence.com/how-to-make-scroll-image-animation/)

### Option C: Extend Existing Three.js Shader (Lowest Effort)

The current Hero.tsx already tracks `scrollProgress` (0 to 1) via a scroll event listener. The metaball shader already has `uTime` and `uMovementScale` uniforms.

**What's possible without new assets:**

- Pass `scrollProgress` as a new uniform
- Morph metaballs based on scroll: converge on scroll down, expand on scroll up
- Change lighting/color preset as scroll progresses (e.g., holographic → vibrant → moody)
- Increase/decrease sphere count or blur with scroll
- Tie the existing mask effect (already working) to a more dramatic reveal

**Pros:** No new dependencies, no assets needed, extends proven code.
**Cons:** Still metaballs, not literally a hammer. Procedural look, not cinematic.

### Option D: WebGL Particle System (Sparks)

Use Three.js `Points` or `InstancedMesh` for spark particles. Trigger burst on scroll threshold. GPU-driven instancing for thousands of particles.

**Pros:** Visceral "materials" feel, interactive.
**Cons:** Hardest to make performant on low-end Android. GPU memory pressure. Battery drain on mobile.

### Comparison Matrix

| Approach | Asset Cost | Dev Effort | Mobile Perf | Cross-browser | Visual Impact |
|---|---|---|---|---|---|
| CSS scroll-timeline | None | Low | Excellent | Good (Safari 26+) | Medium |
| Frame sequence (canvas) | High (3D render) | Medium | Good | Excellent | High |
| Extend Three.js shader | None | Low-Medium | Already optimized | Already works | Medium |
| WebGL particles | None | High | Risky | Moderate | High |

---

## 4. Search-First Architecture — Options

### Current State

- `BimoAIChat.tsx` connects to Genkit/Gemini via `/api/chat`
- `CommandPalette.tsx` provides Cmd+K search
- `products.ts` has 50+ products with structured data (material, purity, melting point, density, applications, forms)
- `materials.ts` has detailed material specs

### Option A: Semantic Search Over Materials Catalog

Route hero search bar to Genkit. The AI agent already has Firestore access. Could support queries like:

- "tungsten rod 99.95% purity"
- "alloys with yield strength above 800 MPa"
- "sputtering targets for PVD"
- "what material works at 2500C in vacuum"

**Implementation:** New `/api/search` endpoint that uses Genkit to parse intent, query Firestore products collection, return ranked results.

### Option B: Structured Faceted Search

Traditional filter-based search. Facets: material type, purity range, temperature rating, form factor, application/industry.

**Implementation:** Client-side filtering over `products.ts` data. No AI needed. Fast, predictable, works offline.

### Option C: Hybrid (Search Bar + Quick Filters)

Search bar for natural language. Below it, quick-filter chips for common queries: "Tungsten", "Sputtering Targets", "> 3000C", "Space-grade".

---

## 5. TrumpRx vs. Bimo Tech — What Translates, What Doesn't

### What translates well

| TrumpRx Pattern | Bimo Tech Adaptation |
|---|---|
| Search/browse catalog as primary UX | Materials catalog with search front and center |
| Each item shows key specs at a glance | Material name, key properties, purity, temp rating |
| Coupon / action button per item | "Request Quote" / "Add to RFQ Basket" per material |
| Co-prescribed drugs | "Commonly paired materials" or "Used in same applications" |
| Participating pharmacies | Available forms + manufacturing capabilities |
| Print/save to wallet | Download datasheet / Save to RFQ basket |

### What doesn't translate

| TrumpRx Pattern | Why It Doesn't Fit |
|---|---|
| 43 items total | Bimo has 50+ products, deeper specs, more complex relationships |
| Single eligibility gate | Bimo users have varied needs (supply, manufacturing, R&D) |
| Price as primary differentiator | Technical specs are primary; pricing is quote-based |
| GoodRx API backend | Need internal Firestore + AI for semantic material search |
| Consumer simplicity | Engineers need data density, not simplification |

---

## 6. Font Options (Alternatives to Instrument Serif)

Since we're considering a different font than what NDS uses, here are options that match the "confident, technical, premium" feel:

### Serif (Editorial / Luxury)

| Font | Character | License |
|---|---|---|
| **Instrument Serif** | What NDS uses. Condensed, editorial. | Open source (Google Fonts) |
| **Fraunces** | Variable, optical sizing, soft serif. | Open source (Google Fonts) |
| **Playfair Display** | High-contrast, elegant. | Open source (Google Fonts) |
| **Source Serif 4** | Adobe's workhorse serif. Technical feel. | Open source |

### Sans-Serif (Technical / Engineering)

| Font | Character | License |
|---|---|---|
| **Inter** | Already in use. Excellent for data-dense UI. | Open source |
| **IBM Plex Sans** | Already in use as heading font. Technical DNA. | Open source |
| **Geist** | Vercel's font. Sharp, modern, mono companion. | Open source |
| **Space Grotesk** | Space-themed, geometric, technical feel. Fits the brand. | Open source (Google Fonts) |
| **Satoshi** | Modern geometric sans. Clean and confident. | Free for commercial use |

### Mono (Data / Specs / Parameters)

| Font | Character | License |
|---|---|---|
| **IBM Plex Mono** | Already in use. | Open source |
| **JetBrains Mono** | Developer-oriented, excellent legibility. | Open source |
| **Geist Mono** | Pairs with Geist Sans. | Open source |

### Recommended Pairing

**Space Grotesk** (headings) + **Inter** (body) + **IBM Plex Mono** (specs/data). Space Grotesk has a geometric, slightly futuristic quality that aligns with "advanced materials for extreme environments" without being gimmicky. Inter is already in the codebase and proven for data-dense UI.

---

## 7. Open Decisions (Blocking Implementation)

These need answers before code gets written:

1. **Hammer/sparks animation:** Commission 3D assets (frame sequence), or extend existing procedural shader?
2. **Hero search:** New semantic search endpoint, or route to existing AI chat?
3. **Returning users:** Persistent search bar over animation, or skip-to-search button?
4. **Scope:** Homepage only, or homepage + product catalog pages?
5. **Font:** Keep current (Inter/IBM Plex), switch to Space Grotesk + Inter, or go serif (Instrument Serif / Fraunces)?
6. **Color palette:** Keep current dark blue-black (#000624), or shift?

---

## References

- [National Design Studio — Wikipedia](https://en.wikipedia.org/wiki/National_Design_Studio)
- [NOTUS — 'Sloppy' Code and Accessibility Issues](https://www.notus.org/trump-white-house/silicon-valley-government-websites-national-design-studio)
- [Axios — TrumpRx Is Live](https://www.axios.com/2026/02/06/trump-trumprx-drug-prices-site-live-online)
- [CNBC — White House Launches TrumpRx](https://www.cnbc.com/2026/02/05/trump-rx-white-house-launches-direct-to-consumer-drug-site.html)
- [STAT News — What To Know About TrumpRx](https://www.statnews.com/2026/02/05/trumprx-what-to-know-drug-prices/)
- [Architect's Newspaper — NDS Rebrand](https://www.archpaper.com/2025/12/national-design-studio-rebrand/)
- [Dezeen — Joe Gebbia Interview](https://www.dezeen.com/2025/11/18/america-first-chief-design-officer-joe-gebbia-interview/)
- [MDN — CSS Scroll-driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [MDN — ScrollTimeline API](https://developer.mozilla.org/en-US/docs/Web/API/ScrollTimeline)
- [Chrome DevRel — Scroll-driven Animation Case Studies](https://developer.chrome.com/blog/css-ui-ecommerce-sda)
- [CSS-Tricks — Apple-style Scroll Animations](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/)
- [CSS-Tricks — Parallax with Scroll-Driven CSS](https://css-tricks.com/bringing-back-parallax-with-scroll-driven-css-animations/)
- [Builder.io — Scroll-Driven Hero Animations](https://www.builder.io/blog/scroll-driven-animations)
- [scroll-driven-animations.style](https://scroll-driven-animations.style/)
- [Scrollsequence — How to Make Scroll Image Animation](https://scrollsequence.com/how-to-make-scroll-image-animation/)
- [design.dev — CSS Scroll-Timeline Guide](https://design.dev/guides/scroll-timeline/)
