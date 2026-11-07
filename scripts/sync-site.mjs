#!/usr/bin/env node
/* Derived site files: everything that depends on the public address or on a data file.
 *   node scripts/sync-site.mjs          rewrite the files
 *   node scripts/sync-site.mjs --check  exit 1 if any file is out of date
 * Source of truth: NEXT.site.url (assets/data/site.js) · NEXT.projects · NEXT.team · NEXT.roles.
 * SITE_URL=https://example.org node scripts/sync-site.mjs   overrides the address for one run (testing).
 *
 * Writes
 *   <!-- seo -->…<!-- /seo -->        in each page's <head>: canonical, icons, manifest, Open Graph, Twitter card
 *                                     (+ Organization JSON-LD on index.html). Pages get it by containing the marker pair.
 *   <!-- seo:base -->…<!-- /seo:base --> 404.html only: makes its relative links work from any missing address.
 *   <!-- roles -->…<!-- /roles -->    career.html: the open-roles list, from assets/data/roles.js
 *   sitemap.xml, robots.txt
 * Titles and descriptions are read from each page's own <title> / <meta name="description"> — edit them there.
 * Owned by S7. */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');

/* ---- data: evaluate the browser data files in a sandbox ---- */
function load(file) {
  const sb = {}; sb.window = sb; vm.runInNewContext(readFileSync(join(root, 'assets/data', file), 'utf8'), sb);
  return sb.NEXT;
}
const N = { ...load('site.js'), ...load('projects.js'), ...load('team.js'), ...load('roles.js') };
const site = N.site;
const url = (process.env.SITE_URL || site.url || '').replace(/\/+$/, '');
const basePath = (() => { try { return new URL(url).pathname.replace(/\/?$/, '/'); } catch { return '/'; } })();
const abs = (p) => url + '/' + p.replace(/^\//, '');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = (s) => s;                       // already-escaped HTML read from a page is reused as is
const OG = { path: 'assets/img/og/og-default.png', w: 1200, h: 630 };
const alt = `${site.name} — ${site.tagline}`;

/* pages: kind 'full' = canonical + social cards, 'icons' = icons only (noindex pages). Anything else is skipped. */
const kind = { '404.html': 'icons', 'styleguide.html': 'icons' };
const noSitemap = new Set(['404.html', 'styleguide.html', 'products.html', 'project.html']);   // project.html is a template: each real project is listed as project.html?p=<slug>
const order = ['index.html', 'work.html', 'films.html', 'studio.html', 'recognition.html', 'career.html', 'apply.html', 'contact.html'];

const icons = [
  '<link rel="icon" href="favicon.ico" sizes="48x48">',
  '<link rel="icon" href="assets/img/icons/icon.svg" type="image/svg+xml" sizes="any">',
  '<link rel="apple-touch-icon" href="assets/img/icons/apple-touch-icon.png">',
  '<link rel="manifest" href="site.webmanifest">'
];

function jsonLd() {
  const o = {
    '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: url + '/', slogan: site.tagline, description: site.blurb,
    logo: abs('assets/img/icons/icon-512.png'), email: site.email,
    location: (site.hubs || []).map((h) => ({ '@type': 'Place', name: h.name, address: h.name })),
    founder: (N.team || []).map((t) => ({ '@type': 'Person', name: t.name, jobTitle: t.role }))
  };
  return '<script type="application/ld+json">\n' + JSON.stringify(o, null, 2).replace(/</g, '\\u003c') + '\n</script>';
}

function seoBlock(file, src) {
  const lines = [];
  if (kind[file] !== 'icons') {
    const title = (src.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '', desc = (src.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    const canon = file === 'index.html' ? url + '/' : abs(file);
    lines.push(`<link rel="canonical" href="${canon}">`);
    lines.push(...icons);
    lines.push('<meta property="og:type" content="website">', `<meta property="og:site_name" content="${esc(site.name)}">`, '<meta property="og:locale" content="en_US">',
      `<meta property="og:title" content="${attr(title)}">`, `<meta property="og:description" content="${attr(desc)}">`, `<meta property="og:url" content="${canon}">`,
      `<meta property="og:image" content="${abs(OG.path)}">`, `<meta property="og:image:width" content="${OG.w}">`, `<meta property="og:image:height" content="${OG.h}">`, `<meta property="og:image:alt" content="${esc(alt)}">`,
      '<meta name="twitter:card" content="summary_large_image">', `<meta name="twitter:title" content="${attr(title)}">`, `<meta name="twitter:description" content="${attr(desc)}">`,
      `<meta name="twitter:image" content="${abs(OG.path)}">`, `<meta name="twitter:image:alt" content="${esc(alt)}">`);
    if (file === 'index.html') lines.push(jsonLd());
  } else lines.push(...icons);
  return lines.join('\n');
}

/* 404.html is served for any missing address (/a/b/c), where "assets/…" would not resolve. A base element fixes that,
   but only when the page is not being opened at its own address (so local previews keep working). */
const baseBlock = () => `<script>(function(){if(/404\\.html$/.test(location.pathname))return;var b=document.createElement('base');b.href=${JSON.stringify(basePath)};document.head.appendChild(b);})();</script>`;

function rolesBlock() {
  return (N.roles || []).map((r) => `      <li class="role" id="${esc(r.slug)}" data-reveal>
        <a class="role__row" href="apply.html?role=${esc(r.slug)}">
          <span class="role__title">${esc(r.title)}</span>
          <span class="role__go">Apply</span>
        </a>
        <div class="role__body">
          <p class="role__text">${esc(r.text)}</p>
          <ul class="tags">
${(r.tags || []).map((t) => `            <li>${esc(t)}</li>`).join('\n')}
          </ul>
        </div>
      </li>`).join('\n');
}

const swap = (src, name, body) => {
  const re = new RegExp(`<!-- ${name} -->[\\s\\S]*?<!-- /${name} -->`);
  return re.test(src) ? src.replace(re, () => `<!-- ${name} -->\n${body}\n<!-- /${name} -->`) : src;
};

let stale = 0;
const touch = (name, next, prev) => {
  if (next === prev) { console.log(`ok     ${name}`); return; }
  stale++;
  if (check) console.log(`STALE  ${name}`); else { writeFileSync(join(root, name), next); console.log(`synced ${name}`); }
};

const pages = readdirSync(root).filter((f) => f.endsWith('.html')).sort();
for (const file of pages) {
  const prev = readFileSync(join(root, file), 'utf8');
  if (!prev.includes('<!-- seo -->')) { console.log(`skip   ${file} (no seo marker)`); continue; }
  let next = swap(prev, 'seo', seoBlock(file, prev));
  if (file === '404.html') next = swap(next, 'seo:base', baseBlock());
  if (file === 'career.html') next = swap(next, 'roles', rolesBlock());
  touch(file, next, prev);
}

/* ---- sitemap.xml ---- */
const urls = pages.filter((f) => !noSitemap.has(f) && readFileSync(join(root, f), 'utf8').includes('<!-- seo -->')).sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99) || a.localeCompare(b)).map((f) => (f === 'index.html' ? url + '/' : abs(f)));
const projects = (N.projects || []).filter((p) => !p.sample).map((p) => abs(`project.html?p=${encodeURIComponent(p.slug)}`));
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  [...urls, ...projects].map((u) => `  <url><loc>${esc(u)}</loc></url>`).join('\n') + '\n</urlset>\n';
const read = (f) => { try { return readFileSync(join(root, f), 'utf8'); } catch { return ''; } };
touch('sitemap.xml', sitemap, read('sitemap.xml'));

/* ---- robots.txt: crawl everything on the site; keep crawlers out of the project's working files if they get deployed ---- */
const robots = `User-agent: *\nAllow: /\n${['docs', 'ledger', 'scripts', 'patches'].map((d) => `Disallow: ${basePath}${d}/`).join('\n')}\n\nSitemap: ${abs('sitemap.xml')}\n`;
touch('robots.txt', robots, read('robots.txt'));

if (check && stale) { console.error(`\n${stale} file(s) out of date — run: node scripts/sync-site.mjs`); process.exit(1); }
