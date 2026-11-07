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
     links     { live, repo }         featured  show on home (max 4)
     sample    true = placeholder, shows an ochre SAMPLE tag
   Case-study fields (all optional — missing ones are simply not shown):
     brief     what the client needed / the problem        (1–3 sentences)
     approach  what we did and why                         (1–3 sentences)
     outcome   what changed — only measurable, true things (1–3 sentences)
     gallery   [{ src, alt, caption }]  images in assets/img/projects/<slug>/ (1600px wide WebP/JPG)
               or [{ art:{ motif, palette }, caption }] to show generated art
   ========================================================================== */
window.NEXT = window.NEXT || {};
NEXT.projects = [
  { slug: "mini-me", title: "Mini Me", year: 2026, category: "ai", status: "coming-soon", featured: true,
    summary: "The revolutionary AI that changes the future — multiple agents working together to futurize engineering.",
    abstract: "Mini Me connects multiple AI agents into one system that plans, builds and checks engineering work. It is our flagship product: fast execution, detailed results, and customization for the way each team works.",
    role: "Flagship product — concept, design, engineering", tags: ["multi-agent", "LLM", "engineering"],
    palette: "ink", motif: "nodes", logo: "assets/img/brand/mini-me-logo.webp", links: {} },

  { slug: "meridian", title: "Meridian", year: 2026, category: "web", status: "live", featured: true, sample: true,
    summary: "A booking and scheduling platform for a multi-branch clinic.",
    abstract: "Sample entry. Replace with a real web project: what the client needed, what you built, and what changed for them.",
    brief: "Sample text. Describe the problem in the client's own terms: who was struggling, with what, and why it mattered.",
    approach: "Sample text. Explain the key decisions — what we tested first, what we built, what we deliberately left out.",
    outcome: "Sample text. Only true, measurable results belong here. If there are none yet, say what happens next.",
    gallery: [ { art: { motif: "tiles", palette: "indigo" }, caption: "Sample figure — replace with a real screenshot." },
               { art: { motif: "bars", palette: "ochre" }, caption: "Sample figure — a second screen or detail." } ],
    role: "Design & full-stack build", tags: ["web app", "scheduling", "dashboard"],
    palette: "indigo", motif: "tiles", links: {} },

  { slug: "lumen", title: "Lumen", year: 2025, category: "app", status: "live", featured: true, sample: true,
    summary: "A field-reporting mobile app that keeps working without a signal.",
    abstract: "Sample entry. Replace with a real mobile project.",
    role: "Product design & mobile engineering", tags: ["mobile", "offline-first", "sync"],
    palette: "forest", motif: "waves", links: {} },

  { slug: "parallax", title: "Parallax", year: 2025, category: "saas", status: "beta", featured: true, sample: true,
    summary: "An analytics workspace built for small research teams.",
    abstract: "Sample entry. Replace with a real SaaS project.",
    role: "Architecture & engineering", tags: ["SaaS", "analytics", "multi-tenant"],
    palette: "ochre", motif: "bars", links: {} },

  { slug: "quill", title: "Quill", year: 2026, category: "ai", status: "prototype", sample: true,
    summary: "An LLM assistant that drafts and cites from a private document library.",
    abstract: "Sample entry. Replace with a real AI project.",
    role: "Applied research & prototype", tags: ["LLM", "retrieval", "citations"],
    palette: "crimson", motif: "orbits", links: {} },

  { slug: "halcyon", title: "Halcyon", year: 2025, category: "research", status: "prototype", sample: true,
    summary: "An open study of lightweight models for noisy signals.",
    abstract: "Sample entry. Replace with a real research project.",
    role: "Research & evaluation", tags: ["research", "signals", "evaluation"],
    palette: "paper", motif: "rings", links: {} }
];
