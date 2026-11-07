# S7 — Polish & launch
**Depends on:** S2–S6 (run last) · **Ledger:** `ledger/S7-polish-launch.md`

## Owns
Any file for small fixes; plus `404.html`, `sitemap.xml`, `robots.txt`, favicon set, `assets/img/og/`, `ledger/S7-polish-launch.md`. Apply every *Request* listed in other ledgers (promote page CSS to `site.css`, etc.).

## Checklist
- **SEO/social:** unique `<title>`/description per page, canonical, Open Graph + Twitter cards with a 1200×630 OG image (typeset wordmark + tagline), JSON-LD `Organization`, sitemap, robots.
- **Favicon:** SVG favicon (crimson italic *x*), `apple-touch-icon`, `manifest`.
- **404.html** in the site voice with a link to Work.
- **Performance:** Lighthouse mobile ≥ 90; images WebP with `width/height`; lazy-load below the fold; fonts preloaded; no unused CSS/JS; total home weight < 600 KB.
- **Accessibility:** axe or Lighthouse a11y ≥ 95, keyboard walk-through, contrast, reduced-motion, focus order in menu/lightbox.
- **Cross-browser:** Chrome, Safari (iOS), Firefox, Edge. Check `color-mix`, `dialog`, `text-wrap` fallbacks.
- **Content gate:** `npm run prelaunch` must pass (no samples, no stubs, shell in sync). Verify none of the old unverified claims remain anywhere (grep `8.9`, `99.99`, `hundreds`, `Award`, `FundedNext`, `Trading`).
- **Web3Forms:** confirm domain restriction on the key.

## Before you start
Read `docs/REDESIGN_PLAN.md`, `docs/DESIGN_SYSTEM.md`, `docs/WORKFLOW.md`; open `/styleguide.html` (run `npm run serve`). Use only components and tokens from the style guide. The site is **showcase-first**: the visitor must quickly see projects, films and how we work. Never invent facts, numbers or awards — use data from `assets/data/*.js` or leave a clearly marked `sample: true` placeholder.

## Deliver
Fill `ledger/<your file>`, run `npm run check`, commit, `git format-patch main --stdout > patches/<stage>.patch` (see WORKFLOW.md).
