import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/output
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
        search: '',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8868',
        pathname: '/media/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
