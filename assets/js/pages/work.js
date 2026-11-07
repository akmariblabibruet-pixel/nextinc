/* work.html + project.html — owned by S3.
   Reads NEXT.projects (assets/data/projects.js). Needs: art.js, core.js, render.js. */
(function () {
  'use strict';
  var NEXT = window.NEXT, R = NEXT.render, e = NEXT.esc, d = document;
  var ORDER = ['web', 'app', 'ai', 'saas', 'research'];
  var all = NEXT.projects || [];
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function idx(p) { return all.indexOf(p) + 1; }
  function setMeta(sel, attr, val, create) {
    var el = d.querySelector(sel);
    if (!el && create) { el = d.createElement(create.tag); Object.keys(create.attrs).forEach(function (k) { el.setAttribute(k, create.attrs[k]); }); d.head.appendChild(el); }
    if (el) el.setAttribute(attr, val);
  }

  /* ======================= work.html ======================= */
  var list = d.getElementById('list');
  if (list) {
    var filters = d.getElementById('filters'), lead = d.getElementById('lead'), count = d.getElementById('count'), empty = d.getElementById('empty');
    var cats = ORDER.filter(function (c) { return all.some(function (p) { return p.category === c; }); });
    var current = 'all';

    filters.innerHTML = ['all'].concat(cats).map(function (c) {
      var n = c === 'all' ? all.length : all.filter(function (p) { return p.category === c; }).length;
      return '<button type="button" class="filter" data-cat="' + c + '" aria-pressed="false">' + (c === 'all' ? 'All' : e(R.CAT[c])) + '<sup class="num">' + n + '</sup></button>';
    }).join('');

    var leadHtml = function (p) {
      var tags = (p.tags || []).map(function (t) { return '<li>' + e(t) + '</li>'; }).join('');
      return '<div class="grid lead">' +
        '<div class="c-8">' + R.plate(p, { no: idx(p), ar: '16/10', role: false, delay: 0 }) + '</div>' +
        '<div class="c-4 lead__side" data-reveal style="--d:2">' +
          '<p class="smcp mute">Featured plate</p>' +
          '<p class="lede">' + e(p.abstract || p.summary || '') + '</p>' +
          (p.role ? '<p class="note"><b>Role.</b> ' + e(p.role) + '</p>' : '') +
          (tags ? '<ul class="tags">' + tags + '</ul>' : '') +
          '<p><a class="btn btn--ghost" href="project.html?p=' + encodeURIComponent(p.slug) + '">Read the case study</a></p>' +
        '</div></div>';
    };

    function render(cat, push) {
      current = cat;
      var items = cat === 'all' ? all.slice() : all.filter(function (p) { return p.category === cat; });
      NEXT.$$('.filter', filters).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === cat ? 'true' : 'false'); });
      if (push) { try { history.replaceState(null, '', cat === 'all' ? location.pathname + location.search : '#' + cat); } catch (x) {} }
      empty.hidden = items.length > 0;
      lead.innerHTML = items.length ? leadHtml(items[0]) : '';
      list.innerHTML = items.slice(1).map(function (p, i) {
        return '<div class="c-6 ' + (i % 2 ? 'work-list__odd' : '') + '">' + R.plate(p, { no: idx(p), ar: '4/3', role: true, delay: i % 2 }) + '</div>';
      }).join('');
      count.textContent = items.length + (items.length === 1 ? ' plate' : ' plates') + (cat === 'all' ? '' : ' · ' + R.CAT[cat]);
      NEXT.init(lead); NEXT.init(list);
    }
    filters.addEventListener('click', function (ev) { var b = ev.target.closest('.filter'); if (b) render(b.getAttribute('data-cat'), true); });
    d.addEventListener('click', function (ev) { if (ev.target.closest('[data-reset]')) render('all', true); });
    function fromHash() { var h = location.hash.replace('#', ''); render(cats.indexOf(h) > -1 ? h : 'all', false); }
    window.addEventListener('hashchange', fromHash);
    fromHash();
  }

  /* ======================= project.html ======================= */
  var root = d.getElementById('case');
  if (root) {
    var slug = new URLSearchParams(location.search).get('p');
    var p = all.filter(function (x) { return x.slug === slug; })[0];
    if (!p) {
      d.title = 'Plate not found — Next Inc.';
      setMeta('meta[name=robots]', 'content', 'noindex', { tag: 'meta', attrs: { name: 'robots', content: 'noindex' } });
      root.innerHTML = '<section class="wrap page-head"><p class="crumbs"><a href="work.html">Work</a></p><h1 class="h1">Plate not <em>found.</em></h1>' +
        '<p class="lede">We could not find that project. It may have been renamed.</p><p class="mt-m"><a class="btn" href="work.html">See all work</a></p></section>';
    } else {
      var i = idx(p), next = all[i % all.length];
      var film = (NEXT.films || []).filter(function (f) { return f.id === p.video; })[0] || (NEXT.films || []).filter(function (f) { return f.project === p.slug; })[0];
      var url = location.origin + location.pathname + '?p=' + encodeURIComponent(p.slug);
      d.title = p.title + ' — case study — Next Inc.';
      setMeta('meta[name=description]', 'content', p.summary || '');
      setMeta('link[rel=canonical]', 'href', url, { tag: 'link', attrs: { rel: 'canonical', href: url } });
      setMeta('meta[property="og:title"]', 'content', p.title + ' — Next Inc.', { tag: 'meta', attrs: { property: 'og:title', content: '' } });
      setMeta('meta[property="og:description"]', 'content', p.summary || '', { tag: 'meta', attrs: { property: 'og:description', content: '' } });

      var cover = p.cover ? '<img src="' + e(p.cover) + '" alt="" decoding="async">' : NEXT.art.cover(p);
      var logo = p.logo ? '<img class="plate__logo" src="' + e(p.logo) + '" alt="' + e(p.title) + ' logo">' : '';
      var hero;
      if (film) {
        hero = '<button type="button" class="plate cs-plate" data-film="' + e(film.id) + '" data-cursor="Play" aria-label="Play film: ' + e(film.title) + '"><span class="plate__frame" style="--ar:16/9">' + cover + logo +
          '<span class="film__play" aria-hidden="true"></span><span class="film__time">' + e(film.duration || '') + '</span></span></button>' +
          '<figcaption class="cap"><span class="cap__text"><b>Fig. 1.</b> ' + e(p.title) + ' &mdash; ' + e(film.title) + '.</span></figcaption>';
      } else {
        hero = '<div class="plate cs-plate"><span class="plate__frame" style="--ar:21/9">' + cover + logo + '</span></div>' +
          '<figcaption class="cap"><span class="cap__text"><b>Fig. 1.</b> ' + e(p.title) + ', ' + e(p.year || '') + '.</span></figcaption>';
      }

      var chip = p.status ? '<span class="chip chip--' + e(p.status) + '">' + e(R.STATUS[p.status] || p.status) + '</span>' : '';
      var rows = [['Role', p.role], ['Year', p.year], ['Category', R.CAT[p.category] || p.category], ['Status', R.STATUS[p.status] || p.status], ['Keywords', (p.tags || []).join(', ')]]
        .filter(function (r) { return r[1]; })
        .map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td>' + e(r[1]) + '</td></tr>'; }).join('');

      var parts = [['Brief', p.brief, '&dagger;'], ['Approach', p.approach, '&Dagger;'], ['Outcome', p.outcome, '&sect;']].filter(function (x) { return x[1]; });
      var partsHtml = parts.length ? '<section class="wrap sec--tight"><div class="grid cs-parts">' + parts.map(function (x, k) {
        return '<div class="c-4" data-reveal style="--d:' + k + '"><p class="cs-part__h"><span class="dagger">' + x[2] + '</span> ' + x[0] + '</p><p>' + e(x[1]) + '</p></div>';
      }).join('') + '</div></section>' : '';

      var gal = (p.gallery || []);
      var galHtml = gal.length ? '<section class="wrap sec--tight"><div class="sec-head"><span class="sec-head__no">&sect;</span><h2 class="sec-head__title h3">Figures</h2></div><div class="grid cs-gal">' +
        gal.map(function (g, k) {
          var m = g.src ? '<img src="' + e(g.src) + '" alt="' + e(g.alt || '') + '" loading="lazy" decoding="async">' : NEXT.art.cover({ slug: p.slug + '-g' + k, motif: g.art && g.art.motif, palette: g.art && g.art.palette });
          return '<figure class="c-6" data-reveal style="--d:' + (k % 2) + '"><button type="button" class="plate cs-plate" data-gal="' + k + '" data-cursor="View" aria-label="Open figure ' + (k + 2) + '"><span class="plate__frame" style="--ar:16/10">' + m + '</span></button>' +
            '<figcaption class="cap"><span class="cap__text"><b>Fig. ' + (k + 2) + '.</b> ' + e(g.caption || '') + '</span></figcaption></figure>';
        }).join('') + '</div></section>' : '';

      var links = '';
      if (p.links && p.links.live) links += '<a class="btn" href="' + e(p.links.live) + '" target="_blank" rel="noopener">Visit the live project</a>';
      if (p.links && p.links.repo) links += '<a class="btn btn--ghost" href="' + e(p.links.repo) + '" target="_blank" rel="noopener">View the source</a>';
      if (film) links += '<button type="button" class="btn btn--play btn--ghost" data-film="' + e(film.id) + '">Watch the film</button>';
      var dev = p.status === 'coming-soon' ? '<p class="note cs-dev"><b>&dagger; In development.</b> This project has not launched yet. We will publish the full case study when it does.</p>' : '';
      var linksHtml = (links || dev) ? '<section class="wrap sec--tight">' + dev + (links ? '<div class="flex cs-links">' + links + '</div>' : '') + '</section>' : '';

      root.innerHTML =
        '<section class="wrap page-head cs-head">' +
          '<p class="crumbs"><a href="work.html">Work</a><span>/</span><span class="cur">' + e(p.title) + '</span></p>' +
          (p.sample ? '<p class="cs-sample">Sample case study &mdash; placeholder content</p>' : '') +
          '<div class="cs-title"><h1 class="h1">' + e(p.title) + '</h1>' + chip + '</div>' +
          '<p class="lede">' + e(p.summary || '') + '</p></section>' +
        '<section class="wrap"><figure class="cs-hero" data-reveal>' + hero + '</figure></section>' +
        '<section class="wrap sec--tight"><div class="grid">' +
          '<div class="c-7" data-reveal><p class="smcp mute">Abstract</p><p class="lede dropcap mt-s">' + e(p.abstract || p.summary || '') + '</p></div>' +
          '<div class="c-4 s-9" data-reveal style="--d:2"><table class="tab cs-spec"><tbody>' + rows + '</tbody></table><p class="note mt-s"><b>Table 1.</b> Project facts.</p></div>' +
        '</div></section>' + partsHtml + galHtml + linksHtml +
        '<section class="wrap sec"><div class="sec-head"><span class="sec-head__no">&rarr;</span><h2 class="sec-head__title h3">Next plate</h2><p class="sec-head__intro"><a class="link link--arrow" href="work.html">All work</a></p></div>' +
          '<div class="grid"><div class="c-8">' + R.plate(next, { no: idx(next), ar: '16/9', role: true }) + '</div>' +
          '<div class="c-4 cs-cta" data-reveal><p class="h3">Want something <em>like this?</em></p><p class="mt-s"><a class="btn" href="contact.html">Start a project</a></p></div></div></section>';
      NEXT.init(root);

      /* figure lightbox */
      var gi = 0, dlg;
      function showFig(n) {
        gi = (n + gal.length) % gal.length; var g = gal[gi];
        var m = g.src ? '<img src="' + e(g.src) + '" alt="' + e(g.alt || '') + '">' : NEXT.art.cover({ slug: p.slug + '-g' + gi, motif: g.art && g.art.motif, palette: g.art && g.art.palette });
        dlg.querySelector('.lightbox__media').innerHTML = m;
        dlg.querySelector('.cs-lb__cap').innerHTML = '<b>Fig. ' + (gi + 2) + '.</b> ' + e(g.caption || '');
      }
      function openFig(n, opener) {
        dlg = d.createElement('dialog'); dlg.className = 'lightbox'; dlg.setAttribute('aria-label', p.title + ' figures');
        dlg.innerHTML = '<div class="lightbox__box"><button class="lightbox__x" type="button" data-close>Close</button><div class="lightbox__media cs-lb__media"></div>' +
          '<div class="lightbox__bar"><span class="cs-lb__cap"></span><span class="cs-lb__nav"><button type="button" class="link" data-prev>&larr; Prev</button> &nbsp; <button type="button" class="link" data-next>Next &rarr;</button></span></div></div>';
        d.body.appendChild(dlg); showFig(n);
        dlg.addEventListener('click', function (ev) {
          if (ev.target === dlg || ev.target.hasAttribute('data-close')) dlg.close();
          else if (ev.target.hasAttribute('data-prev')) showFig(gi - 1); else if (ev.target.hasAttribute('data-next')) showFig(gi + 1);
        });
        dlg.addEventListener('keydown', function (ev) { if (ev.key === 'ArrowLeft') showFig(gi - 1); if (ev.key === 'ArrowRight') showFig(gi + 1); });
        dlg.addEventListener('close', function () { dlg.remove(); opener && opener.focus && opener.focus(); });
        dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
      }
      root.addEventListener('click', function (ev) { var b = ev.target.closest('[data-gal]'); if (b) openFig(parseInt(b.getAttribute('data-gal'), 10), b); });
    }
  }
})();
