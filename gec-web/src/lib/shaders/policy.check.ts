import assert from 'node:assert/strict';
import { renderScale, frameGuard, hexToRgb, GUARD_FRAMES } from './policy.ts';

// half resolution on a 1x screen, full at 2x, never above 1
assert.equal(renderScale(1000, 1), 0.5);
assert.equal(renderScale(1000, 2), 1);
assert.equal(renderScale(1000, 3), 1);
// wide canvases are capped at 1280 internal pixels
assert.equal(renderScale(2560, 2), 0.5);
// phones: 0.35×DPR, never above 1, capped at 480 internal px
assert.equal(renderScale(390, 1, true), 0.35);
assert.ok(Math.abs(renderScale(390, 2, true) - 0.7) < 1e-9);
assert.equal(renderScale(390, 3, true), 1); // 1.05 by DPR, clamped to 1
assert.equal(renderScale(768, 3, true), 480 / 768); // wide phone/tablet at 3x hits the 480px cap
// line-based print families on phones: 0.75×DPR, max 2, within a 1.6M-pixel budget
assert.equal(renderScale(390, 2, true, true, 600), 1.5);
assert.equal(renderScale(384, 2.8125, true, true, 612), 2); // S25 hero: 0.75×2.81 = 2.1, capped at 2
const foot = renderScale(384, 2.8125, true, true, 1670); // S25 footer: the budget decides
assert.ok(foot > 1.5 && foot < 1.6 && 384 * 1670 * foot * foot <= 1_600_000 + 1);
assert.equal(renderScale(390, 2, true, true, 20000), 0.5); // absurdly tall section: floor at 0.5
// desktop ignores the crisp flag
assert.equal(renderScale(1000, 1, false, true), 0.5);
// desktop numbers are untouched by the phone flag's default
assert.equal(renderScale(1000, 1), renderScale(1000, 1, false));
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
