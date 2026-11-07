# Next Inc. — Website Redesign Plan

> **Goal:** a showcase site that makes a client say *"wow, these people can build"* within ten seconds —
> by letting them **see our projects, watch our films, and understand how we work**.
> Light on weight (static HTML/CSS/JS, no build step), heavy on craft.

Status of every stage lives in [`LEDGER.md`](../LEDGER.md) (generated from `ledger/`). Start there.

---

## 1. Why the current site had to change

| Problem found in the old site | Consequence |
|---|---|
| Page `<title>` still says *"Institutional Trading Platform"*; a comment says *FundedNext* | It is a **trading-firm template** with our words pasted in. Looks and feels borrowed. |
| Claims we cannot back: *"Latency avg 8.9ms"*, *"99.998% SLA"*, *"Trusted by hundreds"*, *"Award Winning Firm"* | A client who checks us loses trust instantly. **Launch blocker — see §9.** |
| Nothing to *show*: no projects, no case studies, no video, no achievements | The one thing a studio site exists for is missing. |
| Dark slate + glowing red blobs + gradient text + pill badges + `// MONO LABELS` | The generic "AI-generated" look. Indistinguishable from a thousand others. |
| `index.html` is 375 KB because photos and logo are base64-embedded; Tailwind runs from a CDN at load | Slow first paint, can't cache images, hard to edit. |
| An empty "metrics" block, a `Locations` link that goes to `#`, 4 unrelated page designs | Unfinished feel; inconsistent. |

What was **good** and is kept: the crimson brand colour, the company story and four pillars, the two hubs
(Pennsylvania · Rajshahi), the three founders, the Mini Me flagship, the working Web3Forms contact/apply forms.

---

## 2. The idea: "The Monograph"

Our fonts are Computer Modern — the typeface of research papers. So instead of fighting that, we lean into it:
**the whole site is typeset like a beautiful research monograph — and our work is the content.**

| In a paper | On our site |
|---|---|
| Plates / figures | **Projects** are numbered *Plates* with italic captions and printer's crop marks |
| Table of contents | The home page opens with a real **Contents** list with dotted leaders |
| Algorithm 1 | **Our method** is set as a LaTeX *algorithm* block that steps through itself |
| References | **Achievements** are a numbered *[1] [2] [3]* reference list |
| Authors & affiliations | **Founders** are the *Authors*, with superscript affiliations |
| Marginalia, † footnotes | Side notes and asides, used sparingly |
| (a cinema) | **Films** play in a dark *Screening Room* band with film-strip edges |

Nobody in our space looks like this. It signals *rigour* (we are research-driven), *care* (we sweat details),
and *warmth* (paper, ink, one red) — and it can never be mistaken for a template.

**Memorable details:** the wordmark is Ne**𝑥**t — the crimson italic *x* is "the unknown"; every project
gets a unique generated cover (no stock photos needed); the hubs figure is a dot-matrix world with an arc between
our two cities.

### Anti-"vibe-coded" rules (what we deliberately do NOT do)
No glow blobs · no gradient text · no glassmorphism · no emoji or icon soup · no pill-badge walls · no uniform
rounded-2xl card grids · no `// comment` labels · no fake stats. Hairline rules, sharp corners (2 px),
asymmetric editorial grid, real typography.

---

## 3. Design tokens (full detail: [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md); live: `/styleguide.html`)

| Role | Value | Notes |
|---|---|---|
| Paper | `#F5F0E6` / `#ECE5D6` | warm ivory page + band colour, with a faint grain |
| Ink | `#16120E` · `#3B342B` · `#6B6254` | text; muted text is 5.3:1 on paper |
| **Crimson** (brand) | `#C0102C` (5.5:1) | links, the *x*, section numbers, primary button. `#FF4660` only on dark |
| Indigo / Forest / Ochre | `#24307A` · `#1F5D49` · `#C58A1E` | used mostly inside generated covers |
| Screening room | `#0F0D0C` | dark band reserved for **video** |
| Type | **CMU Serif** (all text) + **CMU Typewriter Text** (meta, code) | self-hosted woff2, Latin subset, 110 KB total |
| Base size | 17 px (18.5 px ≥1500 px wide) | measure ≤ 38 em; headings balanced; hyphenation on |
| Motion | reveal-on-scroll, headline word-rise, count-up, slow drifting art, cursor "View/Play" label | all disabled under `prefers-reduced-motion` |

