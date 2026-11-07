#!/usr/bin/env node
/* Keeps the shared header/footer identical on every page.
 *   node scripts/sync-shell.mjs          rewrite pages
 *   node scripts/sync-shell.mjs --check  exit 1 if any page is out of date
 * A page opts in by containing the marker pairs
 *   <!-- shell:header -->…<!-- /shell:header -->   and   <!-- shell:footer -->…<!-- /shell:footer -->
 * Pages without markers (old pages not yet redesigned) are skipped.
 * Edit partials/header.html or partials/footer.html, then run this. Owned by S1. */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const parent = { 'project.html': 'work.html', 'apply.html': 'career.html' };   // sub-pages highlight their parent
const partial = (n) => readFileSync(join(root, 'partials', n), 'utf8').trim();
const header = partial('header.html'), footer = partial('footer.html');

function withCurrent(html, file) {
  const target = parent[file] || file;
  return html.replace(/<a ([^>]*?)href="([^"#]+\.html)"([^>]*)>/g, (m, a, href, b) =>
    href === target ? `<a ${a}href="${href}" aria-current="page"${b}>` : m);
}
let stale = 0;
for (const file of readdirSync(root).filter((f) => f.endsWith('.html'))) {
  const p = join(root, file); const src = readFileSync(p, 'utf8');
  if (!src.includes('<!-- shell:header -->')) { console.log(`skip   ${file} (no markers)`); continue; }
  const out = src
    .replace(/<!-- shell:header -->[\s\S]*?<!-- \/shell:header -->/, `<!-- shell:header -->\n${withCurrent(header, file)}\n<!-- /shell:header -->`)
    .replace(/<!-- shell:footer -->[\s\S]*?<!-- \/shell:footer -->/, `<!-- shell:footer -->\n${footer}\n<!-- /shell:footer -->`);
  if (out !== src) { stale++; if (!check) { writeFileSync(p, out); console.log(`synced ${file}`); } else console.log(`STALE  ${file}`); }
  else console.log(`ok     ${file}`);
}
if (check && stale) { console.error(`\n${stale} page(s) out of sync — run: node scripts/sync-shell.mjs`); process.exit(1); }
