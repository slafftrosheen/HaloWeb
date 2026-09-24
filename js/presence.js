/* Halo Presence — canvas port of app/ui/presence/HaloOrb.kt.
 *
 * Geometry and motion are translated 1:1 from the Kotlin renderer:
 *  - 7 rounded cells in normalized coordinates (pearlCells)
 *  - radial-gradient matte body, soft ground shadow
 *  - state-driven shift target with a 280ms tween (0ms when motion is reduced)
 *  - a short "light-break" line on the upper-right edge, never a progress ring
 *
 * Cell colors come from the page CSS custom properties (--cell-a…--cell-f),
 * so the presence re-themes itself with the page. No idle animation runs:
 * the render loop stops when the cluster is settled and the state is static.
 */
(function () {
  'use strict';

  // Normalized cell rects, identical to pearlCells in HaloOrb.kt.
  var PEARL_CELLS = [
    [0.24, 0.22, 0.42, 0.40],
    [0.47, 0.18, 0.65, 0.36],
    [0.68, 0.34, 0.80, 0.48],
    [0.19, 0.46, 0.37, 0.63],
    [0.42, 0.43, 0.62, 0.61], // central volume — drawn more translucent
    [0.64, 0.56, 0.78, 0.73],
    [0.35, 0.67, 0.54, 0.81]
  ];

  var STATES = {
    ready:      { label: 'Ready',        shift: 0,     dynamic: false },
    capturing:  { label: 'Capturing',    shift: 0,     dynamic: true,  envelope: 'input' },
    recognizing:{ label: 'Recognizing',  shift: -0.035,dynamic: false },
    reasoning:  { label: 'Reasoning',    shift: 0.025, dynamic: false },
    executing:  { label: 'Executing',    shift: 0.035, dynamic: false },
    speaking:   { label: 'Speaking',     shift: 0.018, dynamic: true,  envelope: 'output' }
  };

  var TWEEN_MS = 280; // matches tween(280) in HaloOrb.kt

  function Presence(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = 'ready';
    this.source = 'Phone';
    this.shift = 0;
    this.shiftFrom = 0;
    this.shiftTo = 0;
    this.tweenStart = 0;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.raf = 0;
    this.vars = null;
    this.refreshTheme();
    this.render();
  }

  Presence.prototype.refreshTheme = function () {
    var s = getComputedStyle(document.documentElement);
    this.vars = {
      surface: s.getPropertyValue('--surface').trim() || '#FFFFFF',
      ink: s.getPropertyValue('--text').trim() || '#182033',
      cells: ['--cell-a', '--cell-b', '--cell-c', '--cell-d', '--cell-e', '--cell-f']
        .map(function (v) { return s.getPropertyValue(v).trim() || '#CCCCCC'; })
    };
    // Re-draw immediately: the loop is usually stopped when settled, so a theme
    // switch would otherwise leave the old palette on screen until the next state.
    this.render();
  };

  Presence.prototype.setState = function (key, source) {
    if (!STATES[key]) return;
    this.state = key;
    if (typeof source === 'string' && source) this.source = source;
    var target = STATES[key].shift;
    if (this.reducedMotion) {
      this.shift = target;
      this.stopLoop();
      this.render();
      return;
    }
    this.shiftFrom = this.shift;
    this.shiftTo = target;
    this.tweenStart = performance.now();
    this.startLoop();
  };

  Presence.prototype.startLoop = function () {
    if (this.raf) return;
    var self = this;
    function frame(now) {
      self.raf = requestAnimationFrame(frame);
      self.tick(now);
    }
    this.raf = requestAnimationFrame(frame);
  };

  Presence.prototype.stopLoop = function () {
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
  };

  Presence.prototype.tick = function (now) {
    var st = STATES[this.state];
    var t;

    if (this.tweenStart && now - this.tweenStart < TWEEN_MS) {
      // Ease-out approximation of Compose's FastOutSlowIn tween.
      t = Math.min(1, (now - this.tweenStart) / TWEEN_MS);
      t = 1 - Math.pow(1 - t, 3);
      this.shift = this.shiftFrom + (this.shiftTo - this.shiftFrom) * t;
    } else if (st.dynamic) {
      // Playground envelope: a gentle simulated wave, clearly labeled demo input.
      var wave = 0.5 + 0.5 * Math.sin(now / 550);
      if (st.envelope === 'input') {
        this.shift = 0.06 * (0.25 + 0.75 * wave);
      } else {
        this.shift = 0.012 + 0.008 * wave;
      }
    } else {
      this.shift = this.shiftTo;
      this.tweenStart = 0;
      this.stopLoop();
    }
    this.render();
  };

  Presence.prototype.render = function () {
    var ctx = this.ctx;
    var dpr = window.devicePixelRatio || 1;
    var cssSize = this.canvas.clientWidth || 240;
    var px = Math.round(cssSize * dpr);
    if (this.canvas.width !== px) {
      this.canvas.width = px;
      this.canvas.height = px;
    }
    var D = px;
    var center = D / 2;
    var radius = D * 0.47;
    var v = this.vars;

    ctx.clearRect(0, 0, D, D);

    // Ground shadow: ink at 5% alpha, nudged down 1.8% (HaloOrb.kt).
    ctx.fillStyle = hexOrCurrent(v.ink, 0.05);
    ctx.beginPath();
    ctx.arc(center, center + D * 0.018, radius, 0, Math.PI * 2);
    ctx.fill();

    // Matte body: radial gradient offset toward the upper-left.
    var g = ctx.createRadialGradient(
      center - D * 0.14, center - D * 0.18, D * 0.05,
      center - D * 0.14, center - D * 0.18, D * 0.85
    );
    g.addColorStop(0, v.surface);
    g.addColorStop(0.7, withAlpha(v.surface, 0.92));
    g.addColorStop(1, withAlpha(v.ink, 0.12));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();

    // Cells, clipped to the silhouette. Even indices shift one way, odd the other.
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.clip();

    for (var i = 0; i < PEARL_CELLS.length; i++) {
      var r = PEARL_CELLS[i];
      var off = (i % 2 === 0 ? this.shift : -this.shift * 0.65) * D;
      var x = r[0] * D + off;
      var y = r[1] * D + off * 0.5;
      var w = (r[2] - r[0]) * D;
      var h = (r[3] - r[1]) * D;
      var cr = D * 0.045;
      ctx.fillStyle = withAlpha(v.cells[i % v.cells.length], i === 4 ? 0.45 : 0.8);
      roundRect(ctx, x, y, w, h, cr);
    }

    // Light-break signature on the upper-right edge — never a progress ring.
    ctx.strokeStyle = withAlpha(v.ink, 0.22);
    ctx.lineWidth = D * 0.022;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(D * 0.83, D * 0.16);
    ctx.lineTo(D * 0.88, D * 0.22);
    ctx.stroke();

    ctx.restore();
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
  }

  function withAlpha(color, alpha) {
    var c = color.replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    var n = parseInt(c, 16);
    if (isNaN(n)) return color;
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }
  function hexOrCurrent(color, alpha) { return withAlpha(color, alpha); }

  window.HaloPresence = {
    mount: function (canvas) { return new Presence(canvas); },
    states: Object.keys(STATES)
  };
})();
