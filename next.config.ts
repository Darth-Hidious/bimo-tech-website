import type { NextConfig } from "next";

// Static export: every page is pre-rendered HTML, so the site can be served
// by nginx or Apache as plain files, or deployed to Vercel unchanged.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // One 404 page for both root layouts (English and the other languages): app/global-not-found.tsx.
  experimental: { globalNotFound: true },
};

export default nextConfig;
