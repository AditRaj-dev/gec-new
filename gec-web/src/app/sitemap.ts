import type { MetadataRoute } from 'next';
import { getStories } from '@/lib/api';
import { SITE_URL } from '@/lib/site';

// Served at /sitemap.xml. Story URLs come from the same source as the pages, so new CMS stories appear here.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/initiatives`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/stories`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/teams`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
  ];
  const stories = (await getStories()).map((s) => ({
    url: `${SITE_URL}/stories/${s.slug}`,
    lastModified: new Date(s.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  return [...pages, ...stories];
}
