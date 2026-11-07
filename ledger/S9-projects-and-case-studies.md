---
stage: S9
name: Four projects and case-study pages
status: done
owner: site team
depends: S8
---
## Done
- Four projects in home order, all `featured`: `mini-me`, `spherex-blink`, `minilocker`, `next-inc-immersive` (new).
- **Mini Me** text rewritten as a plain overview: new one-line `summary` (79 characters) and a short `abstract`. The old wording ("revolutionary", "fast execution, detailed results") is gone. No `brief`, no `sections`, no feature list, no `links`. Checked against the feature guide: nothing in the copy comes from its Planned items (billing, tenancy, monitoring, future tiers). Status stays `coming-soon`.
- **Next Inc. Immersive**: `web` / `prototype`, `crimson` / `waves`, repo and live links, cover. The abstract says plainly that it is a showcase build and not our production site. Stack facts come from the repo's `package.json` (React, Vite, Three.js through react-three-fiber, tsparticles, Tailwind).
- **Film** `mini-me-chat-film` (YouTube `4fNrtf8CX_o`, 1:03, `walkthrough`, project `mini-me`) with a local poster. It is not `featured`; the home hero is S10's.
- **Case-study template** (`project.html?p=<slug>`, in `work.js` and `work.css`), each block only when its data exists:
  - Hero: the project's film poster with a play button; otherwise `cover`; otherwise generated art. The project logo is added only on the cover/art fallback, because a poster carries its own branding.
  - New **Films** list for two or more films (rows open the lightbox; it reuses `R.reel`, recoloured for the light page in `work.css`).
  - New **extra sections** (`sections`): title, one or more paragraphs, optional list. A block without a title, or with neither text nor list, is skipped; all copy is escaped.
  - **Links** use the brief's labels: `live` Visit, `repo` View on GitHub, `docs` Documentation, `more[]` its own label. Only `http(s)` addresses render. The "Watch the film" button is gone (hero and Films list already do that).
  - "In development" note moved up beside the status chip; it shows for `coming-soon` only and never replaces a block.
  - Spec table renders only when it has a row.
  - Hero caption no longer repeats the project name when the film title already starts with it (MiniLocker used to read "MiniLocker — MiniLocker — Blast Radius Zero").
- `npm run sync` added `next-inc-immersive` to `sitemap.xml`. `npm run check` and `npm run prelaunch` pass; every file is inside its budget (new cover 107.6 of 120 KB, new poster 56.8 of 100 KB).
- **Tested** by running the real `project.html` and scripts in a headless DOM (the test scripts are not part of the repo): all four pages, and 14 fixtures: strip gallery, brief, links and films from an entry; strip everything optional; no spec facts; 0, 1 and 2+ films; `video` pointing at a missing film; film without a poster; mixed good and bad `sections`; unsafe or label-less links; empty `links`; dev note with real blocks; unknown slug. No empty heading, list, paragraph, table or section, no dead link or unnamed button, no script error, no iframe before Play, one eager image per page.

## Changed
New: `assets/img/films/mini-me-chat-film.webp`, `assets/img/projects/next-inc-immersive/cover.webp`.
Edited: `assets/data/projects.js`, `assets/data/films.js`, `assets/js/pages/work.js`, `assets/css/pages/work.css`, `sitemap.xml` (by `npm run sync`), this ledger.
`project.html` needed no change.

## Decisions
- **Poster.** `mini-me-chat-film.webp` is the owner's promo image resized to 1600×900. It shows a "Try MiniMe" button and `minime.app`, which sits against the "no links, no domain until one exists" decision and the "no dead buttons" rule. Swap the file (same name) for a plain frame from the film or a crop of the devices if that matters.
- **Immersive cover.** Cropped from the owner's screenshot of the hero, starting below the badge row ("Trusted by hundreds", "Multiple award winning firm"). Those badges belong to that build, and Recognition is deliberately empty, so they are not shown here. The nav bar is cropped out too.
- **Mini Me `role`** ("Flagship product — concept, design, engineering") was already there and is unchanged. Remove it if the owner does not want a role shown.
- The Films list shows every film of the project, the hero film included, so it reads as a programme (01, 02, …).
- The spec table stays beside the abstract (today's layout). The block table in the S9 brief lists it after the extra sections; moving it would be a redesign, so it was left.
- Dimensions: covers and figures sit in fixed-ratio frames and fill them, so `width`/`height` on them are ratio hints, not file sizes. The hero poster is 1600×900.

## Left to do
Assets still missing, per project (each is a data edit; recipes are in `docs/stages/S8-media-and-budget.md`):
- **mini-me:** a real cover (the plate still shows the logo on generated art); the 3–5 s hover loop to be cut from the film, then add `preview: { mp4: "assets/previews/mini-me.mp4" }`; 3–6 screenshots with captions.
- **spherex-blink:** a screen-captured demo (20–60 s), optional loop, more screenshots.
- **minilocker:** the hover loop (cut from the film), screenshots.
- **next-inc-immersive:** later a screen-recorded flythrough; a real README in the repo, which is now linked. No loop yet.
- Not done here (no browser available): visual check at 360 px and 1440 px, keyboard pass, Lighthouse, and the lightbox in a real browser.

## Requests
- S1/S7: `R.plate()` and `R.film()` in `render.js` output `<img>` without `width`/`height` (the "Next plate" card on every case study). Frames fix the ratio, so nothing shifts, but the acceptance wording says every image.
- Docs: update "Needs from the owner" in `docs/projects/BRIEFS.md` (Mini Me: film received; Immersive: thumbnail received).
- S10: the Mini Me slide gets one film; the Mini Me plate keeps a centred logo above the cover (open question from S8).
