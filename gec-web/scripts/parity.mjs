// Content parity gate for CMS Phase 0: the site must read identically after content moves to the API.
// Usage: BASE=http://localhost:3211 node scripts/parity.mjs [--update]
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE || 'http://localhost:3211';
const ROUTES = ['/', '/about', '/teams', '/initiatives', '/stories'];
const dir = fileURLToPath(new URL('./parity/', import.meta.url));
const update = process.argv.includes('--update');
mkdirSync(dir, { recursive: true });

// Build-only assets change on every unrelated rebuild (content-hashed chunk names, HMR endpoints)
// and would make the gate flap without any real content change — exclude them.
function isBuildAsset(path) {
  return path.startsWith('/_next/static/') || path.startsWith('/_next/webpack-hmr') || path.startsWith('/__nextjs');
}

// next/image serves everything (including plain /public files that need resizing) through
// `/_next/image?url=<encoded>&w=…&q=…`. The encoded `url` is the real, stable image identity;
// the `/_next/image` prefix plus width/quality params are resizer plumbing that must not be
// compared. Decode it and use it (or the plain path, sans query, for un-proxied srcs like the
// partner logos) as the recorded value.
function resolveSrc(raw) {
  if (raw.startsWith('/_next/image')) {
    const q = raw.indexOf('?');
    const params = new URLSearchParams(q === -1 ? '' : raw.slice(q + 1));
    const url = params.get('url');
    if (!url) return null;
    const decoded = decodeURIComponent(url).split(/[?#]/)[0];
    return isBuildAsset(decoded) ? null : decoded;
  }
  const path = raw.split(/[?#]/)[0];
  return isBuildAsset(path) ? null : path;
}

// Visible text + link targets + image srcs + section surfaces, one item per line.
// srcSet/srcset is intentionally NOT parsed: every image in this codebase that carries a srcSet
// also carries the `src` we already record (next/image always emits both), so parsing it too
// would only duplicate — at different widths — the same image identity already captured via src.
function digest(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const out = [];
  for (const m of body.matchAll(/data-surface="([^"]+)"|href="([^"#?]+)|src="(\/[^"]+)|>([^<>]+)</g)) {
    const [, surface, href, src, text] = m;
    if (surface) out.push(`[surface] ${surface}`);
    else if (href) { if (!isBuildAsset(href)) out.push(`[href] ${href}`); }
    else if (src) { const resolved = resolveSrc(src); if (resolved) out.push(`[src] ${resolved}`); }
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
  // A fresh Windows checkout (core.autocrlf=true) rewrites the committed LF baselines to CRLF on
  // disk; normalise before comparing so that alone never fails the gate.
  const was = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  if (was === now) { console.log(`✓ ${route}`); continue; }
  failed++;
  const a = was.split('\n'), b = now.split('\n');
  // now-only-appends means `a` can be a prefix of `b` (or vice versa); scan to the longer length
  // so that case is reported as a real difference instead of findIndex's -1 ("line 0 / undefined").
  let i = -1;
  for (let k = 0; k < Math.max(a.length, b.length); k++) { if (a[k] !== b[k]) { i = k; break; } }
  console.error(`✗ ${route}: first difference at line ${i + 1}\n  was: ${a[i]}\n  now: ${b[i]}`);
}
process.exit(failed ? 1 : 0);
