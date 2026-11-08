---
stage: S11
name: "Work: traffic animation"
status: done
owner: site team
depends: S10
---
## Done
- **Fig. 1 on `work.html`: our projects on a street.** One car per entry of `NEXT.projects`, in `projects.js` order; nothing is hard-coded, so a new project adds a car by itself. Even positions drive left to right in the near lane, odd positions right to left in the far lane. 0 projects: the figure is hidden and nothing is drawn. Cars carry no name.
- **Full width.** The street is as wide as the window (edge to edge, scrollbar excluded), not the page column; the caption stays in the column. `road.js` sets the exact width and left offset; `road.css` has the `100vw` rule as the start value. The stage clips at the window's edges. Car size still follows the column, so cars do not grow on a wide screen.
- **Scene.** Drawn in the same 60° oblique view as the pictures in `assets/img/road/`: a flat road band between two paved pavements (slab joints, kerb line), a dashed centre line, edge lines, a zebra crossing before the traffic light and a pool of lamplight under each lamp. **The road is the footer's colour** (`--room`). Double-lantern lamps stand on both pavements (`lamp-far.svg` on the far pavement, `lamp-near.svg` on the near one, staggered); the traffic light stands at the right end of the near pavement where the last near lamp would be.
- **Cars.** One body drawn in five colours (`car-red`, `car-indigo`, `car-forest`, `car-ochre`, `car-silver`); far-lane cars are mirrored. Colour comes from the project's `car` field, else from its palette, else it cycles. The roof carries the project logo on a light panel when the project has `carLogo`, and stays blank when it has none. Mini Me is red with its logo (#FF2052), SPHEREx Blink is indigo with the orbit mark from its web app, MiniLocker is green with the ring-and-point mark from its UI, Next Inc. Immersive is yellow with a blank roof (its repo has no logo, only the template favicon).
- **Links.** Each car is `<a href="project.html?p=<slug>">`, accessible name "Case study: <title>", keyboard focusable, Tab order = `projects.js` order. Every string put into HTML goes through `NEXT.esc`.
- **Traffic light.** Three pictures (`signal-red/amber/green.svg`) cross-fade: green while the traffic runs, amber while it slows, red once it has stopped.
- **Stopping.** The traffic eases to a stop in about half a second and eases back up. It stops while the pointer is over the figure (mouse), while a finger or pen is held on it (touch devices), and while a car has keyboard focus. A scroll gesture on touch ends the hold, so the page never gets stuck. A long press does not follow the car's link; a short tap does. There is no Pause/Play button.
- **Motion.** One phase value moves every car; speed eases exponentially; a very small speed-dependent bob stands in for suspension. No frame is scheduled while the tab is hidden, the figure is off-screen, or the traffic is fully stopped. Reduced motion: the cars are parked, all fully inside the road, light red, still links.
- **Cars leave and enter completely out of sight.** A car travels the road plus its own length plus a small gap (6% of a car) at each end, and the stage clips at the window's edges, so it drives fully off one side before it comes back at the other. Checked frame by frame over a full loop: every wrap happens while the car is entirely outside the window.
- **Keyboard focus slides a cut-off car into view** (eased, one phase offset, no jump).
- **No layout shift from the figure.** The box height is fixed from the first paint by `--cw` (the width of one car, `clamp(100px, 17cqw, 190px)`); `road.js` only narrows it when many projects need the room.
- **Pictures.** Generated from the supplied car, lamp and traffic-light drawings (cars recoloured, traffic light drawn once per lit lamp, coordinates rounded to whole units). Gzipped: about 5 KB per car, 15 KB per lamp, 3 KB per light state.
- **One invitation per page end.** The closing sections of `work.html`, `studio.html` and every project page no longer carry their own Start a project button, because the footer right below already has one. Each now ends with a large italic "Or," that sits on the line where the page meets the footer, half above it (crimson on paper) and half below it (the footer's crimson on the dark): `.cta--or` and `.or` in `site.css`. The project page's "Want something like this?" is now an `h2.h2`, the same size as studio's "Want to work with us?". Studio keeps See open roles and See our work.
- **work.html uses the home page's rows.** Same `R.row` component, picture left then right, every picture in a 16:9 frame, plate numbers from the project's place in `projects.js`; the old featured block and two-column grid are gone. The `.prow` styles moved from `home.css` to `site.css` so both pages share them.
- **No custom cursor.** The round "View" / "Play" label that followed the pointer is removed everywhere: the script (`core.js`), its styles and every `data-cursor` hook.
- **Checks.** `npm run check` passes. `check-media.mjs` now also reads `carLogo`, so a missing or unused roof logo is reported.

## Changed
New: `assets/img/road/` (cars, lamps, light states), `assets/img/projects/{mini-me,spherex-blink,minilocker}/car-logo.svg`.
Rewritten: `assets/js/pages/road.js`, `assets/css/pages/road.css`.
Edited: `assets/data/projects.js` (`car` and `carLogo` fields, documented in its header and set on the four projects), `scripts/check-media.mjs` (reads `carLogo`), `work.html` (caption: "Hold the road to stop the cars." on touch devices), this ledger.

## Decisions
- **Evenly spaced and never overlapping, by construction.** Each lane's cars sit at the middles of m equal parts of one loop of road plus one car length, and the car length is capped at `road width / (2m − 1)`.
- **One phase, eased speed, own frame loop** (plain `requestAnimationFrame`): a CSS animation cannot change speed without a jump.
- **Flat road, no CSS perspective.** The pictures are drawn in an orthographic oblique view, so the road is a flat band; a CSS tilt would disagree with them.
- **`carLogo` is separate from `logo`.** `logo` is drawn on every plate; the roof logo is only for the car.
- **Logos sit on a light roof panel** so a red logo is still readable on a red roof.
- **No logo for Next Inc. Immersive.** Its repo has no logo of its own; the roof stays blank until one is supplied (`carLogo`).

## Left to do
- Check in Safari, Firefox and on a real phone (touch hold, text sharpness), and with a screen reader.
- If the site grows past about 12 projects, give the figure more lanes or a taller box; today the cars simply get smaller.
- Pre-existing layout shift on `work.html` when `work.js` builds the plates (footer jumps); not touched here.
