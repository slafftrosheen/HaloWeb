/* HaloWeb i18n: no dependencies, preserves the English source, updates dynamic content. */
(function () {
  'use strict';

  var languages = ['en', 'lv', 'ru'];
  var translations = window.HaloTranslations || {};
  var languageSelect = document.getElementById('halo-language');
  var storageKey = 'halo-web-language';
  if (!languageSelect) return;

  var originalText = [];
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  var ignoredParents = { SCRIPT: true, STYLE: true, OPTION: true, CODE: true };

  while (walker.nextNode()) {
    var node = walker.currentNode;
    if (!node.parentElement || ignoredParents[node.parentElement.tagName]) continue;
    var original = node.nodeValue;
    if (!original.trim()) continue;

    // PRE keeps meaningful line breaks (the issue-report template).
    var preserveLines = node.parentElement.tagName === 'PRE';
    var key = preserveLines ? original.trim() : original.trim().replace(/\s+/g, ' ');
    originalText.push({ node: node, original: original, key: key, preserveLines: preserveLines });
  }

  var attributes = [];
  Array.prototype.forEach.call(
    document.querySelectorAll('[alt], [aria-label], [title], [placeholder]'),
    function (element) {
      var values = {};
      ['alt', 'aria-label', 'title', 'placeholder'].forEach(function (name) {
        if (element.hasAttribute(name)) values[name] = element.getAttribute(name);
      });
      attributes.push({ element: element, values: values });
    }
  );

  var metadata = [];
  Array.prototype.forEach.call(
    document.querySelectorAll('meta[name="description"],meta[property="og:title"],meta[property="og:description"]'),
    function (element) { metadata.push({ element: element, original: element.content }); }
  );

  var schema = document.querySelector('script[type="application/ld+json"]');
  var schemaSource = schema ? schema.textContent : '';
  var schemaData = null;
  try { if (schemaSource) schemaData = JSON.parse(schemaSource); } catch (_) {}

  var currentLanguage = 'en';

  function validLanguage(lang) {
    return languages.indexOf(lang) !== -1;
  }

  function t(source) {
    var dictionary = translations[currentLanguage] || {};
    return Object.prototype.hasOwnProperty.call(dictionary, source) ? dictionary[source] : source;
  }

  function formatProgress(done, total) {
    return t('{done} of {total} tried')
      .replace('{done}', String(done))
      .replace('{total}', String(total));
  }

  function translatedText(record) {
    var value = t(record.key);
    if (value === record.key) return record.original;
    var leading = (record.original.match(/^\s*/) || [''])[0];
    var trailing = (record.original.match(/\s*$/) || [''])[0];
    return leading + value + trailing;
  }

  function apply(lang, updateUrl) {
    currentLanguage = validLanguage(lang) ? lang : 'en';

    originalText.forEach(function (record) {
      record.node.nodeValue = translatedText(record);
    });

    attributes.forEach(function (record) {
      Object.keys(record.values).forEach(function (name) {
        record.element.setAttribute(name, t(record.values[name]));
      });
    });

    document.documentElement.setAttribute('lang', currentLanguage);
    languageSelect.value = currentLanguage;
    document.title = t('Halo — a local-first AI assistant and cognitive runtime');
    metadata.forEach(function (record) {
      record.element.content = t(record.original);
    });

    if (schema && schemaData) {
      var localizedSchema = Object.assign({}, schemaData);
      localizedSchema.description = t(schemaData.description);
      schema.textContent = JSON.stringify(localizedSchema);
    }

    try { localStorage.setItem(storageKey, currentLanguage); } catch (_) {}

    if (updateUrl && window.history && window.history.replaceState) {
      try {
        var url = new URL(window.location.href);
        if (currentLanguage === 'en') url.searchParams.delete('lang');
        else url.searchParams.set('lang', currentLanguage);
        window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
      } catch (_) { /* Language still works without URL updates. */ }
    }

    window.dispatchEvent(new CustomEvent('halo:languagechange', {
      detail: { language: currentLanguage }
    }));
  }

  // Useful for the tester checklist and asynchronous clipboard feedback.
  window.HaloI18n = {
    t: t,
    formatProgress: formatProgress,
    getLanguage: function () { return currentLanguage; },
    setLanguage: function (lang) { apply(lang, true); }
  };

  var requested = null;
  try { requested = new URL(window.location.href).searchParams.get('lang'); } catch (_) {}
  var saved = null;
  try { saved = localStorage.getItem(storageKey); } catch (_) {}
  var browser = (navigator.language || 'en').split('-')[0].toLowerCase();
  apply(validLanguage(requested) ? requested : validLanguage(saved) ? saved : browser, false);

  languageSelect.addEventListener('change', function () {
    apply(languageSelect.value, true);
  });
})();
