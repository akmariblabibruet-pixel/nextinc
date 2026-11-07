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
      if (NEXT.preview) { NEXT.preview.bind(lead); NEXT.preview.bind(list); }   /* S10: hover loops, only for projects that have `preview` */
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
      d.documentElement.classList.add('case-ready');
    } else {
      var i = idx(p);
      var pf = (NEXT.films || []).filter(function (f) { return f.project === p.slug && f.id !== p.video; });   /* films of this project, array order */
      var lead = (NEXT.films || []).filter(function (f) { return f.id === p.video; })[0];
      if (lead) pf.unshift(lead);
      var film = pf[0];                                                                                         /* the hero film */
      function safe(u) { return /^https?:\/\//i.test(u || ''); }
      var base = ((NEXT.site && NEXT.site.url) || location.origin).replace(/\/+$/, '');      /* the public address, not localhost or a preview host */
      var url = base + '/project.html?p=' + encodeURIComponent(p.slug);
      d.title = p.title + ' — case study — Next Inc.';
      setMeta('meta[name=description]', 'content', p.summary || '');
      setMeta('link[rel=canonical]', 'href', url, { tag: 'link', attrs: { rel: 'canonical', href: url } });
      setMeta('meta[property="og:title"]', 'content', p.title + ' — Next Inc.', { tag: 'meta', attrs: { property: 'og:title', content: '' } });
      setMeta('meta[property="og:description"]', 'content', p.summary || '', { tag: 'meta', attrs: { property: 'og:description', content: '' } });
      setMeta('meta[property="og:url"]', 'content', url, { tag: 'meta', attrs: { property: 'og:url', content: '' } });
      setMeta('meta[name="twitter:title"]', 'content', p.title + ' — Next Inc.', { tag: 'meta', attrs: { name: 'twitter:title', content: '' } });
      setMeta('meta[name="twitter:description"]', 'content', p.summary || '', { tag: 'meta', attrs: { name: 'twitter:description', content: '' } });
      if (p.cover && /^assets\//.test(p.cover)) {          /* a project's own cover makes a better share card than the default one */
        setMeta('meta[property="og:image"]', 'content', base + '/' + p.cover, { tag: 'meta', attrs: { property: 'og:image', content: '' } });
        setMeta('meta[name="twitter:image"]', 'content', base + '/' + p.cover, { tag: 'meta', attrs: { name: 'twitter:image', content: '' } });
        ['og:image:width', 'og:image:height'].forEach(function (k) { var m = d.querySelector('meta[property="' + k + '"]'); if (m) m.remove(); });   /* size of the default card no longer applies */
      }

      /* width/height only tell the browser the frame's ratio; the image fills the frame, so nothing can shift. The hero is the one eager image. */
      function pic(src, w, h, eager) { return '<img src="' + e(src) + '" alt="" width="' + w + '" height="' + h + '"' + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">'; }
      var logo = p.logo ? '<img class="plate__logo" src="' + e(p.logo) + '" alt="' + e(p.title) + ' logo" width="512" height="512">' : '';
      var hero;
      if (film) {
        /* the film's poster carries its own branding, so the project logo is only added when we fall back to the cover or generated art */
        var fm = film.poster ? pic(film.poster, 1600, 900, true) : (p.cover ? pic(p.cover, 1600, 900, true) : NEXT.art.cover(p)) + logo;
        var ft = film.title.indexOf(p.title) === 0 ? e(film.title) : e(p.title) + ' &mdash; ' + e(film.title);   /* do not repeat the project name */
        hero = '<button type="button" class="plate cs-plate" data-film="' + e(film.id) + '" data-cursor="Play" aria-label="Play film: ' + e(film.title + (film.duration ? ', ' + film.duration : '')) + '"><span class="plate__frame" style="--ar:16/9">' + fm +
          '<span class="film__play" aria-hidden="true"></span><span class="film__time">' + e(film.duration || '') + '</span></span></button>' +
          '<figcaption class="cap"><span class="cap__text"><b>Fig. 1.</b> ' + ft + '.</span></figcaption>';
      } else {
        hero = '<div class="plate cs-plate"><span class="plate__frame" style="--ar:21/9">' + (p.cover ? pic(p.cover, 2100, 900, true) : NEXT.art.cover(p)) + logo + '</span></div>' +
          '<figcaption class="cap"><span class="cap__text"><b>Fig. 1.</b> ' + e(p.title) + (p.year ? ', ' + e(p.year) : '') + '.</span></figcaption>';
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
          var m = g.src ? '<img src="' + e(g.src) + '" alt="' + e(g.alt || '') + '" width="1600" height="1000" loading="lazy" decoding="async">' : NEXT.art.cover({ slug: p.slug + '-g' + k, motif: g.art && g.art.motif, palette: g.art && g.art.palette });
          return '<figure class="c-6" data-reveal style="--d:' + (k % 2) + '"><button type="button" class="plate cs-plate" data-gal="' + k + '" data-cursor="View" aria-label="Open figure ' + (k + 2) + '"><span class="plate__frame" style="--ar:16/10">' + m + '</span></button>' +
            '<figcaption class="cap"><span class="cap__text"><b>Fig. ' + (k + 2) + '.</b> ' + e(g.caption || '') + '</span></figcaption></figure>';
        }).join('') + '</div></section>' : '';

      /* Films: a list only when there are two or more (with one, the hero already is the film). Rows open the lightbox. */
      var filmsHtml = pf.length > 1 ? '<section class="wrap sec--tight cs-films"><div class="sec-head"><span class="sec-head__no">&para;</span><h2 class="sec-head__title h3">Films</h2></div>' +
        '<div class="grid"><div class="c-8">' + R.reel(pf) + '</div></div></section>' : '';

      /* Extra sections: plain editorial blocks. A block with no title, or with neither text nor list, is skipped. */
      var secs = (p.sections || []).map(function (s) {
        var body = [].concat(s && s.body != null ? s.body : []).filter(Boolean), items = ((s && s.list) || []).filter(Boolean);
        if (!s || !s.title || (!body.length && !items.length)) return '';
        return '<div class="cs-sec"><h2 class="h3">' + e(s.title) + '</h2>' + body.map(function (t) { return '<p>' + e(t) + '</p>'; }).join('') +
          (items.length ? '<ul class="cs-list">' + items.map(function (t) { return '<li>' + e(t) + '</li>'; }).join('') + '</ul>' : '') + '</div>';
      }).filter(Boolean);
      var secsHtml = secs.length ? '<section class="wrap sec--tight"><div class="grid"><div class="c-7" data-reveal>' + secs.join('') + '</div></div></section>' : '';

      /* Links: one button per key; nothing at all when there are none. Only http(s) addresses are rendered. */
      var L = p.links || {}, links = '';
      function btn(cls, href, label) { return '<a class="btn ' + cls + '" href="' + e(href) + '" target="_blank" rel="noopener">' + e(label) + '</a>'; }
      if (safe(L.live)) links += btn('', L.live, 'Visit');
      if (safe(L.repo)) links += btn('btn--ghost', L.repo, 'View on GitHub');
      if (safe(L.docs)) links += btn('btn--ghost', L.docs, 'Documentation');
      (L.more || []).forEach(function (m) { if (m && m.label && safe(m.url)) links += btn('btn--ghost', m.url, m.label); });
      var linksHtml = links ? '<div class="flex cs-links">' + links + '</div>' : '';   /* sits under the abstract */
      var dev = p.status === 'coming-soon' ? '<p class="note cs-dev"><b>&dagger; In development.</b> This project has not launched yet. We will publish the full case study when it does.</p>' : '';
      /* the next two or three other projects, in order, wrapping round at the end; small plates that show the whole cover */
      var others = [], q;
      for (var n = 1; n < all.length && others.length < 3; n++) { q = all[(i - 1 + n) % all.length]; if (q !== p) others.push(q); }
      var nextHtml = others.map(function (q, k) { return '<div class="c-4">' + R.plate(q, { no: idx(q), ar: '16/9', fit: true, role: false, delay: k }) + '</div>'; }).join('');
      var specHtml = rows ? '<div class="c-4 s-9" data-reveal style="--d:2"><table class="tab cs-spec"><tbody>' + rows + '</tbody></table><p class="note mt-s"><b>Table 1.</b> Project facts.</p></div>' : '';

      root.innerHTML =
        '<section class="wrap page-head cs-head">' +
          '<p class="crumbs"><a href="work.html">Work</a><span>/</span><span class="cur">' + e(p.title) + '</span></p>' +
          (p.sample ? '<p class="cs-sample">Sample case study &mdash; placeholder content</p>' : '') +
          '<div class="cs-title"><h1 class="h1">' + e(p.title) + '</h1>' + chip + '</div>' +
          '<p class="lede">' + e(p.summary || '') + '</p>' + dev + '</section>' +
        '<section class="wrap"><figure class="cs-hero" data-reveal>' + hero + '</figure></section>' +
        '<section class="wrap sec--tight"><div class="grid">' +
          '<div class="c-7" data-reveal><p class="smcp mute">Abstract</p><p class="lede dropcap mt-s">' + e(p.abstract || p.summary || '') + '</p>' + linksHtml + '</div>' + specHtml +
        '</div></section>' + partsHtml + filmsHtml + galHtml + secsHtml +
        '<section class="wrap sec"><div class="sec-head"><span class="sec-head__no">&rarr;</span><h2 class="sec-head__title h3">Next plates</h2><p class="sec-head__intro"><a class="link link--arrow" href="work.html">All work</a></p></div>' +
          '<div class="grid cs-next">' + nextHtml + '</div>' +
          '<div class="cs-more" data-reveal><p class="h3">Want something <em>like this?</em></p><a class="btn" href="contact.html">Start a project</a></div></section>';
      NEXT.init(root);
      d.documentElement.classList.add('case-ready');   /* see work.css: the footer waits for the case study so it is not pushed down */

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
