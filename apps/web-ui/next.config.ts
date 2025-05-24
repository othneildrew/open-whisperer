import type { NextConfig } from "next";

const IMG_SERVER = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

const nextConfig: NextConfig = {
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/output
  output: 'standalone',
  images: {
    remotePatterns: [
      new URL(`${IMG_SERVER}/media/**`),
    ]
  },
};

export default nextConfig;
