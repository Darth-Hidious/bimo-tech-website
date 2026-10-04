import type { NextConfig } from "next";

// Static export: every page is pre-rendered HTML, so the site can be served
// by nginx or Apache as plain files, or deployed to Vercel unchanged.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
