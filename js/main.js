/* HaloWeb shell behavior: System/Light/Dark theme, scroll progress and active-section nav. */
(function () {
  'use strict';

  var root = document.documentElement;
  var KEY = 'halo-web-theme';
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  root.setAttribute('data-js','on');

  function storedMode() {
    try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
  }
  function systemTheme() { return media.matches ? 'dark' : 'light'; }
  function resolvedTheme(mode) { return mode === 'light' || mode === 'dark' ? mode : systemTheme(); }

  function persist(mode) {
    try {
      if (mode === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, mode);
    } catch (e) {}
  }

  function applyTheme(mode) {
    mode = mode || storedMode();
    var resolved = resolvedTheme(mode);
    root.setAttribute('data-theme', resolved);
    Array.prototype.forEach.call(document.querySelectorAll('.theme-option[data-mode]'), function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-mode') === mode ? 'true' : 'false');
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', resolved === 'dark' ? '#17191E' : '#F6F7FB');
  }

  function initTheme() {
    applyTheme(storedMode());
    Array.prototype.forEach.call(document.querySelectorAll('.theme-option[data-mode]'), function (button) {
      button.addEventListener('click', function () {
        var mode = button.getAttribute('data-mode');
        persist(mode);
        applyTheme(mode);
      });
    });
    if (media.addEventListener) {
      media.addEventListener('change', function () {
        if (storedMode() === 'system') applyTheme('system');
      });
    }
  }

  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    var ticking = false;
    function update() {
      ticking = false;
      var doc = document.documentElement;
      var max = Math.max(1, doc.scrollHeight - window.innerHeight);
      var value = Math.max(0, Math.min(1, window.scrollY / max));
      bar.style.width = (value * 100).toFixed(2) + '%';
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive:true });
    window.addEventListener('resize', update);
    update();
  }

  function initActiveNav() {
    if (!('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
    var targets = links.map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    }).filter(Boolean);
    if (!targets.length) return;

    var visible = {};
    function refresh() {
      var best = null;
      var bestScore = -Infinity;
      targets.forEach(function (target) {
        if (!visible[target.id]) return;
        var rect = target.getBoundingClientRect();
        var score = -Math.abs(rect.top - window.innerHeight * .26);
        if (score > bestScore) { bestScore = score; best = target.id; }
      });
      links.forEach(function (link) {
        link.classList.toggle('is-active', best && link.getAttribute('href') === '#' + best);
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      refresh();
    }, { rootMargin:'-12% 0px -68% 0px', threshold:0 });

    targets.forEach(function (target) { observer.observe(target); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initScrollProgress();
    initActiveNav();
  });
})();
