// Where the site lives. Nothing to configure: on Vercel the address comes from the project's
// production domain (VERCEL_PROJECT_PRODUCTION_URL, the shortest custom domain added to the project,
// or its .vercel.app address while there is none). Canonical links, hreflang and the sitemap all
// follow it. SITE_URL overrides it if ever needed. The email address does not: it is the company's
// own, whatever domain the site runs on (contactEmail below).
// This file must not import anything: scripts/check-out.mjs loads it directly with Node.

const clean = (s: string) => s.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");

function host(): string {
  const explicit = process.env.SITE_URL;
  if (explicit) return clean(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return clean(vercel);
  return "localhost:3000"; // a local build
}

export const SITE_HOST = host();
export const SITE = SITE_HOST.startsWith("localhost") ? `http://${SITE_HOST}` : `https://${SITE_HOST}`;

/**
 * Search engines may index the site only once it runs on its own domain. On a .vercel.app address or
 * a local build every page says noindex, so the preview link can be shared without it showing up in
 * Google ahead of launch.
 */
export const IS_LIVE = !/\.vercel\.app$/.test(SITE_HOST) && !SITE_HOST.startsWith("localhost");

/**
 * The sales address shown on the site, and the inbox and sender of quote emails: CONTACT_EMAIL if set,
 * otherwise the company address from lib/site.ts (info@bimomaterials.com).
 */
export const contactEmail = (address: string) => process.env.CONTACT_EMAIL || address;
