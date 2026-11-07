/* preview.js — hover loops on plates. Owned by S10. No dependencies, budget 1.2 KB minified.
   NEXT.preview.bind(root) arms every plate in `root` whose project has `preview: { mp4, webm }` (see projects.js)
   and returns how many it armed (0 on touch, reduced motion or Save-Data, so callers can skip hints).
   The <video> is created once, on the first hover or keyboard focus, and never before. */
(function () {
  var N = (window.NEXT = window.NEXT || {}), m = window.matchMedia, cur;
  function off(s) { clearTimeout(s.t); if (s.v) { s.v.pause(); s.v.classList.remove('is-on'); } }
  N.preview = {
    bind: function (root) {
      var c = navigator.connection, n = 0;
      if (!m || !m('(hover:hover) and (pointer:fine)').matches || m('(prefers-reduced-motion:reduce)').matches || (c && c.saveData)) return 0;
      [].forEach.call(root.querySelectorAll('a.plate[href*="?p="]'), function (a) {
        var k = decodeURIComponent(a.search.slice(3)), s = {}, f = a.querySelector('.plate__frame'),
            p = (N.projects || []).filter(function (x) { return x.slug === k; })[0], u = p && p.preview;
        if (!u) return;
        n++;
        function on() {
          clearTimeout(s.t);
          s.t = setTimeout(function () {
            if (cur && cur !== s) off(cur);
            cur = s;
            var v = s.v;
            if (!v) {
              v = s.v = document.createElement('video');
              v.className = 'plate__preview'; v.muted = v.loop = v.playsInline = true; v.preload = 'none'; v.tabIndex = -1;
              v.ariaHidden = 'true';
              v.innerHTML = (u.webm ? '<source src="' + N.esc(u.webm) + '" type="video/webm">' : '') + (u.mp4 ? '<source src="' + N.esc(u.mp4) + '" type="video/mp4">' : '');
              v.onplaying = function () { v.classList.add('is-on'); };
              f.appendChild(v);
            }
            v.play().catch(function () {});
          }, 120);
        }
        a.onpointerenter = on; a.onpointerleave = a.onblur = function () { off(s); };
        a.onfocus = function () { if (a.matches(':focus-visible')) on(); };
      });
      return n;
    }
  };
})();
