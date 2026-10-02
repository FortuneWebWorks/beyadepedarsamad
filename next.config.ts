import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deployed as a static bundle to GitHub Pages.
  output: "export",
  trailingSlash: true,
  images: {
    // Google Drive redirects thumbnails to this CDN host; media.ts builds URLs
    // against it directly so we can request exact widths.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
    ],
    // No image server exists in a static export, so next/image would only
    // add weight here — every <img> is hand-written with srcSet instead.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
};

export default nextConfig;
