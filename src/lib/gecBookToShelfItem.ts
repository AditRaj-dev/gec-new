import type { GecBook } from '@/components/deskfolio/gecBooksData';
import type { NewsletterBookshelfItem } from '@/components/ui/newsletter-bookshelf';

/** One initiative volume as a spine on the phone bookshelf; its pages come from GEC_BOOKS_BY_ID. */
export function gecBookToShelfItem(book: GecBook, index: number): NewsletterBookshelfItem {
  return {
    id: book.id,
    title: book.shortTitle,
    date: 'GEC / 26',
    subtitle: book.subtitle,
    color: book.coverTheme.base,
    foil: book.coverTheme.foil,
    editionNumber: `VOL. ${String(index + 1).padStart(2, '0')}`,
    category: book.badge,
  };
}
