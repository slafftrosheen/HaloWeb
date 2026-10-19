/* halo web · alpha.js — tester checklist + feedback draft (ported unchanged in behaviour from HaloWeb main.js).
   Checklist ticks stay in this browser (same storage key as before, so testers keep their progress).
   The form never stores or sends anything: it prepares a mail draft or copies text. */
(function () {
  'use strict';
  function tr(s) { return window.HaloI18n ? window.HaloI18n.t(s) : s; }
  var COPY = {
    progress: '{done} of {total} tried',
    subject: 'Halo feedback',
    required: 'Complete the required fields to prepare your feedback.',
    opened: 'Email draft requested. Your feedback has not been sent yet. If your mail app did not open, copy the feedback and email it to slaff.trosheen@gmail.com.',
    copied: 'Feedback copied. Paste it into an email to slaff.trosheen@gmail.com.',
    copyFailed: 'Copy is unavailable. Select the prepared feedback below and copy it manually.',
    notTried: 'No checklist steps marked as tried.',
    tried: 'Checklist steps tried',
    tplCopied: 'Template copied.',
    tplFailed: 'Copy is unavailable. Select the template and copy it manually.'
  };
  var MAIL = 'slaff.trosheen@gmail.com';
  var checks = Array.prototype.slice.call(document.querySelectorAll('[data-alpha-step]'));
  var KEY = 'halo-web-alpha-steps-v1';
  var label = document.getElementById('alpha-progress-label');
  var bar = document.getElementById('alpha-progress-fill');

  function refresh() {
    var done = checks.filter(function (c) { return c.checked; });
    if (label) label.textContent = tr(COPY.progress).replace('{done}', done.length).replace('{total}', checks.length);
    if (bar) bar.style.width = (done.length / checks.length * 100) + '%';
    try { localStorage.setItem(KEY, JSON.stringify(done.map(function (c) { return c.getAttribute('data-alpha-step'); }))); } catch (_) {}
  }
  window.addEventListener('halo:language', refresh);
  if (checks.length) {
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem(KEY) || '[]'); if (!Array.isArray(saved)) saved = []; } catch (_) { saved = []; }
    checks.forEach(function (c) { c.checked = saved.indexOf(c.getAttribute('data-alpha-step')) !== -1; c.addEventListener('change', refresh); });
    var reset = document.getElementById('alpha-reset');
    if (reset) { reset.hidden = false; reset.addEventListener('click', function () { checks.forEach(function (c) { c.checked = false; }); refresh(); }); }
    refresh();
  }

  var form = document.getElementById('feedback-form');
  if (form) {
    var status = document.getElementById('feedback-status');
    var pre = document.getElementById('feedback-body');
    var preview = document.getElementById('feedback-preview');
    var fieldLabel = function (name) { var el = form.elements[name]; return el ? el.closest('label').firstChild.textContent.trim().replace(/\s*\((optional|required)\)$/, '') : name; };
    function prepare() {
      var data = new FormData(form), lines = [tr(COPY.subject), ''];
      ['name', 'email', 'version', 'host', 'screen', 'summary', 'expected', 'steps'].forEach(function (n) {
        var v = String(data.get(n) || '').trim(); if (v) lines.push(fieldLabel(n) + ':\n' + v + '\n');
      });
      lines.push(fieldLabel('kind') + ': ' + form.elements.kind.selectedOptions[0].textContent);
      if (data.get('rating')) lines.push(fieldLabel('rating') + ': ' + form.elements.rating.selectedOptions[0].textContent);
      lines.push('', tr(COPY.tried) + ':');
      var tried = checks.filter(function (c) { return c.checked; });
      if (!tried.length) lines.push(tr(COPY.notTried));
      tried.forEach(function (c) { lines.push('- ' + c.closest('label').querySelector('strong').firstChild.textContent.trim()); });
      var body = lines.join('\n'); pre.textContent = body; return body;
    }
    function valid() {
      ['screen', 'summary'].forEach(function (n) { var f = form.elements[n]; f.setCustomValidity(f.value.trim() ? '' : tr(COPY.required)); });
      if (form.reportValidity()) return true; status.textContent = tr(COPY.required); return false;
    }
    Array.prototype.forEach.call(form.querySelectorAll('[data-needs-js]'), function (b) { b.disabled = false; });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); if (!valid()) return;
      var body = prepare(), a = document.createElement('a');
      a.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(tr(COPY.subject) + ' — ' + form.elements.screen.value.trim()) + '&body=' + encodeURIComponent(body);
      a.hidden = true; document.body.appendChild(a); a.click(); a.remove();
      preview.open = true; status.textContent = tr(COPY.opened);   /* a draft, never "sent" */
    });
    document.getElementById('feedback-copy').addEventListener('click', function () {
      if (!valid()) return; var body = prepare(); preview.open = true;
      (navigator.clipboard ? navigator.clipboard.writeText(body) : Promise.reject()).then(function () { status.textContent = tr(COPY.copied); }, function () { status.textContent = tr(COPY.copyFailed); });
    });
    form.addEventListener('input', function () { form.elements.screen.setCustomValidity(''); form.elements.summary.setCustomValidity(''); status.textContent = ''; if (pre.textContent) prepare(); });
    form.addEventListener('reset', function () { status.textContent = ''; pre.textContent = ''; preview.open = false; });
  }

  var tplBtn = document.getElementById('alpha-copy-template');
  if (tplBtn) {
    tplBtn.hidden = false;
    tplBtn.addEventListener('click', function () {
      var s = document.getElementById('alpha-copy-status');
      var text = document.getElementById('alpha-issue-template').textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { s.textContent = tr(COPY.tplCopied); }, function () { s.textContent = tr(COPY.tplFailed); });
    });
  }
})();
