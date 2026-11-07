---
stage: S10
name: Home: reel, hover previews, slideshow
status: done
owner: site team
depends: S9
---
## Done
- **Covers.** MiniLocker, SPHEREx Blink and Mini Me use the owner's three images as supplied, re-encoded to WebP inside the 120 KB limit (115.0, 80.8 and 83.0 KB). The Mini Me image still shows the "Try MiniMe" button and `minime.app`. Mini Me now has a cover, so its `logo` field is gone (the logo would have sat on top of the banner).
- **SPHEREx link.** The live link is `https://spherex-blink-web.vercel.app/` (was the github.io address); the page loads.
- **Hover previews.** `assets/js/preview.js` (`NEXT.preview.bind(root)`), loaded on `index.html` and `work.html`, bound in `home.js` and once in `work.js`. It arms only plates whose project has `preview: { webm, mp4 }`, only on hover devices without reduced motion or Save-Data. No project has a `preview` yet, so nothing plays and the "Hover a plate to see it move." sentence is not shown.
- **Company reel (Fig. 1).** The figure is `#hero-reel` in `index.html`, empty and hidden. `home.js` fills and shows it when `films.js` has a film `next-inc-reel` with a poster; otherwise it stays hidden, so there is never a dead play button. MiniLocker is no longer in Fig. 1 and `featured` is removed from `minilocker-film`.
- **Screening-room slideshow.** One slide per project with a film, in `projects.js` order (today: Mini Me, MiniLocker). Left: the project's first film (same order as the case-study page). Right: title, status, every film as a list row, summary, "Case study" link. Every 8 s with a progress line (the line's CSS animation is the timer). Tabs with counter, previous/next, Pause/Play, ← → keys, swipe (40 px). Holds while the pointer is over the section, focus is inside it, a lightbox is open, the tab is hidden, or the section is off-screen. First touch stops it. Reduced motion: no auto-advance, no cross-fade, button reads "Play"; pressing it starts the 8 s timer. All slides share one grid cell, so the section never changes height. Posters are lazy; no video is requested. 0 slides shows "No films yet"; 1 slide shows no tabs, controls or timer. Carousel and slide ARIA as in the brief; the live region is `off` while rotating and `polite` once paused or stepped by hand.
- **Weight (minified with esbuild, KB = 1024 B as in `check-media`).** Slideshow JS 2983 B of 3072; slideshow CSS 1494 B of 1536; `preview.js` 1187 B of 1228.
- **Checks.** `npm run check` and `npm run prelaunch` pass. Tested in headless Chromium against the running site, with fixtures injected in the browser (not in the repo):
  - 0, 1, 2 (real data) and 3 slides; two films on one project; an unattached film only.
  - Timing: 8 s advance; hover holds; leaving resumes; Pause and Play; Play after reduced motion.
  - Input: ← → keys; Tab order (tabs, controls, film, list row, case study, All films); lightbox opens, holds the timer, Esc closes and focus returns inside the slide.
  - Touch and reduced motion: first touch stops it; swipe; reduced motion gives no timer and no fade.
  - Hover previews with a test clip: one request per plate; pause on leave; no second download; one plays at a time; keyboard focus plays; also works on `work.html`, including after a filter re-render.
  - No preview request on touch, reduced motion or Save-Data.
  - 360 px and 1440 px: no sideways scroll, same section height on every slide, no script errors.
  - Lighthouse mobile (two runs): Performance 97 and 99, CLS 0.
  - Not tested: Safari, Firefox, real touch devices.

## Changed
New: `assets/js/preview.js`, `assets/img/projects/mini-me/cover.webp`.
Edited: `assets/js/pages/home.js`, `assets/css/pages/home.css`, `index.html`, `assets/data/films.js`, `assets/js/pages/work.js` (one `bind` call), `work.html` (the `preview.js` script tag), `assets/data/projects.js`, `assets/img/projects/minilocker/cover.webp`, `assets/img/projects/spherex-blink/cover.webp`, this ledger.
**Outside S10's file list** (needed for the work, the owner should know): `projects.js` (Mini Me cover and logo, SPHEREx link), the three cover images, the screening-room markup in `index.html` (the slideshow mount `#show`, replacing the old feature film and reel list), the header note in `films.js`, and the script tag in `work.html`.

