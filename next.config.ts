import type { NextConfig } from "next";

// Every page is still pre-rendered to static HTML at build time (see the build output: ○ and ●).
// The one piece of server code is the quote form's mail sender, app/api/quote/route.ts, which runs as a
// Vercel function. Hosted elsewhere, run `next start` on Node.
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  // One 404 page for both root layouts (English and the other languages): app/global-not-found.tsx.
  experimental: { globalNotFound: true },
};

export default nextConfig;
