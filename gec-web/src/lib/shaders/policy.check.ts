import assert from 'node:assert/strict';
import { renderScale, frameGuard, hexToRgb, GUARD_FRAMES } from './policy.ts';

// half resolution on a 1x screen, full at 2x, never above 1
assert.equal(renderScale(1000, 1), 0.5);
assert.equal(renderScale(1000, 2), 1);
assert.equal(renderScale(1000, 3), 1);
// wide canvases are capped at 1280 internal pixels
assert.equal(renderScale(2560, 2), 0.5);
// degenerate width never divides by zero
assert.ok(Number.isFinite(renderScale(0, 1)));

// guard waits for a full sample window
assert.equal(frameGuard(Array(GUARD_FRAMES - 1).fill(40)), 'pending');
// fast device keeps running, slow device freezes
assert.equal(frameGuard(Array(GUARD_FRAMES).fill(16)), 'ok');
assert.equal(frameGuard(Array(GUARD_FRAMES).fill(40)), 'freeze');
// a few hitches don't freeze a fast device
assert.equal(frameGuard([...Array(GUARD_FRAMES - 3).fill(16), 120, 120, 120]), 'ok');

assert.deepEqual(hexToRgb('#A3040F'), [163 / 255, 4 / 255, 15 / 255]);
assert.deepEqual(hexToRgb('FCF8ED'), [252 / 255, 248 / 255, 237 / 255]);

console.log('shaders/policy.check: all assertions passed');
