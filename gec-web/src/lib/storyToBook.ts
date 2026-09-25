import type { Story } from './types';
import type { NewsletterBookshelfItem } from '@/components/ui/newsletter-bookshelf';

const COVERS = ['#A3040F', '#222222', '#7B1113', '#1F7EC0'] as const;

export function storyToBook(story: Story, index: number): NewsletterBookshelfItem {
  const byline = [story.authorOrFounder, story.startupName].filter(Boolean).join(' · ');
  return {
    id: story.id,
    title: story.title,
    date: new Date(story.publishedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    subtitle: byline || undefined,
    href: `/stories#${story.slug}`,
    color: COVERS[index % COVERS.length],
    category: story.category,
    readTime: story.readTime,
    tags: story.tags,
    executiveSummary: story.excerpt,
  };
}
