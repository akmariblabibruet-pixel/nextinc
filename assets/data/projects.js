/* ==========================================================================
   PROJECTS  — one object per project. Owned by S3 (S1 seeds it).
   Rendered as "Plates" on the home page, work.html and project.html?p=<slug>
   Fields
     slug      url-safe id            title     display name
     year      number                 category  web | app | ai | saas | research
     status    live | beta | coming-soon | prototype
     summary   ONE line for the plate caption (≤ 90 chars)
     abstract  2–4 sentences for the case-study page
     role      what Next Inc. did     tags      string[]
     palette   crimson|ink|indigo|ochre|forest|paper   (generative cover colours)
     motif     nodes|orbits|bars|waves|tiles|rings     (generative cover shape)
     cover     optional image path (overrides generated art)   logo  optional
     video     optional film id from films.js (also: any film in films.js whose
               `project` equals this slug is listed on the case-study page)
     links     { live, repo, docs, more }   see "Motion and extras" below      featured  show on home (max 4)
     sample    true = placeholder, shows an ochre SAMPLE tag
   Case-study fields (all optional — missing ones are simply not shown):
     brief     what the client needed / the problem        (1–3 sentences)
     approach  what we did and why                         (1–3 sentences)
     outcome   what changed — only measurable, true things (1–3 sentences)
     gallery   [{ src, alt, caption }]  images in assets/img/projects/<slug>/ (1600px wide WebP/JPG)
               or [{ art:{ motif, palette }, caption }] to show generated art
   Motion and extras (S8 — all optional; missing means nothing is rendered, no placeholder, no empty block)
     preview   { mp4, webm }  a 3-5 s muted hover loop: assets/previews/<slug>.mp4 (+ .webm), 640 px wide, max 500 KB.
               Without it the plate stays a still image. Played only on hover/focus of a desktop pointer (S10).
     links     live -> "Visit" · repo -> "View on GitHub" · docs -> "Documentation" · more -> [{ label, url }]
     sections  [{ title, body: "a paragraph" | ["p1","p2"], list: ["item", ...] }]  extra editorial blocks on the case-study page
     Films     a film in films.js whose `project` equals the slug belongs to this project; they list in array order.
     Budgets   cover 120 KB · preview 500 KB · film poster 100 KB · screenshot 200 KB · max 4 featured.
               `npm run check` (scripts/check-media.mjs) enforces them and fails on a missing file.
   ========================================================================== */
