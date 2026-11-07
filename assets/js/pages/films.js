/* ==========================================================================
   Films page — owned by S4.  Depends on: data/films.js, projects.js, art.js, core.js, render.js
   --------------------------------------------------------------------------
   What this script does
     · Renders the featured film (huge), the programme (year · duration) and the
       other films grouped by kind, with a filter (Showreel · Launch films ·
       Walkthroughs · Studio — only kinds that have films are offered).
     · Wraps NEXT.openFilm (core.js is NOT edited) to add to the lightbox:
       previous / next film, ← → keys, page-scroll lock, link to the project's
       case study, copy-link button, WebM source, and deep links.
     · Deep link:  films.html#mini-me-launch  opens that film on load.
     · Muted hover preview (desktop pointers only, created on first hover).
   Privacy / weight: no request goes to YouTube or Vimeo until a visitor presses
   play (the embed is built on click, youtube-nocookie.com). Nothing here loads video on page load.

   HOW TO ADD A FILM   (edit assets/data/films.js — one object per film, no HTML)
   ------------------------------------------------------------------------
   Common fields
     id        url-safe slug, unique — also the deep link: films.html#<id>
     title, sub, duration ("1:30"), year, kind: showreel | launch | walkthrough | studio
     project   optional slug from projects.js → the lightbox and the card link to its case study
     featured  true on exactly ONE film = the huge film at the top
     poster    optional image (see "Posters"); otherwise a generated cover is used
     sample    true = placeholder (ochre SAMPLE tag, player says "Film coming soon"). Delete it once the film is real.

   1) YouTube  (lightest for the site — recommended for long films)
        { id:"mini-me-launch", title:"Mini Me — Launch film", sub:"…", duration:"0:48", year:2026, kind:"launch",
          project:"mini-me", provider:"youtube", src:"AbCdEfGhIjK",         // the 11 characters after ?v=
          poster:"assets/img/films/mini-me-launch.webp" }
      Upload as "Unlisted". Always host the poster yourself: YouTube's thumbnail URLs (i.ytimg.com)
      would contact YouTube as soon as the page loads.

   2) Vimeo
        provider:"vimeo", src:"123456789"                                    // the numeric id
      The video's privacy setting must allow embedding on your domain.

   3) Self-hosted MP4  (+ optional WebM)
        provider:"mp4", src:"assets/films/mini-me-launch.mp4",
        webm:"assets/films/mini-me-launch.webm",                             // optional, tried first by browsers that support it
        poster:"assets/img/films/mini-me-launch.webp"
      Encode H.264 + AAC, 1080p, about 4 Mbps (≈ 0.5 MB per second of film — a 90 s reel is ≈ 45 MB; for a smaller
      file lower the bitrate, or use YouTube). "faststart" lets playback begin before the download ends:
        ffmpeg -i in.mov -vf scale=-2:1080 -c:v libx264 -preset slow -b:v 4M -maxrate 5M -bufsize 8M \
               -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart out.mp4
      WebM (VP9 + Opus, usually 30–40 % smaller at the same look):
        ffmpeg -i in.mov -vf scale=-2:1080 -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 -c:a libopus -b:a 96k out.webm
      Put big files in assets/films/ (create the folder) — not in assets/img/.

   4) Optional hover preview (desktop only, never loaded on touch screens)
        preview:"assets/films/mini-me-launch-preview.mp4"
      Muted, no audio track, 6–10 s loop, ≈ 640 px wide, ≤ 3 MB. It is fetched only when the pointer first
      hovers the card (preload="none"), and never when the visitor prefers reduced motion.

   Posters   1600×900 WebP or JPG, < 200 KB, saved as assets/img/films/<id>.webp
   Order     the programme and the ← → player order follow the order of films.js.
   ========================================================================== */
