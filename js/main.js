(function () {
  'use strict';

  var root = document.documentElement;
  var themeKey = 'halo-web-theme';
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function storedThemeMode() {
    try { return localStorage.getItem(themeKey) || 'system'; }
    catch (_) { return 'system'; }
  }

  function resolveTheme(mode) {
    if (mode === 'light' || mode === 'dark') return mode;
    return darkQuery.matches ? 'dark' : 'light';
  }

  function applyTheme(mode) {
    mode = mode || storedThemeMode();
    var resolved = resolveTheme(mode);
    root.setAttribute('data-theme', resolved);

    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-mode]'), function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-theme-mode') === mode ? 'true' : 'false');
    });

    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', resolved === 'dark' ? '#15171B' : '#F4F5F7');
  }

  function initTheme() {
    applyTheme(storedThemeMode());

    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-mode]'), function (button) {
      button.addEventListener('click', function () {
        var mode = button.getAttribute('data-theme-mode');
        try {
          if (mode === 'system') localStorage.removeItem(themeKey);
          else localStorage.setItem(themeKey, mode);
        } catch (_) {}
        applyTheme(mode);
      });
    });

    if (darkQuery.addEventListener) {
      darkQuery.addEventListener('change', function () {
        if (storedThemeMode() === 'system') applyTheme('system');
      });
    }
  }

  function initScrollChrome() {
    var progress = document.getElementById('page-progress');
    var header = document.querySelector('.site-header');
    var raf = 0;

    function update() {
      raf = 0;
      var doc = document.documentElement;
      var max = Math.max(1, doc.scrollHeight - window.innerHeight);
      if (progress) progress.style.width = Math.max(0, Math.min(100, window.scrollY / max * 100)) + '%';
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 16);
    }

    window.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function initActiveNavigation() {
    if (!('IntersectionObserver' in window)) return;

    var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
    var sections = links.map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    }).filter(Boolean);
    var visible = {};

    function refresh() {
      var best = null;
      var bestDistance = Infinity;

      sections.forEach(function (section) {
        if (!visible[section.id]) return;
        var distance = Math.abs(section.getBoundingClientRect().top - window.innerHeight * 0.22);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = section.id;
        }
      });

      links.forEach(function (link) {
        var active = best && link.getAttribute('href') === '#' + best;
        link.classList.toggle('is-active', !!active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });
      refresh();
    }, { rootMargin: '-12% 0px -70% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function initReveals() {
    var elements = Array.prototype.slice.call(document.querySelectorAll('.reveal, .shot-reveal'));
    var runtimeFlow = document.querySelector('[data-runtime-flow]');

    if (reducedQuery.matches || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      if (runtimeFlow) runtimeFlow.classList.add('is-running');
      return;
    }

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    elements.forEach(function (el, index) {
      if (el.classList.contains('shot-reveal')) {
        el.style.transitionDelay = Math.min(index % 4, 3) * 55 + 'ms';
      }
      revealObserver.observe(el);
    });

    if (runtimeFlow) {
      var runtimeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runtimeFlow.classList.add('is-running');
          runtimeObserver.disconnect();
        });
      }, { threshold: 0.35 });
      runtimeObserver.observe(runtimeFlow);
    }
  }

  initTheme();
  initScrollChrome();
  initActiveNavigation();
  initReveals();
})();
