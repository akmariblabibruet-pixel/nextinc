/* career.html · apply.html · contact.html — owned by S6.
   Needs core.js (NEXT.$, NEXT.$$, NEXT.esc), data/site.js (NEXT.site.email) and data/roles.js (NEXT.roles), loaded first.

   What it does
   - Sends both forms to Web3Forms exactly like the old pages did: POST https://api.web3forms.com/submit, FormData body,
     Accept: application/json, success = data.success. The access key and every field name stay in the HTML.
   - Checks required / email / link fields itself so each error sits under its field, is linked with aria-describedby,
     and is summarised in a role="alert" line. (`novalidate` is set here, so without JS the browser's own checks still run.)
   - Disables the button while sending, shows the owner's original success / error copy (data-ok / data-err on the form).
   - apply.html: pre-fills the role from ?role=<slug>.
   - Keeps the public email in one place (NEXT.site.email) for every [data-site-email] link. */
(function () {
  'use strict';
  var NEXT = (window.NEXT = window.NEXT || {}), d = document, $ = NEXT.$, $$ = NEXT.$$, esc = NEXT.esc;
  var ENDPOINT = 'https://api.web3forms.com/submit';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mail = NEXT.site && NEXT.site.email;

  /* ---- small helpers ---- */
  function syncShared() {
    if (mail) $$('[data-site-email]').forEach(function (a) { a.textContent = mail; if (a.tagName === 'A') a.href = 'mailto:' + mail; });
    $$('[data-today]').forEach(function (el) {
      try { el.textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (x) {}
    });
  }
  function titleHtml(t) {            /* last word of the role title is the crimson italic one */
    var w = t.split(' '), last = w.pop();
    return (w.length ? esc(w.join(' ')) + ' ' : '') + '<em>' + esc(last) + '</em>';
  }

  /* ---- apply.html: role from the query string ---- */
  function initRole() {
    var form = $('#apply-form'); if (!form) return;
    var slug = ''; try { slug = new URLSearchParams(location.search).get('role') || ''; } catch (x) {}
    var hit = NEXT.roles.filter(function (r) { return r.slug === slug; })[0], r = hit || NEXT.roles[0];

    form.elements['role'].value = r.title;
    form.elements['subject'].value = 'New Application: ' + r.title;
    var h = $('[data-role-title]'); if (h) h.innerHTML = titleHtml(r.title);
    $$('[data-role-short]').forEach(function (x) { x.textContent = r.title; });
    var s = $('[data-role-summary]'); if (s) s.textContent = r.summary;
    var t = $('[data-role-text]'); if (t) t.textContent = r.text;
    var g = $('[data-role-tags]'); if (g) g.innerHTML = r.tags.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    d.title = 'Apply — ' + r.title + ' — Next Inc.';

    var note = $('#role-note');       /* a ?role= we do not know: say so instead of silently picking one */
    if (note && slug && !hit) {
      note.innerHTML = '<b>&dagger;</b> We could not match that role link, so this form is for <b>' + esc(r.title) + '</b>. <a class="link" href="career.html">See all open roles</a>.';
      note.hidden = false;
    }
  }

  /* ---- validation ---- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function normUrl(v) {              /* "behance.net/me" -> "https://behance.net/me"; anything with a scheme is left alone */
    v = v.trim();
    if (/^[a-z][a-z0-9+.\-]*:/i.test(v)) return v;
    return /^[^\s]+\.[^\s]{2,}$/.test(v) ? 'https://' + v : v;
  }
  function validUrl(v) { try { return /^https?:$/.test(new URL(v).protocol); } catch (x) { return false; } }
  function check(inp) {
    var v = (inp.value || '').trim();
    if (inp.required && !v) return inp.getAttribute('data-required') || 'Please fill this in.';
    if (v && inp.type === 'email' && !EMAIL.test(v)) return 'That does not look like an email address.';
    if (v && inp.type === 'url' && !validUrl(normUrl(v))) return 'Please enter a link, for example https://example.com.';
    return '';
  }
  function labelOf(field) {
    var sp = field.querySelector('span'); return sp ? (sp.childNodes[0] ? sp.childNodes[0].textContent : sp.textContent).trim() : '';
  }
  function describe(inp, id, on) {
    var ids = (inp.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (x) { return x && x !== id; });
    if (on) ids.push(id);
    if (ids.length) inp.setAttribute('aria-describedby', ids.join(' ')); else inp.removeAttribute('aria-describedby');
  }
  function mark(field, inp, msg) {
    var id = inp.id + '-err', err = d.getElementById(id);
    if (!msg) {
      if (err) err.remove();
      field.classList.remove('is-invalid'); inp.removeAttribute('aria-invalid'); describe(inp, id, false); return;
    }
    if (!err) { err = d.createElement('p'); err.className = 'field__err'; err.id = id; field.parentNode.insertBefore(err, field.nextSibling); }
    err.textContent = msg; field.classList.add('is-invalid'); inp.setAttribute('aria-invalid', 'true'); describe(inp, id, true);
  }
  function fieldsOf(form) {
    return $$('.field', form).map(function (f) { return { f: f, i: $('input,textarea,select', f) }; }).filter(function (x) { return x.i; });
  }

  /* ---- form engine ---- */
  function initForm(form) {
    var btn = $('[type="submit"]', form), ok = $('.form-msg--ok', form), bad = $('.form-msg--err', form);
    if (!btn || !ok || !bad) return;
    var label = btn.textContent;
    form.noValidate = true;

    function say(kind, text) {
      ok.textContent = ''; bad.textContent = '';
      if (kind === 'ok') ok.textContent = text;
      else if (kind === 'fail') bad.innerHTML = esc(text) + (mail ? ' at <a class="link" href="mailto:' + esc(mail) + '">' + esc(mail) + '</a>' : '') + '.';
      else if (kind === 'check') bad.textContent = text;
      if (kind !== 'clear' && !reduce) { try { (kind === 'ok' ? ok : bad).scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (x) {} }
    }
    function clearAll() { fieldsOf(form).forEach(function (x) { mark(x.f, x.i, ''); }); say('clear'); }

    /* fix a field as soon as the visitor fixes the text */
    function recheck(ev) {
      var f = ev.target.closest && ev.target.closest('.field'); if (!f || !f.classList.contains('is-invalid')) return;
      var inp = $('input,textarea,select', f); if (!inp) return;
      mark(f, inp, check(inp));
      if (!$('.is-invalid', form)) bad.textContent = '';
    }
    form.addEventListener('input', recheck); form.addEventListener('change', recheck);

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (form.getAttribute('aria-busy') === 'true') return;
      ok.textContent = ''; bad.textContent = '';

      var first = null, names = [];
      fieldsOf(form).forEach(function (x) {
        var msg = check(x.i); mark(x.f, x.i, msg);
        if (msg) { names.push(labelOf(x.f)); if (!first) first = x.i; }
      });
      if (first) { say('check', 'Please check ' + (names.length === 1 ? 'this field' : 'these fields') + ': ' + names.join(', ') + '.'); first.focus(); return; }

      /* the copy that is sent — the visible inputs are never rewritten */
      var fd = new FormData(form);
      $$('input[type="url"]', form).forEach(function (u) { if (u.value.trim()) fd.set(u.name, normUrl(u.value)); });
      if (form.hasAttribute('data-subject') && !String(fd.get('subject') || '').trim()) {
        var kind = fd.get('project_type'); fd.set('subject', form.getAttribute('data-subject') + (kind ? ' — ' + kind : ''));
      }
      if (fd.has('budget') && !String(fd.get('budget')).trim()) fd.delete('budget');

      btn.disabled = true; btn.textContent = form.getAttribute('data-sending') || 'Sending…'; form.setAttribute('aria-busy', 'true');
      fetch(ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json' }, body: fd })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.success) { form.reset(); clearAll(); say('ok', form.getAttribute('data-ok') || 'Thank you.'); }
          else say('fail', form.getAttribute('data-err') || 'Something went wrong. Please try again or email us directly');
        })
        .catch(function () { say('fail', form.getAttribute('data-err') || 'Something went wrong. Please try again or email us directly'); })
        .then(function () { btn.disabled = false; btn.textContent = label; form.removeAttribute('aria-busy'); });
    });
  }

  /* Runs right away (this script sits at the end of <body>), i.e. before core.js splits the headline into words —
     so the role title written by initRole() still gets the word-rise. */
  syncShared(); initRole(); $$('form[data-form]').forEach(initForm);
})();
