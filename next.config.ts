import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: [
    'styled-portfolio-5.cluster-7.preview.emergentcf.cloud',
    'styled-portfolio-5.preview.emergentagent.com',
    '*.preview.emergentagent.com',
    '*.preview.emergentcf.cloud',
    '*.cluster-7.preview.emergentcf.cloud',
    'localhost',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/archives', destination: '/initiatives', permanent: true },
      { source: '/newsletter', destination: '/stories#dispatch', permanent: true },
    ];
  },
};

export default nextConfig;
