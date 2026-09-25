import assert from 'node:assert/strict';
import { pickList, pickSingleton } from './contentPick.ts';

const fb = { title: 'Fallback', lede: 'Keep me' };
// API unset / failed → fetchPublishedProjection returned the null fallback
assert.deepEqual(pickSingleton(null, fb), fb);
// empty list → fallback
assert.deepEqual(pickSingleton([], fb), fb);
// published doc merges over fallback: missing keys survive
assert.deepEqual(pickSingleton([{ id: 'a', data: { title: 'CMS' } }], fb), { title: 'CMS', lede: 'Keep me' });
// malformed payload → fallback
assert.deepEqual(pickSingleton({ nope: true }, fb), fb);
assert.deepEqual(pickSingleton([{ id: 'a' }], fb), fb);

const list = [{ n: 'a' }, { n: 'b' }];
assert.deepEqual(pickList(null, list), list);
assert.deepEqual(pickList([], list), list);
// items unwrap to data, sorted by data.order; missing order keeps position
assert.deepEqual(
  pickList([{ id: '1', data: { n: 'x', order: 2 } }, { id: '2', data: { n: 'y', order: 1 } }, { id: '3', data: { n: 'z' } }], list),
  [{ n: 'y', order: 1 }, { n: 'x', order: 2 }, { n: 'z' }],
);
// items without data are dropped; all dropped → fallback
assert.deepEqual(pickList([{ id: '1' }], list), list);

console.log('contentPick.check: all assertions passed');
