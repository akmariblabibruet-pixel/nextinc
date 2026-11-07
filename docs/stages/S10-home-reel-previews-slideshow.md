# S10 — Home: company reel, hover previews, screening-room slideshow
**Depends on:** S9 · **Ledger:** `ledger/S10-home-reel-previews-slideshow.md` · **Plan:** `docs/UPDATE_PLAN.md`

## Goal
Three changes on the home page, all of them invisible to the page weight until a visitor acts.

## You own
`index.html` (the hero figure and one intro line only), `assets/js/pages/home.js`, `assets/css/pages/home.css`, `assets/js/preview.js` (new), `assets/data/films.js` (the reel entry and the `featured` flag only), `assets/img/films/next-inc-reel.webp`, `ledger/S10-home-reel-previews-slideshow.md`. One call to `NEXT.preview.bind` in `assets/js/pages/work.js` (list view); note it in the ledger under *Requests*.

## 1. Hero figure becomes the company reel
- Keep the `<figure class="hero__fig">` exactly where it is: under the hero, before the running head and §1.
- Point it at a new film `next-inc-reel`: `data-film`, `aria-label`, and the caption (**Fig. 1.** Next Inc. — what we have built so far, plus the duration). Remove the MiniLocker wording.
- Film entry in `films.js`: `id: "next-inc-reel"`, `kind: "showreel"`, no `project`, `provider: "youtube"`, `featured: true`. Remove `featured` from `minilocker-film`.
- This image is the LCP. Poster 1600×900 WebP ≤ 100 KB, with the 960 px mobile `<source>` already used there, `width`/`height` and `fetchpriority="high"` kept.
- Until the reel exists, the current home.js code hides the figure when its film id is missing. Keep that, so there is never a dead play button, and the section returns by itself when the film entry is added. The MiniLocker film must not stay in Fig. 1.

## 2. Selected work: four plates, hover previews
- `home.js` already shows the featured projects, four slots, so with four featured projects the list needs no change. Check that previews and covers crop well in the slots' ratios (16/10, 4/5, 4/3, 16/10).
- New `assets/js/preview.js` (≤ 1.2 KB minified, no dependencies) exposes `NEXT.preview.bind(root)`. For each `.plate` whose project has `preview`:
  - **Only** when `(hover:hover) and (pointer:fine)`, the visitor has not asked for reduced motion, and `navigator.connection.saveData` is not set.
  - On `pointerenter` or keyboard focus-visible, wait 120 ms, then create the video once: `<video class="plate__preview" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1">`, WebM source first if there is one, then MP4. Append it inside `.plate__frame`, call `play()`, add `is-on` on the `playing` event.
  - On leave or blur: pause and remove `is-on`. Keep the element, so a second hover does not download again.
  - One preview at a time. The thumbnail stays underneath, so nothing shifts.
  - Plates without `preview` get no element and no handlers: **thumbnail only**.
- The plate stays a plain link: the video ignores the pointer, focus stays on the link.
- Add the sentence "Hover a plate to see it move." to the section intro only when at least one plate got a preview, and only on hover devices.
- Load `preview.js` on `index.html` and `work.html` only.

## 3. Screening room: slideshow
Keep the section, its dark "room" look, heading, intro and the "All films" button. Replace the single feature film and the reel list with a slideshow.

**Slides.** One per project that has at least one film, in `projects.js` order. A project joins automatically when a film with `project: "<slug>"` exists; with no film there is no slide. If there are no slides at all, keep today's "No films yet" message.

**Slide layout (same as today).** Left (`c-8`): the project's first film, large (`R.film`, poster plus play, opens the lightbox). Right (`c-4`): the project title and status, then **every film of that project as a list row** (title, duration; click opens the lightbox), the one-line summary and a "Case study →" link. A project with one film still shows that film in the list, so the column is never empty.

**Behaviour.**
- Advances every 8 s with a thin progress line (transform only, existing crimson token).
- **Pauses** while the pointer is over the section, while focus is inside it, while the lightbox is open, while the tab is hidden and while the section is off-screen (IntersectionObserver). On touch screens it stops after the first interaction.
- Controls: previous, next, and a **pause/play button**. Project names as typographic tabs with a counter (for example "2 / 3"), styled like the existing films filter. Keys ← →; swipe on touch (40 px threshold).
- **Reduced motion:** no auto-advance and no cross-fade; the button reads "Play".
- Changing slide is a 250 ms opacity fade. All slides sit in one grid cell (`grid-area: 1 / 1`; inactive ones `visibility: hidden` and `inert`) so the section is as tall as the tallest slide and **never shifts**.
- Posters are `loading="lazy"`. **No video is requested by the slideshow at all.**

**Accessibility.** `role="region"`, `aria-roledescription="carousel"`, `aria-label="Project films"`. Each slide: `role="group"`, `aria-roledescription="slide"`, `aria-label="2 of 3: MiniLocker"`. The live region is `off` while rotating and `polite` once paused or stepped manually.

**Weight.** ≤ 3 KB minified JS and ≤ 1.5 KB CSS for the slideshow.

## Acceptance (check in DevTools → Network, then Lighthouse)
- First load of the home page: no `.mp4`, `.webm` or YouTube request; ≤ 250 KB transferred.
- Hover a plate with a preview: exactly one request, ≤ 500 KB, plays within a second; leaving pauses it; hovering again makes no new request. A plate without a preview does nothing.
- Chrome device emulation (touch) and "prefers-reduced-motion: reduce": no preview requests, no auto-advance.
- Slideshow with **0**, **1** and **3** projects that have films: "No films yet" message, a single slide with no tabs and no auto-advance, and three slides cycling. Hover stops it; leaving restarts it.
- Keyboard only: tab to the pause button, the tabs, the films and the case-study link; ← → change slides; Esc closes the lightbox and focus returns.
- 360 px and 1440 px; CLS 0; Lighthouse mobile Performance ≥ 95.
- `npm run check` and `npm run prelaunch` pass.

## Deliver
Fill the ledger (list the assets still missing per project), run `npm run check`, commit.
