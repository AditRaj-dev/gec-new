import { EXPECT } from './smoke.expect.mjs';

const BASE = process.env.BASE ?? 'http://localhost:3210';
const norm = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;|&rsquo;|&lsquo;|[‘’]/g, "'")
    .replace(/&quot;|[“”]/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');

let failed = 0;
for (const [route, spec] of Object.entries(EXPECT)) {
  let routeFailed = false;
  const fail = (m) => { failed++; routeFailed = true; console.error(`✗ ${route}: ${m}`); };
  let res;
  try { res = await fetch(BASE + route); } catch (e) { fail(`fetch failed (${e.message}) — is next start -p 3210 running?`); continue; }
  if (res.status !== 200) { fail(`status ${res.status}`); continue; }
  const html = await res.text();
  const text = norm(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' '));
  for (const t of spec.text ?? []) if (!text.includes(norm(t))) fail(`missing text "${t}"`);
  if (spec.surfaces) {
    const got = [...html.matchAll(/data-surface="([a-z]+)"/g)].map((m) => m[1]);
    if (got.join(',') !== spec.surfaces.join(',')) fail(`surface order\n    want ${spec.surfaces.join(',')}\n    got  ${got.join(',')}`);
  }
  if (!routeFailed) console.log(`✓ ${route}`);
}
if (Object.keys(EXPECT).length === 0) console.log('smoke: no expectations yet');
process.exit(failed ? 1 : 0);