(function () {
  'use strict';
  var NEXT = window.NEXT; if (!NEXT || !NEXT.render || !NEXT.films) return;
  var R = NEXT.render, e = NEXT.esc, $ = NEXT.$, $$ = NEXT.$$, d = document, root = d.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce;

  var KINDS = [
    { k: 'showreel', label: 'Showreel', note: 'Our work, cut together.' },
    { k: 'launch', label: 'Launch films', note: 'One product, one short film.' },
    { k: 'walkthrough', label: 'Walkthroughs', note: 'A product, shown as it is used.' },
    { k: 'studio', label: 'Studio', note: 'The people and the places behind the work.' }
  ];
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function kindOf(f) { return f.kind || 'other'; }
  function kindInfo(k) {
    for (var i = 0; i < KINDS.length; i++) if (KINDS[i].k === k) return KINDS[i];
    return { k: k, label: k.charAt(0).toUpperCase() + k.slice(1), note: '' };
  }

  var films = NEXT.films.slice(), byId = {};
  films.forEach(function (f) {
    if (!f.id || !f.title) console.warn('[films] every film needs an id and a title', f);
    if (byId[f.id]) console.warn('[films] duplicate id: ' + f.id);
    byId[f.id] = f;
    if (f.provider === 'youtube' && !/^[\w-]{11}$/.test(f.src || '')) console.warn('[films] ' + f.id + ': a YouTube src is the 11-character video id');
    if (f.provider === 'mp4' && !f.src) console.warn('[films] ' + f.id + ': provider "mp4" needs src');
  });
  function indexOf(id) { for (var i = 0; i < films.length; i++) if (films[i].id === id) return i; return -1; }
  function project(f) {
    if (!f.project) return null;
    return (NEXT.projects || []).filter(function (p) { return p.slug === f.project; })[0] || null;
  }
  function projectHref(p) { return 'project.html?p=' + encodeURIComponent(p.slug); }
  function cardFor(id) { return $$('[data-film]').filter(function (el) { return el.getAttribute('data-film') === id; })[0] || null; }

  var feat = films.filter(function (f) { return f.featured; })[0] || films[0];

  /* ------------------------------------------------------------------ hover preview */
  function bindPreview(card, f) {
    if (!f.preview || !canHover) return;
    var frame = $('.film__frame', card), v = null;
    card.addEventListener('pointerenter', function (ev) {
      if (ev.pointerType && ev.pointerType !== 'mouse') return;
      if (!v) {
        v = d.createElement('video'); v.className = 'film__preview';
        v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'none'; v.tabIndex = -1;
        v.setAttribute('muted', ''); v.setAttribute('aria-hidden', 'true'); v.src = f.preview;
        frame.appendChild(v);
      }
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      v.classList.add('is-on');
    });
    card.addEventListener('pointerleave', function () { if (v) { v.classList.remove('is-on'); v.pause(); } });
  }

  /* ------------------------------------------------------------------ featured + programme */
  function renderFeatured() {
    var host = $('#feat-film'), row = $('#feat-row'); if (!host || !feat) return;
    host.innerHTML = R.film(feat, { bare: true, reveal: false });
    var card = $('.film', host);
    $('.film__frame', card).insertAdjacentHTML('beforeend', '<span class="feat__lab" aria-hidden="true">CH1 &middot; ' + e(kindOf(feat)) + '</span>');
    bindPreview(card, feat);

    var p = project(feat), k = kindInfo(kindOf(feat));
    var prog = '<p class="prog__head smcp"><span>Programme</span><span class="mono">' + pad(films.length) + (films.length === 1 ? ' film' : ' films') + '</span></p>' +
      '<ol class="reel">' + films.map(function (f, i) {
        return '<li><button type="button" class="reel__item' + (f === feat ? ' is-on' : '') + '" data-film="' + e(f.id) + '">' +
          '<span class="reel__no">' + pad(i + 1) + '</span><span class="reel__name">' + e(f.title) + '<small>' + e(f.sub || '') + '</small></span>' +
          '<span class="reel__time">' + e(f.year || '') + ' &middot; ' + e(f.duration || '') + '</span></button></li>';
      }).join('') + '</ol>';

    row.innerHTML =
      '<div class="c-7"><p class="smcp feat__now" data-reveal>Now showing</p>' +
      '<h2 class="h2 feat__title" data-reveal style="--d:1">' + e(feat.title) + '</h2>' +
      (feat.sub ? '<p class="feat__sub" data-reveal style="--d:2">' + e(feat.sub) + '</p>' : '') +
      '<p class="cap__meta feat__facts" data-reveal style="--d:3"><span>' + e(k.label) + '</span><span class="num">' + e(feat.year || '') + '</span><span class="num">' + e(feat.duration || '') + '</span></p>' +
      '<div class="feat__cta" data-reveal style="--d:4"><button type="button" class="btn btn--room btn--play" data-film="' + e(feat.id) + '">Play film</button>' +
      (p ? '<a class="link link--arrow" href="' + projectHref(p) + '">Case study: ' + e(p.title) + '</a>' : '') + '</div></div>' +
      '<div class="c-5 prog" data-reveal style="--d:2">' + prog + '</div>';
    NEXT.init(host); NEXT.init(row);
  }

  /* ------------------------------------------------------------------ grouped grid + filter */
  function renderGroups() {
    var fh = $('#films-filter'), kh = $('#films-kinds'); if (!fh || !kh) return;
    var rest = films.filter(function (f) { return f !== feat; });
    var order = KINDS.map(function (k) { return k.k; });
    rest.forEach(function (f) { if (order.indexOf(kindOf(f)) < 0) order.push(kindOf(f)); });
    var groups = order.map(function (k) { return { info: kindInfo(k), list: rest.filter(function (f) { return kindOf(f) === k; }) }; })
      .filter(function (g) { return g.list.length; });
    if (!groups.length) { var sec = $('#all'); if (sec) sec.hidden = true; return; }

    fh.innerHTML = '<button type="button" class="films-filter__b" data-kind="all" aria-pressed="true">All<span class="num">' + pad(rest.length) + '</span></button>' +
      groups.map(function (g) { return '<button type="button" class="films-filter__b" data-kind="' + e(g.info.k) + '" aria-pressed="false">' + e(g.info.label) + '<span class="num">' + pad(g.list.length) + '</span></button>'; }).join('');

    kh.innerHTML = groups.map(function (g) {
      var id = 'kind-' + g.info.k;
      return '<section class="kind" data-kind="' + e(g.info.k) + '" aria-labelledby="' + id + '"><header class="kind__head">' +
        '<h3 class="kind__title" id="' + id + '">' + e(g.info.label) + '</h3><span class="kind__count mono">' + pad(g.list.length) + '</span>' +
        (g.info.note ? '<p class="kind__note">' + e(g.info.note) + '</p>' : '') + '</header><div class="grid">' +
        g.list.map(function (f, i) {
          var p = project(f);
          return '<div class="c-4 fcard">' + R.film(f, { delay: i % 3 }) +
            '<p class="cap__meta"><span class="num">' + e(f.year || '') + '</span>' +
            (p ? '<span><a class="link" href="' + projectHref(p) + '">' + e(p.title) + '</a></span>' : '') + '</p></div>';
        }).join('') + '</div></section>';
    }).join('');

    $$('.fcard', kh).forEach(function (c) { var b = $('.film', c); if (b) bindPreview(b, byId[b.getAttribute('data-film')]); });
    NEXT.init(kh);

    var status = $('#films-status');
    fh.addEventListener('click', function (ev) {
      var b = ev.target.closest ? ev.target.closest('[data-kind]') : null; if (!b) return;
      var k = b.getAttribute('data-kind'), shown = 0;
      $$('[data-kind]', fh).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('.kind', kh).forEach(function (s) {
        var show = k === 'all' || s.getAttribute('data-kind') === k, was = !s.hidden;
        s.hidden = !show;
        if (show) { shown += $$('.fcard', s).length; if (!was) { s.classList.remove('is-shown'); void s.offsetWidth; s.classList.add('is-shown'); } }
      });
      if (status) status.textContent = 'Showing ' + shown + (shown === 1 ? ' film' : ' films') + (k === 'all' ? '' : ' — ' + kindInfo(k).label);
    });
  }

  /* ------------------------------------------------------------------ lightbox upgrades */
  var baseOpen = NEXT.openFilm, cur = null;   // cur = the open <dialog>

  function hashId() { try { return decodeURIComponent(location.hash.slice(1)); } catch (_) { return ''; } }
  function setHash(id) { try { history.replaceState(null, '', location.pathname + location.search + '#' + encodeURIComponent(id)); } catch (_) {} }
  function clearHash() { try { history.replaceState(null, '', location.pathname + location.search); } catch (_) {} }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (ok, no) {
      var t = d.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;left:-9999px;top:0';
      d.body.appendChild(t); t.select();
      var done = false; try { done = d.execCommand('copy'); } catch (_) {}
      t.remove(); done ? ok() : no();
    });
  }
  function copyLink(btn, scope, id) {
    var url = location.href.split('#')[0] + '#' + encodeURIComponent(id), st = $('[data-copied]', scope), old = btn.textContent;
    function say(msg) { btn.textContent = msg; if (st) st.textContent = msg; setTimeout(function () { if (btn.isConnected) { btn.textContent = old; if (st) st.textContent = ''; } }, 2200); }
    copyText(url).then(function () { say('Link copied'); }, function () { window.prompt('Copy this link', url); });
  }

  function swapTo(dlg, id, viaButton, dir) {
    dlg.__swap = true;                       // the old dialog must not unlock the page or move focus
    NEXT.openFilm(id, dlg.__real);           // open the new one first, so the page is never uncovered
    dlg.close();
    if (viaButton && cur) { var b = $('[data-step="' + dir + '"]', cur); if (b) b.focus(); }
  }
  function step(dlg, dir, viaButton) {
    var n = films.length; if (n < 2) return;
    swapTo(dlg, films[(indexOf(dlg.__film) + dir + n) % n].id, viaButton, dir);
  }

  function decorate(dlg, f) {
    var box = $('.lightbox__box', dlg), i = indexOf(f.id), n = films.length, p = project(f);

    /* WebM option: replace the <video src=mp4> core built with <source webm> + <source mp4> */
    if (f.provider === 'mp4' && f.src && f.webm) {
      var old = $('video', dlg);
      if (old) {
        var v = d.createElement('video'); v.controls = true; v.autoplay = true; v.playsInline = true;
        if (f.poster) v.poster = f.poster;
        v.innerHTML = '<source src="' + e(f.webm) + '" type="video/webm"><source src="' + e(f.src) + '" type="video/mp4">';
        old.parentNode.replaceChild(v, old);
      }
    }

    var links = (p ? '<a class="link link--arrow" href="' + projectHref(p) + '">Case study: ' + e(p.title) + '</a>' : '') +
      '<button type="button" class="lightbox__copy" data-copy>Copy link</button><span class="sr-only" role="status" aria-live="polite" data-copied></span>';
    var nav = '';
    if (n > 1) {
      var pv = films[(i - 1 + n) % n], nx = films[(i + 1) % n];
      nav = '<div class="lightbox__nav">' +
        '<button type="button" class="lightbox__step" data-step="-1" aria-label="Previous film: ' + e(pv.title) + '"><span aria-hidden="true">&larr;</span><span class="lightbox__step-t" aria-hidden="true">' + e(pv.title) + '</span></button>' +
        '<span class="mono lightbox__pos" role="img" aria-label="Film ' + (i + 1) + ' of ' + n + '">' + pad(i + 1) + ' / ' + pad(n) + '</span>' +
        '<button type="button" class="lightbox__step" data-step="1" aria-label="Next film: ' + e(nx.title) + '"><span class="lightbox__step-t" aria-hidden="true">' + e(nx.title) + '</span><span aria-hidden="true">&rarr;</span></button></div>';
    }
    var more = d.createElement('div'); more.className = 'lightbox__more';
    more.innerHTML = '<div class="lightbox__links">' + links + '</div>' + nav;
    box.appendChild(more);
    more.addEventListener('click', function (ev) {
      var b = ev.target.closest ? ev.target.closest('button') : null; if (!b) return;
      if (b.hasAttribute('data-copy')) copyLink(b, more, f.id);
      else if (b.hasAttribute('data-step')) step(dlg, parseInt(b.getAttribute('data-step'), 10), true);
    });
  }

  if (baseOpen) {
    NEXT.openFilm = function (id, opener) {
      var f = byId[id]; if (!f) return baseOpen(id, opener);
      var before = d.querySelectorAll('dialog.lightbox').length, real = opener || null, dlg = null;
      var proxy = { focus: function () { if (!(dlg && dlg.__swap) && real && real.focus) real.focus(); } };   // focus returns to the trigger on a real close
      baseOpen(id, proxy);
      var all = d.querySelectorAll('dialog.lightbox'); if (all.length <= before) return;
      dlg = all[all.length - 1]; dlg.__film = id; dlg.__real = real; cur = dlg;
      decorate(dlg, f);
      root.classList.add('films-locked'); setHash(id);
      dlg.addEventListener('close', function () {
        if (dlg.__swap) return;
        if (cur === dlg) cur = null;
        root.classList.remove('films-locked'); clearHash();
      });
    };

    d.addEventListener('keydown', function (ev) {
      if (!cur || ev.defaultPrevented || ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
      if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
      var a = d.activeElement; if (a && /^(VIDEO|INPUT|TEXTAREA|SELECT|IFRAME)$/.test(a.tagName)) return;   // let a focused player seek
      ev.preventDefault(); step(cur, ev.key === 'ArrowRight' ? 1 : -1, false);
    });

    window.addEventListener('hashchange', function () {
      var id = hashId();
      if (id && byId[id]) { if (!cur) NEXT.openFilm(id, cardFor(id)); else if (cur.__film !== id) swapTo(cur, id, false); }
      else if (!id && cur) cur.close();
    });
  }

  /* ------------------------------------------------------------------ go */
  function start() {
    if (!films.length) {
      var h = $('#feat-film'); if (h) h.innerHTML = '<p class="lede">No films yet. Add one in <span class="mono">assets/data/films.js</span>.</p>';
      var s = $('#all'); if (s) s.hidden = true; document.documentElement.classList.add('films-ready'); return;
    }
    try { renderFeatured(); renderGroups(); } finally { document.documentElement.classList.add('films-ready'); }   /* see films.css: the parts below the head stay unpainted until now */
    var id = hashId(); if (id && byId[id]) NEXT.openFilm(id, cardFor(id));   // films.html#<id>
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})();