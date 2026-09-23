import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../src/', import.meta.url));
// Ported verbatim from gec-showcase / earlier builds; not ours to restyle.
const SKIP = ['components/deskfolio/', 'components/ui/', 'components/teams/', 'components/BrandEntranceCurtain.tsx', 'lib/logoData.ts'];
const RULES = [
  [/\bInter\b(?=['",\s])/, 'Inter is banned'],
  [/Clash Display|Satoshi|Fragment Mono/, 'superseded font family'],
  [/#000000\b|#000\b(?![0-9a-f])/i, 'pure black is banned; use var(--gec-ink)'],
  [/border-left\s*:\s*(?:[2-9]|\d{2,})px/, 'side-stripe borders are banned'],
  [/background-clip\s*:\s*text/, 'gradient text is banned (only .hero-title-rich in globals.css)'],
];
const ALLOW = [['app/globals.css', 'gradient text is banned (only .hero-title-rich in globals.css)']];

const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(css|tsx?|mjs)$/.test(n) && !/\.check\./.test(n)) files.push(p);
  }
})(ROOT);

let bad = 0;
for (const f of files) {
  const rel = relative(ROOT, f).replaceAll('\\', '/');
  if (SKIP.some((s) => rel.startsWith(s))) continue;
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    for (const [re, msg] of RULES) {
      if (re.test(line) && !ALLOW.some(([af, am]) => af === rel && am === msg)) {
        bad++; console.error(`${rel}:${i + 1}  ${msg}\n    ${line.trim()}`);
      }
    }
  });
}
console.log(bad ? `design-lint: ${bad} problem(s)` : 'design-lint: clean');
process.exit(bad ? 1 : 0);
