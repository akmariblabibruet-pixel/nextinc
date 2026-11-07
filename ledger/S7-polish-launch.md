---
stage: S7
name: Polish & launch
status: done
owner: Claude (sessions 2 and 3; session 1 lost its uncommitted work to a sandbox reset)
depends: S2–S6
---
## Done
- Domain set: `NEXT.site.url = https://www.wearenext.tech`. `scripts/sync-site.mjs` writes per-page canonical, Open Graph, Twitter cards, icons, manifest link, Organization JSON-LD (home), `sitemap.xml`, `robots.txt`, and the careers list from `assets/data/roles.js`.
- Brand: SVG favicon (+dark variant), apple-touch, 192/512/maskable icons, `favicon.ico`, `site.webmanifest`, 1200×630 OG card (24 KB). Regenerate with `npm run brand`.
- `404.html` in site voice; static `<base>` so it works at any depth (tested `/a/b/c`, `/nope`).
- `scripts/check-launch.mjs` launch gate wired into `npm run prelaunch` (passes).
- Roles moved to `assets/data/roles.js`; `forms.js` no longer holds a list (S6 request done). Favicon request (S6) done.
- Accessibility: axe-core clean (wcag2a/2aa/21aa/best-practice) on every page at 1440 and 390, no console errors or warnings, re-run in session 3 after all changes. Mobile menu makes the page inert while open; lightbox keeps focus inside and returns it to the trigger on Esc; reduced motion shows everything at once with no running animations.
- Lighthouse (mobile, dev server without compression or caching): performance 97–100, accessibility 100, best practices 100, SEO 100 on home, work, films, studio, recognition, careers, apply, contact and two case studies. CLS 0 everywhere.
- Layout shift fixed (it was 0.27–0.72 on films and project pages): the italic body font is now preloaded on every page, and the script-rendered parts of `films.html` and `project.html` stay unpainted until the script has rendered them (`html.films-ready` / `html.case-ready`, with a CSS fallback that reveals them after 5 s if the script never runs).
- Form pages (`career`, `contact`, `apply`) load only the scripts they use (`site.js`, `core.js`, `forms.js`, plus `roles.js` on apply): about 35 KB less. Forms re-tested: validation, role pre-fill, unknown-role note, email links.
- Footer checked visually at desktop and mobile after the `h3`→`h2` change.
- Compat: `matchMedia().addListener` fallback; `color-mix()` fallbacks; image width/height; static CSS support check against Safari 15+, Firefox ESR and current Chrome/Edge found only non-critical gaps in Safari 15.0–15.3 (older `:focus-visible`, `dvh`, `:has`), all with fallbacks or harmless.
- Project page social meta (og:url, twitter, own cover) uses the public domain.
- Two real projects added from their READMEs only: `spherex-blink` and `minilocker` (both public, authored by the same person as this repo). They appear on `work.html` and in `sitemap.xml`. The case-study caption and plate no longer print a stray comma or empty year when a project has none.
- `products.html` kept: a noindex redirect to `work.html` that preserves old links (canonical made absolute). Not in the sitemap on purpose.
- Home weight ≈ 205 KB raw / ≈ 136 KB transferred.

## Changed
Pages (seo/roles markers, descriptions, footer h2, menu foot inside nav, preloads): all `*.html`. New: `404.html`, `favicon.ico`, `site.webmanifest`, `robots.txt`, `sitemap.xml`, `assets/data/roles.js`, `assets/img/icons/*`, `assets/img/og/og-default.png`, `scripts/sync-site.mjs`, `scripts/check-launch.mjs`, `scripts/brand/*`. Edited: `assets/css/site.css`, `assets/css/pages/{films,work}.css`, `assets/js/core.js`, `render.js`, `pages/{forms,work,films}.js`, `assets/data/{site,team,projects}.js`, `scripts/serve.mjs`, `package.json`, `partials/*`.

## Decisions
- `<base href="/">` is static in 404.html (generated); assumes the site is served at the domain root.
- All sample content is gone: the sample projects, films and recognition entries were deleted, and the "12+ projects shipped" stat became "2 Public prototypes". `npm run prelaunch` now fails only if a file the data points to is missing.
- Public email left as `ariblabib360@gmail.com` pending owner confirmation.
- The two new projects are marked `prototype` (spherex-blink's README calls itself one; MiniLocker has no public live URL). They have no `role` and MiniLocker has no `year`, because the READMEs do not say; no screenshots yet, so both use the generated cover art.
- Firefox and Safari could not be run (only Chromium is installable in the sandbox); compatibility was checked from the code and a support table only.

## Left to do
Nothing a model can do. Only the owner items below remain before launch.

## Requests
- Film: none for now (the MiniLocker mp4 is over 100 MB, so it is skipped). `films.js` is empty on purpose and the home page and `films.html` show an honest note. To add one later, upload to YouTube and add an entry (guide in `assets/js/pages/films.js`).
- Projects: `spherex-blink` and `minilocker` have covers and figures taken from their own repos, no `role` (credited to the team), `year` 2026 for MiniLocker, and `featured: true`. Recognition is empty on purpose until there is something true to list.
- Owner, accounts: restrict the Web3Forms access key to `www.wearenext.tech`; send one real message from `contact.html` and one from `apply.html` on the live domain; confirm `ariblabib360@gmail.com` is the public address.
- Owner, deploy: publish only the site files (`*.html`, `assets/`, `favicon.ico`, `site.webmanifest`, `robots.txt`, `sitemap.xml`, `404.html`) at the domain root, not `docs/`, `ledger/`, `scripts/`, `patches/` or the stray `S7-polish-launch.patch` at the repo root.
- Owner, optional: test in real Firefox and Safari/iOS before announcing.
