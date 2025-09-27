import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  transpilePackages: ['@industrial/graph', '@industrial/sdk'],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    tsconfigPaths: true,
  },
};

export default nextConfig;
