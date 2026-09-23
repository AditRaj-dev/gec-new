import assert from 'node:assert/strict';
import { holeScale, holeRadius, holeOpacity, isLive, shelfOffset, EXPAND_END } from './act.ts';

// the hole starts inset and ends at full size
assert.equal(holeScale(0), 0.82);
assert.equal(holeScale(EXPAND_END), 1);
assert.equal(holeScale(1), 1);
assert.equal(holeRadius(0), 20);
assert.equal(holeRadius(EXPAND_END), 0);
// fully opaque while expanding, gone once live
assert.equal(holeOpacity(0.1), 1);
assert.equal(holeOpacity(EXPAND_END), 0);
// interaction only once fully expanded
assert.equal(isLive(EXPAND_END - 0.001), false);
assert.equal(isLive(EXPAND_END), true);
// shelf travel: still before, linear through, clamped after
assert.equal(shelfOffset(0.2, 1000), 0);
assert.equal(shelfOffset(0.61, 1000), 500);
assert.equal(shelfOffset(1, 1000), 1000);
// nothing to travel when the covers fit
assert.equal(shelfOffset(0.6, 0), 0);
assert.equal(shelfOffset(0.6, -50), 0);

console.log('act.check: all assertions passed');
