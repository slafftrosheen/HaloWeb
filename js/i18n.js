/* HaloWeb EN / LV / RU: progressive static-copy localization.
   Dictionary values are reviewable in js/locale-data.js. No network calls. 
   Content absent from a locale remains in source English, never machine-fabricated. */
(function () {
  'use strict';
  var root = document.documentElement;
  var catalogs = window.HaloLocaleStrings || {};
  var supported = {en:true, lv:true, ru:true};
  var state = new WeakMap(), attributes = new WeakMap(), links = new WeakMap();
  var localeKey = 'halo-web-language';
  var param = new URLSearchParams(location.search).get('lang');
  var stored = null;
  try { stored = localStorage.getItem(localeKey); } catch (_) {}
  var fromPath = location.pathname.match(/^\/(lv|ru)(?:\/|$)/);
  var pathLang = fromPath ? fromPath[1] : null;
  var lang = pathLang || (supported[param] ? param : supported[stored] ? stored : ((navigator.language || 'en').toLowerCase().split('-')[0]));
  if (!supported[lang]) lang = 'en';
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
  function translate(text, locale) {
    locale = locale || lang;
    return locale === 'en' ? text : ((catalogs[locale] || {})[norm(text)] || text);
  }
  function excluded(node) {
    var el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    return !el || Boolean(el.closest('script,style,noscript,svg,code,pre,textarea,[data-no-i18n]'));
  }
  function translateNode(node) {
    if (excluded(node)) return;
    var s = state.get(node), now = node.nodeValue;
    if (!s || s.last !== now) { s = {source:now,last:now}; state.set(node,s); }
    var base = norm(s.source);
    var target = translate(base);
    var output = target === base ? s.source : s.source.replace(/^(\s*)([\s\S]*?)(\s*)$/, function (_,before,body,after) {
      return before + target + after;
    });
    if (now !== output) { s.last = output; node.nodeValue = output; }
  }
  function textWalk(container) {
    if (!container) return;
    var walk = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) translateNode(walk.currentNode);
  }
  function updateAttrs() {
    document.querySelectorAll('[aria-label],[title],[placeholder]').forEach(function(el) {
      if (excluded(el)) return;
      ['aria-label','title','placeholder'].forEach(function(attr){
        if (!el.hasAttribute(attr)) return;
        var orig = attributes.get(el) || {};
        if (!orig[attr]) orig[attr] = el.getAttribute(attr);
        attributes.set(el, orig);
        el.setAttribute(attr, translate(orig[attr]));
      });
    });
  }
  function updateLinks() {
    document.querySelectorAll('a[href]').forEach(function(a){
      var original = links.get(a);
      if (!original) { original = a.getAttribute('href'); links.set(a,original); }
      if (!/^(?:[\w-]+\.html)(?:[?#]|$)/i.test(original)) return;
      var url = new URL(original, location.href);
      var path = original.split(/[?#]/)[0];
      var hash = url.hash;
      a.setAttribute('href', (lang === 'en' ? '/' : '/' + lang + '/') + path + hash);
    });
  }
  var initialTitle = document.title;
  var description = document.querySelector('meta[name="description"]');
  var ogTitle = document.querySelector('meta[property="og:title"]');
  var ogDescription = document.querySelector('meta[property="og:description"]');
  var initialDescription = description ? description.content : '';
  function newLocaleUrl(next) {
    var path = location.pathname.replace(/^\/(?:lv|ru)(?=\/)/, '/').replace(/^\/+/, '');
    if (!path || path.endsWith('/')) path = 'index.html';
    var basename = path.split('/').pop();
    var dest = (next === 'en' ? '/' : '/' + next + '/') + basename;
    return dest + location.hash;
  }
  function apply(next, save) {
    if (!supported[next]) next = 'en';
    lang = next; root.lang = lang;
    if (save) { try { localStorage.setItem(localeKey,lang); } catch (_) {} }
    document.title = translate(initialTitle);
    if (description) description.content = translate(initialDescription);
    if (ogTitle) ogTitle.content = translate(initialTitle);
    if (ogDescription) ogDescription.content = translate(initialDescription);
    textWalk(document.body); updateAttrs(); updateLinks();
    var select = document.getElementById('site-language');
    if (select) select.value = lang;
    window.dispatchEvent(new CustomEvent('halo:language', {detail:{lang:lang}}));
  }
  var select = document.getElementById('site-language');
  if (select) {
    var container = select.closest('.locale-picker');
    if (container) container.hidden = false;
    select.addEventListener('change', function () {
      var next = supported[select.value] ? select.value : 'en';
      try { localStorage.setItem(localeKey, next); } catch (_) {}
      // Reload the real translated HTML so page metadata and content work
      // without JavaScript and language changes always restore EN correctly.
      window.location.assign(newLocaleUrl(next));
    });
  }
  window.HaloI18n = {get language(){return lang;}, t:translate, apply:apply};
  apply(lang,Boolean(supported[param]));
  // Re-localize text emitted by the interactive demos without translating form input.
  var pending = false;
  var observer = new MutationObserver(function(changes){
    for (var i=0;i<changes.length;i++) if(changes[i].type === 'characterData' || changes[i].addedNodes.length) { pending=true; break; }
    if (!pending) return;
    pending=false;
    changes.forEach(function(c) {
      if (c.type==='characterData') translateNode(c.target);
      else c.addedNodes.forEach(function(n) {
        if (n.nodeType===Node.TEXT_NODE) translateNode(n);
        else if (n.nodeType===Node.ELEMENT_NODE) textWalk(n);
      });
    });
  });
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
})();