---
stage: S1
name: Foundation (design system, shell, data, tooling)
status: done
owner: Claude (Sonnet 5.5)
depends: —
---
## Done
- **Design system "The Monograph"** (`assets/css/site.css`): tokens, CMU Serif / Typewriter (self-hosted, subset 110 KB), 12-col grid, buttons, header + mobile menu, footer, plates with crop marks, captions, TOC, algorithm block, booktabs table/rows, references, authors, stats, marquee, screening room + lightbox, forms, print styles, reduced-motion handling.
- **Generative art** (`assets/js/art.js`): 6 motifs × 6 palettes for project/film covers, hero "oscilloscope" figure, dot-matrix hubs map (land mask from Natural Earth, `assets/data/world.js`).
- **Behaviour** (`assets/js/core.js`): header hide/show, mobile menu, reveal-on-scroll, headline word-rise, count-up, parallax, cursor label, algorithm stepper, film lightbox (YouTube-nocookie / Vimeo / MP4 / "coming soon").
- **Renderers** (`assets/js/render.js`): `data-mount` for plates, films, reel, refs, authors, stats, disciplines, algo, runhead, map.
- **Data layer** (`assets/data/*.js`) seeded with real facts from the old site (hubs, four pillars, founders, Mini Me) and clearly-marked `sample:true` placeholders.
- **Shared shell**: `partials/header.html`, `partials/footer.html`, `scripts/sync-shell.mjs`.
- **Stub pages** so navigation works from day one: `work.html`, `project.html`, `films.html`, `studio.html`, `recognition.html` (each marked `<!-- STUB:Sx -->`), plus `styleguide.html`.
- **Tooling**: `npm run serve | sync | ledger | check | prelaunch`; docs; stage briefs S2–S7.
- Images extracted from the old base64-embedded `index.html` → `assets/img/` (PNG/WebP/JPG).

## Changed
New files only; **no existing page was modified** (old `index/products/career/apply/contact.html` still work until their stages land).

## Decisions
- Static site, no build step, classic scripts (works from `file://`).
- Header/footer are generated into each page by `sync-shell` (no JS needed, SEO-safe).
- Placeholders are loud (`SAMPLE` tag) and blocked by `npm run prelaunch`.
- Hub affiliation: all three founders share one affiliation line (we did not know who sits in which hub).
- Contact email taken from the old careers page.

## Left to do
- Real content (see plan §8). Favicon/OG image (S7). `products.html` redirect (S3).

## Requests
(none)
