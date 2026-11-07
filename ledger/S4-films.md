---
stage: S4
name: Films (screening room) + player
status: done
owner: Claude (Sonnet 5.5) — page JS/CSS supplied by the site owner; integrated and verified by Claude
depends: S1
---
## Done
- `films.html`: dark "screening room" page — page head + keyboard hint, film-strip perforation dividers, featured film (16:9) with "Now showing" details and the programme list, filter (All / Launch films / Walkthroughs / Studio — only kinds that have films), films grouped by kind, noscript note.
- `assets/js/pages/films.js` + `assets/css/pages/films.css`: wraps `NEXT.openFilm` (core.js untouched) to add previous/next film, ← → keys, scroll lock, link to the project's case study, copy-link, WebM support, deep links (`films.html#mini-me-launch`) and an optional muted hover preview. Header of `films.js` documents how to add YouTube / Vimeo / MP4 films, poster and bitrate advice.
- Verified (headless Chrome, 1440 and 390): no console errors or warnings, no horizontal overflow, **no request to YouTube/Vimeo before a click**, lightbox opens, → key moves to next film (hash updates), Esc closes and clears the hash, focus returns to the trigger, deep link opens the right film.

## Changed
- `films.html`, `assets/css/pages/films.css`, `assets/js/pages/films.js`, `assets/data/films.js` (header now points to the guide in films.js), `assets/img/films/.gitkeep`, this ledger.

## Decisions
- `<main>` carries `class="films room"`, which the supplied CSS expects for room colours.
- Films in `assets/data/films.js` are still `sample: true`; the player shows "Film coming soon" for them.

## Left to do
- Add real films (id, title, sub, duration, year, kind, provider + src, poster in `assets/img/films/`) and delete `sample: true`; set `featured: true` on one.
- Posters: hosted locally (never `i.ytimg.com`) to keep the no-third-party-before-click promise.

## Requests
- Real film files or YouTube/Vimeo ids, with titles and durations.
