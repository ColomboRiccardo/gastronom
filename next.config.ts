import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Mirror of OPTIMIZABLE_HOST_SUFFIXES in src/lib/images.ts
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.gastronomsanremo.com" },
      { protocol: "https", hostname: "gastronomsanremo.com" },
    ],
  },
  async redirects() {
    // Belt and braces for the hosting-level rule: apex always lands on www.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "gastronomsanremo.com" }],
        destination: "https://www.gastronomsanremo.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
