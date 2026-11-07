#!/usr/bin/env node
/* Launch gate (part of `npm run prelaunch`). Fails (exit 1) on anything that would embarrass us on day one:
 *   - the public address is still the placeholder
 *   - a public page lacks a unique title/description, canonical link or social card; the OG image is missing or not 1200x630
 *   - favicon / manifest / robots / sitemap / 404 files are missing or broken
 *   - a local link, script, stylesheet, image or data-file path points at a file that does not exist
 *   - one of the old unverified claims or template leftovers is still on the site (8.9 ms, 99.99x %, "hundreds", "award winning",
 *     FundedNext, "trading", Tailwind CDN, Google Fonts, Material Symbols)
 * Warnings (title/description length, images without alt) are printed but do not fail. Owned by S7. */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, extname } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fails = [], warns = [];
const fail = (m) => fails.push(m), warn = (m) => warns.push(m);
const read = (f) => readFileSync(join(root, f), 'utf8');
const walk = (dir, out = []) => { for (const f of readdirSync(join(root, dir))) { const p = join(dir, f); statSync(join(root, p)).isDirectory() ? walk(p, out) : out.push(p); } return out; };

/* ---- 1. public address ---- */
const sb = {}; sb.window = sb; vm.runInNewContext(read('assets/data/site.js'), sb);
const site = sb.NEXT.site; let host = '';
try { host = new URL(site.url).hostname; } catch { /* handled below */ }
if (!site.url || !/^https:\/\//.test(site.url)) fail('assets/data/site.js: site.url must be the live https address (then run `npm run sync`).');
else if (/^(www\.)?example\.(com|org|net)$/.test(host) || /localhost|127\.0\.0\.1/.test(host)) fail(`assets/data/site.js: site.url is still the placeholder (${site.url}). Set the real address, then run \`npm run sync\`.`);

/* ---- 2. public pages ---- */
const pages = readdirSync(root).filter((f) => f.endsWith('.html')).sort();
const seen = { title: new Map(), desc: new Map() };
for (const f of pages) {
  const s = read(f); if (!s.includes('<!-- seo -->') || /<meta name="robots" content="noindex"/.test(s) || ['styleguide.html', '404.html'].includes(f)) continue;
  const title = (s.match(/<title>([\s\S]*?)<\/title>/) || [])[1], desc = (s.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) fail(`${f}: no <title>`); else { if (title.length > 70) warn(`${f}: title is ${title.length} chars (search results cut at about 60)`); (seen.title.get(title) || seen.title.set(title, []).get(title)).push(f); }
  if (!desc) fail(`${f}: no meta description`); else { if (desc.length < 70 || desc.length > 160) warn(`${f}: description is ${desc.length} chars (aim for 70–160)`); (seen.desc.get(desc) || seen.desc.set(desc, []).get(desc)).push(f); }
  for (const [needle, what] of [['rel="canonical"', 'canonical link'], ['property="og:image"', 'og:image'], ['property="og:title"', 'og:title'], ['name="twitter:card"', 'twitter:card']])
    if (!s.includes(needle)) fail(`${f}: missing ${what} (run \`npm run sync\`)`);
}
for (const [k, m] of Object.entries(seen)) for (const [v, files] of m) if (files.length > 1) fail(`${files.join(', ')}: identical ${k} — each page needs its own`);

/* ---- 3. brand + crawler files ---- */
const must = ['favicon.ico', 'assets/img/icons/icon.svg', 'assets/img/icons/apple-touch-icon.png', 'assets/img/icons/icon-192.png', 'assets/img/icons/icon-512.png', 'assets/img/icons/icon-maskable-512.png', 'assets/img/og/og-default.png', 'site.webmanifest', 'robots.txt', 'sitemap.xml', '404.html'];
for (const f of must) if (!existsSync(join(root, f))) fail(`missing file: ${f}`);
if (existsSync(join(root, 'assets/img/og/og-default.png'))) {
  const b = readFileSync(join(root, 'assets/img/og/og-default.png')); const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
  if (w !== 1200 || h !== 630) fail(`assets/img/og/og-default.png is ${w}x${h}, must be 1200x630`);
  if (b.length > 300 * 1024) warn(`og-default.png is ${(b.length / 1024) | 0} KB (keep it under 300 KB; some networks drop larger cards)`);
}
try { const m = JSON.parse(read('site.webmanifest')); for (const i of m.icons || []) if (!existsSync(join(root, i.src))) fail(`site.webmanifest: icon not found: ${i.src}`); } catch (e) { fail(`site.webmanifest is not valid JSON (${e.message})`); }
if (existsSync(join(root, 'robots.txt')) && !/^Sitemap: https:\/\//m.test(read('robots.txt'))) fail('robots.txt has no absolute Sitemap line');

/* ---- 4. local references exist ---- */
const refOk = (from, ref) => {
  if (!ref || /^(https?:|mailto:|tel:|data:|#|javascript:)/.test(ref)) return true;
  const clean = ref.split('#')[0].split('?')[0]; if (!clean) return true;
  return existsSync(join(root, dirname(from), clean));
};
for (const f of pages) {
  const s = read(f);
  for (const m of s.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) { if (m[1].includes('{')) continue; if (!refOk(f, m[1].split(/\s+/)[0])) fail(`${f}: broken reference "${m[1]}"`); }
  for (const m of s.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) warn(`${f}: <img> without alt`);
}
for (const f of walk('assets/data').filter((x) => x.endsWith('.js'))) {
  for (const m of read(f).matchAll(/["'](assets\/[^"']+\.(?:png|jpe?g|webp|svg|gif|mp4|webm|woff2?))["']/g)) if (!existsSync(join(root, m[1]))) fail(`${f}: file not found "${m[1]}"`);
}
for (const f of walk('assets/css').filter((x) => x.endsWith('.css'))) {
  for (const m of read(f).matchAll(/url\(["']?([^"')]+)["']?\)/g)) if (!/^(data:|https?:|#|%23)/.test(m[1]) && !existsSync(join(root, dirname(f), m[1].split(/[?#]/)[0]))) fail(`${f}: url() not found "${m[1]}"`);
}

/* ---- 5. old claims and template leftovers (site files only — docs and ledgers talk about them on purpose) ---- */
const banned = [[/\b8\.9\s*ms\b/i, '"8.9 ms" latency claim'], [/99\.99\d*\s*%?/, '"99.99x%" uptime/SLA claim'], [/trusted by hundreds|hundreds of (?:clients|companies|customers|teams)/i, '"hundreds" claim'],
  [/award[- ]winning/i, '"award winning" claim'], [/fundednext/i, 'FundedNext (old template)'], [/\btrading\b/i, '"trading" (old template wording)'], [/institutional/i, '"institutional" (old template wording)'],
  [/cdn\.tailwindcss\.com/i, 'Tailwind CDN'], [/fonts\.googleapis\.com|fonts\.gstatic\.com/i, 'Google Fonts'], [/material[- ]symbols/i, 'Material Symbols']];
const siteFiles = [...pages, ...walk('assets').filter((f) => /\.(js|css|html|json)$/.test(f)), 'site.webmanifest', 'robots.txt', 'sitemap.xml'];
for (const f of siteFiles) { const s = read(f); for (const [re, what] of banned) if (re.test(s)) fail(`${f}: ${what}`); }

/* ---- report ---- */
if (warns.length) console.log('Warnings:\n' + warns.map((w) => `  ! ${w}`).join('\n') + '\n');
if (fails.length) { console.error('Launch gate FAILED:\n' + fails.map((m) => `  ✗ ${m}`).join('\n')); process.exit(1); }
console.log(`Launch gate passed (${pages.length} pages checked).`);
console.log([
  '\nStill to do by hand (cannot be checked from here):',
  '  1. Web3Forms dashboard → restrict the access key to the production domain.',
  '  2. Send one real test message from contact.html and one from apply.html on the live domain.',
  '  3. Confirm the public email on the site is the one you want.',
  '  4. Deploy only the site files (index/pages, assets/, favicon.ico, site.webmanifest, robots.txt, sitemap.xml, 404.html) — not docs/, ledger/, scripts/, patches/.'
].join('\n'));
