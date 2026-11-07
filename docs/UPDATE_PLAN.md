# Update plan — four projects, motion, and a screening room that cycles

**Owner:** site team · **Stages:** S8 → S9 → S10 · **Briefs:** `docs/stages/S8…S10` · **Project facts:** `docs/projects/BRIEFS.md`
Start a stage the way `docs/WORKFLOW.md` describes. This file is the source of truth for the rules and the order.

## Goal
Grow the site from two public prototypes to four showcased projects, with motion kept optional and cheap:
1. A short **company reel** under the hero (replaces the MiniLocker film in Fig. 1).
2. **Selected work** shows four projects as thumbnails; on hover a short muted loop plays. Projects without a loop stay thumbnail-only.
3. Every project has a **case-study page** with the same layout; sections appear only when the project has the content.
4. The **screening room** becomes a slideshow, one slide per project that has films, pausing on hover.

## Hard rules
1. **Light.** The site stays fast. Budgets are in the table below and are checked by a script (S8), not by eye.
2. **Same design.** No new colours, fonts or layout system. Use the tokens and components in `assets/css/site.css` and `styleguide.html`. Each project keeps its generative `palette` / `motif`. New CSS extends existing classes.
3. **No video before intent.** Zero video bytes on page load. A preview loads on hover or keyboard focus (desktop pointers only); a full film loads only after Play (the existing YouTube/Vimeo facade). Touch screens, reduced motion and Save-Data never load previews.
4. **No blank sections.** A section, table row, button, tab or slide exists only if its data exists. No "coming soon" boxes, no empty headings, no dead links.
5. **True only.** Every claim comes from the project's own repo or from the owner. Say what works and what does not yet. No invented numbers, clients or awards.
6. **Nothing internal goes public.** See "Do not publish" in `docs/projects/BRIEFS.md`.
7. **Credit the team.** Commits, comments, docs and ledger `owner:` fields name people or "site team", never tools.

## Budgets
| Item | Budget |
|---|---|
| Home, first load, before any interaction | ≤ 250 KB transferred (today ≈ 136 KB) and **0 video bytes** |
| Lighthouse, mobile | Performance ≥ 95; CLS 0 on home, work and project pages |
| Thumbnail (`cover`) | WebP, 1600×1000, ≤ 120 KB (today 41–47 KB) |
| Hover preview | muted loop, 3–5 s, 640 px wide, **≤ 500 KB** each; MP4 (H.264), WebM optional |
| Film poster | WebP, 1600×900, ≤ 100 KB |
| Screenshot | WebP, ≤ 1600 px wide, ≤ 200 KB, `width`/`height` set, lazy |
| Full films | YouTube (unlisted) with the existing facade. Self-host only if ≤ 10 MB |
| New JavaScript (all stages together) | ≤ 6 KB minified, no libraries |
| New CSS (all stages together) | ≤ 4 KB |

## The lineup (order on the home page)
| # | Project | slug | Exists in `projects.js` | Thumbnail | Hover loop | Films | Links |
|---|---|---|---|---|---|---|---|
| 1 | Mini Me | `mini-me` | yes, text only | logo art today; needs a real cover | owner cuts from demo | demo video (owner has) | none confirmed |
| 2 | SPHEREx Blink Comparator | `spherex-blink` | yes, complete | yes | none yet, thumbnail only | none yet | live + repo |
| 3 | MiniLocker | `minilocker` | yes, complete | yes | owner cuts from motion video | YouTube film exists | repo |
| 4 | Next Inc. Immersive (3D showcase build) | `next-inc-immersive` | **new** | needs a screenshot | none yet | none yet | repo (live URL if any) |

"Next Inc. Immersive" is the default name for the 3D version. Alternatives: "Next Inc. 3D", "Next Inc. Showcase". Decide in S9 and change it in one place (`projects.js`).

## What the owner supplies (in parallel with the stages)
| Asset | Spec |
|---|---|
| Company reel | 30–60 s, shows all four projects. Upload to YouTube (unlisted), give the 11-character id, the duration, and one poster frame |
| Per project: thumbnail | one still, 16:10, recorded with a safe margin (it is cropped to 16:10, 4:5, 4:3 by the layout) |
| Per project: hover loop | 3–5 s excerpt, no audio. Only for projects that have a video |
| Per project: films | YouTube id + duration + title for each video |
| Per project: screenshots | real screenshots, any number, with a one-line caption each |
| Decisions | the open questions at the end of this file |

Encoding recipes are in `docs/stages/S8-media-and-budget.md`.

## Order of work
1. **S8** media rules, data model, budget gate.
2. **S9** the four projects and their case-study pages (data + template).
3. **S10** home page: reel under the hero, hover previews, slideshow.

S10 reads what S9 produces, so do them in this order. Previews, films and screenshots can arrive at any time; adding them is a data edit, not a code change.

## Done means
- All four projects are on the home page in order, each with a thumbnail.
- Previews play on hover for the projects that have one; the others stay still.
- Each case-study page shows only the sections it has content for, at 360 px and 1440 px.
- The screening room cycles through every project with a film, pauses on hover and focus, and has a pause button.
- `npm run check` and `npm run prelaunch` pass, budgets are met, `npm run sync` has refreshed the sitemap, the three ledgers are `done`.

## Open questions for the owner
1. **Mini Me status** — `coming-soon`, `prototype` or `beta`? The feature guide marks parts as Available, Partially wired and Planned. The page may only present Available parts as working.
2. **Name** of the 3D build (default above).
3. **Mini Me links** — the book site `minimebook.vercel.app` is the team's internal atlas; link it only if you want it public.
4. **Next Inc. Immersive** — is it deployed anywhere? Is the repo public? Its README is the Vite template and should be written before the repo is linked.
5. **MiniLocker** — is the "motion video" the same film as the YouTube one, or a different clip?
6. **Reel hosting** — YouTube (default) or a self-hosted MP4?
