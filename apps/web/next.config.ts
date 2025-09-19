import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  transpilePackages: ['@industrial/graph', '@industrial/sdk'],
};

export default nextConfig;
