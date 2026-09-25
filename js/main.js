/* HaloWeb page behavior: three-state theme preference (System/Light/Dark,
 * matching the Halo app's AppearanceMode selector), motion preference, and
 * Presence lifecycle (theme refresh + resize re-render for all instances).
 */
(function () {
  'use strict';

  var KEY = 'halo-web-theme';
  var root = document.documentElement;

  /* Signal that JS is running; scroll-reveal styling is gated on this so the
   * page remains fully readable when scripts are disabled. */
  root.setAttribute('data-js', 'on');

  /* ---------- Motion preference ---------- */
  function applyMotion() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.setAttribute('data-motion', reduced ? 'reduced' : 'full');
  }
  var motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionMedia.addEventListener) {
    motionMedia.addEventListener('change', applyMotion);
  }
  applyMotion();

  /* ---------- Theme: System / Light / Dark (like the app) ---------- */
  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function persist(value) {
    try {
      if (value === null) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, value);
    } catch (e) { /* private mode: selection stays for the session only */ }
  }

  function resolvedTheme() {
    var pref = stored();
    return pref === 'light' || pref === 'dark' ? pref : systemTheme();
  }

  function apply() {
    var resolved = resolvedTheme();
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-dark-active', resolved === 'dark' ? 'true' : 'false');
    if (window.HaloPresence) window.HaloPresence.refreshAllThemes();
    updateThemeUi();
  }

  function updateThemeUi() {
    var mode = stored() || 'system';
    var resolved = resolvedTheme();
    var group = document.querySelector('.theme-switch');
    if (group) {
      Array.prototype.forEach.call(group.querySelectorAll('.btn[data-mode]'), function (btn) {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-mode') === mode ? 'true' : 'false');
      });
      group.setAttribute('data-dark-active', resolved === 'dark' ? 'true' : 'false');
    }
    // Keep the compact header control in sync (cycles System → Light → Dark).
    var cycle = document.querySelector('.theme-toggle');
    if (cycle) {
      cycle.setAttribute('data-mode', mode);
      cycle.setAttribute('aria-pressed', resolved === 'dark' ? 'true' : 'false');
      cycle.setAttribute('aria-label',
        'Theme: ' + mode + (mode === 'system' ? ' (' + resolved + ')' : '') + '. Activate to change.');
    }
  }

  // Follow the OS only while the user has no explicit choice.
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  if (media.addEventListener) {
    media.addEventListener('change', function () {
      if (!stored()) apply();
    });
  }

  apply();

  function setMode(mode) {
    if (mode === 'system') persist(null);
    else persist(mode);
    apply();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.theme-switch .btn[data-mode]'), function (btn) {
    btn.addEventListener('click', function () { setMode(btn.getAttribute('data-mode')); });
  });

  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var order = ['system', 'light', 'dark'];
      var current = stored() || 'system';
      setMode(order[(order.indexOf(current) + 1) % order.length]);
    });
  }

  /* Re-render presences on layout resize (DPR-aware canvas sizing). */
  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.HaloPresence) window.HaloPresence.refreshAllThemes();
    }, 120);
  });
})();
