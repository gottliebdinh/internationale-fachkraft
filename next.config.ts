import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { BRAND_SYMBOL_SRC } from "./src/lib/brand-logo";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      // Browsers request /favicon.ico by default; serve our mark (no default triangle .ico).
      { source: "/favicon.ico", destination: BRAND_SYMBOL_SRC },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nmsawotkcrhahahyulci.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
