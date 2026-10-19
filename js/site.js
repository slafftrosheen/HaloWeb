/* halo web · site.js v1.0 — progressive enhancement only. Every section is complete without it.
   Motion contract: one play per event · no permanent loops · paused off-screen and in background tabs ·
   never under prefers-reduced-motion (static SVG stays) · no layout shift (ring boxes are sized in CSS). */
(function () {
  'use strict';
  var root = document.documentElement;
  root.setAttribute('data-ready', '');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var THEME_KEY = 'halo-web-theme';
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function tr(s) { return window.HaloI18n ? window.HaloI18n.t(s) : s; }
  function theme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /* Old single-page anchors → their new pages */
  var OLD = { '#alpha': 'alpha.html', '#alpha-files': 'alpha.html#alpha-files', '#alpha-walkthrough': 'alpha.html#alpha-walkthrough', '#feedback': 'alpha.html#feedback',
              '#status': 'status.html', '#ai': 'your-ai.html', '#devices': 'devices.html', '#workspace': 'workspace.html', '#actions': 'how-it-works.html', '#presence': 'design.html', '#ring': 'design.html' };
  if (OLD[location.hash] && /(^|\/)(index(\.html)?)?$/.test(location.pathname)) location.replace(OLD[location.hash]);

  /* ---------- theme ---------- */
  function setTheme(mode) {
    if (mode === 'system') { root.removeAttribute('data-theme'); try { localStorage.removeItem(THEME_KEY); } catch (_) {} }
    else { root.setAttribute('data-theme', mode); try { localStorage.setItem(THEME_KEY, mode); } catch (_) {} }
    $('[data-theme-set]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-theme-set') === mode)); });
    /* Kids illustrations ship as distinct dark/light branded stills. */
    $('img[src*="assets/brand/kids/svg/halo_kids_orb_"]').forEach(function (img) {
      var original = img.getAttribute('data-light-base');
      if (!original) {
        original = img.getAttribute('src').replace(/_(?:light|dark)\.svg$/, '');
        img.setAttribute('data-light-base', original);
      }
      img.setAttribute('src', original + '_' + theme() + '.svg');
    });
    $$('.ring[data-themed]').forEach(function (r) { if (r._anim) { r._anim.destroy(); r._anim = null; r.classList.remove('is-live'); } swapStill(r); });
  }
  function currentMode() { try { return localStorage.getItem(THEME_KEY) || 'system'; } catch (_) { return 'system'; } }
  $$('[data-theme-set]').forEach(function (b) { b.addEventListener('click', function () { setTheme(b.getAttribute('data-theme-set')); }); });
  setTheme(currentMode());

  /* ---------- header ---------- */
  var header = $('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  window.addEventListener('halo:language', function () { if (typeof fit === 'function') fit(); });
  $$('details.menu, details.nav-product').forEach(function (d) {
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && d.open) { d.open = false; $('summary', d).focus(); } });
    $$('a', d).forEach(function (a) { a.addEventListener('click', function () { d.open = false; }); });
  });
  document.addEventListener('click', function (e) { $$('details.nav-product[open]').forEach(function (d) { if (!d.contains(e.target)) d.open = false; }); });
  var menu = $('details.menu');
  if (menu) menu.addEventListener('toggle', function () { document.body.style.overflow = menu.open ? 'hidden' : ''; });

  var hdr = $('.hdr'), nav = $('.nav', hdr || document);
  function fit() {
    if (!hdr || !nav) return;
    hdr.classList.remove('is-compact');
    if (getComputedStyle(nav).display === 'none') return;
    var need = $$('.hdr > *', document).reduce(function (s, el) { return s + (el.classList.contains('menu') ? 0 : el.scrollWidth); }, 0);
    if (need + 48 > hdr.clientWidth || nav.scrollWidth > nav.clientWidth + 1) hdr.classList.add('is-compact');
  }
  if ('ResizeObserver' in window && hdr) { var ro = new ResizeObserver(fit); ro.observe(hdr); ro.observe(nav); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit();

  /* ---------- rings / Lottie ---------- */
  function swapStill(r) {
    var img = $('img', r); if (!img || !r.hasAttribute('data-themed')) return;
    img.src = img.getAttribute('data-src-' + theme()) || img.src;
  }
  function lottieSrc(r) {
    var src = r.getAttribute('data-lottie'); if (!src) return null;
    return r.hasAttribute('data-themed') ? src.replace('{theme}', theme()) : src;
  }
  function mount(r, opts) {
    opts = opts || {};
    if (reduce.matches || document.hidden || !window.lottie) return null;
    var src = lottieSrc(r); if (!src) return null;
    if (r._anim) r._anim.destroy();
    var box = $('.ring-lottie', r);
    if (!box) { box = document.createElement('div'); box.className = 'ring-lottie'; box.setAttribute('aria-hidden', 'true'); r.appendChild(box); }
    var a = window.lottie.loadAnimation({ container: box, renderer: 'svg', loop: false, autoplay: false, path: src,
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet', progressiveLoad: true } });
    r._anim = a;
    r._finished = false; r._suspended = false;
    a.addEventListener('DOMLoaded', function () {
      r.classList.add('is-live');
      if (opts.segment) a.playSegments(opts.segment, true); else a.goToAndPlay(0, true);
    });
    a.addEventListener('complete', function () {
      r._finished = true;
      if (opts.loops && (r._loops = (r._loops || 0) + 1) < opts.loops && r.classList.contains('is-on')) { a.goToAndPlay(0, true); return; }
      r._loops = 0;
      if (opts.thenStill) { r.classList.remove('is-live'); }   /* hand back to the exact static logo frame */
    });
    a.addEventListener('data_failed', function () { r.classList.remove('is-live'); });
    return a;
  }
  /* Play a ring once when it becomes visible (data-play="view") */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var r = en.target;
      if (en.isIntersecting) {
        if (!r._played) { r._played = true; mount(r, { thenStill: r.hasAttribute('data-then-still') }); }
        else if (r._suspended && r._anim && !r._finished && !reduce.matches && !document.hidden) {
          r._anim.play(); r._suspended = false;
        }
      } else if (r._anim && !r._finished) { r._anim.pause(); r._suspended = true; }
    });
  }, { threshold: .4 }) : null;
  $$('.ring[data-play="view"]').forEach(function (r) { swapStill(r); if (io) io.observe(r); });
  $$('.ring[data-themed]').forEach(swapStill);

  /* Hero entrance: once per session, ≤2 s, ends on the exact static logo */
  var hero = $('.ring[data-play="intro"]');
  if (hero) {
    var seen = false; try { seen = sessionStorage.getItem('halo-hero-seen') === '1'; } catch (_) {}
    if (!seen && !reduce.matches) {
      mount(hero, { segment: [0, 60], thenStill: true });
      try { sessionStorage.setItem('halo-hero-seen', '1'); } catch (_) {}
    }
  }
  /* Background tabs: freeze every animation */
  document.addEventListener('visibilitychange', function () {
    if (!window.lottie) return;
    if (document.hidden) {
      window.lottie.freeze();
      document.dispatchEvent(new Event('halo:motion-pause'));
    } else if (!reduce.matches) window.lottie.unfreeze();
  });

  /* System theme and runtime accessibility changes must never leave an
     invisible old-theme animation running behind the static fallback. */
  var scheme = window.matchMedia('(prefers-color-scheme: dark)');
  if (scheme.addEventListener) scheme.addEventListener('change', function () {
    if (currentMode() === 'system') setTheme('system');
  });
  function stopForReducedMotion() {
    if (!reduce.matches) return;
    $('.ring').forEach(function (r) {
      if (r._anim) { r._anim.destroy(); r._anim = null; }
      r._suspended = false;
      r.classList.remove('is-live');
    });
    document.dispatchEvent(new Event('halo:motion-pause'));
  }
  if (reduce.addEventListener) reduce.addEventListener('change', stopForReducedMotion);

  /* Section reveals are progressive enhancement only: the real content stays
     readable without JS and with reduced motion. */
  if ('IntersectionObserver' in window && !reduce.matches) {
    $('.section > .wrap, .hero-copy, .hero-stage').forEach(function (el) { el.classList.add('reveal'); });
  }

  /* A small, genuine brand asset is used for completed illustrative steps.
     A draft Discard never plays the success animation. */
  function microFx(host, name, still) {
    if (reduce.matches || document.hidden || !window.lottie || !host) return;
    var old = $('.micro-fx', host);
    if (old) { if (old._anim) old._anim.destroy(); old.remove(); }
    var el = document.createElement('span');
    el.className = 'ring micro-fx';
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('data-themed', '');
    el.setAttribute('data-lottie', 'assets/brand/fx/lottie/halo_fx_' + name + '_{theme}.json');
    var img = document.createElement('img');
    img.setAttribute('alt', '');
    img.setAttribute('width', '96'); img.setAttribute('height', '96');
    img.setAttribute('data-src-light', 'assets/brand/fx/svg/' + still + '_light.svg');
    img.setAttribute('data-src-dark', 'assets/brand/fx/svg/' + still + '_dark.svg');
    el.appendChild(img);
    host.appendChild(el);
    swapStill(el);
    mount(el, { thenStill: true });
  }

  /* ---------- journey stepper ---------- */
  $$('[data-journey]').forEach(function (j) {
    var btns = $$('[data-step]', j), figs = $$('.journey-figs > [data-fig]', j);
    var live = $('[data-journey-live]', j), playBtn = $('[data-journey-play]', j), stopBtn = $('[data-journey-stop]', j);
    var cur = 0, timer = null;
    function go(i, fromUser) {
      cur = i;
      btns.forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === i)); var r = $('.ring', b); if (r) r.classList.toggle('is-on', k === i); });
      var target = btns[i].getAttribute('data-fig');
      figs.forEach(function (f) { f.classList.toggle('is-on', f.getAttribute('data-fig') === target); });
      var r = $('.ring', btns[i]); if (r) mount(r, { thenStill: false });
      if (live) live.textContent = tr('Step') + ' ' + (i + 1) + ' ' + tr('of') + ' ' + btns.length + ': ' + $('.st-t', btns[i]).textContent;
      if (fromUser) stop();
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } if (playBtn) playBtn.hidden = false; if (stopBtn) stopBtn.hidden = true; }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { go(i, true); }); });
    if (playBtn) playBtn.addEventListener('click', function () {
      go(0); playBtn.hidden = true; stopBtn.hidden = false; stopBtn.focus();
      timer = setInterval(function () { if (cur >= btns.length - 1) { stop(); playBtn.focus(); return; } go(cur + 1); }, reduce.matches ? 3200 : 2600);
    });
    if (stopBtn) stopBtn.addEventListener('click', function () { stop(); playBtn.focus(); });
    document.addEventListener('halo:motion-pause', stop);
    go(0);
  });

  /* ---------- voice states example ---------- */
  $$('[data-vstates]').forEach(function (w) {
    var list = $('.vstates', w), items = $('.vstate', w), btn = $('[data-vplay]', w), live = $('[data-vlive]', w), t = null;
    if (!btn) return;
    var stopVoice = document.createElement('button');
    stopVoice.type = 'button'; stopVoice.className = 'btn btn--sec btn--sm';
    stopVoice.textContent = tr('Stop preview'); stopVoice.hidden = true;
    stopVoice.setAttribute('data-voice-stop', '');
    btn.insertAdjacentElement('afterend', stopVoice);
    function halt() {
      if (t !== null) { clearTimeout(t); t = null; }
      items.forEach(function (it) { it.classList.remove('is-on'); var ring = $('.ring', it); if (ring && ring._anim) ring._anim.pause(); });
      list.classList.remove('is-playing'); btn.disabled = false; stopVoice.hidden = true;
      if (live) live.textContent = '';
    }
    stopVoice.addEventListener('click', function () { halt(); btn.focus(); });
    document.addEventListener('halo:motion-pause', halt);
    btn.addEventListener('click', function () {
      var i = 0; list.classList.add('is-playing'); btn.disabled = true; stopVoice.hidden = false;
      function step() {
        items.forEach(function (it, k) { it.classList.toggle('is-on', k === i); var r = $('.ring', it); if (r) r.classList.toggle('is-on', k === i); });
        var r = $('.ring', items[i]); if (r) mount(r, { loops: 2 });
        if (live) live.textContent = $('b', items[i]).textContent;
        i++;
        if (i < items.length) t = setTimeout(step, 2200);
        else t = setTimeout(halt, 2400);
      }
      step();
    });
  });

  /* ---------- learning ladder ---------- */
  $$('[data-ladder]').forEach(function (w) {
    var list = $('.ladder', w), rungs = $$('.rung', w), next = $('[data-ladder-next]', w), reset = $('[data-ladder-reset]', w), live = $('[data-ladder-live]', w), i = 0;
    function show() {
      list.classList.add('is-guided');
      rungs.forEach(function (r, k) { r.classList.toggle('is-reached', k <= i); r.classList.toggle('is-current', k === i); });
      if (live) live.textContent = $('b', rungs[i]).textContent;
      next.disabled = i >= rungs.length - 1;
      if (i === rungs.length - 1) microFx(w, 'learn_advance', 'halo_fx_learn_advance');
    }
    next.addEventListener('click', function () { if (i < rungs.length - 1) { i++; show(); } });
    reset.addEventListener('click', function () { i = 0; show(); });
    show();
  });

  /* ---------- canvas draft sample ---------- */
  $$('[data-draft]').forEach(function (w) {
    var card = $('.card--draft', w), line = $('.l-draft', w), st = $('[data-draft-status]', w);
    var keep = $('[data-keep]', w), discard = $('[data-discard]', w), reset = $('[data-draft-reset]', w);
    [keep, discard].forEach(function (b) { b.disabled = false; });
    function set(state, msg) {
      card.setAttribute('data-state', state);
      $('.kind', card).textContent = tr(state === 'saved' ? 'Saved card' : 'Halo suggestion · draft');
      if (line) { line.classList.toggle('is-saved', state === 'saved'); line.classList.toggle('is-gone', state === 'discarded'); }
      keep.hidden = discard.hidden = state !== 'draft'; reset.hidden = state === 'draft';
      st.textContent = tr(msg);
    }
    keep.addEventListener('click', function () { set('saved', 'Kept. The card is now part of your canvas.'); microFx(w, 'apply_draft', 'halo_fx_apply_draft_applied'); reset.focus(); });
    discard.addEventListener('click', function () { set('discarded', 'Discarded. Your canvas is exactly as it was.'); reset.focus(); });
    reset.addEventListener('click', function () { set('draft', ''); var f = $('.micro-fx', w); if (f) { if (f._anim) f._anim.destroy(); f.remove(); } keep.focus(); });
  });

  /* ---------- one-time path draw (host diagram) ---------- */
  if (io && !reduce.matches) {
    var once = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-drawn'); once.unobserve(e.target); } }); }, { threshold: .35 });
    $$('[data-draw]').forEach(function (el) { once.observe(el); });
  }

  /* ---------- reveal ---------- */
  if ('IntersectionObserver' in window && !reduce.matches) {
    var rv = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rv.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { rv.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('is-in'); }); }
})();
