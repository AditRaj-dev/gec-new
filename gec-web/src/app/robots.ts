import type { MetadataRoute } from 'next';
import { INDEXABLE, SITE_URL } from '@/lib/site';

// Served at /robots.txt. Search and AI crawlers are welcome: being cited is the point of a public student org site.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: INDEXABLE ? [{ userAgent: '*', allow: '/', disallow: ['/api/'] }] : [{ userAgent: '*', disallow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
