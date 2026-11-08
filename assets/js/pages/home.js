/* Home page composition — owned by S2; S10 adds the company reel, hover previews and the screening-room slideshow.
   Builds the asymmetric plate layout, Fig. 1 and the slideshow from the data files. */
(function () {
  'use strict';
  var NEXT = window.NEXT, R = NEXT.render, e = NEXT.esc, d = document, films = NEXT.films || [];

  /* §1 — up to four projects as rows: picture left and text right, then text left and picture right, and so on.
     Every picture sits in the same 16:9 frame and is shown whole (see .prow in home.css). */
  var host = d.getElementById('work-grid');
  if (host) {
    var feat = NEXT.projects.filter(function (p) { return p.featured; });
    var rest = NEXT.projects.filter(function (p) { return !p.featured; });
    var list = feat.concat(rest).slice(0, 4);
    host.innerHTML = list.map(function (p, i) {
      return R.row(p, { no: i + 1, ar: '16/9', flip: i % 2 === 1 });
    }).join('');
    NEXT.init(host);
    /* hover loops (preview.js): arms only plates whose project has `preview`, and only on hover devices; the hint follows the same rule */
    if (NEXT.preview && NEXT.preview.bind(host)) {
      var intro = d.querySelector('#work .sec-head__intro');
      if (intro) intro.textContent += ' Hover a plate to see it move.';
    }
  }

  /* Fig. 1 — the company reel. It exists only once the film "next-inc-reel" is in films.js (with a poster), so there is never a dead play button.
     The markup is built here, not written into index.html, so the page never points at a poster file that is not there yet. */
  var hf = d.getElementById('hero-reel');
  var rf = hf && films.filter(function (x) { return x.id === hf.getAttribute('data-reel'); })[0];
  if (rf && rf.poster) {
    var rt = rf.duration ? '<span class="film__time">' + e(rf.duration) + '</span>' : '';
    hf.innerHTML = '<button type="button" class="plate hero__plate" data-film="' + e(rf.id) + '" aria-label="Play film: ' + e(rf.title + (rf.duration ? ', ' + rf.duration : '')) + '">' +
      '<span class="plate__frame"><span class="hero__art" data-parallax=".05"><img src="' + e(rf.poster) + '" alt="" width="1600" height="900" decoding="async" fetchpriority="high"></span>' +
      '<span class="film__play" aria-hidden="true"></span><span class="hero__lab" aria-hidden="true">CH1 &middot; film</span>' + rt + '</span></button>' +
      '<figcaption class="cap"><span class="cap__text"><b>Fig. 1.</b> ' + e(rf.title) + (rf.duration ? ', ' + e(rf.duration) : '') + '.</span></figcaption>';
    hf.hidden = false;
    NEXT.init(hf);
  }

  /* §2 — screening room: a slideshow, one slide per project that has at least one film (projects.js order).
     Slides show posters only; no video is requested until a visitor presses Play. */
  var show = d.getElementById('show'), room = d.getElementById('films');
  if (show && room) {
    var slides = (NEXT.projects || []).map(function (p) {
      var f = films.filter(function (x) { return x.project === p.slug && x.id !== p.video; }), l = films.filter(function (x) { return x.id === p.video; })[0];
      return { p: p, f: l ? [l].concat(f) : f };                     /* same film order as the case-study page */
    }).filter(function (s) { return s.f.length; });
    if (!films.length) { var all = room.querySelector('.room-cta'); if (all) all.hidden = true; }
    if (slides.length) slideshow(show, slides, room);
    else show.outerHTML = '<p class="lede">No films yet. We will publish them here when they are ready.</p>';
  }

  function slideshow(show, slides, room) {
    var n = slides.length, many = n > 1, i = 0, x0, $ = NEXT.$, off = 1, auto = many && !matchMedia('(prefers-reduced-motion:reduce)').matches,
        stage = $('.show__stage', show), fill = $('.show__line i', show), cnt = $('.mono', show), play = $('[data-a="0"]', show);
    stage.innerHTML = slides.map(function (s, k) {
      var p = s.p, st = R.STATUS[p.status];
      return '<div class="show__slide grid" role="group" aria-roledescription="slide" aria-label="' + (k + 1) + ' of ' + n + ': ' + e(p.title) + '">' +
        '<div class="c-8">' + R.film(s.f[0], { reveal: false }) + '</div><div class="c-4"><h3 class="h3">' + e(p.title) + '</h3>' +
        (st ? '<p class="smcp mute">' + e(st) + '</p>' : '') + '<div class="mt-s">' + R.reel(s.f) + '</div>' +
        (p.summary ? '<p class="cap__text mt-s">' + e(p.summary) + '</p>' : '') +
        '<p class="mt-s"><a class="link link--arrow" href="project.html?p=' + encodeURIComponent(p.slug) + '">Case study</a></p></div></div>';
    }).join('');
    var els = NEXT.$$('.show__slide', show);
    if (!many) { els[0].classList.add('is-on'); return; }             /* one slide: no tabs, no controls, no auto-advance */
    $('.show__tabs', show).innerHTML = slides.map(function (s, k) { return '<button class="smcp" data-i="' + k + '">' + e(s.p.title) + '</button>'; }).join('');
    NEXT.$$('.show__bar,.show__line', show).forEach(function (el) { el.hidden = false; });
    var tabs = NEXT.$$('[data-i]', show);

    /* running = auto-advance is on and nothing holds it: pointer over the section, keyboard focus inside, a lightbox open, hidden tab, section off-screen */
    function sync() {
      var held = off || d.hidden || room.matches(':hover') || $(':focus-visible', room) || $('dialog.lightbox', d);
      show.classList.toggle('is-auto', auto); show.classList.toggle('is-held', !!held);
      play.textContent = auto ? 'Pause' : 'Play'; play.setAttribute('aria-label', play.textContent + ' slideshow');
    }
    function go(k, manual) {
      i = (k + n) % n;
      stage.setAttribute('aria-live', manual || !auto ? 'polite' : 'off');     /* silent while it rotates, announced once paused or stepped by hand */
      els.forEach(function (el, j) { el.classList.toggle('is-on', j === i); el.toggleAttribute('inert', j !== i); });
      tabs.forEach(function (t, j) { t.setAttribute('aria-current', j === i); });
      cnt.textContent = (i + 1) + ' / ' + n;
      fill.style.animation = 'none'; void fill.offsetWidth; fill.style.animation = '';     /* restart the progress line */
    }

    fill.onanimationend = function () { go(i + 1); };        /* the progress line is the timer: 8 s, paused together with it */
    show.onclick = function (ev) {
      var b = ev.target.closest('[data-a],[data-i]'); if (!b) return;
      var a = b.dataset.a, t = b.dataset.i;
      if (t) go(+t, 1); else if (a === '0') { auto = !auto; sync(); } else go(i + +a, 1);
    };
    show.onkeydown = function (ev) { if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') go(i + (ev.key === 'ArrowRight' ? 1 : -1), 1); };
    show.onpointerdown = function (ev) {                      /* touch: swipe to step, and auto-advance stops after the first touch */
      if (ev.pointerType !== 'touch') return;
      x0 = ev.clientX; if (ev.target !== play) { auto = false; sync(); }
    };
    show.onpointerup = function (ev) { if (x0 !== null && Math.abs(ev.clientX - x0) >= 40) go(i + (ev.clientX < x0 ? 1 : -1), 1); x0 = null; };
    ['pointerenter', 'pointerleave', 'focusin', 'focusout'].forEach(function (t) { room.addEventListener(t, sync); });
    d.addEventListener('visibilitychange', sync);
    new MutationObserver(sync).observe(d.body, { childList: true });          /* a film lightbox opens or closes */
    new IntersectionObserver(function (en) { off = !en[0].isIntersecting; sync(); }).observe(room);

    go(0); sync();
  }

  /* §6 — recognition: while there is nothing true to cite, say so instead of showing an empty list */
  var rec = d.querySelector('#recognition [data-mount="refs"]');
  if (rec && !(NEXT.recognition || []).length) {
    rec.__mounted = 1;
    rec.innerHTML = '<p class="lede">Nothing to cite yet. We will list verified awards, press and milestones here, and we will not invent any.</p>';
    var more = d.querySelector('#recognition a[href="recognition.html"]');
    if (more && more.parentNode) more.parentNode.hidden = true;
  }
})();
