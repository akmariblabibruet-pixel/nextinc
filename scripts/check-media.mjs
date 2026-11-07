#!/usr/bin/env node
/* Media budget gate. Owned by S8. Budgets live in docs/UPDATE_PLAN.md.
 *   node scripts/check-media.mjs            errors exit 1, warnings are only printed
 *   node scripts/check-media.mjs --strict   warnings fail too (used by `npm run prelaunch`)
 * Reads assets/data/*.js (projects, films) and checks every file they point to:
 *   errors   a referenced file is missing · a file is over its budget · a film has no local poster
 *            a film points to an unknown project · more than 4 featured projects · empty `preview`
 *   warnings a file in assets/previews, assets/img/projects or assets/img/films that nothing uses
 *            a self-hosted film over 5 MB */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, sep } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');
const KB = 1024, MB = 1024 * KB;
const BUDGET = { cover: 120 * KB, preview: 500 * KB, poster: 100 * KB, screenshot: 200 * KB, film: 10 * MB };
const FILM_WARN = 5 * MB, FEATURED_MAX = 4;

const errors = [], warnings = [], rows = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);

/* ---- load the data files the same way scripts/sync-site.mjs does ---- */
const sb = {}; sb.window = sb;
for (const f of readdirSync(join(root, 'assets/data')).filter((x) => x.endsWith('.js') && x !== 'world.js').sort()) {
  try { vm.runInNewContext(readFileSync(join(root, 'assets/data', f), 'utf8'), sb); }
  catch (e) { err(`assets/data/${f}: cannot be read (${e.message})`); }
}
const NEXT = sb.NEXT || {}, projects = NEXT.projects || [], films = NEXT.films || [];

/* ---- collect every file the data refers to ---- */
const local = (p) => typeof p === 'string' && p !== '' && !/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(p);
const clean = (p) => p.split(/[?#]/)[0].replace(/^\.\//, '').replace(/^\//, '');
const items = new Map();                               /* path -> { kind, who } (first use wins) */
const use = (kind, path, who) => { if (local(path)) { const k = clean(path); if (!items.has(k)) items.set(k, { kind, who }); } };

for (const p of projects) {
  const who = `project ${p.slug}`;
  use('cover', p.cover, who);
  use('logo', p.logo, who);
  (p.gallery || []).forEach((g) => use('screenshot', g && g.src, who));
  if ('preview' in p) {
    const v = p.preview || {};
    if (!v.mp4 && !v.webm) err(`${who}: \`preview\` needs an mp4 and/or webm path`);
    use('preview', v.mp4, who); use('preview', v.webm, who);
  }
}
for (const f of films) {
  const who = `film ${f.id}`;
  if (f.project && !projects.some((p) => p.slug === f.project)) err(`${who}: project "${f.project}" does not exist in projects.js`);
  if (!f.sample && f.provider !== 'none' && !f.poster) err(`${who}: no \`poster\` (host one in assets/img/films/ so no request leaves the site before Play)`);
  use('poster', f.poster, who);
  if (f.preview) { const pv = typeof f.preview === 'string' ? { mp4: f.preview } : f.preview; use('preview', pv.mp4, who); use('preview', pv.webm, who); }
  if (f.provider === 'mp4') { use('film', f.src, who); use('film', f.webm, who); }
}
const featured = projects.filter((p) => p.featured);
if (featured.length > FEATURED_MAX) err(`${featured.length} projects are \`featured\`; the home page shows ${FEATURED_MAX} (${featured.map((p) => p.slug).join(', ')})`);

/* ---- sizes and missing files ---- */
const fmt = (n) => (n >= MB ? (n / MB).toFixed(1) + ' MB' : (n / KB).toFixed(1) + ' KB');
for (const [path, { kind, who }] of items) {
  const abs = join(root, path);
  if (!existsSync(abs)) { err(`${who}: ${kind} file is missing: ${path}`); continue; }
  const size = statSync(abs).size, max = BUDGET[kind];
  rows.push({ kind, path, size, max });
  if (max && size > max) err(`${who}: ${path} is ${fmt(size)}, the ${kind} budget is ${fmt(max)}`);
  if (kind === 'film' && size > FILM_WARN && size <= max) warn(`${who}: ${path} is ${fmt(size)}; consider YouTube for films over ${fmt(FILM_WARN)}`);
}

/* ---- orphans: files in the media folders that no data entry or page uses ---- */
const text = [];
const walk = (dir, keep) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    if (d.name.startsWith('.') || d.name === 'node_modules') return [];
    const p = join(dir, d.name);
    return d.isDirectory() ? walk(p, keep) : keep(d.name) ? [p] : [];
  });
};
for (const d of [root, join(root, 'partials')]) readdirSync(d).filter((x) => x.endsWith('.html')).forEach((x) => text.push(readFileSync(join(d, x), 'utf8')));
for (const f of walk(join(root, 'assets/css'), (n) => n.endsWith('.css')).concat(walk(join(root, 'assets/js'), (n) => n.endsWith('.js')))) text.push(readFileSync(f, 'utf8'));
const mentioned = new Set((text.join('\n').match(/assets\/[A-Za-z0-9_./-]+/g) || []).map(clean));
for (const k of items.keys()) mentioned.add(k);
for (const dir of ['assets/previews', 'assets/img/projects', 'assets/img/films', 'assets/films']) {
  for (const f of walk(join(root, dir), () => true)) {
    const rel = f.slice(root.length + 1).split(sep).join('/');
    if (!mentioned.has(rel)) warn(`${rel} is not used by any data entry or page`);
  }
}

/* ---- report ---- */
console.log('Media check');
for (const r of rows.sort((a, b) => a.kind.localeCompare(b.kind) || a.path.localeCompare(b.path))) {
  const note = r.max ? `${fmt(r.size)} / ${fmt(r.max)}` : fmt(r.size);
  console.log(`  ok     ${r.kind.padEnd(10)} ${r.path}   ${note}`);
}
if (!rows.length) console.log('  (no media files referenced)');
warnings.forEach((w) => console.log(`  warn   ${w}`));
errors.forEach((e) => console.log(`  ERROR  ${e}`));
console.log(errors.length ? `\n${errors.length} error(s) and ${warnings.length} warning(s). Fix the errors before committing.`
  : warnings.length ? `\nBudgets met, ${warnings.length} warning(s)${strict ? ' (--strict: failing)' : ''}.` : '\nAll media inside budget.');
if (errors.length || (strict && warnings.length)) process.exit(1);
