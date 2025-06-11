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
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'source.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: 'picsum.photos',
    },
    {
      protocol: 'https',
      hostname: 'qjpnvzrmiibksdvxmzop.supabase.co',
    },
    {
      protocol: 'https',
      hostname: 'images.kabum.com.br',
    }
  ],
},
};

export default nextConfig;
