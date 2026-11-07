# S8 — Media rules, data model, budget gate
**Depends on:** S7 · **Ledger:** `ledger/S8-media-and-budget.md` · **Plan:** `docs/UPDATE_PLAN.md`

## Goal
Make adding a thumbnail, hover loop, film or screenshot a **data edit that cannot break the weight budget**. No visible change to any page in this stage.

## You own
`assets/data/projects.js` (header comment only), `assets/css/site.css` (one small rule group), `scripts/check-media.mjs` (new), `scripts/ledger.mjs`, `package.json` (`check`, `prelaunch`, new `check:media`), `assets/previews/.gitkeep`, `ledger/S8-media-and-budget.md`.

## 1. Folders and names
```
assets/img/projects/<slug>/cover.webp            thumbnail, 1600×1000
assets/img/projects/<slug>/<what-it-shows>.webp  screenshots (lowercase, hyphens)
assets/previews/<slug>.mp4  (+ <slug>.webm)      hover loop
assets/img/films/<film-id>.webp                  film poster, always hosted here
assets/films/<film-id>.mp4  (+ .webm)            only if self-hosted and ≤ 10 MB; otherwise YouTube
```

## 2. Data model (document in the header of `projects.js`; later stages read it)
```js
preview:  { mp4: "assets/previews/<slug>.mp4", webm: "assets/previews/<slug>.webm" },   // optional; 3–5 s muted loop
links:    { live, repo, docs, more: [{ label, url }] },                                  // every key optional
sections: [{ title: "…", body: "one paragraph" | ["p1", "p2"], list: ["…", "…"] }],      // optional extra blocks
```
- A film belongs to a project through `project: "<slug>"` in `films.js` (already supported). Films of one project are listed in array order.
- Rule for every field: **missing means nothing is rendered**. No placeholder text, no empty block.
- `featured: true` on at most four projects (the home page shows four).

## 3. Shared CSS (site.css)
`.plate__frame>video` is already positioned and cropped by `site.css`. Add only the fade, with a selector specific enough to beat its `transition: transform`:
```css
.plate__frame>video.plate__preview{z-index:1;opacity:0;pointer-events:none;transition:opacity .5s}
.plate__frame>video.plate__preview.is-on{opacity:1}
```
No new colours, no new variables.

## 4. Budget gate — `scripts/check-media.mjs`
Load `assets/data/*.js` the way `scripts/check-samples.mjs` reads them, then check:
- **Errors (exit 1):** a referenced file is missing (`cover`, `logo`, `preview.*`, `gallery[].src`, film `poster`, self-hosted film `src`/`webm`); a film has no `poster`; a file is over budget (preview 500 KB, cover 120 KB, poster 100 KB, screenshot 200 KB, self-hosted film 10 MB); more than four `featured` projects.
- **Warnings (printed; exit 1 only with `--strict`):** a file in `assets/previews/`, `assets/img/projects/`, `assets/img/films/` or `assets/films/` that no data entry or page mentions; a self-hosted film over 5 MB.
- Print one line per checked file with its size, so a human sees how close each one is.
It runs at the end of `npm run check` and, with `--strict`, of `npm run prelaunch`; `npm run check:media` runs it alone.

## 5. Ledger order
`scripts/ledger.mjs` sorts file names as text, so `S10` would list before `S8`. Sort numerically (stage number first, then name).

## 6. Recipes (put these in the ledger so the owner can copy them)
Install ffmpeg once (Windows: `winget install Gyan.FFmpeg`). It also writes WebP, so no other tool is needed.
```bash
# hover loop, MP4 (H.264), 4 s starting at 2 s, no audio, 640 px wide
ffmpeg -ss 2 -t 4 -i demo.mp4 -an -vf "scale=640:-2,fps=24" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart assets/previews/<slug>.mp4
# same loop as WebM (usually smaller; optional)
ffmpeg -ss 2 -t 4 -i demo.mp4 -an -vf "scale=640:-2,fps=24" -c:v libvpx-vp9 -crf 38 -b:v 0 assets/previews/<slug>.webm
# thumbnail or film poster from one frame
ffmpeg -ss 3 -i demo.mp4 -frames:v 1 -vf "scale=1600:-2" -c:v libwebp -quality 80 poster.webp
# screenshot PNG to WebP (only scale if it is wider than 1600 px)
ffmpeg -i shot.png -c:v libwebp -quality 82 shot.webp
```
Over budget? Raise `-crf` by 3, drop to `scale=480:-2`, use `fps=20`, or shorten the loop to 3 s. For the thumbnail's crop, keep the subject centred: the layout shows it at 16:10, 4:5 and 4:3.

## Acceptance
- `npm run check` passes on today's repo (every current file is inside its budget).
- Copy any 2 MB file to `assets/previews/` and point a project at it: `npm run check` fails and names the file. Remove it again.
- `npm run ledger` lists S8, S9, S10 in numeric order.
- No page changes visually; `npm run serve` looks exactly as before.

## Deliver
Fill the ledger, run `npm run check`, commit. (`docs/WORKFLOW.md` has the patch commands.)
