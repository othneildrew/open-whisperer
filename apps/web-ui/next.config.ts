import type { NextConfig } from "next";

const NEXT_SERVER_ENDPOINT = process.env.NEXT_SERVER_ENDPOINT || 'http://localhost:8000';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`${NEXT_SERVER_ENDPOINT}/media/**`),
    ]
  },
};

export default nextConfig;
