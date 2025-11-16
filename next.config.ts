import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
  output: 'export', // enable static export
  images: {
    unoptimized: true, // close image optimization
  },
};

export default nextConfig;
