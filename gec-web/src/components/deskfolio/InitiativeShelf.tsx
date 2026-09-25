'use client';

import { NewsletterBookshelf } from '@/components/ui/newsletter-bookshelf';
import { gecBookToShelfItem } from '@/lib/gecBookToShelfItem';
import { GEC_BOOKS, GEC_BOOKS_BY_ID } from './gecBooksData';

const SHELF_ITEMS = GEC_BOOKS.map(gecBookToShelfItem);

/**
 * Phone recomposition of the DeskFolio desk: the four initiative volumes on the bookshelf,
 * each opening into its real pages. Rendered by DeskRunway below 769px.
 */
export function InitiativeShelf() {
  return (
    <NewsletterBookshelf
      items={SHELF_ITEMS}
      brand="GEC INITIATIVES"
      variant="bookcase"
      buildBook={(item) => GEC_BOOKS_BY_ID[item.id]}
    />
  );
}
