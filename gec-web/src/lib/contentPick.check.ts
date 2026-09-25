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

// --- fallback safety: malformed/partial CMS docs must never crash a page ---

// nested object: missing nested key (`cta`) keeps the fallback's nested value
const routeCopyLikeFallback = { heading: 'Fallback heading', cta: { label: 'Apply', href: '/apply' } };
assert.deepEqual(
  pickSingleton([{ id: 'a', data: { heading: 'CMS heading' } }], routeCopyLikeFallback),
  { heading: 'CMS heading', cta: { label: 'Apply', href: '/apply' } },
);
// nested object: CMS supplies part of the nested object — merged one level deep, kind-checked per key
assert.deepEqual(
  pickSingleton([{ id: 'a', data: { cta: { label: 'Join' } } }], routeCopyLikeFallback),
  { heading: 'Fallback heading', cta: { label: 'Join', href: '/apply' } },
);

// wrong-typed top-level field falls back to the fallback's value
const typedFallback = { count: 5, title: 'T' };
assert.deepEqual(
  pickSingleton([{ id: 'a', data: { count: 'five', title: 'X' } }], typedFallback),
  { count: 5, title: 'X' },
);

// extra unknown key on the CMS doc is dropped (not present in the fallback)
assert.deepEqual(
  pickSingleton([{ id: 'a', data: { title: 'X', secret: 'leak' } }], typedFallback),
  { count: 5, title: 'X' },
);

// list item missing a required key (present on the fallback item) is dropped
const taggedList = [{ n: 'a', tag: 'x' }, { n: 'b', tag: 'y' }];
assert.deepEqual(
  pickList([{ id: '1', data: { n: 'ok', tag: 'z', order: 1 } }, { id: '2', data: { n: 'missing-tag', order: 2 } }], taggedList),
  [{ n: 'ok', tag: 'z', order: 1 }],
);
// list item with a wrong-typed required field is dropped too
assert.deepEqual(
  pickList([{ id: '1', data: { n: 'ok', tag: 'z', order: 1 } }, { id: '2', data: { n: 3, tag: 'y', order: 2 } }], taggedList),
  [{ n: 'ok', tag: 'z', order: 1 }],
);
// if the fallback list is empty, keep today's behaviour: no shape validation
assert.deepEqual(
  pickList([{ id: '1', data: { anything: true } }], []),
  [{ anything: true }],
);

// unordered items sort after ordered items, keeping their relative position
// (item 0 is unordered but must land AFTER the ordered item, not stay first)
assert.deepEqual(
  pickList(
    [
      { id: '1', data: { n: 'first-unordered' } },
      { id: '2', data: { n: 'ordered', order: 1 } },
      { id: '3', data: { n: 'second-unordered' } },
    ],
    list,
  ),
  [{ n: 'ordered', order: 1 }, { n: 'first-unordered' }, { n: 'second-unordered' }],
);

console.log('contentPick.check: all assertions passed');
