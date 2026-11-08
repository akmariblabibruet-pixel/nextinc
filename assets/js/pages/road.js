/* road.js — Fig. 1 on work.html: our projects as cars in two-way traffic. Owned by S11. No dependencies, budget 4 KB minified.
   One car per NEXT.projects entry, in order. Even positions drive left to right, odd ones right to left. A car takes its project's
   palette colour (NEXT.art.palettes) and links to the case study. Hover or keyboard focus on the figure turns the light red and the
   traffic eases to a stop; so do Pause, the first touch and reduced motion. Nothing is calculated while the figure is off-screen or the tab is hidden.
   Needs: art.js, core.js. Styles: assets/css/pages/road.css. */
(function () {
  'use strict';
  var N = window.NEXT || {}, e = N.esc, st = N.$('#road'), ps = N.projects || [];
  if (!st) return;
  if (!ps.length) { st.parentNode.hidden = true; return; }
  var pal = (N.art || {}).palettes || {}, mq = matchMedia('(prefers-reduced-motion:reduce)'), n = ps.length,
      P = +mq.matches,                 /* paused: Pause button, first touch, reduced motion */
      H = 0, O = 0, T = 0,             /* hold bits (1 pointer, 2 keyboard focus), Play override, touch seen */
      vis = !window.IntersectionObserver,
      W = 0, D = 0, L = 0,             /* road width, loop length, car length */
      u = 0, pan = 0, panT = 0,        /* traffic phase, and a slide that brings a focused car fully into view */
      sp = 0, raf = 0, last = 0, cars, btn, plane;

  /* relative luminance of #rrggbb */
  function lum(h) {
    var c = [1, 3, 5].map(function (i) { var v = parseInt(h.substr(i, 2), 16) / 255; return v < .04 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  }
  /* "SPHEREx Blink Comparator" -> SBC, "MiniLocker" -> ML */
  function ini(t) {
    var w = t.split(/[\s\-–—]+/).filter(Boolean), r = w.length > 1 ? w.map(function (x) { return x[0]; }) : t.match(/[A-Z0-9]/g) || [t[0]];
    return r.slice(0, 3).join('').toUpperCase();
  }

  /* The light and Pause sit first in the DOM, so Tab reaches them before the cars; CSS puts them under the road. */
  st.innerHTML = '<div class="road__verge"><button type="button" class="road__btn smcp"></button><span class="road__light" aria-hidden="true"><i></i><i></i><i></i></span></div>' +
    '<div class="road__plane">' + ps.map(function (p, i) {
      var b = (pal[p.palette] || pal.ink || {}).bg || '';
      return '<a class="road__car road__car--' + (i % 2 ? 'l' : 'r') + '" href="project.html?p=' + e(encodeURIComponent(p.slug)) + '" aria-label="Case study: ' + e(p.title) + '"' +
        (b ? ' style="--c:' + e(b) + ';--t:var(--' + (lum(b) < .18 ? 'paper' : 'ink') + ')"' : '') + '><b class="road__r" aria-hidden="true"></b></a>';
    }).join('') + '</div>';
  btn = N.$('.road__btn', st); plane = N.$('.road__plane', st);
  cars = N.$$('.road__car', st).map(function (el, i) {
    var t = String(ps[i].title || ps[i].slug || '?'), m = i % 2 ? n >> 1 : n - (n >> 1);
    /* a = start position on the loop: each lane's cars sit at the middles of m equal parts, so they are evenly spaced and all in view at rest; d = lane direction and speed */
    return { el: el, r: el.firstChild, t: [t, ini(t), ini(t)[0]], a: ((i >> 1) + .5) / m, d: i % 2 ? -.85 : 1, x: 0 };
  });

  function run() { return !P && (O || !H); }
  function go() { return vis && !document.hidden; }

  /* roof label: the name, else initials, else one letter; all cars are tested together so the page reflows three times at most */
  function fit() {
    var t = cars.slice();
    [0, 1, 2].forEach(function (k) {
      t.forEach(function (c) { c.r.textContent = c.t[k]; });
      t = t.filter(function (c) { return c.r.scrollWidth > c.r.clientWidth; });
    });
  }
  /* a car travels one loop of road + its own length, so it leaves one edge completely before it comes back at the other */
  function place() {
    cars.forEach(function (c) {
      c.x = ((((c.a + c.d * (u + pan)) % 1) + 1) % 1) * D - L;
      c.el.style.transform = 'translate3d(' + c.x.toFixed(1) + 'px,-50%,0)';
    });
  }
  function measure() {
    var h = plane.clientHeight; W = plane.clientWidth;
    if (!W) return;
    /* short enough that, with the most cars in one lane, they are one car length apart or more and can all stand in view */
    L = Math.min(.78 * h, W / (2 * (n - (n >> 1)) - 1)); D = W + L;
    st.style.setProperty('--cl', L.toFixed(1) + 'px'); fit(); place();
  }

  /* one frame loop: speed and slide ease out exponentially (about 0.5 s), then the loop ends and nothing runs */
  function frame(t) {
    raf = 0;
    if (!go()) return;
    var dt = Math.max(0, Math.min(t - last, 50)) / 1e3, k = 1 - Math.exp(-dt / .11), g = +run();
    last = t; sp += (g - sp) * k; pan += (panT - pan) * k;
    if (Math.abs(g - sp) < .005) sp = g;
    if (Math.abs(panT - pan) < 1e-4) pan = panT;
    u += sp * dt / 16; place();
    if (g || sp || pan != panT) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && go() && (run() || sp || pan != panT)) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function sync() {
    st.dataset.s = run() ? 'g' : 'r';
    btn.textContent = P ? 'Play' : 'Pause'; btn.setAttribute('aria-label', btn.textContent + ' traffic');
    kick();
  }

  st.onpointerenter = function (v) { if (v.pointerType != 'touch') { H |= 1; sync(); } };
  st.onpointerleave = function (v) { if (v.pointerType != 'touch') { H &= ~1; O = 0; sync(); } };
  /* the first touch stops the traffic (unless it is on the button, whose own click decides) */
  st.onpointerdown = function (v) { if (v.pointerType == 'touch' && !T) { T = 1; if (!v.target.closest('button')) { P = 1; sync(); } } };
  st.addEventListener('focusin', function (v) {
    var c = cars.filter(function (c) { return c.el == v.target; })[0];
    if (c && c.el.matches(':focus-visible')) {
      /* slide the traffic just far enough to bring a car that is cut by an edge fully into view; nothing jumps */
      var m = 8, dx = c.x < m ? m - c.x : c.x + L > W - m ? W - m - c.x - L : 0;
      panT += dx / D / c.d; H |= 2; O = 0; sync();
    }
  });
  st.addEventListener('focusout', function () { H &= ~2; sync(); });
  btn.onclick = function () { if (P) { P = 0; O = 1; } else P = 1; sync(); };
  mq.onchange = function () { if (mq.matches) { P = 1; sync(); } };
  document.addEventListener('visibilitychange', kick);
  if (window.IntersectionObserver) new IntersectionObserver(function (x) { vis = x.pop().isIntersecting; kick(); }).observe(st);
  if (document.fonts) document.fonts.ready.then(measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(st); else addEventListener('resize', measure);
  measure(); sync();
})();
