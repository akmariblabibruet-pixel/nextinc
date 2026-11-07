# Project briefs — the facts the pages may use

Source of truth for S9 (copy) and S10 (home). Every statement below was taken from the project's own repository on 7 Nov 2026.
If a project changes, update this file first, then `assets/data/projects.js`.
Field names are explained in the header of `assets/data/projects.js` and in `docs/stages/S8-media-and-budget.md`.

Order on the home page: 1 Mini Me · 2 SPHEREx Blink Comparator · 3 MiniLocker · 4 Next Inc. Immersive.

---

## 1. Mini Me — `mini-me`
**Source:** the Mini Me book repo (`Unavailable4u/minime_book`), mainly `docs/minime_feature_guide.md`. That repo is *about* Mini Me; it is not the product.
**Status:** `coming-soon` (decided). Show the demo film. **Overview only:** keep the abstract short and do not describe features one by one.

**What it is (usable, plain):** a personal, workspace-centred AI operating environment. It combines persistent chats, workspaces that hold context, sources, notes and generated work, a roster of specialised agents (research, reasoning, writing, review, testing, design), notebooks, staged project execution (research → plan → build → test → growth), a code workbench with review gates, knowledge graphs, and live progress with usage accounting.
**Stack (stated in the guide):** Next.js frontend, FastAPI backend, Supabase authentication.
**Ecosystem:** Mini Me Web is the flagship surface of three products sharing one account: **M2C** (terminal and editor coding agent, "Minime to Code") and **Menux** (local-first personal automation agent).
**Status words:** the guide marks each feature Available, Partially wired or Planned. Write only the Available ones as working. Never present Planned items as shipped.

**Extra sections:** none. The facts above are background for writing the overview; they are not a feature list for the page.
**Needs from the owner:** demo film (YouTube id, duration, title), a poster frame, a 3–5 s loop, 3–6 screenshots with captions, a real cover (the logo art is not a thumbnail).
**Links:** none (decided): no repo, no domain, and not the book site. Do not invent a product URL.

---

## 2. SPHEREx Blink Comparator — `spherex-blink`
**Source:** `Unavailable4u/spherex-blink`. The entry in `projects.js` already matches its README and is complete (cover, two figures, live URL, repo).
**Status:** `completed`. Keep "nothing in it claims a detection".
**Needs from the owner:** a screen-captured demo (20–60 s) and, if wanted, a 3–5 s loop of the blink in action. Until then: thumbnail only, no hover effect, no screening-room slide.
**Note:** the repo has blink GIFs of 0.5–1.5 MB. Do not use them as they are; they break the budget. A re-encoded WebM/MP4 of the same blink is roughly 100–200 KB.
**More screenshots** can come from the app itself; each needs a caption that says what the viewer is looking at.

---

## 3. MiniLocker — `minilocker`
**Source:** `shaikh-dotcom/MiniLocker`. The entry already matches its README.
**Status:** `completed`. Keep the sentence that the credential broker has only been exercised against a recorded upstream.
**Films:** "Blast Radius Zero" (YouTube, 2:50) is already in `films.js` and is the full motion film (confirmed). Add any further video as another film with `project: "minilocker"`.
**Needs from the owner:** a 3–5 s loop (cut later from the film) for the hover preview. Until it exists the plate is a still; screenshots (the repo's `images/browser` and `docs/assets` are starting points) with captions.
**Links:** repo only. No live URL exists; do not add a "Visit" button.
**Suggested extra section:** "Attack Lab" — 15 scripted attacks run against the real sandbox, each reported as contained, breached or inconclusive (already in the abstract; add only if the page needs more room).

---

## 4. Next Inc. Immersive — `next-inc-immersive` (new)
**Source:** `shaikh-dotcom/Next-In-C`. Its README is the unchanged Vite template, so the facts below come from `package.json` and the component names only. **Run it (`npm install`, `npm run dev`) and confirm each section before writing copy.**
**What it is, in one line:** a showcase build of our website that demonstrates 3D and high-graphics animation. It is **not our production site**; say so on the page in plain words.
**Stack (from `package.json`):** React, Vite, Three.js through react-three-fiber (with drei and postprocessing), tsparticles, react-globe.gl, Tailwind.
**What it appears to contain (component names):** a preloader, a hero with a 3D backdrop, an interactive Earth/globe with stats, a founders section, a Mini Me section, tech icons, lazy-loaded canvases.
**Category / status:** `web` / `prototype`.
**Never embed it** in this site: it is a WebGL app and would break every budget. The site shows a thumbnail, a film (when one exists) and a link.
**Links (decided):** `repo` = `https://github.com/shaikh-dotcom/Next-In-C` (public), `live` = `https://next-in-c.onrender.com/`. The page may say it is a showcase build, but must still say it is not our production site.
**Needs from the owner:** a thumbnail (a still of the hero scene), later a screen-recorded flythrough, and a real README in that repo now that it is linked.

---

## Do not publish
These come from the Mini Me book repo and are internal. Do not copy them into this site, link to them or summarise them:
- the financial strategy rulebook: pricing tiers, token caps, cost targets, hiring and funding plans;
- the team to-do page (it is editable by anyone with the link) and the master timeline;
- the server-management stages, the API inventory and the technical roadmap;
- the research-track documents (FBEBC), unless the owner decides to publish them;
- keys, tokens, environment variables and any credentials, in any repo.

## Writing rules for all four
- Plain verbs, short sentences, the site's existing voice. No "revolutionary", "cutting-edge" or "world-class".
- Credit the team; do not add a `role` unless the owner says what it was.
- Numbers only if the repo states them (for example SPHEREx's 20 fields and 219 frames; MiniLocker's 15 attacks).
- Every screenshot has `alt` text describing what is shown, and a caption saying why it matters.
