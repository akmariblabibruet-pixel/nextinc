---
stage: S5
name: Studio + Recognition
status: done
owner: Claude (Sonnet 5.5)
depends: S1
---
## Done
- `studio.html`: page head with contents list · §1 Story (drop cap, larger opening line, facts table + margin note) · §2 Authors (shared renderer; optional `bio` shown when present) · §3 Two hubs (dot-matrix map as Fig. 1, captions (a)/(b), two hub cards with coordinates, screen-reader group label) · §4 Principles in a booktabs table with roman numerals · CTA (contact / careers / work).
- `recognition.html`: references grouped by year (descending) with year headers, continuous `[n]` numbering, filter by kind (with counts, hash memory e.g. `#award`), items with `url` link out, empty state, "jump to year" links, and an honest "Just getting started" callout (with a legend of what will be listed) shown automatically while every entry is `sample: true`.
- Mobile: founders stack full-width (no orphan third card).
- Verified in headless Chrome at 1440 and 390: no console errors, no horizontal overflow.

## Changed
- `studio.html`, `recognition.html`, `assets/css/pages/studio.css` (used by both pages), `assets/js/pages/studio.js` (both pages), `assets/data/team.js` (comment documenting optional `bio`), this ledger.

## Decisions
- Founder bios are **not** invented: add `bio: "…"` to a person in `team.js` and it appears under the portrait.
- The shared `render.js` was not touched; bios are appended by `studio.js` after mount.
- Story copy uses only facts from the old site (innovation lab, bridging research and application, web/mobile/SaaS/AI-LLM, two hubs, Mini Me flagship). Wording is mine — please read it.
- **Principles table is my wording**, derived from the Method on the home page (prototype + user testing; tested, documented code; one team; two hubs). Please confirm each is true of how you work, or edit the rows in `studio.html`.
- Recognition shows the year once (group header), so the per-row year column is hidden on this page only.

## Left to do
- Replace the four sample recognition entries with real ones (or leave the honest note until there are some).
- Add real founder bios / photos if wanted.
- Confirm story + principles copy.

## Requests
- Any real awards, press, grants, certifications or milestones (title, organisation, year, link).
- One or two true sentences about each founder (optional).
