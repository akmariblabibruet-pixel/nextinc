/* ==========================================================================
   render.js — turns the data files into markup. Owned by S1.
   Declarative:  <div data-mount="plates" data-featured data-limit="4"></div>
   Mount names:  plates · reel · films · refs · authors · stats · disciplines
                 · algo · runhead · map · reelart
   Programmatic: NEXT.render.plate(project, opts) etc. — all return HTML strings.
   Load order on a page:  data/*.js → art.js → core.js → render.js
   ========================================================================== */
(function () {
  'use strict';
  var NEXT = (window.NEXT = window.NEXT || {}), e = NEXT.esc;
  var CAT = { web: 'Web', app: 'Mobile', ai: 'AI & LLM', saas: 'SaaS', research: 'Research' };
  var STATUS = { live: 'Live', beta: 'Beta', 'coming-soon': 'Coming soon', prototype: 'Prototype', completed: 'Completed' };
  var KIND = { award: 'Award', press: 'Press', grant: 'Grant', certification: 'Certification', milestone: 'Milestone' };
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function d(i, step) { return ' style="--d:' + (i * (step || 1)) + '"'; }

  var R = (NEXT.render = {
    CAT: CAT, STATUS: STATUS,

    /* the picture part of a plate: image or generated art, logo, plate number, status badge. o: {no, ar} */
    frame: function (p, o) {
      o = o || {};
      var media = p.cover ? '<img src="' + e(p.cover) + '" alt="" loading="lazy" decoding="async">' : NEXT.art.cover(p);
      var logo = p.logo ? '<img class="plate__logo" src="' + e(p.logo) + '" alt="' + e(p.title) + ' logo" width="512" height="512" loading="lazy" decoding="async">' : '';
      return '<span class="plate__frame"' + (o.ar ? ' style="--ar:' + e(o.ar) + '"' : '') + '>' + media + logo +
        (o.no ? '<span class="plate__no">Pl. ' + pad(o.no) + '</span>' : '') +
        (p.status ? '<span class="plate__status' + (p.status === 'live' ? ' plate__status--live' : '') + '">' + e(STATUS[p.status] || p.status) + '</span>' : '') + '</span>';
    },

    /* one project as a Plate. o: {no, ar:'4/3', reveal:true, delay:0, fit:true}
       fit: show the whole cover inside the frame (never cropped or zoomed); the frame colour fills any spare space */
    plate: function (p, o) {
      o = o || {};
      var href = 'project.html?p=' + encodeURIComponent(p.slug);
      return '<a class="plate' + (o.fit ? ' plate--fit' : '') + (p.sample ? ' is-sample' : '') + '" href="' + href + '" data-cursor="View"' + (o.reveal === false ? '' : ' data-reveal') + d(o.delay || 0) + '>' +
        R.frame(p, o) +
        '<span class="cap"><span class="cap__title">' + e(p.title) + ' <span class="arrow" aria-hidden="true">↗</span></span>' +
        '<span class="cap__text">' + (o.no ? '<b>Plate ' + o.no + '.</b> ' : '') + e(p.summary || '') + '</span>' +
        '<span class="cap__meta"><span>' + e(CAT[p.category] || p.category || '') + '</span>' + (p.year ? '<span class="num">' + e(p.year) + '</span>' : '') + (p.role && o.role ? '<span>' + e(p.role) + '</span>' : '') + '</span></span></a>';
    },

    /* one project as a Row: the picture on one side, name and text on the other. o: {no, ar:'16/9', flip:true (text left, picture right), role}
       The picture is a link that screen readers and Tab skip (the title is the same link); the cursor label is on the picture only. */
    row: function (p, o) {
      o = o || {};
      var href = 'project.html?p=' + encodeURIComponent(p.slug);
      return '<article class="prow' + (o.flip ? ' prow--flip' : '') + (p.sample ? ' is-sample' : '') + '" data-reveal' + d(o.delay || 0) + '>' +
        '<a class="plate plate--fit prow__plate" href="' + href + '" data-cursor="View" tabindex="-1" aria-hidden="true">' + R.frame(p, { no: o.no, ar: o.ar }) + '</a>' +
        '<div class="prow__text">' +
          (o.no ? '<p class="prow__no">Plate ' + pad(o.no) + '</p>' : '') +
          '<h3 class="prow__title"><a href="' + href + '">' + e(p.title) + ' <span class="arrow" aria-hidden="true">↗</span></a></h3>' +
          '<p class="prow__sum">' + e(p.summary || '') + '</p>' +
          '<p class="cap__meta prow__meta"><span>' + e(CAT[p.category] || p.category || '') + '</span>' + (p.year ? '<span class="num">' + e(p.year) + '</span>' : '') + (p.role && o.role ? '<span>' + e(p.role) + '</span>' : '') + '</p>' +
          '<p class="prow__go"><a class="link link--arrow" href="' + href + '" tabindex="-1" aria-hidden="true">Read the case study</a></p>' +
        '</div></article>';
    },

    /* one film as a card (opens the lightbox). o: {ar, reveal} */
    film: function (f, o) {
      o = o || {};
      var media = f.poster ? '<img src="' + e(f.poster) + '" alt="" loading="lazy" decoding="async">' : NEXT.art.cover(f);
      return '<button type="button" class="film' + (f.sample ? ' is-sample' : '') + '" data-film="' + e(f.id) + '" data-cursor="Play"' + (o.reveal === false ? '' : ' data-reveal') + d(o.delay || 0) + '>' +
        '<span class="sr-only">Play' + (o.bare ? ': ' + e(f.title) + '. ' : ' ') + '</span>' +     /* part of the name, so the name always contains the visible text */
        '<span class="film__frame">' + media + '<span class="film__play" aria-hidden="true"></span><span class="film__time">' + e(f.duration || '') + '</span></span>' +
        (o.bare ? '' : '<span class="film__ttl">' + e(f.title) + '</span><span class="film__sub">' + e(f.sub || '') + '</span>') + '</button>';
    },

    /* programme list of films (rows) */
    reel: function (films) {
      return '<ol class="reel">' + films.map(function (f, i) {
        return '<li data-reveal' + d(i) + '><button type="button" class="reel__item" data-film="' + e(f.id) + '"><span class="reel__no">' + pad(i + 1) + '</span>' +
          '<span class="reel__name">' + e(f.title) + '<small>' + e(f.sub || '') + '</small></span><span class="reel__time">' + e(f.duration || '') + '</span></button></li>';
      }).join('') + '</ol>';
    },

    /* achievements as numbered references */
    refs: function (items) {
      return '<ol class="refs">' + items.map(function (it, i) {
        var inner = '<span class="refs__year">' + e(it.year) + '</span><span class="refs__title">' + e(it.title) + '</span><span class="refs__meta">' + e(it.org || '') + (it.kind ? ' · ' + e(KIND[it.kind] || it.kind) : '') + '</span>';
        var cls = 'refs__item' + (it.sample ? ' is-sample' : '');
        return it.url ? '<li><a class="' + cls + '" href="' + e(it.url) + '" target="_blank" rel="noopener" data-reveal' + d(i) + '>' + inner + '</a></li>'
                      : '<li><div class="' + cls + '" data-reveal' + d(i) + '>' + inner + '</div></li>';
      }).join('') + '</ol>';
    },

    /* founders as paper authors */
    authors: function (team, aff) {
      var line = team.map(function (t) { return e(t.name) + '<sup>1</sup>'; }).join('<span class="mute"> · </span>');
      var cards = team.map(function (t, i) {
        var alt = e(t.name) + ', ' + e(t.role);
        var img = '<img src="' + e(t.photo) + '" alt="' + alt + '"' + (t.w && t.h ? ' width="' + t.w + '" height="' + t.h + '"' : '') + ' loading="lazy" decoding="async">';
        var pic = t.webp ? '<picture><source srcset="' + e(t.webp) + '" type="image/webp">' + img + '</picture>' : img;
        return '<div class="c-4 m-6"><div class="author" data-reveal' + d(i) + '><div class="author__photo">' + pic + '<span class="author__no">' + pad(i + 1) + '</span></div>' +
          '<h3 class="author__name">' + e(t.name) + '</h3><p class="author__role">' + e(t.role) + '</p></div></div>';
      }).join('');
      return '<p class="authors__line" data-reveal>' + line + '</p><p class="authors__aff" data-reveal><sup>1</sup>' + e(aff || '') + '</p>' +
        '<div class="grid mt-m">' + cards + '</div>';
    },

    stats: function (list) {
      return '<div class="stats">' + list.map(function (s, i) {
        return '<div class="stat' + (s.sample ? ' is-sample' : '') + '" data-reveal' + d(i) + '><div class="stat__n"><span data-count="' + e(s.n) + '"' + (s.suffix ? ' data-suffix="' + e(s.suffix) + '"' : '') + '>' + e(s.n) + e(s.suffix || '') + '</span></div>' +
          '<div class="stat__l">' + e(s.label) + '</div><div class="stat__t">' + e(s.tag || '') + '</div></div>';
      }).join('') + '</div>';
    },

    disciplines: function (list) {
      return '<div class="disc">' + list.map(function (x, i) {
        return '<div class="disc__row" data-reveal' + d(i) + '><span class="disc__no">' + pad(i + 1) + '</span><h3 class="disc__name">' + e(x.name) + '</h3><p class="disc__text">' + e(x.text) + '</p><p class="disc__tech">' + e(x.outputs || '') + '</p></div>';
      }).join('') + '</div>';
    },

    /* "Algorithm 1" — text may contain <b>; it is authored by us in site.js, not user input */
    algo: function (m, n) {
      return '<div class="algo" data-algo><div class="algo__head"><b>Algorithm ' + (n || 1) + '</b> ' + e(m.title) + '</div>' +
        '<div class="algo__io"><b>Input:</b> ' + e(m.input) + '. &nbsp; <b>Output:</b> ' + e(m.output) + '.</div><div class="algo__lines">' +
        m.lines.map(function (l) { return '<div class="algo__line" data-indent="' + (l.i || 0) + '"><span class="t">' + l.t + '</span>' + (l.cm ? '<span class="cm">▷ ' + e(l.cm) + '</span>' : '') + '</div>'; }).join('') + '</div></div>';
    },

    runhead: function (words) {
      var one = words.map(function (w) { return '<span>' + e(w) + '</span>'; }).join('');
      return '<div class="runhead" aria-hidden="true"><div class="runhead__track">' + one + one + '</div></div>';
    }
  });

  /* ---- declarative mounting */
  function pick(list, el) {
    var out = list.slice();
    if (el.hasAttribute('data-featured')) out = out.filter(function (x) { return x.featured; });
    var cat = el.getAttribute('data-category'); if (cat) out = out.filter(function (x) { return x.category === cat; });
    var lim = parseInt(el.getAttribute('data-limit'), 10); if (lim) out = out.slice(0, lim);
    return out;
  }
  NEXT.mount = function (scope) {
    NEXT.$$('[data-mount]', scope || document).forEach(function (el) {
      if (el.__mounted) return; el.__mounted = 1;
      var k = el.getAttribute('data-mount'), html = '';
      var span = 12 / (parseInt(el.getAttribute('data-cols'), 10) || 3), wrap = function (h) { return '<div class="c-' + span + '">' + h + '</div>'; };
      if (k === 'plates') html = pick(NEXT.projects || [], el).map(function (p, i) { return wrap(R.plate(p, { no: i + 1, delay: i % 3 })); }).join('');
      else if (k === 'films') html = pick(NEXT.films || [], el).map(function (f, i) { return wrap(R.film(f, { delay: i % 3 })); }).join('');
      else if (k === 'reel') html = R.reel(pick(NEXT.films || [], el));
      else if (k === 'refs') html = R.refs(pick(NEXT.recognition || [], el));
      else if (k === 'authors') html = R.authors(NEXT.team || [], NEXT.affiliation);
      else if (k === 'stats') html = R.stats(NEXT.site.stats);
      else if (k === 'disciplines') html = R.disciplines(NEXT.site.disciplines);
      else if (k === 'algo') html = R.algo(NEXT.site.method, el.getAttribute('data-n'));
      else if (k === 'runhead') html = R.runhead(NEXT.site.marquee);
      else if (k === 'map') html = '<div class="fig-map">' + NEXT.art.map(NEXT.site.hubs, NEXT.world) + '</div>';
      else if (k === 'reelart') html = NEXT.art.reel();
      el.innerHTML = html;
      if (NEXT.init) NEXT.init(el);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { NEXT.mount(); }); else NEXT.mount();
})();
