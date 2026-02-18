import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable experimental features if needed
  },
  // Force all API routes to use the same runtime
  // This helps with in-memory state sharing on Vercel
  serverExternalPackages: [],
};

export default nextConfig;
