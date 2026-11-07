/* Home page composition — owned by S2.
   Builds the asymmetric plate layout and the featured film from the data files. */
(function () {
  'use strict';
  var NEXT = window.NEXT, R = NEXT.render;

  /* §1 — four slots: lead plate wide, then three offsets */
  var host = document.getElementById('work-grid');
  if (host) {
    var feat = NEXT.projects.filter(function (p) { return p.featured; });
    var rest = NEXT.projects.filter(function (p) { return !p.featured; });
    var list = feat.concat(rest).slice(0, 4);
    var slots = [
      { cls: 'c-8 w-1', ar: '16/10' },
      { cls: 'c-4 s-9 w-2', ar: '4/5' },
      { cls: 'c-5 s-2 w-3', ar: '4/3' },
      { cls: 'c-6 s-7 w-4', ar: '16/10' }
    ];
    host.innerHTML = list.map(function (p, i) {
      return '<div class="' + slots[i].cls + '">' + R.plate(p, { no: i + 1, ar: slots[i].ar, role: i === 0, delay: i % 2 }) + '</div>';
    }).join('');
    NEXT.init(host);
  }

  /* §2 — the featured film, large */
  var ff = document.getElementById('feat-film');
  if (ff) {
    var f = NEXT.films.filter(function (x) { return x.featured; })[0] || NEXT.films[0];
    if (f) { ff.innerHTML = R.film(f, {}); NEXT.init(ff); }
  }
})();