## Decisions
- **Fig. 1 is built by `home.js`, not written in `index.html`.** A static `<img>` pointing at a poster that does not exist yet fails `npm run prelaunch` (broken reference), and a hidden image would still request a 404. Cost: once the reel exists, the figure appears after the scripts run, so on a tall desktop window (1440×900) it pushes §1 down once (CLS about 0.013) and the poster is found late. On a phone CLS stays 0. When the poster is real, replace the empty `<figure id="hero-reel" …>` in `index.html` with the static figure below and delete the "Fig. 1 — the company reel" block in `home.js`; then CLS is 0 on desktop too and the poster loads earlier.
- **Mobile poster.** One 1600×900 poster (≤ 100 KB) is used on every screen. The old 960 px mobile `<source>` is not reproduced, because there is no second file. Add a smaller variant if Lighthouse mobile LCP needs it.
- **Mini Me plate.** The cover carries the branding, so no logo is laid over it (closes the open question from S8/S9).
- **Crops.** Mini Me, MiniLocker and Immersive crop well in their plate slots. The SPHEREx cover is landscape in the 4/5 slot, so its left edge is clipped (the "SPHEREx" label is partly cut). A portrait-friendly crop of that image would fix it.
- **Slideshow timer.** The progress line's `animationend` advances the slide, so hovering or focus pauses the line and the timer together.

## Left to do
- **First-load weight misses the brief's target.** On a 360 px phone the home page loads about 373 KB (the original: 255 KB). The two larger covers (Mini Me 83 KB, SPHEREx 81 KB) are in the first view. Re-encoding them at the same size would save about 60 KB (Mini Me about 50 KB, SPHEREx about 56 KB at quality 80), which still would not reach 250 KB. Either accept a higher target or shrink covers further.
- **Company reel:** record or choose the film, upload it to YouTube, add `assets/img/films/next-inc-reel.webp` (1600×900, ≤ 100 KB) and paste the entry below into `assets/data/films.js`:
  ```js
  { id: "next-inc-reel", title: "Next Inc. — what we have built so far", sub: "Our work so far", duration: "1:30", year: 2026,
    kind: "showreel", provider: "youtube", src: "<11-character YouTube id>",
    poster: "assets/img/films/next-inc-reel.webp", featured: true, palette: "crimson", motif: "waves" },
  ```
  Static figure for `index.html` (see Decisions; use the real duration):
  ```html
  <figure class="hero__fig" data-reveal>
    <button type="button" class="plate hero__plate" data-film="next-inc-reel" data-cursor="Play" aria-label="Play film: Next Inc. — what we have built so far, 1:30">
      <span class="plate__frame">
        <span class="hero__art" data-parallax=".05"><img src="assets/img/films/next-inc-reel.webp" alt="" width="1600" height="900" decoding="async" fetchpriority="high"></span>
        <span class="film__play" aria-hidden="true"></span>
        <span class="hero__lab" aria-hidden="true">CH1 &middot; film</span>
        <span class="film__time">1:30</span>
      </span>
    </button>
    <figcaption class="cap"><span class="cap__text"><b>Fig. 1.</b> Next Inc. — what we have built so far, 1:30.</span></figcaption>
  </figure>
  ```
- **Hover loops.** Cut 3–5 s clips (WebM first, MP4 second, ≤ 500 KB each, in `assets/previews/`), then add `preview: { webm: "assets/previews/<slug>.webm", mp4: "assets/previews/<slug>.mp4" }` to the project. None exists yet, so no plate moves today. Per project:
  - **mini-me:** loop from the film; 3–6 screenshots with captions.
  - **spherex-blink:** a 20–60 s screen-captured demo, optional loop, more screenshots.
  - **minilocker:** loop from the film; screenshots.
  - **next-inc-immersive:** a screen-recorded flythrough later, a real README in the repo, no loop yet.
- Check in Safari, Firefox and on a real phone (touch swipe, Play/Pause, lightbox).

## Requests
- **S1/S7 (`site.css`):** the serif fonts swap late and move §1 by about 60 px when §1 is inside the first screen on desktop (it is whenever Fig. 1 is hidden, and a static Fig. 1 pushes it below). A fallback font adjusted to the serif's metrics (`size-adjust`, `ascent-override`) would remove that shift (CLS about 0.001 on a 1440×900 window today).
- **S1/S7:** `R.plate()` and `R.film()` in `render.js` still output `<img>` without `width`/`height` (carried over from S9).
- **Note on shared files:** the single `NEXT.preview.bind` call in `work.js` (list view) and the `preview.js` script tag in `work.html`, as the brief allows.
- **Docs:** update "Needs from the owner" in `docs/projects/BRIEFS.md` (covers received for Mini Me, SPHEREx and MiniLocker; hover loops and the reel film still needed).
