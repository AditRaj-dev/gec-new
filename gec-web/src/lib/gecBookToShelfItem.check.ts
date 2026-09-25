import assert from 'node:assert/strict';
import { gecBookToShelfItem } from './gecBookToShelfItem.ts';

const book = {
  id: 'summit', title: "E-Summit '26 Conclave Blueprint", shortTitle: 'E-Summit', subtitle: 'People, arenas, and capital.',
  themeColor: '#0F75BC', badge: 'Flagship Conclave', spineColor: '#0F75BC',
  coverTheme: { base: '#0F75BC', accent: '#FFFFFF', foil: 'rgba(255, 255, 255, 0.72)', ink: 'light' as const },
  cover: null, pages: [],
};
const s = gecBookToShelfItem(book, 1);
// id must survive untouched: InitiativeShelf looks the real pages up by it
assert.equal(s.id, 'summit');
// spines are ~50px wide: they carry the short title
assert.equal(s.title, 'E-Summit');
assert.equal(s.subtitle, book.subtitle);
assert.equal(s.color, '#0F75BC');
assert.equal(s.foil, 'rgba(255, 255, 255, 0.72)');
assert.equal(s.category, 'Flagship Conclave');
assert.equal(s.editionNumber, 'VOL. 02');
assert.equal(gecBookToShelfItem(book, 9).editionNumber, 'VOL. 10');
console.log('gecBookToShelfItem.check: all assertions passed');
