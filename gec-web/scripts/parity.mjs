// Content parity gate for CMS Phase 0: the site must read identically after content moves to the API.
// Usage: BASE=http://localhost:3211 node scripts/parity.mjs [--update]
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE || 'http://localhost:3211';
const ROUTES = ['/', '/about', '/teams', '/initiatives', '/stories'];
const dir = fileURLToPath(new URL('./parity/', import.meta.url));
const update = process.argv.includes('--update');
mkdirSync(dir, { recursive: true });

// Visible text + link targets + image srcs + section surfaces, one item per line.
function digest(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const out = [];
  for (const m of body.matchAll(/data-surface="([^"]+)"|href="([^"#?]+)|src="(\/[^"?]+)|>([^<>]+)</g)) {
    const [, surface, href, src, text] = m;
    if (surface) out.push(`[surface] ${surface}`);
    else if (href) out.push(`[href] ${href}`);
    else if (src) out.push(`[src] ${src}`);
    else {
      const t = text.replace(/\s+/g, ' ').trim();
      if (t) out.push(t);
    }
  }
  return out.join('\n') + '\n';
}

let failed = 0;
for (const route of ROUTES) {
  const res = await fetch(BASE + route);
  if (!res.ok) { console.error(`✗ ${route}: HTTP ${res.status}`); failed++; continue; }
  const now = digest(await res.text());
  const file = dir + (route === '/' ? 'home' : route.slice(1)) + '.txt';
  if (update || !existsSync(file)) { writeFileSync(file, now); console.log(`• ${route}: baseline written`); continue; }
  const was = readFileSync(file, 'utf8');
  if (was === now) { console.log(`✓ ${route}`); continue; }
  failed++;
  const a = was.split('\n'), b = now.split('\n');
  const i = a.findIndex((line, k) => line !== b[k]);
  console.error(`✗ ${route}: first difference at line ${i + 1}\n  was: ${a[i]}\n  now: ${b[i]}`);
}
process.exit(failed ? 1 : 0);
