// Where the site lives. Nothing to configure: on Vercel the address comes from the project's
// production domain (VERCEL_PROJECT_PRODUCTION_URL, the shortest custom domain added to the project,
// or its .vercel.app address while there is none). Canonical links, hreflang, the sitemap and the
// default email addresses all follow it. SITE_URL overrides it if ever needed.
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
 * The domain for email addresses: the registered domain, without subdomains. www.bimomaterials.com and
 * materials.bimotech.pl give bimomaterials.com and bimotech.pl; bimo.co.uk stays bimo.co.uk.
 */
export const SITE_DOMAIN = (() => {
  const parts = SITE_HOST.replace(/:\d+$/, "").split(".");
  const keep = parts.length > 2 && /^(co|com|org|net|ac|gov|edu)$/.test(parts[parts.length - 2]) ? 3 : 2;
  return parts.slice(-keep).join(".");
})();

/**
 * Search engines may index the site only once it runs on its own domain. On a .vercel.app address or
 * a local build every page says noindex, so the preview link can be shared without it showing up in
 * Google ahead of launch.
 */
export const IS_LIVE = !/\.vercel\.app$/.test(SITE_HOST) && !SITE_HOST.startsWith("localhost");

/**
 * The sales address shown on the site and used for quote requests: CONTACT_EMAIL if set, otherwise
 * info@ on the site's own domain. Before launch (no domain yet) the placeholder from lib/site.ts.
 */
export const contactEmail = (placeholder: string) => process.env.CONTACT_EMAIL || (IS_LIVE ? `info@${SITE_DOMAIN}` : placeholder);
