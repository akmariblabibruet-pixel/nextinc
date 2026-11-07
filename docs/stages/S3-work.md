# S3 — Work index + case-study template
**Depends on:** S1 · **Ledger:** `ledger/S3-work.md`

## Goal
The portfolio engine: a filterable index of all projects and a rich case-study page for each. This is the most important stage for winning clients.

## You own
`work.html`, `project.html`, `products.html`, `assets/css/pages/work.css`, `assets/js/pages/work.js`, `assets/data/projects.js`, `assets/img/projects/`, `ledger/S3-work.md`.

## work.html
- `.page-head` ("Selected *work*, plate by plate."), filter bar by category (All · Web · Mobile · AI & LLM · SaaS · Research) — typographic tabs with a counter, not pills; keyboard accessible; URL hash (`#ai`) remembers the filter.
- First project large (featured), the rest in a 2/3-column editorial grid using `NEXT.render.plate`.
- Empty-filter state written in the site voice. Sample plates keep the SAMPLE tag.

## project.html (reads `?p=<slug>`)
Order: breadcrumb → title (`.h1`) + status chip → cover **or** hero film (if `video` set, big play button opening the lightbox) → abstract as lede (drop cap) → **Brief · Approach · Outcome** (add optional fields `brief`, `approach`, `outcome` to projects.js and document them in the header comment; fall back to `abstract`) → booktabs spec table (`.tab`: Role, Year, Category, Status, Stack/tags) → **gallery** (`gallery: [{src,alt,caption}]`, captions as *Fig. n.*, click opens a simple lightbox) → links (`links.live`, `links.repo`) → *Next plate* → CTA to `contact.html`.
- Unknown slug → friendly "Plate not found" with link back. Set `document.title`, meta description and canonical via JS.
- Mini Me is *coming soon*: show a tasteful "In development" state, no dead links.
- `products.html` becomes a one-line meta-refresh + link redirect to `work.html`.

## Acceptance
Filters work with keyboard and touch; every plate links to a working case study; 360 px layout good; no layout shift when covers load; add 2 realistic example fields to the Mini Me entry only if the text is already on the old site (do not invent claims).

## Before you start
Read `docs/REDESIGN_PLAN.md`, `docs/DESIGN_SYSTEM.md`, `docs/WORKFLOW.md`; open `/styleguide.html` (run `npm run serve`). Use only components and tokens from the style guide. The site is **showcase-first**: the visitor must quickly see projects, films and how we work. Never invent facts, numbers or awards — use data from `assets/data/*.js` or leave a clearly marked `sample: true` placeholder.

## Deliver
Fill `ledger/<your file>`, run `npm run check`, commit, `git format-patch main --stdout > patches/<stage>.patch` (see WORKFLOW.md).
