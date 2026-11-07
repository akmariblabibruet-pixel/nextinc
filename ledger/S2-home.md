---
stage: S2
name: Home page
status: done
owner: Claude (Sonnet 5.5)
depends: S1
---
## Done
- New `index.html` replaces the old trading-template page (375 KB → ~12 KB; photos/logo are now real files).
- Sections: hero (word-rise H1, abstract, contents list, **Fig. 1** showreel plate with live oscilloscope art → lightbox) · running head · §1 Selected work (asymmetric 4-plate layout from `featured` projects) · §2 Screening room (featured film + programme) · §3 Method (Algorithm 1 + margin notes) · §4 Disciplines · §5 At a glance (count-up) · §6 Recognition (3 refs) · §7 Authors + hubs map · footer CTA.
- Verified in headless Chrome at 1440 / 768 / 390 px: no console errors, no horizontal overflow, lightbox opens/closes with Esc, mobile menu works.
- Old unverifiable claims (8.9 ms, 99.998%, "trusted by hundreds", "award winning", trading wording) are gone from the page (`grep` = 0).

## Changed
- `index.html` (rewritten), `assets/css/pages/home.css`, `assets/js/pages/home.js`, this ledger.
- The commit "S1 fixes" (already folded into the S1 patch) fixed: heading word-rise clipping italic letters, commas detaching from `<em>`, Mini Me logo sizing on plates, footer heading colour, arrow-link spacing, manual hyphenation in display type.

## Decisions
- Hero H1: "Where research becomes *working software.*" — tagline is ours (not on the old site); change in `index.html` + `site.js` (`tagline`) if you prefer another.
- Method margin notes (†‡§ under Algorithm 1) describe deliverables **written by the assistant** — please confirm they match how you really work.
- Showreel/films are `sample:true`, so the play button opens a "Film coming soon" lightbox until a real film id is added in `assets/data/films.js`.

## Left to do
- Lighthouse / real-device test not run in this environment (do in S7).
- Replace sample projects/films/recognition/stat with real content (plan §8).
- `<meta>` OG image + favicon (S7). The shared footer's links point to stub pages until S3–S5 land.

## Requests
(none)
