import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,  // enables "use cache" + cacheTag/cacheLife
  },
};

export default nextConfig;
