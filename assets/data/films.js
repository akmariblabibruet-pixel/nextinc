/* ==========================================================================
   FILMS — motion videos about our projects. Owned by S4 (S1 seeds it).
   provider  youtube | vimeo | mp4 | none      src  video id, or file path for mp4
   poster    optional image; otherwise generative art is used
   kind      showreel | launch | walkthrough | studio
   project   slug from projects.js (optional)   featured  one film = the hero reel
   Full guide (YouTube, Vimeo, MP4/WebM, posters, hover preview): header of assets/js/pages/films.js
   HOW TO ADD A FILM:  upload to YouTube (unlisted is fine), copy the 11-char id,
   set provider:"youtube", src:"<id>", and leave out the sample flag.
   ========================================================================== */
window.NEXT = window.NEXT || {};
NEXT.films = [
  { id: "minilocker-film", title: "MiniLocker — Blast Radius Zero", sub: "The film for the Vultr Agent Rush hackathon", duration: "2:50", year: 2026,
    kind: "launch", project: "minilocker", provider: "youtube", src: "q5bYqguilGs",
    poster: "assets/img/films/minilocker-film.webp", featured: true, palette: "forest", motif: "rings" }
];
