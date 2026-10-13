(function () {
  'use strict';

  var root = document.documentElement;
  root.setAttribute('data-js', 'on');
  var themeKey = 'halo-web-theme';
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var language = 'en';
  var copyStatusKey = '';
  var feedbackStatusKey = '';
  var carouselRefresh = function () {};

  function t(key) {
    return window.HaloTranslations[language][key];
  }

  function refreshProgress() {
    var checks = Array.prototype.slice.call(document.querySelectorAll('[data-alpha-step]'));
    var label = document.getElementById('alpha-progress-label');
    if (label) label.textContent = t('progress').replace('{done}', checks.filter(function (c) { return c.checked; }).length).replace('{total}', checks.length);
  }

  function applyLanguage(value) {
    language = Object.prototype.hasOwnProperty.call(window.HaloTranslations, value) ? value : 'en';
    root.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    ['alt', 'aria-label'].forEach(function (attribute) {
      document.querySelectorAll('[data-i18n-' + attribute + ']').forEach(function (el) {
        el.setAttribute(attribute, t(el.getAttribute('data-i18n-' + attribute)));
      });
    });
    document.title = t('title');
    document.querySelector('meta[name="description"]').content = t('description');
    document.querySelector('meta[property="og:title"]').content = t('title');
    document.querySelector('meta[property="og:description"]').content = t('description');
    document.getElementById('site-language').value = language;
    document.getElementById('alpha-issue-template').textContent = t('template');
    if (copyStatusKey) document.getElementById('alpha-copy-status').textContent = t(copyStatusKey);
    refreshProgress();
    carouselRefresh();
    if (feedbackStatusKey) document.getElementById('feedback-status').textContent = t(feedbackStatusKey);
    if (document.getElementById('feedback-body').textContent) prepareFeedback();
  }

  function initCarousel() {
    var track = document.getElementById('app-track');
    var slides = Array.prototype.slice.call(track.children);
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-app-screen]'));
    var current = 0;
    function refresh() {
      buttons.forEach(function (button, index) { button.setAttribute('aria-pressed', String(index === current)); });
      document.getElementById('app-position').textContent = t('screenCount').replace('{current}', current + 1).replace('{total}', slides.length);
      document.getElementById('app-previous').disabled = current === 0;
      document.getElementById('app-next').disabled = current === slides.length - 1;
      // Keep the selected label visible without scrolling the page.
      var nav = buttons[current].parentElement;
      var button = buttons[current];
      if (button.offsetLeft < nav.scrollLeft) nav.scrollLeft = Math.max(0, button.offsetLeft - 32);
      else if (button.offsetLeft + button.offsetWidth > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = button.offsetLeft + button.offsetWidth - nav.clientWidth;
    }
    function go(index) {
      current = Math.max(0, Math.min(slides.length - 1, index));
      track.scrollTo({left: slides[current].offsetLeft - slides[0].offsetLeft, behavior: reducedQuery.matches ? 'instant' : 'smooth'});
      refresh();
    }
    buttons.forEach(function (button, index) { button.addEventListener('click', function () { go(index); }); });
    document.getElementById('app-previous').addEventListener('click', function () { go(current - 1); });
    document.getElementById('app-next').addEventListener('click', function () { go(current + 1); });
    track.addEventListener('keydown', function (event) {
      if (event.target !== track) return;
      var targets = {ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1};
      if (Object.prototype.hasOwnProperty.call(targets, event.key)) { event.preventDefault(); go(targets[event.key]); }
    });
    var frame = 0;
    track.addEventListener('scroll', function () {
      if (frame) return;
      frame = requestAnimationFrame(function () {
        frame = 0;
        current = slides.reduce(function (best, slide, index) {
          return Math.abs(slide.offsetLeft - slides[0].offsetLeft - track.scrollLeft) < Math.abs(slides[best].offsetLeft - slides[0].offsetLeft - track.scrollLeft) ? index : best;
        }, 0);
        refresh();
      });
    }, {passive:true});
    window.addEventListener('resize', function () {
      track.scrollTo({left: slides[current].offsetLeft - slides[0].offsetLeft, behavior:'instant'});
    });
    carouselRefresh = refresh;
    refresh();
  }

  function prepareFeedback() {
    var form = document.getElementById('feedback-form');
    var data = new FormData(form);
    var lines = [t('feedbackSubject'), ''];
    [['name','feedbackName'], ['email','feedbackEmail'], ['version','feedbackVersion'], ['host','feedbackHost'], ['screen','feedbackScreen'], ['summary','feedbackSummary'], ['expected','feedbackExpected'], ['steps','feedbackSteps']].forEach(function (pair) {
      var value = String(data.get(pair[0]) || '').trim();
      if (value) lines.push(t(pair[1]) + ':\n' + value + '\n');
    });
    lines.push(t('feedbackKind') + ': ' + t(data.get('kind')));
    if (data.get('rating')) lines.push(t('feedbackRating') + ': ' + t(data.get('rating')));
    lines.push(t('feedbackLanguage') + ': ' + language, '', t('feedbackTried') + ':');
    var tried = Array.prototype.slice.call(document.querySelectorAll('[data-alpha-step]:checked'));
    if (!tried.length) lines.push(t('feedbackNotTried'));
    tried.forEach(function (check) { lines.push('- ' + check.closest('label').querySelector('strong').textContent.replace(/\s+/g, ' ').trim()); });
    var body = lines.join('\n');
    document.getElementById('feedback-body').textContent = body;
    return body;
  }

  function initFeedback() {
    var form = document.getElementById('feedback-form');
    var status = document.getElementById('feedback-status');
    function show(key) { feedbackStatusKey = key; status.textContent = t(key); }
    function valid() {
      ['screen','summary'].forEach(function (name) {
        var field = form.elements[name];
        field.setCustomValidity(field.value.trim() ? '' : t('feedbackRequired'));
      });
      if (form.reportValidity()) return true;
      show('feedbackRequired');
      return false;
    }
    form.querySelector('[type="submit"]').disabled = false;
    document.getElementById('feedback-copy').disabled = false;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!valid()) return;
      var body = prepareFeedback();
      var link = document.createElement('a');
      link.href = 'mailto:slaff.trosheen@gmail.com?subject=' + encodeURIComponent(t('feedbackSubject') + ' — ' + form.elements.screen.value.trim()) + '&body=' + encodeURIComponent(body);
      link.hidden = true;
      document.body.appendChild(link);
      link.click();
      link.remove();
      document.getElementById('feedback-preview').open = true;
      show('feedbackOpened');
    });
    document.getElementById('feedback-copy').addEventListener('click', async function () {
      if (!valid()) return;
      var body = prepareFeedback();
      document.getElementById('feedback-preview').open = true;
      try {
        await navigator.clipboard.writeText(body);
        show('feedbackCopied');
      } catch (_) { show('feedbackCopyFailed'); }
    });
    form.addEventListener('input', function () {
      form.elements.screen.setCustomValidity('');
      form.elements.summary.setCustomValidity('');
      feedbackStatusKey = '';
      status.textContent = '';
      if (document.getElementById('feedback-body').textContent) prepareFeedback();
    });
    form.addEventListener('reset', function () {
      form.elements.screen.setCustomValidity('');
      form.elements.summary.setCustomValidity('');
      feedbackStatusKey = '';
      status.textContent = '';
      document.getElementById('feedback-body').textContent = '';
      document.getElementById('feedback-preview').open = false;
    });
  }

  function initWorkspace() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-workspace-tab]'));
    function select(index, focus) {
      tabs.forEach(function (tab, i) {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        document.getElementById(tab.getAttribute('aria-controls')).hidden = i !== index;
      });
      if (focus) tabs[index].focus();
    }
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { select(index, false); });
      tab.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); select(next, true); }
      });
    });
  }

  function initLanguage() {
    var preferred = new URLSearchParams(location.search).get('lang');
    if (!preferred) {
      try { preferred = localStorage.getItem('halo-web-language'); } catch (_) {}
    }
    if (!preferred) preferred = (navigator.language || 'en').split('-')[0];
    applyLanguage(preferred);
    document.getElementById('site-language').addEventListener('change', function (event) {
      applyLanguage(event.target.value);
      try { localStorage.setItem('halo-web-language', language); } catch (_) {}
      var url = new URL(location.href);
      url.searchParams.set('lang', language);
      history.replaceState(null, '', url);
    });
  }

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
    if (themeMeta) themeMeta.setAttribute('content', resolved === 'dark' ? '#131B19' : '#F7F8F4');
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


  function initAlphaChecklist() {
    var checks = Array.prototype.slice.call(document.querySelectorAll('[data-alpha-step]'));
    if (!checks.length) return;
    var storageKey = 'halo-web-alpha-steps-v1';
    var counter = document.getElementById('alpha-progress-label');
    var bar = document.getElementById('alpha-progress-fill');
    var reset = document.getElementById('alpha-reset');

    function readSaved() {
      try {
        var raw = localStorage.getItem(storageKey);
        var parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed.filter(function (v) { return typeof v === 'string'; }) : [];
      } catch (_) { return []; }
    }

    function refresh() {
      var done = checks.filter(function (check) { return check.checked; });
      refreshProgress();
      if (bar) bar.style.width = (done.length / checks.length * 100) + '%';
      try {
        localStorage.setItem(storageKey, JSON.stringify(done.map(function (check) {
          return check.getAttribute('data-alpha-step');
        })));
      } catch (_) { /* Checklist still works without local storage. */ }
    }

    var saved = readSaved();
    checks.forEach(function (check) {
      check.checked = saved.indexOf(check.getAttribute('data-alpha-step')) !== -1;
      check.addEventListener('change', refresh);
    });

    if (reset) reset.addEventListener('click', function () {
      checks.forEach(function (check) { check.checked = false; });
      refresh();
      if (checks[0]) checks[0].focus();
    });
    refresh();
  }

  function initAlphaReportCopy() {
    var button = document.getElementById('alpha-copy-template');
    var template = document.getElementById('alpha-issue-template');
    var status = document.getElementById('alpha-copy-status');
    if (!button || !template) return;
    button.addEventListener('click', function () {
      var text = template.textContent.trim();
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        copyStatusKey = 'copyManual';
        if (status) status.textContent = t(copyStatusKey);
        return;
      }
      navigator.clipboard.writeText(text).then(function () {
        copyStatusKey = 'copySuccess';
        if (status) status.textContent = t(copyStatusKey);
      }, function () {
        copyStatusKey = 'copyFailure';
        if (status) status.textContent = t(copyStatusKey);
      });
    });
  }

  initLanguage();
  initTheme();
  initScrollChrome();
  initActiveNavigation();
  initReveals();
  initAlphaChecklist();
  initAlphaReportCopy();
  initCarousel();
  initFeedback();
  initWorkspace();
})();
