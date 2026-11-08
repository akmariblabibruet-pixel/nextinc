/* road.js — Fig. 1 on work.html: our projects as cars on a street. Owned by S11. No dependencies.
   One car per NEXT.projects entry, in order. Even positions drive left to right in the near lane, odd ones right to left in the far lane.
   A car's colour comes from the project's `car` field (red, indigo, forest, ochre, silver), else from its palette, else it cycles.
   `carLogo` is an image shown on the roof; a project without one keeps a blank roof. Cars carry no name. Each car links to the case study.
   Lamps stand on both pavements; the traffic light at the right end shows what the traffic is doing: green while it runs, amber while it
   slows, red once it has stopped. The traffic stops (and eases back up) while the pointer is over the figure, while a finger is held on it
   (touch and pen), and while a car has keyboard focus. Nothing is calculated while the figure is off-screen or the tab is hidden.
   Needs: core.js. Styles: assets/css/pages/road.css. Pictures: assets/img/road/. */
(function () {
  'use strict';
  var N = window.NEXT || {}, e = N.esc, st = N.$('#road'), ps = N.projects || [];
  if (!st) return;
  if (!ps.length) { st.parentNode.hidden = true; return; }
  var IMG = 'assets/img/road/', COL = ['ochre', 'indigo', 'forest', 'red', 'silver'],
      BY_PAL = { crimson: 'red', indigo: 'indigo', forest: 'forest', ochre: 'ochre', ink: 'silver', paper: 'silver' },
      mq = matchMedia('(prefers-reduced-motion:reduce)'), n = ps.length, m = n - (n >> 1),
      P = +mq.matches,                 /* parked: reduced motion */
      H = 0,                           /* hold bits: 1 pointer over, 2 keyboard focus, 4 finger down */
      vis = !window.IntersectionObserver,
      W = 0, D = 0, L = 0, G = 0, lamps = 0,  /* road width, loop length, car length, gap kept off-screen at each end, lamps drawn per side */
      u = 0, pan = 0, panT = 0,        /* traffic phase, and a slide that brings a focused car fully into view */
      sp = 0, raf = 0, last = 0, tDown = 0, cars, plane, lampBox;

  function img(src, cls) { return '<img class="' + cls + '" src="' + IMG + src + '.svg" alt="" decoding="async" draggable="false">'; }
  function colour(p, i) { return COL.indexOf(p.car) > -1 ? p.car : BY_PAL[p.palette] || COL[i % COL.length]; }

  /* pavements, road, cars and signal; the lamps are added in measure() because their number follows the width */
  st.innerHTML = '<div class="road__walk road__walk--far"></div><div class="road__lamps"></div><div class="road__plane"><i class="road__cross"></i></div>' +
    ps.map(function (p, i) {
      return '<a class="road__car road__car--' + (i % 2 ? 'l' : 'r') + '" href="project.html?p=' + e(encodeURIComponent(p.slug)) + '" aria-label="Case study: ' + e(p.title) + '">' +
        img('car-' + colour(p, i), 'road__body') +
        (p.carLogo ? '<span class="road__roof" aria-hidden="true"><img src="' + e(p.carLogo) + '" alt="" decoding="async" draggable="false"></span>' : '') + '</a>';
    }).join('') +
    '<div class="road__walk road__walk--near"></div><div class="road__lamps road__lamps--near"></div>' +
    '<span class="road__signal" aria-hidden="true">' + img('signal-red', 'road__sig road__sig--r') + img('signal-amber', 'road__sig road__sig--a') + img('signal-green', 'road__sig road__sig--g') + '</span>';
  plane = N.$('.road__plane', st); lampBox = N.$$('.road__lamps', st);
  cars = N.$$('.road__car', st).map(function (el, i) {
    /* a = start position on the loop: each lane's cars sit at the middles of equal parts, so they are evenly spaced and all in view at rest; d = lane direction and speed */
    var k = i % 2 ? n >> 1 : m;
    return { el: el, a: ((i >> 1) + .5) / k, d: i % 2 ? -.85 : 1, x: 0, ph: i * 2.1 };
  });

  function run() { return !P && !H; }
  function go() { return vis && !document.hidden; }

  /* a car travels one loop of road + its own length + a small gap at each end, so it leaves one edge completely (and a little more) before it comes back at the other;
     a very small, speed-dependent bob stands in for the suspension */
  function place(t) {
    cars.forEach(function (c) {
      c.x = ((((c.a + c.d * (u + pan)) % 1) + 1) % 1) * D - L - G;
      c.el.style.transform = 'translate3d(' + c.x.toFixed(1) + 'px,' + (sp * Math.sin(t / 210 + c.ph) * L * .0035).toFixed(2) + 'px,0)';
    });
  }
  /* lamps along both pavements, the far ones in the gaps of the near ones; the traffic light takes the place of the last near lamp */
  function build(k) {
    var far = '', near = '', pool = '', i,
        lamp = function (x, c) { return '<span class="road__lamp" style="left:' + (x * 100).toFixed(2) + '%">' + img('lamp-' + c, 'road__lampimg') + '</span>'; },
        pl = function (x, c) { return '<i class="road__pool road__pool--' + c + '" style="left:' + (x * 100).toFixed(2) + '%"></i>'; };
    for (i = 0; i < k; i++) {
      far += lamp((i + .5) / k, 'far'); pool += pl((i + .5) / k, 'far');
      if (i < k - 1) { near += lamp((i + 1) / k, 'near'); pool += pl((i + 1) / k, 'near'); }
    }
    lampBox[0].innerHTML = far; lampBox[1].innerHTML = near;
    N.$$('.road__pool', plane).forEach(function (x) { x.remove(); });
    plane.insertAdjacentHTML('beforeend', pool);
    lamps = k;
  }
  function measure() {
    /* the street runs the full width of the window: from the window's left edge to its right edge, scrollbar excluded */
    var fig = st.parentNode, vw = document.documentElement.clientWidth;
    st.style.width = vw + 'px'; st.style.marginLeft = -fig.getBoundingClientRect().left + 'px';
    W = st.clientWidth;
    if (!W) return;
    /* short enough that, with the most cars in one lane, they are one car length apart or more and can all stand in view;
       the car size follows the page column, not the window, so cars do not grow on a wide screen */
    var cw = Math.min(Math.max(100, Math.min(190, .17 * fig.clientWidth)), W / (2 * m - .8));   /* the same clamp as --cw in road.css */
    st.style.setProperty('--cw', cw.toFixed(1) + 'px');
    L = cw; G = Math.ceil(.06 * L); D = W + L + 2 * G;
    var k = Math.max(2, Math.floor(W / (1.7 * cw)));
    if (k != lamps) build(k);
    place(0);
  }

  /* green while the traffic runs, amber while it slows down, red once it has stopped */
  function light() { var s = run() ? 'g' : sp > .35 ? 'a' : 'r'; if (st.dataset.s != s) st.dataset.s = s; }
  /* one frame loop: speed and slide ease out exponentially (about 0.5 s), then the loop ends and nothing runs */
  function frame(t) {
    raf = 0;
    if (!go()) return;
    var dt = Math.max(0, Math.min(t - last, 50)) / 1e3, k = 1 - Math.exp(-dt / .11), g = +run();
    last = t; sp += (g - sp) * k; pan += (panT - pan) * k;
    if (Math.abs(g - sp) < .005) sp = g;
    if (Math.abs(panT - pan) < 1e-4) pan = panT;
    u += sp * dt / 16; place(t); light();
    if (g || sp || pan != panT) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && go() && (run() || sp || pan != panT)) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function sync() { light(); kick(); }

  st.onpointerenter = function (v) { if (v.pointerType == 'mouse') { H |= 1; sync(); } };
  st.onpointerleave = function (v) { if (v.pointerType == 'mouse') { H &= ~1; sync(); } };
  /* touch and pen: the traffic stands while a finger is held on the figure. A scroll gesture ends the hold (pointercancel), so it never traps the page. */
  st.onpointerdown = function (v) { if (v.pointerType != 'mouse') { H |= 4; tDown = Date.now(); sync(); } };
  function lift() { if (H & 4) { H &= ~4; sync(); } }
  st.onpointerup = lift; st.onpointercancel = lift;
  /* a long press is a hold, not a tap: it must not also follow the car's link, or open the browser's link menu */
  st.addEventListener('click', function (v) { if (tDown && Date.now() - tDown > 450 && v.target.closest('a')) v.preventDefault(); tDown = 0; }, true);
  st.addEventListener('contextmenu', function (v) { if (tDown) v.preventDefault(); });
  st.addEventListener('focusin', function (v) {
    var c = cars.filter(function (c) { return c.el == v.target; })[0];
    if (c && c.el.matches(':focus-visible')) {
      /* slide the traffic just far enough to bring a car that is cut by an edge fully into view; nothing jumps */
      var mg = 8, dx = c.x < mg ? mg - c.x : c.x + L > W - mg ? W - mg - c.x - L : 0;
      panT += dx / D / c.d; H |= 2; sync();
    }
  });
  st.addEventListener('focusout', function () { H &= ~2; sync(); });
  mq.onchange = function () { P = +mq.matches; sync(); };
  document.addEventListener('visibilitychange', kick);
  if (window.IntersectionObserver) new IntersectionObserver(function (x) { vis = x.pop().isIntersecting; kick(); }).observe(st);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(st); else addEventListener('resize', measure);
  measure(); sync();
})();
