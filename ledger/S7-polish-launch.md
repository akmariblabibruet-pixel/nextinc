---
stage: S7
name: Polish & launch
status: in-progress
owner: Claude (session 2; session 1 lost its uncommitted work to a sandbox reset)
depends: S2–S6
---
## Done
- Domain set: `NEXT.site.url = https://www.wearenext.tech`. `scripts/sync-site.mjs` writes per-page canonical, Open Graph, Twitter cards, icons, manifest link, Organization JSON-LD (home), `sitemap.xml`, `robots.txt`, and the careers list from `assets/data/roles.js`.
- Brand: SVG favicon (+dark variant), apple-touch, 192/512/maskable icons, `favicon.ico`, `site.webmanifest`, 1200×630 OG card (24 KB). Regenerate with `npm run brand`.
- `404.html` in site voice; static `<base>` so it works at any depth (tested `/a/b/c`, `/nope`).
- `scripts/check-launch.mjs` launch gate wired into `npm run prelaunch` (passes).
- Roles moved to `assets/data/roles.js`; `forms.js` no longer holds a list (S6 request done). Favicon request (S6) done.
- Accessibility: axe-core clean on 13 pages × (1440, 390), with mobile menu open and with lightbox open. Menu makes page inert while open.
- Compat: `matchMedia().addListener` fallback; `color-mix()` fallbacks; image width/height; bold-italic font preload.
- Project page social meta (og:url, twitter, own cover) uses the public domain.
- Home weight ≈ 205 KB raw / ≈ 136 KB transferred.

## Changed
Pages (seo/roles markers, descriptions, footer h2, menu foot inside nav, preload): all `*.html` except `products.html`. New: `404.html`, `favicon.ico`, `site.webmanifest`, `robots.txt`, `sitemap.xml`, `assets/data/roles.js`, `assets/img/icons/*`, `assets/img/og/og-default.png`, `scripts/sync-site.mjs`, `scripts/check-launch.mjs`, `scripts/brand/*`. Edited: `assets/css/site.css`, `assets/css/pages/films.css`, `assets/js/core.js`, `render.js`, `pages/forms.js`, `pages/work.js`, `assets/data/team.js`, `scripts/serve.mjs`, `package.json`, `partials/*`.

## Decisions
- `<base href="/">` is static in 404.html (generated); assumes the site is served at the domain root.
- Sample projects stay in the data (marked `sample: true`); they are excluded from the sitemap.
- Public email left as `ariblabib360@gmail.com` pending owner confirmation.

## Left to do
See `S7-HANDOFF.md` (delivered next to this patch) for the full list.

## Requests
- Owner: real projects/films/recognition (17 samples), Web3Forms key restriction, live-site form tests, email confirmation.
- Owner wants these added as projects when ready: `github.com/Unavailable4u/spherex-blink`, `github.com/shaikh-dotcom/MiniLocker`.
