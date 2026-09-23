import assert from 'node:assert/strict';
import { curtainProgress, liveKicker, exitDuration } from './motion.ts';

// fully open before the interstitial starts
assert.equal(curtainProgress(0, 100, 1000).shut, 0);
// fully shut in the hold band
assert.equal(curtainProgress(600, 100, 1000).shut, 1);
// fully open again after it ends
assert.equal(curtainProgress(1200, 100, 1000).shut, 0);
// the line is visible only while shut
assert.ok(curtainProgress(600, 100, 1000).hold > 0.9);
assert.equal(curtainProgress(100, 100, 1000).hold, 0);
// degenerate range never divides by zero
assert.deepEqual(curtainProgress(50, 0, 0), { shut: 0, hold: 0 });

// kicker never reports an empty collection as a number
assert.equal(liveKicker(7, 'teams'), '7 TEAMS');
assert.equal(liveKicker(0, 'teams'), 'NEXT');
assert.equal(liveKicker(Number.NaN, 'teams'), 'NEXT');

// exits are faster than entrances
assert.ok(exitDuration(480) < 480);

console.log('motion.check: all assertions passed');
