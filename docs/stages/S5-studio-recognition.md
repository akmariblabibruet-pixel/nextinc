# S5 — Studio + Recognition
**Depends on:** S1 · **Ledger:** `ledger/S5-studio-recognition.md`

## You own
`studio.html`, `recognition.html`, `assets/css/pages/studio.css`, `assets/js/pages/studio.js`, `assets/data/team.js`, `assets/data/recognition.js`, `ledger/S5-studio-recognition.md`.

## studio.html
1. Page head: "A small lab with a *long* view." 2. **Story** — 3 short paragraphs from the existing company copy (keep facts only: innovation lab, bridges research and application, web/app, SaaS, AI/LLM; two hubs), with a drop cap and one marginal note. 3. **Authors** (`data-mount="authors"`) — add optional `bio` to team.js and show it under each portrait when present. 4. **Hubs** — `data-mount="map"` as *Fig. 1* with two short captions (Pennsylvania — USA Operations Hub; Vodra, Rajshahi — Engineering & R&D Hub). 5. **Values** — three or four principles in a booktabs table (*Principle · What it means in practice*); only statements that are true of how the team works. 6. CTA → contact / careers.

## recognition.html
Group by year (descending) with a year header; each item as a reference `[n]` (reuse `NEXT.render.refs`); filter by `kind`; items with `url` link out. When there are no real items yet, show a short honest note ("We are just getting started — here is what we are working toward") rather than fake awards. Keep `sample:true` on placeholders.

## Acceptance
No invented awards/bios; map responsive; screen-reader label on the map; 360 px OK.

## Before you start
Read `docs/REDESIGN_PLAN.md`, `docs/DESIGN_SYSTEM.md`, `docs/WORKFLOW.md`; open `/styleguide.html` (run `npm run serve`). Use only components and tokens from the style guide. The site is **showcase-first**: the visitor must quickly see projects, films and how we work. Never invent facts, numbers or awards — use data from `assets/data/*.js` or leave a clearly marked `sample: true` placeholder.

## Deliver
Fill `ledger/<your file>`, run `npm run check`, commit, `git format-patch main --stdout > patches/<stage>.patch` (see WORKFLOW.md).
