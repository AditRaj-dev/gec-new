import type { Story } from '@/lib/types';

/** Stories per bay before a year spills into the next bay. */
const PER_BAY = 4;

export type Book = { story: Story; index: number };
export type Bay = { year?: number; sign: boolean; books: Book[] };

export const yearOf = (s: Story) => new Date(s.publishedAt).getFullYear();

/** Entrance bay, one bay per (chunk of a) publishing year, then the end bay. */
export function planAisle(stories: Story[]): Bay[] {
  const byYear = new Map<number, Book[]>();
  stories
    .map((story, index) => ({ story, index }))
    .sort((a, b) => a.story.publishedAt.localeCompare(b.story.publishedAt))
    .forEach((b) => {
      const y = yearOf(b.story);
      byYear.set(y, [...(byYear.get(y) ?? []), b]);
    });
  const bays: Bay[] = [{ sign: false, books: [] }];
  for (const [year, books] of byYear) {
    for (let i = 0; i < books.length; i += PER_BAY) bays.push({ year, sign: i === 0, books: books.slice(i, i + PER_BAY) });
  }
  bays.push({ sign: false, books: [] });
  return bays;
}

/** FullViewportAct runway (in viewports) for a given aisle: longer aisle, longer walk. */
export const aisleRunway = (bays: number) => Math.min(6, Math.max(3.2, 2 + bays * 0.55));
