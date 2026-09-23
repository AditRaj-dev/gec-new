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
  [/background-clip\s*:\s*text/, 'gradient text is banned (only .hero-title-rich in styles/gec.css)'],
];

function cssRuleStack(source) {
  const stack = [];
  let token = '';
  let comment = false;
  let quote = '';
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];
    if (comment) {
      if (ch === '*' && next === '/') { comment = false; i++; }
      continue;
    }
    if (!quote && ch === '/' && next === '*') { comment = true; i++; continue; }
    if (quote) {
      if (ch === '\\') { i++; continue; }
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === '{') { stack.push(token.trim()); token = ''; }
    else if (ch === '}') { stack.pop(); token = ''; }
    else if (ch === ';') token = '';
    else token += ch;
  }
  return stack;
}

function allowed(rel, msg, source, offset) {
  if (rel !== 'styles/gec.css' || msg !== 'gradient text is banned (only .hero-title-rich in styles/gec.css)') return false;
  return cssRuleStack(source.slice(0, offset)).some((selector) =>
    selector.split(',').some((part) => part.trim() === '.hero-title-rich')
  );
}

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
  const source = readFileSync(f, 'utf8');
  let offset = 0;
  source.split('\n').forEach((line, i) => {
    for (const [re, msg] of RULES) {
      const match = line.match(re);
      if (match && !allowed(rel, msg, source, offset + match.index)) {
        bad++; console.error(`${rel}:${i + 1}  ${msg}\n    ${line.trim()}`);
      }
    }
    offset += line.length + 1;
  });
}
console.log(bad ? `design-lint: ${bad} problem(s)` : 'design-lint: clean');
process.exit(bad ? 1 : 0);
