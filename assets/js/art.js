/* ==========================================================================
   art.js — generative covers, hero figure and hubs map. Owned by S1.
   Every project/film gets a unique duotone cover from (slug, palette, motif),
   so the site looks finished even before real screenshots exist.
   API:  NEXT.art.cover(item)  -> <div class="cover"> SVG string
         NEXT.art.reel()       -> hero "oscilloscope" figure (SVG string)
         NEXT.art.map(hubs)    -> hubs figure (SVG string)
   ========================================================================== */
(function () {
  'use strict';
  var NEXT = (window.NEXT = window.NEXT || {});

  var PAL = {
    crimson: { bg: '#C0102C', fg: '#F5F0E6', ac: '#16120E' },
    ink:     { bg: '#16120E', fg: '#F5F0E6', ac: '#FF4660' },
    indigo:  { bg: '#24307A', fg: '#F5F0E6', ac: '#E8B04A' },
    ochre:   { bg: '#D9A441', fg: '#16120E', ac: '#C0102C' },
    forest:  { bg: '#1F5D49', fg: '#F5F0E6', ac: '#E8B04A' },
    paper:   { bg: '#E6DDCB', fg: '#16120E', ac: '#C0102C' }
  };

  /* seeded random so a project always gets the same art */
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var a = seed; return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function f(n) { return Math.round(n * 10) / 10; }

  var MOTIFS = {
    /* constellation — AI / agents */
    nodes: function (r, P) {
      var pts = [], i, j, s = '';
      for (i = 0; i < 28; i++) pts.push([70 + r() * 660, 60 + r() * 480, r()]);
      for (i = 0; i < pts.length; i++) {
        var d = pts.map(function (q, k) { return [k, Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1])]; }).sort(function (a, b) { return a[1] - b[1]; });
        for (j = 1; j <= 2; j++) { var q = pts[d[j][0]]; s += '<line x1="' + f(pts[i][0]) + '" y1="' + f(pts[i][1]) + '" x2="' + f(q[0]) + '" y2="' + f(q[1]) + '" stroke="' + P.fg + '" stroke-opacity=".28"/>'; }
      }
      for (i = 0; i < pts.length; i++) s += '<circle cx="' + f(pts[i][0]) + '" cy="' + f(pts[i][1]) + '" r="' + f(2.5 + pts[i][2] * 5) + '" fill="' + (pts[i][2] > .8 ? P.ac : P.fg) + '"/>';
      s += '<g class="drift"><circle cx="400" cy="300" r="250" fill="none" stroke="' + P.ac + '" stroke-width="2" stroke-dasharray="2 14" stroke-linecap="round"/></g>';
      s += '<g class="drift drift--r"><circle cx="400" cy="300" r="170" fill="none" stroke="' + P.fg + '" stroke-opacity=".5" stroke-dasharray="1 9"/></g>';
      return s;
    },
    /* orbits — research */
    orbits: function (r, P) {
      var s = '', i, cx = 400 + (r() - .5) * 120, cy = 300 + (r() - .5) * 80;
      for (i = 0; i < 8; i++) {
        var rx = 70 + i * 46, ry = rx * (.42 + r() * .25), rot = r() * 180;
        s += '<g class="drift' + (i % 2 ? ' drift--r' : '') + '"><g transform="rotate(' + f(rot) + ' ' + f(cx) + ' ' + f(cy) + ')"><ellipse cx="' + f(cx) + '" cy="' + f(cy) + '" rx="' + f(rx) + '" ry="' + f(ry) + '" fill="none" stroke="' + P.fg + '" stroke-opacity="' + f(.7 - i * .06) + '" stroke-width="1.2"/>' +
          '<circle cx="' + f(cx + rx * Math.cos(r() * 6.28)) + '" cy="' + f(cy + ry * Math.sin(r() * 6.28)) + '" r="' + f(4 + r() * 5) + '" fill="' + (i % 3 === 0 ? P.ac : P.fg) + '"/></g></g>';
      }
      return s + '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="26" fill="' + P.ac + '"/>';
    },
    /* data bars with a sun */
    bars: function (r, P) {
      var s = '', i, n = 30, ph = r() * 6;
      s += '<circle cx="' + f(480 + r() * 160) + '" cy="' + f(170 + r() * 60) + '" r="120" fill="' + P.ac + '"/>';
      for (i = 0; i < n; i++) {
        var h = 90 + 250 * Math.abs(Math.sin(i * .33 + ph) * .7 + Math.sin(i * .9 + ph * 2) * .3) + r() * 30;
        s += '<rect x="' + f(36 + i * 25) + '" y="' + f(560 - h) + '" width="15" height="' + f(h) + '" fill="' + P.fg + '" fill-opacity="' + (i % 7 === 3 ? 1 : .82) + '"/>';
      }
      return s + '<line x1="20" y1="560" x2="780" y2="560" stroke="' + P.fg + '" stroke-width="2"/>';
    },
    /* stacked sine lines — signals */
    waves: function (r, P) {
      var s = '', i, x, k, rows = 15;
      for (i = 0; i < rows; i++) {
        var y0 = 50 + i * (500 / rows), A = 6 + r() * 34, fr = .008 + r() * .014, ph = r() * 6.28, d = '';
        for (x = -10; x <= 810; x += 8) d += (x < 0 ? 'M' : 'L') + x + ' ' + f(y0 + A * Math.sin(x * fr + ph) * Math.sin(x * .004 + i));
        s += '<path d="' + d + '" fill="none" stroke="' + (i === 7 ? P.ac : P.fg) + '" stroke-opacity="' + (i === 7 ? 1 : f(.25 + i / rows * .55)) + '" stroke-width="' + (i === 7 ? 3.5 : 1.3) + '"/>';
      }
      return s;
    },
    /* Truchet tiles — web / UI */
    tiles: function (r, P) {
      var s = '', i, j, c = 100;
      for (i = 0; i < 8; i++) for (j = 0; j < 6; j++) {
        var x = i * c, y = j * c, k = Math.floor(r() * 4), t = r(), fill = t < .42 ? P.fg : (t < .62 ? P.ac : 'none');
        if (fill === 'none') { s += '<circle cx="' + (x + 50) + '" cy="' + (y + 50) + '" r="5" fill="' + P.fg + '" fill-opacity=".45"/>'; continue; }
        s += '<path transform="rotate(' + k * 90 + ' ' + (x + 50) + ' ' + (y + 50) + ')" d="M' + x + ' ' + y + 'L' + (x + c) + ' ' + y + 'A' + c + ' ' + c + ' 0 0 1 ' + x + ' ' + (y + c) + 'Z" fill="' + fill + '" stroke="' + fill + '" stroke-width=".8"/>';
      }
      return s;
    },
    /* half-sun rings */
    rings: function (r, P) {
      var s = '', i, cx = 400 + (r() - .5) * 200;
      for (i = 11; i >= 0; i--) s += '<circle cx="' + f(cx) + '" cy="600" r="' + (46 + i * 46) + '" fill="' + (i % 4 === 0 ? P.ac : 'none') + '" stroke="' + P.fg + '" stroke-opacity="' + f(.9 - i * .05) + '" stroke-width="' + (i % 4 === 0 ? 0 : 1.6) + '"/>';
      return s + '<g class="drift"><circle cx="' + f(cx) + '" cy="600" r="150" fill="none" stroke="' + P.fg + '" stroke-dasharray="1 10" stroke-linecap="round" stroke-width="3"/></g>';
    }
  };

  NEXT.art = {
    palettes: PAL,
    cover: function (item) {
      var P = PAL[item.palette] || PAL.ink, key = item.slug || item.id || item.title || 'x';
      var m = MOTIFS[item.motif] || MOTIFS.nodes, r = rng(hash(key));
      return '<div class="cover" style="--cv-bg:' + P.bg + '" aria-hidden="true"><svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" focusable="false">' +
        '<rect width="800" height="600" fill="' + P.bg + '"/>' + m(r, P) + '</svg></div>';
    },

    /* hero figure: Lissajous curves on an oscilloscope graticule, dark */
    reel: function () {
      var s = '<svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" focusable="false" aria-hidden="true"><rect width="1200" height="520" fill="#0F0D0C"/>', i, x, y, k, t;
      for (x = 0; x <= 1200; x += 60) s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="520" stroke="#F1EADB" stroke-opacity="' + (x % 300 === 0 ? .16 : .07) + '"/>';
      for (y = 0; y <= 520; y += 52) s += '<line x1="0" y1="' + y + '" x2="1200" y2="' + y + '" stroke="#F1EADB" stroke-opacity="' + (y % 260 === 0 ? .16 : .07) + '"/>';
      for (x = 0; x <= 1200; x += 12) s += '<line x1="' + x + '" y1="256" x2="' + x + '" y2="' + (x % 60 === 0 ? 266 : 261) + '" stroke="#F1EADB" stroke-opacity=".3"/>';
      var specs = [[3, 2, 0, 230, 200], [5, 4, .6, 250, 170], [3, 4, 1.2, 210, 220], [2, 3, 2.1, 270, 150], [5, 6, .3, 190, 230], [4, 5, 1.7, 240, 190], [7, 6, .9, 160, 160]];
      for (k = 0; k < specs.length; k++) {
        var a = specs[k][0], b = specs[k][1], ph = specs[k][2], A = specs[k][3], B = specs[k][4], d = '';
        for (i = 0; i <= 420; i++) { t = i / 420 * Math.PI * 2; d += (i ? 'L' : 'M') + f(600 + A * 2.1 * Math.sin(a * t + ph)) + ' ' + f(260 + B * Math.sin(b * t)); }
        s += '<g class="drift' + (k % 2 ? ' drift--r' : '') + '" style="animation-duration:' + (50 + k * 17) + 's"><path d="' + d + '" fill="none" stroke="' + (k === 1 || k === 4 ? '#FF4660' : '#F1EADB') + '" stroke-opacity="' + (k === 1 || k === 4 ? .95 : .34) + '" stroke-width="' + (k === 1 ? 2 : 1) + '"/></g>';
      }
      return s + '</svg>';
    },

    /* hubs figure: dot-matrix world (NEXT.world mask) + two hubs joined by an arc */
    map: function (hubs, world) {
      var W = 1000, K = W / 360, H = Math.round(134 * K) + 8, s, i, c, d = '';
      function X(lon) { return (lon + 180) * K; } function Y(lat) { return (world ? world.lat0 : 78) - lat; }
      function yy(lat) { return Y(lat) * K + 4; }
      s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Map of our two hubs: Pennsylvania, USA and Rajshahi, Bangladesh" focusable="false">';
      for (i = -150; i <= 150; i += 30) s += '<line x1="' + f(X(i)) + '" y1="0" x2="' + f(X(i)) + '" y2="' + H + '" stroke="#16120E" stroke-opacity=".07"/>';
      if (world) {
        for (i = 0; i < world.rows; i++) {
          var row = world.hex[i], bits = '';
          for (c = 0; c < row.length; c++) bits += ('000' + parseInt(row[c], 16).toString(2)).slice(-4);
          for (c = 0; c < world.cols; c++) if (bits[c] === '1') d += 'M' + f(X(world.lon0 + c * world.step + world.step / 2)) + ' ' + f(yy(world.lat0 - i * world.step)) + 'h0';
        }
        s += '<path class="land" d="' + d + '"/>';
      }
      var a = hubs[0], b = hubs[1], ax = X(a.lon), ay = yy(a.lat), bx = X(b.lon), by = yy(b.lat);
      s += '<path class="arc" d="M' + f(ax) + ' ' + f(ay) + ' Q' + f((ax + bx) / 2) + ' ' + f(Math.min(ay, by) - 110) + ' ' + f(bx) + ' ' + f(by) + '" fill="none" stroke="#C0102C" stroke-width="2.2" stroke-linecap="round"/>';
      [[a, ax, ay], [b, bx, by]].forEach(function (h) {
        var hub = h[0], x0 = h[1], y0 = h[2];
        s += '<circle cx="' + f(x0) + '" cy="' + f(y0) + '" r="15" fill="#C0102C" fill-opacity=".16"/><circle cx="' + f(x0) + '" cy="' + f(y0) + '" r="6" fill="#C0102C"/>' +
          '<rect x="' + f(x0 - 74) + '" y="' + f(y0 + 16) + '" width="148" height="46" fill="#F5F0E6" fill-opacity=".92"/>' +
          '<text x="' + f(x0) + '" y="' + f(y0 + 38) + '" text-anchor="middle" font-family="CMU Serif,Georgia,serif" font-weight="700" font-size="21" fill="#16120E">' + (hub.label || hub.name.split(',')[0]) + '</text>' +
          '<text x="' + f(x0) + '" y="' + f(y0 + 55) + '" text-anchor="middle" font-family="CMU Typewriter Text,monospace" font-size="12" fill="#6B6254">' + Math.abs(hub.lat).toFixed(1) + '°' + (hub.lat >= 0 ? 'N' : 'S') + ' ' + Math.abs(hub.lon).toFixed(1) + '°' + (hub.lon >= 0 ? 'E' : 'W') + '</text>';
      });
      return s + '</svg>';
    }
  };
})();