---

## 4. Information architecture

```
index.html        Home — the pitch + highlights of everything below
work.html         Work — all projects, filterable            (S3)
project.html      Case study template  ?p=<slug>             (S3)
films.html        Films — screening room                     (S4)
studio.html       Studio — story, authors, hubs map          (S5)
recognition.html  Recognition — numbered references          (S5)
career.html       Careers  ·  apply.html Apply               (S6)
contact.html      Start a project                            (S6)
styleguide.html   Internal component reference (noindex)
```
`products.html` becomes a redirect to `work.html` (S3).

### Home page blueprint (S2)
1. **Hero** — "Where research becomes *working software.*" (word-rise), abstract paragraph, two buttons
   (*Watch the showreel*, *See our work*), a **Contents** list, and **Fig. 1**: a landscape showreel plate with an
   animated oscilloscope figure and a play button → lightbox.
2. **Running head** marquee of disciplines.
3. **§1 Selected work** — one large lead plate + three offset plates (data: `featured: true`).
4. **§2 Screening room** (dark) — featured film big, programme list right.
5. **§3 Method** — *Algorithm 1* (+ short note on what a client receives).
6. **§4 Disciplines** — four booktabs rows.
7. **§5 Facts** — count-up stats row.
8. **§6 Recognition** — first references + link.
9. **§7 Authors** — founders, hubs figure.
10. **Closing CTA** — the footer's big "Have a problem worth *solving?*".

### Case study template (S3) — what a client reads
Cover/film → one-line abstract → **Brief · Approach · Outcome** (3 short blocks) → a booktabs spec table
(role, year, stack, status) → gallery (images/video) → links (live / repo / film) → *Next plate*.

---

## 5. Architecture & conventions

* **Static, no build.** Open `index.html` or run `node scripts/serve.mjs`. Deploys anywhere (GitHub Pages, Netlify, Vercel).
* **Content is data.** Projects, films, achievements, team and facts live in `assets/data/*.js`. Adding a project = adding an object, no HTML.
* **Shared header/footer** are `partials/*.html`, copied into every page by `node scripts/sync-shell.mjs` (SEO-friendly, no flash, no JS needed).
* **Renderers** in `assets/js/render.js` turn data into plates / films / references / authors. Pages use `<div data-mount="plates">` or call `NEXT.render.*`.
* **Generated art** (`assets/js/art.js`) gives every project and film a unique duotone cover until real screenshots exist.
* **Samples are loud.** Every placeholder carries `sample: true` and shows an ochre **SAMPLE** tag; `node scripts/check-samples.mjs --strict` blocks launch while any remain.
* **Accessibility baseline:** semantic landmarks, skip link, focus rings, contrast ≥ 4.5:1, keyboard-operable menu & lightbox, reduced-motion respected.

---

## 6. The stages (parallel work plan)

```
           ┌─ S2 Home ──────────────┐
 S1 ──────►├─ S3 Work + Case study ─┤
Foundation ├─ S4 Films ─────────────┼──► S7 Polish & launch
 (done)    ├─ S5 Studio+Recognition ┤
           └─ S6 Careers/Contact ───┘
```
After **S1 is applied, S2–S6 are independent** — hand each to a different AI model/person at the same time. S7 runs last.

