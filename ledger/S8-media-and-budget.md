---
stage: S8
name: Media rules, data model, budget gate
status: done
owner: site team
depends: S7
---
## Done
- `scripts/check-media.mjs` (new): reads `assets/data/*.js` and checks every file the data points to. Errors (exit 1): missing file, file over budget (cover 120 KB, preview 500 KB, film poster 100 KB, screenshot 200 KB, self-hosted film 10 MB), film without a local poster, film pointing to an unknown project, empty `preview`, more than four featured projects. Warnings: unused files in the media folders, self-hosted film over 5 MB. `--strict` makes warnings fail.
- Wired in: runs at the end of `npm run check`; `npm run prelaunch` runs it with `--strict`; `npm run check:media` runs it alone.
- Data model documented in the header of `assets/data/projects.js`: `preview { mp4, webm }`, `links { live, repo, docs, more }`, `sections`, film-to-project rule, budgets. Documentation only; no behaviour yet.
- `assets/css/site.css`: `.plate__frame>video.plate__preview` fade (3 lines). It sits under the plate labels (z-index 1, labels are 2 to 3) and ignores the pointer.
- `scripts/ledger.mjs` sorts stages numerically (S8, S9, S10).
- `assets/previews/` created (empty, `.gitkeep`).
- Decisions from the owner recorded in `docs/UPDATE_PLAN.md` and `docs/projects/BRIEFS.md`.
- Tested: today's repo passes with no warnings (largest file is the 172 KB SPHEREx screenshot of 200 KB). Failure cases checked on a copy: missing preview file, 2 MB preview, unused file (warns; fails only with `--strict`), unknown film project, five featured projects, film without poster.

## Changed
New: `scripts/check-media.mjs`, `assets/previews/.gitkeep`. Edited: `assets/css/site.css`, `assets/data/projects.js` (header comment only), `scripts/ledger.mjs`, `package.json`, `docs/UPDATE_PLAN.md`, `docs/projects/BRIEFS.md`, `docs/stages/S8-media-and-budget.md`, `docs/stages/S9-projects-and-case-studies.md`.

## Decisions
- The gate treats `logo` files as existence-only (no size budget); the Mini Me logo is 10 KB.
- Orphan check looks at the media folders only, and counts a file as used if any data entry, root or partial HTML, CSS or JS file mentions its path.
- Encoding recipes (ffmpeg for loops, posters, screenshots) are in section 6 of `docs/stages/S8-media-and-budget.md`.

## Left to do
Nothing for this stage.

## Requests
- S10: the Mini Me plate has a centred logo (z-index 2) above the cover. Decide whether it should fade out while a hover loop plays, or stay.
