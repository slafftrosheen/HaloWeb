/* HaloWeb page behavior: three-state theme preference (System/Light/Dark,
 * matching the app's AppearanceMode selector), motion preference, and
 * Presence lifecycle (theme refresh on theme change, resizeAll on resize).
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
    root.setAttribute('data-theme', resolvedTheme());
    if (window.HaloPresence) window.HaloPresence.refreshAllThemes();
    updateThemeUi();
  }

  function updateThemeUi() {
    var mode = stored() || 'system';
    Array.prototype.forEach.call(document.querySelectorAll('.theme-switch .btn[data-mode]'), function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-mode') === mode ? 'true' : 'false');
    });
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

  /* Layout resize: re-size presence canvases only (no theme recomputation). */
  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.HaloPresence) window.HaloPresence.resizeAll();
    }, 120);
  });
})();