window.NEXT = window.NEXT || {};
NEXT.projects = [
  { slug: "mini-me", title: "Mini Me", year: 2026, category: "ai", status: "coming-soon", featured: true,
    summary: "A personal AI workspace where specialised agents work on the task you describe.",
    abstract: "Mini Me is a personal, workspace-centred AI environment built around chat. You describe a task, and specialised agents for research, writing, review and testing work on it inside a workspace that keeps your context, sources and notes. It is our flagship product.",
    role: "Flagship product — concept, design, engineering", tags: ["multi-agent", "LLM", "engineering"],
    palette: "ink", motif: "nodes", logo: "assets/img/brand/mini-me-logo.webp" },

  /* Real entries below were written from each repo's README. Work is credited to the team, so there is no `role`. */
  { slug: "spherex-blink", title: "SPHEREx Blink Comparator", year: 2026, category: "research", status: "prototype", featured: true,
    cover: "assets/img/projects/spherex-blink/cover.webp",
    summary: "An interactive blink comparator for real SPHEREx infrared images of the sky.",
    abstract: "A public web app built for the NASA Space Apps 2026 challenge Planet X and SPHEREx. It blinks real SPHEREx infrared images of one patch of sky taken on different dates, so anything that moves stands out, the technique used to find Pluto. It then helps you decide what moved and how far away it is, and lets visitors flag candidates for follow-up.",
    brief: "The challenge asked for four things: multi-epoch comparison, spectral band navigation, interactive data and metadata, and crowdsourced anomaly flagging.",
    approach: "Blink and overlay controls for two frames, band plates for each detector, click-to-inspect coordinates and metadata with a mover check, and a flagging panel that exports CSV or JSON. A Planet X lab adds exact parallax and a distance range with error bars.",
    outcome: "20 real fields (219 frames) built from SPHEREx Quick Release 2, plus one clearly labelled simulated practice field. Across the 16 asteroid fields the known object is found in 148 of 150 frames. It is a prototype: nothing in it claims a detection.",
    tags: ["NASA Space Apps", "SPHEREx", "astronomy", "web app"],
    gallery: [
      { src: "assets/img/projects/spherex-blink/astraea-d3-epochs.webp", alt: "Seven greyscale infrared frames of the same star field, taken on different dates, each labelled with its date and wavelength.", caption: "Seven epochs of the asteroid Astraea's field, detector D3, 28 to 31 July 2025. A blink comparator flips between them so anything that moves stands out." },
      { src: "assets/img/projects/spherex-blink/astraea-d6-epochs.webp", alt: "Four greyscale infrared frames of the same star field from detector D6, each labelled with its date and wavelength.", caption: "The same field through detector D6. Each detector sees a different range of wavelengths, so the app warns when two frames are too different in colour to compare brightness." }
    ],
    palette: "indigo", motif: "orbits",
    links: { live: "https://unavailable4u.github.io/spherex-blink/", repo: "https://github.com/Unavailable4u/spherex-blink" } },

  { slug: "minilocker", title: "MiniLocker", year: 2026, category: "ai", status: "prototype", featured: true,
    cover: "assets/img/projects/minilocker/cover.webp",
    summary: "A sandbox for AI agents that logs every action and measures what a run could touch.",
    abstract: "MiniLocker gives an AI agent a shell and a web browser while keeping what it can break small, visible and provable. Every task runs in a fresh locked-down Docker container with no network route, and the only way out is an allowlisting proxy. Every action goes into a hash-chained ledger, and a Blast Radius report measured from that ledger shows what the run could and could not touch.",
    brief: "An agent with a shell and a browser can be talked into anything: a hostile web page, a poisoned package or an ordinary mistake can leak keys or wipe a disk.",
    approach: "Hard limits instead of trust: hardened containers, an egress allowlist, a policy engine with strict and observe profiles, decoy credentials, and snapshots with rewind. A built-in Attack Lab runs 15 scripted attacks against the real sandbox, so the containment claims can be checked rather than read.",
    outcome: "Each Attack Lab run is reported as contained, breached or inconclusive. The sandbox, egress control, ledger and report, Attack Lab and deployment are working and tested end to end; the credential broker has so far only been exercised against a recorded upstream.",
    tags: ["AI agents", "sandboxing", "security"],
    palette: "forest", motif: "rings",
    links: { repo: "https://github.com/shaikh-dotcom/MiniLocker" } },

  /* Facts: package.json of the repo and the owner's screenshot of the hero. The repo README is still the Vite template. */
  { slug: "next-inc-immersive", title: "Next Inc. Immersive", year: 2026, category: "web", status: "prototype", featured: true,
    cover: "assets/img/projects/next-inc-immersive/cover.webp",
    summary: "A showcase build of our website for 3D and high-graphics animation.",
    abstract: "Next Inc. Immersive is a showcase build of our website that demonstrates 3D and high-graphics animation. It is not our production site, which is the one you are reading. It is built with React and Vite, draws its 3D scenes with Three.js through react-three-fiber, adds particle effects with tsparticles, and uses Tailwind for the layout.",
    tags: ["3D", "WebGL", "React", "Three.js"],
    palette: "crimson", motif: "waves",
    links: { live: "https://next-in-c.onrender.com/", repo: "https://github.com/shaikh-dotcom/Next-In-C" } }
];
