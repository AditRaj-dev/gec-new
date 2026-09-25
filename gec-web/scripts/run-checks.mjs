import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../src/', import.meta.url));
const checks = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.check\.(ts|mjs)$/.test(n)) checks.push(p);
  }
})(src);
checks.push(fileURLToPath(new URL('./design-lint.mjs', import.meta.url)));

let failed = 0;
for (const c of checks) {
  const r = spawnSync(process.execPath, [c], { stdio: 'inherit' });
  if (r.status !== 0) { failed++; console.error(`FAILED: ${c}`); }
}
process.exit(failed ? 1 : 0);
