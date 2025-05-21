import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  images: {
    domains: ['source.unsplash.com', 'picsum.photos', 'qjpnvzrmiibksdvxmzop.supabase.co'],
  },
};

export default nextConfig;
