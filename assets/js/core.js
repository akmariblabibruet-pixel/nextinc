/* ==========================================================================
   core.js — behaviour shared by every page. Owned by S1. No dependencies.
   Provides: header state, mobile menu, scroll reveals, headline word-rise,
   count-up numbers, parallax, algorithm highlighter, and the
   film lightbox (NEXT.openFilm).
   Page scripts call NEXT.init(scope) after inserting new DOM.
   Markup hooks:  data-reveal  data-split  data-count="12" data-suffix="+"
                  data-parallax=".06"  data-film="<id>"  data-algo
   ========================================================================== */
(function () {
  'use strict';
  var NEXT = (window.NEXT = window.NEXT || {}), d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  NEXT.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  NEXT.$ = function (s, c) { return (c || d).querySelector(s); };
  NEXT.$$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* ---- header: hairline once scrolled, hides on scroll-down, returns on scroll-up */
  function initHeader() {
    var h = NEXT.$('.site-header'); if (!h) return;
    var last = 0, ticking = false;
    function tick() {
      var y = window.scrollY;
      h.classList.toggle('is-scrolled', y > 8);
      if (!d.body.classList.contains('menu-open')) {
        if (y > last + 6 && y > 560) h.classList.add('is-hidden');
        else if (y < last - 6) h.classList.remove('is-hidden');
      }
      last = y; ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }, { passive: true });
    tick();
  }

  /* ---- full-screen mobile menu */
  function initMenu() {
    var btn = NEXT.$('[data-menu-toggle]'), menu = NEXT.$('#menu'); if (!btn || !menu) return;
    var label = NEXT.$('[data-menu-label]', btn);
    function set(open) {
      menu.classList.toggle('is-open', open); d.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.textContent = open ? 'Close' : 'Menu';
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      /* while the menu is open, nothing behind it can be reached with Tab or a screen reader */
      NEXT.$$('.skip, main, .site-footer').forEach(function (el) { if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
      if (open) { var f = NEXT.$('a', menu); f && setTimeout(function () { f.focus(); }, 350); }
    }
    btn.addEventListener('click', function () { set(!menu.classList.contains('is-open')); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { set(false); btn.focus(); } });
    NEXT.$$('a', menu).forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    var mq = window.matchMedia && window.matchMedia('(min-width:980px)');      /* older Safari has addListener only */
    if (mq) { var onWide = function (m) { if (m.matches) set(false); }; if (mq.addEventListener) mq.addEventListener('change', onWide); else if (mq.addListener) mq.addListener(onWide); }
  }

  /* ---- headline word-rise: wraps words in masked spans */
  function split(el) {
    if (el.__split) return; el.__split = 1;
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = d.createDocumentFragment();
          var prev = n.previousSibling;
          n.textContent.split(/(\s+)/).forEach(function (tok, idx) {
            if (!tok) return;
            /* punctuation right after an <em> sticks to that word (no stray line break before a comma) */
            if (idx === 0 && prev && prev.nodeType === 1 && /^[,.;:!?)\]”’]+$/.test(tok)) {
              var ws = prev.querySelectorAll('.w'), last = ws[ws.length - 1];
              if (last) { var pu = d.createElement('span'); pu.className = 'p'; pu.textContent = tok; last.firstChild.appendChild(pu); return; }
            }
            if (/^\s+$/.test(tok)) { frag.appendChild(d.createTextNode(' ')); return; }
            var w = d.createElement('span'), s = d.createElement('span');
            w.className = 'w'; w.setAttribute('aria-hidden', 'true'); s.textContent = tok; s.style.setProperty('--i', i++); w.appendChild(s); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
  }

  /* ---- count-up numbers */
  function count(el, instant) {
    var to = parseFloat(el.getAttribute('data-count')), suf = el.getAttribute('data-suffix') || '', dec = (String(to).split('.')[1] || '').length;
    if (isNaN(to)) return;
    if (instant || reduce) { el.textContent = to.toFixed(dec) + suf; return; }
    var t0 = performance.now(), dur = 1500;
    (function tick(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = (to * e).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---- algorithm block: steps through the lines once when it scrolls into view */
  function algo(el) {
    var lines = NEXT.$$('.algo__line', el), i = 0, timer;
    function clear() { lines.forEach(function (l) { l.classList.remove('is-on'); }); }
    lines.forEach(function (l) {
      l.addEventListener('mouseenter', function () { clearInterval(timer); clear(); l.classList.add('is-on'); });
      l.addEventListener('mouseleave', function () { l.classList.remove('is-on'); });
    });
    if (reduce) return;
    timer = setInterval(function () { clear(); if (i >= lines.length) { clearInterval(timer); return; } lines[i++].classList.add('is-on'); }, 620);
  }

  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; el.classList.add('is-in'); io.unobserve(el);
      if (el.hasAttribute('data-count')) count(el);
      if (el.hasAttribute('data-algo')) algo(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }) : null;

  NEXT.init = function (scope) {
    NEXT.$$('[data-reveal],[data-split],[data-count],[data-algo]', scope || d).forEach(function (el) {
      if (el.__seen) return; el.__seen = 1;
      if (el.hasAttribute('data-split')) split(el);
      if (!io) { el.classList.add('is-in'); if (el.hasAttribute('data-count')) count(el, true); return; }
      if (el.hasAttribute('data-count') && !el.hasAttribute('data-reveal')) el.classList.add('is-in');
      io.observe(el);
    });
  };

  /* ---- gentle parallax (put it on an inner wrapper, never on a [data-reveal] node) */
  function initParallax() {
    if (reduce) return;
    var ticking = false;
    function run() {
      var vh = window.innerHeight;
      NEXT.$$('[data-parallax]').forEach(function (el) {
        var r = el.getBoundingClientRect(); if (r.bottom < -120 || r.top > vh + 120) return;
        var k = parseFloat(el.getAttribute('data-parallax')) || 0.06;
        el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * -k).toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    window.addEventListener('resize', run); run();
  }

  /* ---- film lightbox: <dialog>, YouTube (privacy mode) / Vimeo / mp4 / "coming soon" */
  NEXT.openFilm = function (id, opener) {
    var f = (NEXT.films || []).filter(function (x) { return x.id === id; })[0]; if (!f) return;
    var e = NEXT.esc, dlg = d.createElement('dialog'), media;
    dlg.className = 'lightbox'; dlg.setAttribute('aria-label', f.title);
    if (f.provider === 'youtube' && f.src) media = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(f.src) + '?autoplay=1&rel=0&modestbranding=1" title="' + e(f.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    else if (f.provider === 'vimeo' && f.src) media = '<iframe src="https://player.vimeo.com/video/' + encodeURIComponent(f.src) + '?autoplay=1&title=0&byline=0&portrait=0" title="' + e(f.title) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    else if (f.provider === 'mp4' && f.src) media = '<video src="' + e(f.src) + '"' + (f.poster ? ' poster="' + e(f.poster) + '"' : '') + ' controls autoplay playsinline></video>';
    else media = (NEXT.art ? NEXT.art.cover(f) : '') + '<div class="lightbox__soon"><b>Film coming soon</b><span>' + e(f.title) + ' — ' + e(f.duration || '') + '</span></div>';
    dlg.innerHTML = '<div class="lightbox__box"><button class="lightbox__x" type="button" data-close>Close</button><div class="lightbox__media">' + media + '</div>' +
      '<div class="lightbox__bar"><div><b>' + e(f.title) + '</b><br><i>' + e(f.sub || '') + '</i></div><span class="mono">' + e(f.duration || '') + '</span></div></div>';
    d.body.appendChild(dlg);
    dlg.addEventListener('click', function (ev) { if (ev.target === dlg || ev.target.hasAttribute('data-close')) dlg.close(); });
    dlg.addEventListener('close', function () { dlg.remove(); if (opener && opener.focus) opener.focus(); });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  };
  d.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-film]') : null;
    if (t) { e.preventDefault(); NEXT.openFilm(t.getAttribute('data-film'), t); }
  });

  function boot() {
    initHeader(); initMenu(); NEXT.init(d); initParallax();
    NEXT.$$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})();
