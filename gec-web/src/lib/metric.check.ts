import assert from 'node:assert/strict';
import { parseMetric, formatMetric } from './metric.ts';

for (const s of ['35+', '12,000+', '45+', '28+']) {
  const m = parseMetric(s);
  assert.equal(formatMetric(m.value, m), s, `round-trip ${s}`);
}
assert.equal(parseMetric('12,000+').value, 12000);
assert.equal(formatMetric(6000, parseMetric('12,000+')), '6,000+');
assert.equal(formatMetric(0, parseMetric('35+')), '0+');
// non-numeric metrics pass through untouched
assert.equal(parseMetric('[XX]+').value, 0);
assert.equal(formatMetric(0, parseMetric('[XX]+')), '[XX]+');

console.log('metric.check: all assertions passed');
