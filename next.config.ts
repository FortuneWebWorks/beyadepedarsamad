import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/beyadepedarsamad",
  assetPrefix: "/beyadepedarsamad/",
};

export default nextConfig;
