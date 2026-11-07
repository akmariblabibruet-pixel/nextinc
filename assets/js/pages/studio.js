/* studio.html + recognition.html — owned by S5. Needs core.js + render.js (loaded first). */
(function () {
  'use strict';
  var NEXT = window.NEXT, R = NEXT.render, e = NEXT.esc, d = document;

  /* ---- studio: optional bio under each founder (team.js `bio`), added after the shared renderer ---- */
  var auth = d.querySelector('[data-mount="authors"]');
  if (auth && NEXT.team) {
    NEXT.$$('.author', auth).forEach(function (a, i) {
      var t = NEXT.team[i];
      if (t && t.bio) { var p = d.createElement('p'); p.className = 'author__bio'; p.textContent = t.bio; a.appendChild(p); }
    });
  }

  /* ---- recognition: filter by kind, group by year (descending), numbered [n] across groups ---- */
  var groups = d.getElementById('groups');
  if (!groups) return;
  var filters = d.getElementById('filters'), count = d.getElementById('count'), empty = d.getElementById('empty'), honest = d.getElementById('honest');
  var all = (NEXT.recognition || []).slice().sort(function (a, b) { return b.year - a.year; });
  var KIND = { award: 'Award', press: 'Press', grant: 'Grant', certification: 'Certification', milestone: 'Milestone' };
  var kinds = Object.keys(KIND).filter(function (k) { return all.some(function (x) { return x.kind === k; }); });
  honest.hidden = !(all.length === 0 || all.every(function (x) { return x.sample; }));

  filters.innerHTML = ['all'].concat(kinds).map(function (k) {
    var n = k === 'all' ? all.length : all.filter(function (x) { return x.kind === k; }).length;
    return '<button type="button" class="filter" data-kind="' + k + '" aria-pressed="false">' + (k === 'all' ? 'All' : e(KIND[k])) + '<sup class="num">' + n + '</sup></button>';
  }).join('');
  if (kinds.length < 2) filters.hidden = true;

  function render(kind, push) {
    var items = kind === 'all' ? all : all.filter(function (x) { return x.kind === kind; });
    NEXT.$$('.filter', filters).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-kind') === kind ? 'true' : 'false'); });
    if (push) { try { history.replaceState(null, '', kind === 'all' ? location.pathname : '#' + kind); } catch (x) {} }
    var years = [], by = {};
    items.forEach(function (x) { if (!by[x.year]) { by[x.year] = []; years.push(x.year); } by[x.year].push(x); });
    var n = 0;
    groups.innerHTML = years.map(function (y) {
      var html = '<h2 class="rec__year" id="y' + y + '">' + y + '</h2>' + R.refs(by[y]).replace('<ol class="refs">', '<ol class="refs" aria-labelledby="y' + y + '" style="counter-reset:ref ' + n + '">');
      n += by[y].length; return html;
    }).join('');
    var yj = d.getElementById('yearjump');
    if (yj) yj.innerHTML = years.length > 1 ? ' &nbsp;&middot;&nbsp; jump to ' + years.map(function (y) { return '<a class="link" href="#y' + y + '" data-yr="' + y + '">' + y + '</a>'; }).join(', ') : '';
    empty.hidden = items.length > 0;
    count.textContent = items.length + (items.length === 1 ? ' reference' : ' references') + (kind === 'all' ? '' : ' · ' + KIND[kind]);
    NEXT.init(groups);
  }
  filters.addEventListener('click', function (ev) { var b = ev.target.closest('.filter'); if (b) render(b.getAttribute('data-kind'), true); });
  d.addEventListener('click', function (ev) { if (ev.target.closest('[data-reset]')) render('all', true); });
  function fromHash() { var h = location.hash.replace('#', ''); render(kinds.indexOf(h) > -1 ? h : 'all', false); }
  d.addEventListener('click', function (ev) {
    var a = ev.target.closest('[data-yr]'); if (!a) return;
    ev.preventDefault(); var t = d.getElementById('y' + a.getAttribute('data-yr')); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  window.addEventListener('hashchange', function () { if (/^#y\d+$/.test(location.hash)) return; fromHash(); });
  fromHash();
})();
