import assert from 'node:assert/strict';
import { storyToBook } from './storyToBook.ts';

const story = {
  id: 's1', slug: 'farmvision', title: 'From Garage to Seed Round', category: 'Founder Story',
  excerpt: 'Meet the student builders.', authorOrFounder: 'Aman Sharma', startupName: 'FarmVision AI',
  publishedAt: '2026-03-02', tags: ['agritech'], readTime: '6 min',
};
const b = storyToBook(story, 0);
assert.equal(b.id, 's1');
assert.equal(b.title, 'From Garage to Seed Round');
assert.equal(b.subtitle, 'Aman Sharma · FarmVision AI');
assert.equal(b.category, 'Founder Story');
assert.equal(b.href, '/stories#farmvision');
assert.equal(b.executiveSummary, 'Meet the student builders.');
assert.equal(b.readTime, '6 min');
assert.ok(b.date.length > 0);
// covers cycle through the brand palette, deterministic by index
assert.equal(storyToBook(story, 0).color, storyToBook(story, 4).color);
assert.notEqual(storyToBook(story, 0).color, storyToBook(story, 1).color);
// missing optional fields never render "undefined"
const bare = storyToBook({ ...story, authorOrFounder: undefined, startupName: undefined }, 2);
assert.equal(bare.subtitle, undefined);

console.log('storyToBook.check: all assertions passed');
