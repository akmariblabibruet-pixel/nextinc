#!/usr/bin/env node
/* Pre-launch guard. Lists every placeholder left in the site.
 *   node scripts/check-samples.mjs          report (exit 0)
 *   node scripts/check-samples.mjs --strict exit 1 if anything is left (use before publishing). Owned by S1. */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let n = 0;
const hit = (where, what) => { n++; console.log(`  • ${where}: ${what}`); };
for (const f of readdirSync(join(root, 'assets/data')).filter((x) => x.endsWith('.js') && x !== 'world.js')) {
  readFileSync(join(root, 'assets/data', f), 'utf8').split('\n').forEach((l, i) => { if (/sample:\s*true/.test(l)) hit(`assets/data/${f}:${i + 1}`, l.trim().slice(0, 70)); });
}
for (const f of readdirSync(root).filter((x) => x.endsWith('.html'))) {
  const s = readFileSync(join(root, f), 'utf8'); const m = s.match(/<!-- STUB:(S\d)/);
  if (m) hit(f, `still a stub for stage ${m[1]}`);
}
console.log(n ? `\n${n} placeholder(s) left before launch.` : '\nNo placeholders left. Ready to publish.');
if (n && process.argv.includes('--strict')) process.exit(1);