| Stage | Deliverable | Owns (may create/edit) | Brief |
|---|---|---|---|
| **S1 Foundation** ✅ | design system, fonts, shell, data layer, styleguide, tooling | `assets/css/site.css`, `assets/js/{core,art,render}.js`, `assets/data/{site,world}.js`, `partials/`, `scripts/`, `docs/`, `styleguide.html` | this doc |
| **S2 Home** | new `index.html` | `index.html`, `assets/css/pages/home.css`, `assets/js/pages/home.js` | [S2-home.md](stages/S2-home.md) |
| **S3 Work** | work + case studies, `products.html` redirect | `work.html`, `project.html`, `products.html`, `assets/css/pages/work.css`, `assets/js/pages/work.js`, `assets/data/projects.js` | [S3-work.md](stages/S3-work.md) |
| **S4 Films** | films page + player upgrades | `films.html`, `assets/css/pages/films.css`, `assets/js/pages/films.js`, `assets/data/films.js` | [S4-films.md](stages/S4-films.md) |
| **S5 Studio & Recognition** | story, authors, hubs, references | `studio.html`, `recognition.html`, `assets/css/pages/studio.css`, `assets/js/pages/studio.js`, `assets/data/{team,recognition}.js` | [S5-studio-recognition.md](stages/S5-studio-recognition.md) |
| **S6 Careers & Contact** | restyle forms, keep Web3Forms working | `career.html`, `apply.html`, `contact.html`, `assets/css/pages/forms.css`, `assets/js/pages/forms.js` | [S6-careers-contact.md](stages/S6-careers-contact.md) |
| **S7 Polish & launch** | SEO/OG, favicon, 404, perf, a11y, QA, launch checklist | any file (small fixes), `404.html`, `sitemap.xml`, `robots.txt`, `assets/img/og/` | [S7-polish-launch.md](stages/S7-polish-launch.md) |

### File-ownership rule (this is what makes patches apply cleanly)
Each stage edits **only the files it owns** plus its own ledger file. If a stage needs a change in a shared file
(`site.css`, `core.js`, `render.js`, `site.js`, partials), it **does not edit it** — it writes the request in its ledger under
*"Requests for S1/S7"* and uses page-level CSS/JS instead. S7 (or S1) applies those requests.

---

## 7. How to run a stage (patch + ledger workflow)

Full details: [`WORKFLOW.md`](WORKFLOW.md). In short:

1. Apply earlier patches, then `git checkout -b stage/S3-work`.
2. Tell the AI: *"Read `docs/REDESIGN_PLAN.md`, `docs/DESIGN_SYSTEM.md` and `docs/stages/S3-work.md`, open `/styleguide.html`, then do the stage."*
3. The AI edits owned files, fills in **its** `ledger/S3-work.md` (done / changed / left / requests), runs `npm run check`, commits.
4. It outputs the patch: `git format-patch main --stdout > patches/S3-work.patch`.
5. You apply: `git am --3way patches/S3-work.patch`, then `npm run ledger` → read `LEDGER.md`.

`LEDGER.md` is generated and git-ignored, so patches never conflict on it.

---

## 8. Content we need from you (the site is only as good as this)

The design works with sample data, but **a showcase is its content**. Please prepare, per project: title, year, one-line summary,
2–4 sentence story (problem → what we built → result), 3–6 screenshots (16:10, ≥1600 px wide), live link, and ideally a 30–90 s film.

| Item | Format | Where it goes |
|---|---|---|
| Showreel (60–90 s) | MP4 H.264 ≤ 1080p, ≤ 25 MB — or a YouTube/Vimeo id | `assets/data/films.js` |
| Project films | same; upload to YouTube *unlisted* and paste the id (lightest for the site) | `films.js` |
| Project screenshots | WebP/JPG, 1600 px wide, < 250 KB each | `assets/img/projects/<slug>/` |
| Real achievements | title, organisation, year, link | `recognition.js` |
| Real numbers | projects shipped, clients, years (only what is true) | `site.js` → `stats` |
| Founder bios | 2 sentences each (optional) | `team.js` |
| Logo (SVG) | vector | S7 favicon + OG image |

---

## 9. Launch blockers (found during the audit)

1. Remove or **substantiate** the old claims: *8.9 ms latency, 99.998% SLA, "trusted by hundreds", "award-winning"*. The new pages do not repeat them.
2. Replace every `sample: true` item (`npm run prelaunch` must pass).
3. Update `<title>` / meta description (done in new pages — verify in S7).
4. Web3Forms access key is public by design but should be **domain-restricted** in the Web3Forms dashboard.
5. Confirm the public contact email (`ariblabib360@gmail.com`) is the one you want on the site.

---

## 10. Definition of done (every stage)

- [ ] Uses only tokens/components from the style guide (no new hard-coded colours or fonts)
- [ ] Works at 360 px, 768 px, 1440 px; no horizontal scroll
- [ ] Keyboard: every interactive element reachable, visible focus
- [ ] `prefers-reduced-motion` honoured
- [ ] No console errors; images have `alt`, `width/height` or `aspect-ratio`
- [ ] `npm run check` passes; ledger file filled in; patch applies on a clean checkout
