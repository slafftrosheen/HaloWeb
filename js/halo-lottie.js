/* halo web Lottie loader · v1.1 — uses lottie_light (already on the site), shape layers only, 30 fps.
   Usage:  <div class="h-lottie" data-halo-lottie="near_to_far" aria-hidden="true"></div>
   Load AFTER js/vendor/lottie_light.min.js, both with `defer`.
   Theme follows :root[data-theme] (falls back to prefers-color-scheme). Reduced motion → static frame.
   Plays only while on screen. One-shot animations: HaloLottie.play(el) on the event. */
(function () {
  var BASE = window.__HALO_LOTTIE_BASE || 'assets/brand/lottie/halo_';
  var CFG = {
    hero_ring_intro: { intro: [0, 60], loopSeg: [60, 180] },
    open_ring_gap: { loop: true }, near_to_far: { loop: true }, runtime_pipeline: { loop: true },
    honest_status: { loop: true }, workspace_flow: { loop: true }, pairing_signal: { loop: true },
    phone_action: { loop: true }, approval_dot: { loop: true }, scroll_cue: { loop: true },
    download: { loop: true }, checklist_tick: { once: true }, feedback_sent: { once: true }
  };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var darkMq = window.matchMedia('(prefers-color-scheme: dark)');
  var io = null;

  function theme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return darkMq.matches ? 'dark' : 'light';
  }
  function still(el) {
    var a = el._anim, cfg = el._cfg; if (!a) return;
    a.goToAndStop(cfg.once ? a.totalFrames - 1 : (cfg.loopSeg ? cfg.loopSeg[0] : 0), true);
  }
  function mount(el) {
    var name = el.getAttribute('data-halo-lottie'), cfg = CFG[name] || { loop: true }, t = theme();
    if (el._anim && el._theme === t) return;          // already showing the right theme
    if (el._anim) el._anim.destroy();
    var a = window.lottie.loadAnimation({ container: el, renderer: 'svg', autoplay: false,
      loop: !!(cfg.loop || cfg.intro), path: BASE + name + '_' + t + '.json',
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: true } });
    el._anim = a; el._cfg = cfg; el._theme = t;
    a.addEventListener('DOMLoaded', function () {
      if (reduce.matches) { still(el); return; }
      if (cfg.intro) a.playSegments([cfg.intro, cfg.loopSeg], true);
      else if (!cfg.once || el.hasAttribute('data-autoplay')) { if (el._visible !== false) a.play(); }
      if (el._visible === false) a.pause();
    });
    a.addEventListener('data_failed', function () { if (window.console) console.warn('halo lottie: could not load ' + name); });
  }
  function all() { document.querySelectorAll('[data-halo-lottie]').forEach(mount); }

  window.HaloLottie = {
    play: function (el) { if (el && el._anim && !reduce.matches) el._anim.goToAndPlay(0, true); },
    refresh: function () { all(); if (io) document.querySelectorAll('[data-halo-lottie]').forEach(function (el) { io.observe(el); }); }
  };

  function init() {
    if (!window.lottie) { if (window.console) console.warn('halo lottie: load lottie_light.min.js before halo-lottie.js'); return; }
    io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var el = e.target, a = el._anim; el._visible = e.isIntersecting;
        if (!a || reduce.matches || (el._cfg.once && !e.isIntersecting)) { if (a && !e.isIntersecting) a.pause(); return; }
        if (el._cfg.once) return;                     // one-shots only play on their event
        e.isIntersecting ? a.play() : a.pause();
      });
    }, { rootMargin: '120px' }) : null;
    HaloLottie.refresh();
    new MutationObserver(all).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    var onTheme = function () { if (!document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') === 'system') all(); };
    darkMq.addEventListener ? darkMq.addEventListener('change', onTheme) : darkMq.addListener && darkMq.addListener(onTheme);
    var onReduce = function () { document.querySelectorAll('[data-halo-lottie]').forEach(function (el) { if (!el._anim) return; reduce.matches ? still(el) : (!el._cfg.once && el._visible !== false && el._anim.play()); }); };
    reduce.addEventListener ? reduce.addEventListener('change', onReduce) : reduce.addListener && reduce.addListener(onReduce);
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
