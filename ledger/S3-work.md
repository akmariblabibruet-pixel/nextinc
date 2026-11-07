---
stage: S3
name: Work index + case study
status: done
owner: Claude (Sonnet 5.5)
depends: S1
---
## Done
- `work.html`: filterable index (All / Web / Mobile / AI & LLM / SaaS / Research, counts, `aria-pressed`, `#ai`-style hash memory, live count, empty state with reset), a large featured lead plate with abstract/role/tags, then a staggered two-column plate list, CTA.
- `project.html?p=<slug>`: data-driven case study — breadcrumb, title + status chip, film-or-cover hero (Fig. 1), drop-cap abstract + Table 1 facts, Brief / Approach / Outcome (†‡§), figure gallery with captions and prev/next/Esc lightbox, links, "In development" note for coming-soon projects, SAMPLE strip for placeholders, Next plate + CTA, "Plate not found" state. Title, description, canonical, og tags set from JS.
- `products.html` is now an instant redirect to `work.html` (old links keep working).
- Verified (headless Chrome, 1440 and 390): no console errors, no horizontal overflow, slugs mini-me / meridian / lumen / unknown.

## Changed
- `work.html`, `project.html`, `products.html`, `assets/css/pages/work.css`, `assets/js/pages/work.js`, `assets/data/projects.js` (header docs for `brief`, `approach`, `outcome`, `gallery`; Meridian got sample text + 2 generated figures), this ledger.

## Decisions
- Case-study sections only render when the field exists, so a project with just `abstract` still looks complete.
- Films link to projects via `film.project` (or `project.video` = film id); the hero becomes a play plate automatically.
- Gallery items are `{src,alt,caption}` (real screenshots) or `{art:{motif,palette},caption}` (generated).
- Case studies are client-rendered, so per-project SEO is limited; S7 may add a prerender step.

## Left to do
- Replace the five sample projects with real ones (and give Mini Me a real brief/approach/outcome when ready).
- Add real screenshots under `assets/img/projects/<slug>/` and reference them in `gallery`.
- Pretty URLs / prerender and OG images are S7.

## Requests
- Real project list: title, one-line summary, role, year, link, 2-4 screenshots, and a short brief/approach/outcome each.
