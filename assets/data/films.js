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
/* Empty on purpose: no film is published yet. The home page and films.html show an honest note.
   Add a film below when there is one (see the guide in assets/js/pages/films.js). */
NEXT.films = [];
