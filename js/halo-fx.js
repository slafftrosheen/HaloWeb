/* halo FX for the web · v1.1 — reveal, card spotlight/tilt, parallax depth, Guide trace, bloom.
   No dependencies (~4 KB). Respects prefers-reduced-motion (also when it is switched on live) and coarse pointers.
   Load with <script src="js/halo-fx.js" defer></script> after css/halo-fx.css. */
(function () {
  var root = document.documentElement;
  root.classList.add('hfx-ready');               // [data-reveal] only hides once this script runs
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine = window.matchMedia('(pointer: fine)');

  /* reveal on scroll ----------------------------------------------------- */
  function showAll() { document.querySelectorAll('[data-reveal]').forEach(function (e) { e.classList.add('is-in'); }); }
  function reveal() {
    var els = document.querySelectorAll('[data-reveal]:not(.is-in)');
    if (reduce.matches || !('IntersectionObserver' in window)) { showAll(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: .18, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* card spotlight + tilt (max 4°) --------------------------------------- */
  function cards() {
    if (!fine.matches) return;
    document.querySelectorAll('.h-card').forEach(function (c) {
      if (c._hfx) return; c._hfx = true;
      var raf = 0, ev = null;
      c.addEventListener('pointermove', function (e) {
        ev = e; if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var r = c.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
          c.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
          if (reduce.matches || c.hasAttribute('data-no-tilt')) return;
          c.style.setProperty('--rx', ((.5 - y) * 8).toFixed(2) + 'deg'); c.style.setProperty('--ry', ((x - .5) * 8).toFixed(2) + 'deg');
        });
      });
      c.addEventListener('pointerleave', function () { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
  }

  /* parallax depth: data-depth="0.05–0.6" (pointer + scroll). Reads all layout first, then writes (no thrash),
     and only works on layers whose section is on screen. */
  function parallax() {
    var els = [].slice.call(document.querySelectorAll('[data-depth]'));
    if (!els.length) return;
    var mx = 0, my = 0, tx = 0, ty = 0, ticking = false, visible = new Set();
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? visible.add(e.target) : visible.delete(e.target); }); req();
    }, { rootMargin: '100px' }) : null;
    els.forEach(function (el) { io ? io.observe(el.parentElement) : visible.add(el.parentElement); });
    if (fine.matches) window.addEventListener('pointermove', function (e) {
      mx = (e.clientX / innerWidth - .5); my = (e.clientY / innerHeight - .5); req();
    }, { passive: true });
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req, { passive: true });
    function req() { if (!ticking && !reduce.matches) { ticking = true; requestAnimationFrame(frame); } }
    function frame() {
      ticking = false; tx += (mx - tx) * .12; ty += (my - ty) * .12;
      var vh = innerHeight, live = els.filter(function (el) { return visible.has(el.parentElement); });
      var rects = live.map(function (el) { return el.parentElement.getBoundingClientRect(); });   // read
      live.forEach(function (el, i) {                                                            // write
        var d = parseFloat(el.getAttribute('data-depth')) || 0, r = rects[i];
        var sc = ((r.top + r.height / 2) - vh / 2) * d * -0.25;
        el.style.setProperty('--px', (tx * d * 60).toFixed(1) + 'px');
        el.style.setProperty('--py', (ty * d * 60 + sc).toFixed(1) + 'px');
      });
      if (Math.abs(mx - tx) > .001 || Math.abs(my - ty) > .001) req();
    }
    req();
  }

  /* Guide trace: max ONE per page, plays once when it enters view.
     Never on cloud opt-in, purchases, new permissions or destructive actions. */
  function guide() {
    var all = document.querySelectorAll('.hfx-trace'), g = all[0];
    if (!g) return;
    if (all.length > 1 && window.console) console.warn('halo FX: only one Guide trace per page — using the first.');
    for (var i = 1; i < all.length; i++) all[i].classList.remove('hfx-trace');
    if (reduce.matches || !('IntersectionObserver' in window)) { g.classList.add('is-on'); return; }
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { setTimeout(function () { g.classList.add('is-on'); }, 400); io.disconnect(); }
    }, { threshold: .6 });
    io.observe(g);
  }

  /* flow shorts: <video data-hfx-autoplay muted loop playsinline preload="none" poster="…">
     play only while on screen and never under reduced motion (the poster stays). */
  function videos() {
    var vs = [].slice.call(document.querySelectorAll('video[data-hfx-autoplay]'));
    if (!vs.length) return;
    vs.forEach(function (v) { v.muted = true; v.setAttribute('playsinline', ''); });
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !reduce.matches) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: .35 });
    vs.forEach(function (v) { io.observe(v); });
    reduce.addEventListener && reduce.addEventListener('change', function () { if (reduce.matches) vs.forEach(function (v) { v.pause(); }); });
  }

  window.HaloFx = {
    bloom: function (el) { if (!el || reduce.matches) return; el.classList.remove('is-bloom'); void el.offsetWidth; el.classList.add('is-bloom'); },
    acting: function (el, on) { if (el) el.classList.toggle('is-acting', !!on); },      // Edge glow: only while halo acts on the phone
    listening: function (el, on) { if (el) el.classList.toggle('is-listening', !!on); },
    refresh: function () { reveal(); cards(); }                                       // call after adding cards/sections dynamically
  };

  var onReduce = function () { if (reduce.matches) { showAll(); document.querySelectorAll('[data-depth]').forEach(function (el) { el.style.removeProperty('--px'); el.style.removeProperty('--py'); }); } };
  reduce.addEventListener ? reduce.addEventListener('change', onReduce) : reduce.addListener && reduce.addListener(onReduce);

  function init() { reveal(); cards(); parallax(); guide(); videos(); }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
