---
stage: S11
name: "Work: traffic animation"
status: done
owner: site team
depends: S10
---
## Done
- **Fig. 1 on `work.html`: our projects in traffic.** A two-lane road seen almost from above (the road is a plane tilted 15° from flat, so it narrows slightly towards the far side). One car per entry of `NEXT.projects`, in `projects.js` order; nothing is hard-coded, so a new project adds a car by itself. Even positions drive left to right in the near lane, odd positions right to left in the far lane. 0 projects: the figure is hidden and nothing is drawn.
- **Cars.** Top face in the project's palette colour (`NEXT.art.palettes[palette].bg`, falling back to `ink`), a darker side face one step lower, an ink hairline outside and a paper hairline inside so a car reads on every palette, including `ink` and `paper`. The roof shows the name; if it does not fit, the initials ("SPHEREx Blink Comparator" gives SBC); if those do not fit, one letter. Roof text is never mirrored or turned, so it reads the same in both directions. Its colour (paper or ink) is chosen from the car colour's luminance. The full title is in the accessible name.
- **Links.** Each car is `<a href="project.html?p=<slug>">` (slug through `encodeURIComponent`), accessible name "Case study: <title>", keyboard focusable, Tab order = `projects.js` order. The visible focus ring is the site's own `:focus-visible` style. Every string put into HTML goes through `NEXT.esc`.
- **Traffic light.** Red, amber and green lamps beside the road, near the right end. Green is lit while traffic runs. Hovering anywhere in the figure (not only the light), or keyboard focus on a car, lights red and the cars ease to a stop in about 0.4 s; leaving or moving focus away lights green and they ease back up. Nothing jumps or resets: one phase value moves all cars, and the speed is eased, never cut. Amber is drawn but never lit.
- **Touch.** The first touch on the figure stops the traffic (red, button reads "Play"); the button restarts it. Later touches do not stop it again, so a tap on a car follows its link. The caption says "Hover the road…" only on hover devices and "Tap the road…" otherwise.
- **Pause/Play.** A visible button under the road (first in Tab order). Pressing Play while the pointer is still over the figure keeps the traffic running until the pointer leaves.
- **Stops by itself.** No frame is scheduled while the tab is hidden, the figure is off-screen, or the traffic is fully stopped. Reduced motion: no movement; the cars are parked, all fully inside the road, light red, still links; Play may start the motion.
- **Keyboard focus slides a cut-off car into view.** A car is partly cut by the road edge about 40% of the time. When a car gets keyboard focus the whole traffic slides (eased, one phase offset, no jump) just far enough to bring it fully inside the road.
- **No layout shift from the figure.** The box has a fixed `aspect-ratio` (2/1 below 560 px, 3.2/1 up to 900 px, 5/1 above), so it is reserved from the first paint: 320×160 at 360 px, 1240×248 at 1440 px. Only `transform` is animated (the lamp has a 0.3 s `opacity` transition).
- **Weight (minified with esbuild, KB = 1024 B as in `check-media`).** `road.js` 3312 B of 4096; `road.css` 2658 B of 3072. No fonts, images, libraries or network requests.
- **Checks.** `npm run check` and `npm run prelaunch` pass. Tested in Chromium (Playwright) against `node scripts/serve.mjs`, fixtures injected in the browser and not in the repo:
  - Real data: 4 cars, lanes alternate, hrefs and names match `projects.js`, colours match the palettes, 6 wraps in 24 s all happen with the car off-screen (a sliver of 3 px or less), largest step 1.4 px per frame.
  - Hover: light red at once, cars stop in about 330–410 ms with steps that only shrink, stay stopped; leaving gives green and a smooth start. Hovering the light also stops it.
  - Keyboard: Tab order Pause, then the 4 cars in order; focus gives red and stopped cars; 2 px crimson ring; leaving gives green; 32 focus events at different traffic phases all ended with the car fully inside the road.
  - Pause/Play with the mouse; touch emulation (first touch stops, Play works, later touches do not stop it, 44 px target, a tap on a car follows its link); reduced motion (no movement, 0 style writes in 1.5 s, cars parked inside the road, links work, Play starts it).
  - Off-screen: 240 writes/s on screen, 0 off-screen, back to 240 on return.
  - 0, 1 and 8 projects: no errors; 8 projects keep at least one car length between neighbours in a lane at 1280 px and at 360 px; 8 parked cars all in view with no overlap; hostile titles and slugs (`<b>`, `&`, quotes, `?`) are escaped.
  - Roof text contrast (rendered colours): ink 16.4, indigo 10.4, forest 6.8, crimson 5.5, ochre 8.3, paper 13.8; all above 4.5:1.
  - Road colour is `--ink-3`: CIEDE2000 distance 22.9 or more from every palette colour (nearest is `forest`).
  - 360 px and 1440 px: no sideways scroll, no console errors, figure CLS 0.
  - Lighthouse mobile, three runs: Performance 99, 99, 99; LCP 1.7–1.8 s; CLS 0; TBT 0–10 ms. See the caveat under Left to do before reading this as an improvement.
  - Not tested: Safari, Firefox, real touch devices, a screen reader, a truly hidden tab (see Left to do).

