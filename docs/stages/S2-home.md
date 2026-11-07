# S2 — Home page
**Depends on:** S1 · **Parallel with:** S3–S6 · **Ledger:** `ledger/S2-home.md`

## Goal
Replace the old `index.html` with the new home page: the 10-second pitch plus a taste of everything (work, films, method, facts, people).

## You own (create/edit)
`index.html`, `assets/css/pages/home.css`, `assets/js/pages/home.js`, `ledger/S2-home.md`. Do not touch anything else.

## Blueprint (top to bottom)
1. **Hero** — H1 *"Where research becomes <em>working software.</em>"* (`data-split`), abstract paragraph (italic "Abstract." lead-in), buttons *Watch the showreel* (`data-film="showreel-2026"`, `.btn--play`) and *See our work* → `work.html`. A **Contents** list (`.toc`) linking to the sections below. **Fig. 1** below: wide plate (aspect 21/9) with `NEXT.art.reel()` animated figure + play button + caption *"Fig. 1. Showreel 2026 — selected work in ninety seconds."* Subtle parallax on the art.
2. **Running head** (`data-mount="runhead"`).
3. **§1 Selected work** — `.sec-head`; lead plate (mini-me, `ar:'16/9'`, `c-8`) + three offset plates (`featured` projects, `c-4`, stagger vertical offsets via home.css); *All work →* link.
4. **§2 Screening room** — `.room.room--perf`; featured film large (`c-8`) + `data-mount="reel"` (`c-4`); button *All films* → `films.html`.
5. **§3 Method** — `data-mount="algo"` (`c-7`) + a margin note (`.note`) explaining what clients receive at each phase (`c-4 s-9`).
6. **§4 Disciplines** — `data-mount="disciplines"`.
7. **§5 Facts** — `data-mount="stats"`.
8. **§6 Recognition** — first 3 references (`data-mount="refs" data-limit="3"`) + link to `recognition.html`.
9. **§7 Authors** — `data-mount="authors"` + hubs figure `data-mount="map"` with caption.
10. Footer's big CTA is already in the shared footer.

## Acceptance
- Title/description: "Next Inc. — Where research becomes working software." (no mention of trading/finance).
- First screen at 1440×900 shows H1, abstract, both buttons and the top of Fig. 1; at 390 px the hero reads cleanly and the menu works.
- Page weight < 400 KB excluding images; Lighthouse performance ≥ 90 (desktop).
- None of the old unverifiable claims (8.9 ms, 99.998%, "trusted by hundreds", "award winning") appear.
- Keep `<!-- shell:header -->`/`<!-- shell:footer -->` markers; run `npm run sync`.

## Before you start
Read `docs/REDESIGN_PLAN.md`, `docs/DESIGN_SYSTEM.md`, `docs/WORKFLOW.md`; open `/styleguide.html` (run `npm run serve`). Use only components and tokens from the style guide. The site is **showcase-first**: the visitor must quickly see projects, films and how we work. Never invent facts, numbers or awards — use data from `assets/data/*.js` or leave a clearly marked `sample: true` placeholder.

## Deliver
Fill `ledger/<your file>`, run `npm run check`, commit, `git format-patch main --stdout > patches/<stage>.patch` (see WORKFLOW.md).
