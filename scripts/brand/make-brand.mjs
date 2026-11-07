#!/usr/bin/env node
/* Regenerates the brand files: SVG favicon (+ dark variant), PNG icons, favicon.ico, web manifest, 1200x630 OG card.
 * Not part of the site itself. Needs two dev-only packages the site does not use:
 *     npm i --no-save playwright sharp        (and a Chromium: `npx playwright install chromium`)
 * If they live elsewhere, point BRAND_TOOLS at that folder (the one that contains node_modules).
 *     node scripts/brand/make-brand.mjs          (CHROMIUM_PATH=/path/to/chrome to use a specific browser binary)
 * The crimson italic x is the glyph outline of "x" from assets/fonts/cmu-serif-700-italic.woff2, stored in glyph-x.json. Owned by S7. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const req = createRequire(join(process.env.BRAND_TOOLS || root, 'package.json'));
const sharp = req('sharp'), { chromium } = req('playwright');

const g = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'glyph-x.json'), 'utf8'));
const sb = {}; sb.window = sb; (await import('node:vm')).runInNewContext(readFileSync(join(root, 'assets/data/site.js'), 'utf8'), sb);
const site = sb.NEXT.site;
const C = { paper: '#F5F0E6', ink: '#16120E', crimson: '#C0102C', crimsonHi: '#FF4660' };

/* x glyph centred in a box of `size`, filling `fill` of it (font units are y-up, so flip) */
function glyph(size, fill, colour) {
  const [x0, y0, x1, y1] = g.bounds, w = x1 - x0, h = y1 - y0, s = (size * fill) / Math.max(w, h);
  const tx = (size - w * s) / 2 - x0 * s, ty = (size + h * s) / 2 + y0 * s;
  return `<path fill="${colour}" transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(5)} ${(-s).toFixed(5)})" d="${g.d}"/>`;
}
const iconSvg = (size, fill, bg, fg, radius = 0.22) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * radius}" fill="${bg}"/>${glyph(size, fill, fg)}</svg>`;

const out = (p) => { mkdirSync(dirname(join(root, p)), { recursive: true }); return join(root, p); };

/* 1. SVG favicon: crimson x on paper; dark scheme gets ink with the lighter crimson */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><style>.bg{fill:${C.paper}}.x{fill:${C.crimson}}@media (prefers-color-scheme:dark){.bg{fill:${C.ink}}.x{fill:${C.crimsonHi}}}</style><rect class="bg" width="64" height="64" rx="14"/>${glyph(64, 0.62, C.crimson).replace('fill="' + C.crimson + '"', 'class="x"')}</svg>\n`;
writeFileSync(out('assets/img/icons/icon.svg'), svg);

/* 2. PNG icons */
const png = async (file, size, fill, radius) => sharp(Buffer.from(iconSvg(size, fill, C.paper, C.crimson, radius))).png({ compressionLevel: 9, palette: true }).toFile(out(file));
await png('assets/img/icons/icon-192.png', 192, 0.62, 0.22);
await png('assets/img/icons/icon-512.png', 512, 0.62, 0.22);
await png('assets/img/icons/apple-touch-icon.png', 180, 0.62, 0);          // iOS rounds the corners itself
await png('assets/img/icons/icon-maskable-512.png', 512, 0.46, 0);         // full bleed; glyph kept inside the 80% safe zone

/* 3. favicon.ico (one 48x48 PNG image inside an ICO container) */
const p48 = await sharp(Buffer.from(iconSvg(48, 0.66, C.paper, C.crimson, 0.2))).png({ compressionLevel: 9 }).toBuffer();
const head = Buffer.alloc(22); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
head[6] = 48; head[7] = 48; head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12); head.writeUInt32LE(p48.length, 14); head.writeUInt32LE(22, 18);
writeFileSync(out('favicon.ico'), Buffer.concat([head, p48]));

/* 4. manifest */
writeFileSync(out('site.webmanifest'), JSON.stringify({
  name: site.name, short_name: 'Next Inc.', description: site.tagline, start_url: './', scope: './', display: 'browser',
  background_color: C.paper, theme_color: C.paper,
  icons: [
    { src: 'assets/img/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'assets/img/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'assets/img/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
}, null, 2) + '\n');

/* 5. OG card: typeset in the site's own fonts, rendered in Chromium. No date on it, so it never goes stale. */
const font = (f) => 'data:font/woff2;base64,' + readFileSync(join(root, 'assets/fonts', f)).toString('base64');   // inlined: a page set via setContent cannot load file:// fonts
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:C;font-weight:700;font-style:normal;src:url(${font('cmu-serif-700-roman.woff2')})}
@font-face{font-family:C;font-weight:700;font-style:italic;src:url(${font('cmu-serif-700-italic.woff2')})}
@font-face{font-family:C;font-weight:500;font-style:normal;src:url(${font('cmu-serif-500-roman.woff2')})}
@font-face{font-family:C;font-weight:500;font-style:italic;src:url(${font('cmu-serif-500-italic.woff2')})}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:${C.paper};color:${C.ink};font-family:C,Georgia,serif;position:relative;overflow:hidden}
.frame{position:absolute;inset:36px;border:2px solid ${C.ink}}
.k{position:absolute;left:92px;top:84px;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:#6B6254;font-weight:700}
.w{position:absolute;left:88px;top:148px;font-size:188px;line-height:1;font-weight:700;letter-spacing:-.03em}.w i{color:${C.crimson}}.w small{font-size:62px;font-weight:500;letter-spacing:0;margin-left:.2em}
.t{position:absolute;left:92px;top:366px;width:900px;font-size:54px;line-height:1.18;font-weight:500;font-style:italic;text-wrap:balance}
.d{position:absolute;left:92px;bottom:72px;font-size:28px;color:#6B6254;font-weight:500}
.rule{position:absolute;left:92px;top:338px;width:120px;height:4px;background:${C.crimson}}
</style><body><div class="frame"></div><div class="k">Innovation lab · Full-stack technology partner</div>
<div class="w">Ne<i>x</i>t<small>Inc.</small></div><div class="rule"></div>
<div class="t">${site.tagline}</div><div class="d">${new URL(site.url).hostname}</div></body>`;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}); const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
const shot = await page.screenshot({ type: 'png' }); await browser.close();
await sharp(shot).png({ compressionLevel: 9, palette: true, colours: 64 }).toFile(out('assets/img/og/og-default.png'));
console.log('brand files written');
