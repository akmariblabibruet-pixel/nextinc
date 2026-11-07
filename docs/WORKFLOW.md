# Working in parallel: patches + ledger

## Roles
* **Integrator (you):** applies patches in order, regenerates `LEDGER.md`, tells the next AI what to do.
* **Stage worker (any AI):** does exactly one stage, touches only its owned files, delivers one patch + one ledger file.

## Start a stage
```bash
git checkout main && git pull
# apply S1 first (and any finished stages the new stage reads)
git checkout -b stage/S3-work
npm run serve          # http://localhost:5173
```
Prompt to give the AI (copy/paste, change the stage):
> You are working on the Next Inc. website redesign. Read `docs/REDESIGN_PLAN.md`, `docs/DESIGN_SYSTEM.md`, `docs/WORKFLOW.md` and your brief `docs/stages/S3-work.md`. Open `/styleguide.html` in a browser to see the components. Do **only** this stage. Edit only the files the brief says you own. When finished: fill in `ledger/S3-work.md` (status, done, changed, left, requests), run `npm run check`, commit, and produce the patch with `git format-patch main --stdout > patches/S3-work.patch`.

## Deliver (worker)
```bash
npm run check                         # shell in sync; lists leftover samples/stubs
git add -A && git commit -m "S3: work index + case study"
mkdir -p patches && git format-patch main --stdout > patches/S3-work.patch
```
Binary files (images, fonts) are included automatically by `format-patch`.

## Apply (integrator)
```bash
git checkout main
git am --3way patches/S1-foundation.patch     # once, first
git am --3way patches/S3-work.patch           # any order for S2–S6
npm run ledger && cat LEDGER.md               # what is done / changed / left
```
If `git am` stops: `git am --abort`, then `git apply --3way patches/<file>` and fix the listed conflict.
Conflicts should be rare because stages own disjoint files; the only shared file is the stage's own ledger.

## Ledger rules
Each stage owns `ledger/Sx-name.md`. Keep this structure (the generator reads the front-matter):
```
---
stage: S3
name: Work + case study
status: pending | in-progress | done
owner: <model or person>
depends: S1
---
## Done            what works now
## Changed         files created/edited (paths)
## Decisions       anything a later stage must know
## Left to do      honest list
## Requests        changes needed in shared files (S1/S7 will apply)
```
Never edit `LEDGER.md` (generated) or another stage's ledger.

## Shared-file rule
If you need a new CSS rule that many pages would use, put it in your page CSS first and list it under *Requests*; S1/S7 will promote it into `site.css`.
