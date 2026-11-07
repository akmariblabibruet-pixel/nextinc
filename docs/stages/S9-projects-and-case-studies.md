# S9 — The four projects and their case-study pages
**Depends on:** S8 · **Ledger:** `ledger/S9-projects-and-case-studies.md` · **Plan:** `docs/UPDATE_PLAN.md` · **Facts:** `docs/projects/BRIEFS.md`

## Goal
Four projects with real content, and one case-study layout that shows **only what each project has**.

## You own
`assets/data/projects.js` (entries), `assets/data/films.js` (films that belong to projects), `project.html`, the case-study part of `assets/js/pages/work.js`, `assets/css/pages/work.css`, `assets/img/projects/**`, `assets/img/films/**`, the loop files in `assets/previews/`, `ledger/S9-projects-and-case-studies.md`.

## 1. Project entries
- Write or refresh the four entries from `docs/projects/BRIEFS.md`. Array order is the home order: `mini-me`, `spherex-blink`, `minilocker`, `next-inc-immersive`. `featured: true` on all four.
- `mini-me`: keep the slug and logo. Add `cover` once supplied. `brief` / `approach` / `outcome` / `sections` only from the feature guide, and only Available features as working. No `links` until the owner confirms one.
- `next-inc-immersive` is new: `category: "web"`, `status: "prototype"`, `links.repo`, and `links.live` only if it is deployed. Its abstract says plainly that it is a showcase build of our website for 3D and high-graphics animation, not our production site. Pick a `palette` and `motif` the other three do not use (for example `crimson` and `waves`); they only show until the real cover arrives.
- Add `preview`, `cover` and `gallery` entries **only when the file exists** (S8's check fails otherwise).

## 2. Films
For each video the owner supplies, add an entry to `films.js` with `project`, `provider: "youtube"`, `src`, `duration`, `kind` (`launch` or `walkthrough`) and a locally hosted `poster`. Do not touch the company reel here (that is S10).

## 3. Case-study template (`project.html?p=<slug>`)
Same layout for every project. Each block renders only if its data exists, in this order:

| Block | Shown when | Data |
|---|---|---|
| Breadcrumb, title, status chip, summary | always | `title`, `status`, `summary` |
| Hero | the project has a film → poster + play button opening the lightbox; else `cover`; else generated art | films with `project === slug`, `video`, `cover` |
| Abstract (lede, drop cap) | always (required field) | `abstract` |
| Brief · Approach · Outcome | each one only if set | `brief`, `approach`, `outcome` |
| Films | **two or more** films (the first is already the hero): a list with title and duration, each opens the lightbox | films |
| Screenshots | `gallery` is not empty: "Fig. n." captions, lightbox, lazy | `gallery` |
| Extra sections | one block per entry, plain editorial style (`.h3`, paragraphs, list) | `sections` |
| Spec table | at least one row; a row only if its value exists | `role`, `year`, `category`, `status`, `tags` |
| Links | at least one link; one button per key: `live` → Visit, `repo` → View on GitHub, `docs` → Documentation, `more[]` → its own label | `links` |
| Next plate, contact CTA | always | — |

- The "In development" note appears only for `status: "coming-soon"`, next to the status chip. It never replaces real blocks.
- Unknown slug keeps the friendly "Plate not found" page. Title, description and canonical keep being set by the script.
- Two small additions to existing behaviour, no redesign: the "Films" list and the `sections` blocks. Both use components that already exist in `site.css`.
- Images keep `width`/`height` and `loading="lazy"`; the hero poster is the only eager image.

## 4. After the data changes
`npm run sync` (adds the fourth project to `sitemap.xml`), then `npm run check`.

## Acceptance
- Open `project.html?p=<slug>` for all four. Each page has no empty heading, empty list or dead button.
- **Fixture test:** temporarily remove `gallery`, `brief`, `links` and the films from one entry and reload. The page stays coherent and shorter, with nothing left behind. Restore it.
- 0 films → hero is the cover. 1 film → hero is the film and there is no "Films" block. 2+ films → the "Films" block appears.
- 360 px and 1440 px both fine; no horizontal scroll; keyboard reaches every button; Esc closes the lightbox and returns focus.
- CLS 0. No request to YouTube before Play. Every `<img>` has dimensions.
- `npm run check` passes.

## Deliver
Fill the ledger (including which assets are still missing per project), run `npm run check`, commit.
