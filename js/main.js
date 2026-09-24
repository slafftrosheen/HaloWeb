/* HaloWeb page behavior: theme persistence (System/Light/Dark, mirroring the
 * app's AppearancePreferences default) and the presence state playground.
 */
(function () {
  'use strict';

  var KEY = 'halo-web-theme';
  var root = document.documentElement;

  /* ---------- Motion preference (mirrors the app's reduced-motion respect) ---------- */
  function applyMotion() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.setAttribute('data-motion', reduced ? 'reduced' : 'full');
  }
  var motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionMedia.addEventListener) {
    motionMedia.addEventListener('change', applyMotion);
  }
  applyMotion();

  /* ---------- Theme ---------- */
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

  function apply(theme, options) {
    options = options || {};
    var resolved = theme === 'light' || theme === 'dark' ? theme : systemTheme();
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-dark-active', resolved === 'dark' ? 'true' : 'false');
    if (presence) presence.refreshTheme();
    if (!options.silent) updateToggleState();
  }

  function updateToggleState() {
    var dark = root.getAttribute('data-theme') === 'dark';
    var mode = stored() || 'system';
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    var title = mode === 'system'
      ? 'Theme: following system (' + (dark ? 'dark' : 'light') + ')'
      : 'Theme: ' + mode;
    btn.setAttribute('title', title);
    btn.setAttribute('aria-label', 'Toggle dark theme. Current: ' + title);
  }

  // Follow the OS only while the user has no explicit choice (System is the default).
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  if (media.addEventListener) {
    media.addEventListener('change', function () {
      if (!stored()) apply(null, { silent: true });
    });
  }

  apply(stored(), { silent: true });

  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') === 'dark';
      var next = dark ? 'light' : 'dark';
      persist(next);
      apply(next);
    });
  }

  /* ---------- Presence playground ---------- */
  var canvas = document.getElementById('presence-canvas');
  var presence = window.HaloPresence ? window.HaloPresence.mount(canvas) : null;
  var captionLabel = document.querySelector('.presence-caption .label');
  var captionSource = document.querySelector('.presence-caption .source');

  var buttons = document.querySelectorAll('.playground .btn[data-state]');
  Array.prototype.forEach.call(buttons, function (btn) {
    btn.addEventListener('click', function () {
      if (!presence) return;
      var state = btn.getAttribute('data-state');
      presence.setState(state, btn.getAttribute('data-source'));
      Array.prototype.forEach.call(buttons, function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      if (captionLabel) captionLabel.textContent = btn.getAttribute('data-label') || state;
      if (captionSource) {
        captionSource.textContent = state === 'capturing'
          ? 'Input source: ' + (btn.getAttribute('data-source') || 'Phone') + ' — demo envelope, no microphone'
          : btn.getAttribute('data-source')
            ? 'Input source: ' + btn.getAttribute('data-source')
            : 'Demo state — the app drives this from real runtime telemetry';
      }
    });
  });

  // Default the cluster to Ready once mounted.
  if (presence) presence.setState('ready');
  updateToggleState();
})();