## Changed
New: `assets/js/pages/road.js`, `assets/css/pages/road.css`, this ledger.
Edited: `work.html` only (the `road.css` link after `work.css`; the `<figure class="road">` with the mount `#road` and its caption, right after the lede inside `.page-head`; the `road.js` script tag after `work.js`).
**Outside S11's file list:** none. `site.css`, `work.js`, `work.css` and the check scripts are untouched.

## Decisions
- **Evenly spaced and never overlapping, by construction.** Each lane's cars sit at the middles of m equal parts of one loop of road plus one car length, and the car length is capped at `road width / (2m − 1)`. That keeps neighbours at least one car length apart while they move, and lets all cars stand fully in view at rest. Cost: with many projects the cars shrink (at 360 px: 8 projects gives 45 px cars with one-letter roof labels; more than about 12 would need a third lane or a different layout).
- **The parked layout is the starting layout.** Traffic starts from the same positions the reduced-motion layout shows, so pressing Play never makes a car jump.
- **One phase, eased speed, own frame loop.** Plain `requestAnimationFrame` with exponential easing (about 0.4 s to stop or start) rather than CSS animations: a CSS animation cannot change speed without a jump, and a resize would restart it. The loop ends when everything has stopped.
- **Tilt by perspective on the road plane only.** `perspective: 1100px` and `rotateX(15deg)` on the plane; the light and the button are not tilted. A stronger perspective makes cars near the edges lean noticeably (tried 900 px and softened it).
- **Road surface is `--ink-3`**, not a mix of tokens, so it works without `color-mix` (a `var()` inside an unsupported `color-mix` does not fall back to the line above it). The side face and the green lamp use `filter: brightness()` for the same reason.
- **No logo on the roof.** No project has a small logo field today; the roof shows name, initials or one letter.
- **No cursor label on the cars.** The site's "View" cursor bubble is larger than a small car and hides its label.
- **No `<noscript>`.** Without script the figure is hidden by `@media (scripting: none)`, so it leaves no empty gap. Browsers that do not know that media feature show an empty box without script.
- **Label in name.** When the roof shows initials the visible text ("MM") is not part of the accessible name ("Case study: Mini Me"), as the brief specifies the name.

## Left to do
- **Pre-existing layout shift on `work.html` that this stage does not fix.** The footer block jumps from about y 770 to about y 3030 when `work.js` builds the plates (CLS about 0.22 in a 360×800 window and 0.35 in a 360×4000 window, measured on the untouched site). No road element is in any shift source. On the patched page a phone-sized window shows CLS 0 only because the figure pushes the footer below the first screen, where its jump is not counted; in a 4000 px window it is still 0.31. Lighthouse mobile on the untouched copy gave Performance 75 (CLS 0.34), on the patched page 99. That difference comes from where the footer sits, not from anything S11 repaired.
- **Hidden tab not tested for real.** Headless and headed Chromium under Xvfb never report a background or minimised tab as hidden. The hidden-tab path was tested by setting `document.hidden` and firing `visibilitychange` (240 writes/s, then 0, then 240 again). The off-screen path was tested for real.
- Check in Safari, Firefox and on a real phone (touch, Pause/Play, the 3D tilt, text sharpness inside the tilted plane), and with a screen reader.
- If the site grows past about 12 projects, give the figure more lanes or a taller box; today the cars simply get smaller.

## Requests
- **Work page stage (`work.js` / `work.css`):** reserve space for the plate grid (or keep the footer hidden until the plates exist) so the footer does not jump; see Left to do.
- **S1/S7 (`site.css`):** none needed. If other pages want the same Pause/Play button or hover-only caption wording, `.road__btn` and `.road__hov`/`.road__tap` could move to `site.css`.
