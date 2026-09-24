'use client';

import {
  NewsletterBookshelf,
  defaultNewsletterBooks,
} from '@/components/ui/newsletter-bookshelf';

import { GEC_DISPATCH_ARCHIVE, type GecDispatchItem } from '@/lib/dispatchData';

export { GEC_DISPATCH_ARCHIVE, type GecDispatchItem };

export { defaultNewsletterBooks };

export function NewsletterSection() {
  return (
    <NewsletterBookshelf
      items={GEC_DISPATCH_ARCHIVE}
      brand="GEC DISPATCH"
    />
  );
}
