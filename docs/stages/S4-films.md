# S4 — Films (screening room) + player
**Depends on:** S1 · **Ledger:** `ledger/S4-films.md`

## Goal
Make the motion videos the star: a cinematic page where a visitor watches the showreel and project films with zero friction, while staying light (no autoplaying heavy video, no third-party scripts until the visitor clicks).

## You own
`films.html`, `assets/css/pages/films.css`, `assets/js/pages/films.js`, `assets/data/films.js`, `assets/img/films/`, `ledger/S4-films.md`.

## Blueprint
- Dark page body (`.room`), `.page-head` in room colours: "The screening *room.*".
- **Featured film** huge (16:9, `NEXT.render.film`), then a *programme* (`NEXT.render.reel`) with year/duration, and a grid of the rest grouped by `kind` (Showreel · Launch films · Walkthroughs · Studio).
- Filter by kind; deep link `films.html#mini-me-launch` opens the lightbox for that film on load.
- Lightbox upgrades (in your page JS, do **not** edit core.js): next/previous film buttons, ← → keys, lock page scroll, show the linked project (`project` slug → link to its case study), copy-link button.
- Optional muted looping preview: if a film has `preview: "path.mp4"` (≤ 3 MB), show it on hover on desktop only (`preload="none"`).
- Document in the films.js header how to add a film for YouTube, Vimeo and self-hosted MP4 (poster, size/bitrate advice: H.264, 1080p, ~4 Mbps; also provide a WebM option).

## Acceptance
Keyboard-operable player; focus returns to the trigger on close; no network request to YouTube/Vimeo before a click; `sample` films show "coming soon" gracefully; works at 360 px.

## Before you start
Read `docs/REDESIGN_PLAN.md`, `docs/DESIGN_SYSTEM.md`, `docs/WORKFLOW.md`; open `/styleguide.html` (run `npm run serve`). Use only components and tokens from the style guide. The site is **showcase-first**: the visitor must quickly see projects, films and how we work. Never invent facts, numbers or awards — use data from `assets/data/*.js` or leave a clearly marked `sample: true` placeholder.

## Deliver
Fill `ledger/<your file>`, run `npm run check`, commit, `git format-patch main --stdout > patches/<stage>.patch` (see WORKFLOW.md).
