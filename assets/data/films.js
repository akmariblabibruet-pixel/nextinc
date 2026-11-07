/* ==========================================================================
   FILMS — motion videos about our projects. Owned by S4 (S1 seeds it).
   provider  youtube | vimeo | mp4 | none      src  video id, or file path for mp4
   poster    optional image; otherwise generative art is used
   kind      showreel | launch | walkthrough | studio
   project   slug from projects.js (optional)   featured  one film = the hero reel
   Full guide (YouTube, Vimeo, MP4/WebM, posters, hover preview): header of assets/js/pages/films.js
   HOW TO ADD A FILM:  upload to YouTube (unlisted is fine), copy the 11-char id,
   set provider:"youtube", src:"<id>", and leave out the sample flag.
   COMPANY REEL (Fig. 1 on the home page): the figure stays hidden until this file has a film with id next-inc-reel
   and a poster. Then it appears by itself. Poster: 1600x900 WebP, at most 100 KB, saved in assets/img/films/ as
   next-inc-reel.webp. Give the entry kind showreel, no project, and featured:true. The caption is built from title + duration.
   A paste-ready entry is in ledger/S10-home-reel-previews-slideshow.md (it is not written here: the launch check reads
   every quoted assets/ path in this folder and would fail on a poster that does not exist yet).
   ========================================================================== */
window.NEXT = window.NEXT || {};
NEXT.films = [
  { id: "minilocker-film", title: "MiniLocker — Blast Radius Zero", sub: "The film for the Vultr Agent Rush hackathon", duration: "2:50", year: 2026,
    kind: "launch", project: "minilocker", provider: "youtube", src: "q5bYqguilGs",
    poster: "assets/img/films/minilocker-film.webp", palette: "forest", motif: "rings" },

  { id: "mini-me-chat-film", title: "Mini Me — The Chat tab", sub: "A first look at the Chat tab", duration: "1:03", year: 2026,
    kind: "walkthrough", project: "mini-me", provider: "youtube", src: "4fNrtf8CX_o",
    poster: "assets/img/films/mini-me-chat-film.webp", palette: "ink", motif: "nodes" }
];
