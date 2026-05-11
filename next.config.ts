import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.telegram.org" },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BOT_USERNAME: process.env.NEXT_PUBLIC_BOT_USERNAME,
  },
  // Externalize packages that have native modules or cause build issues
  serverExternalPackages: ['pdf-parse', 'mammoth', 'telegraf', 'canvas', 'xlsx'],
};

export default nextConfig;
