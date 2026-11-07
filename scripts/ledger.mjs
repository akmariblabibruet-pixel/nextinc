#!/usr/bin/env node
/* Rebuilds LEDGER.md from ledger/S*.md (one file per stage — so parallel patches never conflict).
 *   node scripts/ledger.mjs
 * Each ledger/S*.md starts with front-matter:  status: pending | in-progress | done  and  owner: <who>. Owned by S1. */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'ledger');
const files = readdirSync(dir).filter((f) => /^S\d+.*\.md$/.test(f)).sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10) || a.localeCompare(b));
const meta = (src, k) => (src.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')) || [, ''])[1].trim();
const icon = { done: '✅', 'in-progress': '🟡', pending: '⬜' };
let table = '| Stage | Name | Status | Owner | Depends on |\n|---|---|---|---|---|\n', body = '';
for (const f of files) {
  const s = readFileSync(join(dir, f), 'utf8'), st = meta(s, 'status') || 'pending';
  table += `| ${meta(s, 'stage')} | ${meta(s, 'name')} | ${icon[st] || ''} ${st} | ${meta(s, 'owner') || '—'} | ${meta(s, 'depends') || '—'} |\n`;
  body += `\n---\n\n${s.replace(/^---[\s\S]*?---\n/, '')}`;
}
writeFileSync(join(root, 'LEDGER.md'), `# LEDGER — generated, do not edit\n\nRegenerate with \`node scripts/ledger.mjs\`. Edit the per-stage files in \`ledger/\` instead.\n\n${table}${body}`);
console.log(`LEDGER.md rebuilt from ${files.length} stage files`);
