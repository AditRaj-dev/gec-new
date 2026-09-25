'use client';

import {
  NewsletterBookshelf,
  defaultNewsletterBooks,
} from '@/components/ui/newsletter-bookshelf';

import type { GecDispatchItem } from '@/lib/dispatchData';

export { defaultNewsletterBooks };

export function NewsletterSection({ items }: { items: GecDispatchItem[] }) {
  return (
    <NewsletterBookshelf
      items={items}
      brand="GEC DISPATCH"
    />
  );
}
