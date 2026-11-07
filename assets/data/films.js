/* ==========================================================================
   FILMS — motion videos about our projects. Owned by S4 (S1 seeds it).
   provider  youtube | vimeo | mp4 | none      src  video id, or file path for mp4
   poster    optional image; otherwise generative art is used
   kind      showreel | launch | walkthrough | studio
   project   slug from projects.js (optional)   featured  one film = the hero reel
   HOW TO ADD A FILM:  upload to YouTube (unlisted is fine), copy the 11-char id,
   set provider:"youtube", src:"<id>", remove sample:true.
   ========================================================================== */
window.NEXT = window.NEXT || {};
NEXT.films = [
  { id: "showreel-2026", title: "Showreel 2026", sub: "Selected work in ninety seconds", duration: "1:30", year: 2026,
    kind: "showreel", provider: "none", src: "", featured: true, sample: true, palette: "ink", motif: "waves" },
  { id: "mini-me-launch", title: "Mini Me — Launch film", sub: "Meet the multi-agent engineer", duration: "0:48", year: 2026,
    kind: "launch", project: "mini-me", provider: "none", src: "", sample: true, palette: "crimson", motif: "nodes" },
  { id: "meridian-walkthrough", title: "Meridian — Product walkthrough", sub: "From booking to follow-up", duration: "2:10", year: 2026,
    kind: "walkthrough", project: "meridian", provider: "none", src: "", sample: true, palette: "indigo", motif: "tiles" },
  { id: "lumen-field-test", title: "Lumen — Field test", sub: "Offline, in the real world", duration: "1:05", year: 2025,
    kind: "walkthrough", project: "lumen", provider: "none", src: "", sample: true, palette: "forest", motif: "waves" },
  { id: "inside-next", title: "Inside Next Inc.", sub: "Two hubs, one lab", duration: "3:20", year: 2026,
    kind: "studio", provider: "none", src: "", sample: true, palette: "ochre", motif: "rings" }
];
