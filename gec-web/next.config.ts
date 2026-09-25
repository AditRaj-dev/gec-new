import type { NextConfig } from 'next';
import path from 'path';

const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
const mediaHost = mediaBase ? new URL(mediaBase).hostname : null;

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
      // CMS media: the public Cloudflare R2 bucket behind its media domain (deployment.md §4.5).
      ...(mediaHost ? [{ protocol: 'https' as const, hostname: mediaHost }] : []),
    ],
    // CMS uploads get content-hashed keys and never change, so optimized copies can be cached for 30 days.
    minimumCacheTTL: 2592000,
  },
  async redirects() {
    return [
      { source: '/archives', destination: '/initiatives', permanent: true },
      { source: '/newsletter', destination: '/stories#dispatch', permanent: true },
    ];
  },
};

export default nextConfig;
