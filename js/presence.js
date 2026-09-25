/* Halo Presence — canvas port of app/ui/presence/HaloOrb.kt.
 *
 * Geometry and motion are translated 1:1 from the Kotlin renderer:
 *  - 7 rounded cells in normalized coordinates (pearlCells)
 *  - radial-gradient matte body, soft ground shadow
 *  - state-driven shift target with a 280ms tween (0ms when motion is reduced)
 *  - a short "light-break" line on the upper-right edge, never a progress ring
 *
 * Cell colors come from the page CSS custom properties (--cell-a…--cell-f),
 * so the presence re-themes itself with the page.
 *
 * Motion contract (matches the app's "no permanent idle animation"):
 *  - setState: one bounded 280ms transition
 *  - activityBurst: one bounded (<=1500ms) input/output envelope
 *  - pulse: one bounded 600ms lean
 *  - otherwise the render loop is fully stopped; RAF count returns to zero
 *  - reduced motion is evaluated live; enabling it mid-session cancels
 *    everything, renders once and stops.
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
    ready:        { label: 'Ready',        shift: 0,      trace: 'invoke → capture · microphone active' },
    listening:    { label: 'Listening',    shift: 0,      trace: 'invoke → capture · microphone active' },
    understanding:{ label: 'Understanding',shift: -0.035, trace: 'speech → text · intent recognized' },
    reasoning:    { label: 'Reasoning',    shift: 0.025,  trace: 'context assembled · provider: selected' },
    responding:   { label: 'Responding',   shift: 0.018,  trace: 'answer streaming · output → origin' }
  };

  var TWEEN_MS = 280;
  var PULSE_MS = 600;
  var BURST_MS = 1200;

  function Presence(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = 'ready';
    this.shift = 0;
    this.shiftFrom = 0;
    this.shiftTo = 0;
    this.tweenStart = 0;
    this.burstStart = 0;
    this.burstAmp = 0;
    this.pulseStart = 0;
    this.pulseAmp = 0;
    this.pulseDir = 1;
    this.raf = 0;
    this.vars = null;
    this._onMotionChange = this._onMotionChange.bind(this);
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.addEventListener) mq.addEventListener('change', this._onMotionChange);
      this._motionQuery = mq;
    }
    this.refreshTheme();
    this.render();
    Presence.instances.push(this);
  }

  Presence.instances = [];

  Presence.refreshAllThemes = function () {
    Presence.instances.forEach(function (p) { p.refreshTheme(); });
  };

  Presence.prototype._onMotionChange = function () {
    if (this.reducedMotionLive()) {
      // Cancel everything, render the settled state once, stop.
      this.stopLoop();
      this.burstStart = 0;
      this.pulseStart = 0;
      this.tweenStart = 0;
      this.shift = (STATES[this.state] || STATES.ready).shift;
      this.render();
    }
  };

  Presence.prototype.reducedMotionLive = function () {
    if (!this._motionQuery) return false;
    return this._motionQuery.matches ||
      document.documentElement.getAttribute('data-motion') === 'reduced';
  };

  Presence.prototype.refreshTheme = function () {
    var s = getComputedStyle(document.documentElement);
    this.vars = {
      surface: s.getPropertyValue('--surface').trim() || '#FFFFFF',
      ink: s.getPropertyValue('--text').trim() || '#182033',
      cells: ['--cell-a', '--cell-b', '--cell-c', '--cell-d', '--cell-e', '--cell-f']
        .map(function (v) { return s.getPropertyValue(v).trim() || '#CCCCCC'; })
    };
    // Re-draw immediately: the loop is stopped when settled, so a theme
    // switch would otherwise leave the old palette on screen.
    this.render();
  };

  Presence.prototype.setState = function (key, options) {
    options = options || {};
    if (!STATES[key]) return;
    this.state = key;
    var target = STATES[key].shift;
    if (this.reducedMotionLive()) {
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

  /* Bounded activity envelope (input/output). Duration is capped at BURST_MS;
   * after it the loop stops. Used only while a demo is actually animating. */
  Presence.prototype.activityBurst = function (duration) {
    if (this.reducedMotionLive()) return;
    this.burstStart = performance.now();
    this.burstAmp = Math.min(0.06, Math.max(0.01, (duration || BURST_MS) / 20000));
    this.startLoop();
  };

  Presence.prototype.endBurst = function () {
    this.burstStart = 0;
  };

  /* One-shot directional pulse: a gentle lean toward a nearby capability. */
  Presence.prototype.pulse = function (direction, amplitude) {
    if (this.reducedMotionLive()) return;
    this.pulseDir = direction >= 0 ? 1 : -1;
    this.pulseAmp = Math.min(0.045, amplitude || 0.02);
    this.pulseStart = performance.now();
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
    var t;
    var base = this.shiftTo;

    if (this.tweenStart) {
      t = (now - this.tweenStart) / TWEEN_MS;
      if (t < 1) {
        t = 1 - Math.pow(1 - t, 3);
        base = this.shiftFrom + (this.shiftTo - this.shiftFrom) * t;
      } else {
        this.tweenStart = 0;
      }
    }

    // Bounded burst envelope (linear fade out; no sine loop).
    var burst = 0;
    if (this.burstStart) {
      var bt = (now - this.burstStart) / BURST_MS;
      if (bt >= 1) {
        this.burstStart = 0;
      } else {
        burst = (1 - bt) * this.burstAmp * (0.5 + 0.5 * Math.sin(now / 90));
      }
    }

    // One-shot pulse envelope.
    var extra = 0;
    if (this.pulseStart) {
      var pt = (now - this.pulseStart) / PULSE_MS;
      if (pt >= 1) {
        this.pulseStart = 0;
      } else {
        extra = Math.sin(Math.PI * pt) * this.pulseAmp * this.pulseDir;
      }
    }

    this.shift = base + burst + extra;
    this.render();

    if (!this.tweenStart && !this.burstStart && !this.pulseStart) {
      this.stopLoop();
    }
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
    if (!v) return;

    ctx.clearRect(0, 0, D, D);

    // Ground shadow: ink at 5% alpha, nudged down 1.8% (HaloOrb.kt).
    ctx.fillStyle = withAlpha(v.ink, 0.05);
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
    var c = String(color).replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    var n = parseInt(c, 16);
    if (isNaN(n)) return color;
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  window.HaloPresence = {
    mount: function (canvas) { return new Presence(canvas); },
    refreshAllThemes: Presence.refreshAllThemes,
    states: Object.keys(STATES)
  };
})();
