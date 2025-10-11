import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Exclude backend directory from Next.js build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/backend/**', '**/node_modules/**'],
      };
    }
    return config;
  },
};

export default nextConfig;
