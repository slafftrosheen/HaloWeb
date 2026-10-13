/**
 * Dependency-free HaloWeb i18n regression checks.
 * Run: node --test tests/i18n.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const html = read('index.html');
const runtime = read('js/i18n.js');
const main = read('js/main.js');

function dictionaries() {
  const window = {};
  runInNewContext(read('js/i18n.lv.js'), { window });
  runInNewContext(read('js/i18n.ru.js'), { window });
  return window.HaloTranslations;
}

const locales = dictionaries();
const htmlWithoutScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
const issueTemplate = html.match(/<pre id="alpha-issue-template">([\s\S]*?)<\/pre>/)?.[1];
const nonTranslated = new Set([
  'Halo', 'AI', 'Canvas', 'BuddyBot', 'LiteRT-LM', 'LiteRT-LM + Qwen 3 0.6B',
  'A', 'B', 'C', 'D', 'PDF', 'PNG', 'TXT',
  'English', 'Latviešu', 'Русский', 'GitHub ↗'
]);

const activeWindow = {};
runInNewContext(read('js/translations.js'), { window: activeWindow });
const activeLocales = activeWindow.HaloTranslations;

test('each locale covers every page key without blank translations', () => {
  const keys = [...html.matchAll(/data-i18n(?:-alt|-aria-label)?="([^"]+)"/g)].map(m => m[1]);
  for (const lang of ['en', 'lv', 'ru']) {
    assert.deepEqual(Object.keys(activeLocales[lang]).sort(), Object.keys(activeLocales.en).sort());
    for (const key of keys) assert.ok(activeLocales[lang][key]?.trim(), `${lang}: ${key}`);
  }
});

test('accessibility, metadata, template and dynamic feedback are localized', () => {
  for (const lang of ['en', 'lv', 'ru']) {
    for (const key of ['t010', 'title', 'description', 'template', 'progress', 'copyManual', 'copySuccess', 'copyFailure', 'feedbackOpened', 'feedbackCopied', 'workspaceTabs']) {
      assert.ok(activeLocales[lang][key]?.trim(), `${lang}: ${key}`);
    }
    assert.equal(activeLocales[lang].template.split('\n').length, 7);
    assert.match(activeLocales[lang].progress, /\{done\}/);
    assert.match(activeLocales[lang].progress, /\{total\}/);
  }
  assert.notEqual(activeLocales.lv.t010, activeLocales.en.t010);
  assert.notEqual(activeLocales.ru.t010, activeLocales.en.t010);
});

test('the complete keyed dictionary loads before the interactive script', () => {
  assert.ok(html.indexOf('src="js/translations.js') >= 0);
  assert.ok(html.indexOf('src="js/main.js') > html.indexOf('src="js/translations.js'));
  assert.ok(!html.includes('src="js/i18n.js'), 'legacy runtime must not also translate the page');
  assert.match(main, /function applyLanguage/);
  assert.match(main, /refreshProgress\(\)/);
  assert.match(main, /if \(copyStatusKey\)/);
  assert.match(main, /application.description = t\('description'\)/);
});

function makeElement(values) {
  const attributes = { ...values };
  return {
    attributes,
    hasAttribute(name) { return Object.hasOwn(attributes, name); },
    getAttribute(name) { return attributes[name]; },
    setAttribute(name, value) { attributes[name] = value; }
  };
}

function setupRuntime() {
  const nodes = [
    { nodeValue: 'It can do things, not just talk about them.', parentElement: { tagName: 'H2' } },
    { nodeValue: 'Tick a step when you\'ve tried it—not only if it passed. Checkmarks are stored in this browser, never sent to Halo.', parentElement: { tagName: 'P' } },
    { nodeValue: issueTemplate, parentElement: { tagName: 'PRE' } }
  ];
  const image = makeElement({ alt: 'Halo Home screen.' });
  const languageLabel = makeElement({ 'aria-label': 'Site language' });
  const metaValues = [
    'Halo is an open-source Android AI assistant and cognitive runtime: local LiteRT inference, phone actions, Notebook and Study, configurable providers, and capability-driven devices.',
    'Halo — a local-first AI assistant and cognitive runtime',
    'Runs on Android, works locally, can act on the phone, keeps a workspace, and extends to connected devices.'
  ];
  const meta = metaValues.map((content) => ({ content }));
  const schema = {
    textContent: JSON.stringify({ description: 'Open-source local-first AI assistant and cognitive runtime.' })
  };
  const picker = { value: 'en', addEventListener(_type, callback) { this.onChange = callback; } };
  const doc = {
    body: {},
    title: '',
    documentElement: { setAttribute(name, value) { this[name] = value; } },
    getElementById(id) { return id === 'halo-language' ? picker : null; },
    createTreeWalker() {
      let current = -1;
      return {
        currentNode: null,
        nextNode() {
          current += 1;
          this.currentNode = nodes[current];
          return Boolean(this.currentNode);
        }
      };
    },
    querySelectorAll(selector) {
      return selector.includes('meta[name="description"]') ? meta :
        selector.includes('[alt]') ? [image, languageLabel] : [];
    },
    querySelector(selector) {
      return selector.includes('application/ld+json') ? schema : null;
    }
  };
  const storage = new Map();
  const events = [];
  const window = {
    HaloTranslations: locales,
    location: { href: 'https://halo.example/?ref=test#alpha' },
    history: { state: null, replaceState(_state, _title, path) { this.path = path; } },
    dispatchEvent(event) { events.push(event); }
  };
  const localStorage = {
    getItem(key) { return storage.get(key) ?? null; },
    setItem(key, value) { storage.set(key, value); }
  };
  class LocaleEvent {
    constructor(type, options) { this.type = type; this.detail = options.detail; }
  }
  runInNewContext(runtime, {
    window, document: doc, NodeFilter: { SHOW_TEXT: 4 },
    navigator: { language: 'en-US' }, localStorage, CustomEvent: LocaleEvent, URL
  });
  return { nodes, image, languageLabel, picker, doc, meta, schema, storage, events, window };
}

test('legacy runtime: switching EN → LV → RU → EN restores all text and preserves state', () => {
  const app = setupRuntime();
  const originalText = app.nodes.map((node) => node.nodeValue);
  assert.equal(app.doc.documentElement.lang, 'en');
  const t = app.window.HaloI18n;
  for (const lang of ['lv', 'ru', 'en', 'lv']) {
    t.setLanguage(lang);
    const dict = locales[lang] || {};
    assert.equal(app.doc.documentElement.lang, lang);
    assert.equal(app.picker.value, lang);
    assert.equal(app.storage.get('halo-web-language'), lang);
    assert.equal(app.nodes[0].nodeValue, dict[originalText[0]] || originalText[0]);
    assert.equal(app.nodes[1].nodeValue, dict[originalText[1]] || originalText[1]);
    assert.equal(app.nodes[2].nodeValue, dict[issueTemplate] || issueTemplate);
    assert.equal(app.image.attributes.alt, dict['Halo Home screen.'] || 'Halo Home screen.');
    assert.equal(app.languageLabel.attributes['aria-label'], dict['Site language'] || 'Site language');
    assert.equal(t.formatProgress(3, 7),
      (dict['{done} of {total} tried'] || '{done} of {total} tried')
        .replace('{done}', '3').replace('{total}', '7'));
    assert.equal(t.t('Template copied.'), dict['Template copied.'] || 'Template copied.');
    assert.equal(app.meta[0].content, dict[metaValuesOutside()] || metaValuesOutside());
    assert.equal(JSON.parse(app.schema.textContent).description,
      dict['Open-source local-first AI assistant and cognitive runtime.'] ||
      'Open-source local-first AI assistant and cognitive runtime.');
    assert.equal(app.events.at(-1).detail.language, lang);
    if (lang === 'en') {
      assert.ok(!app.window.history.path.includes('lang='));
    } else {
      assert.ok(app.window.history.path.includes('lang=' + lang));
    }
  }
});

function metaValuesOutside() {
  return 'Halo is an open-source Android AI assistant and cognitive runtime: local LiteRT inference, phone actions, Notebook and Study, configurable providers, and capability-driven devices.';
}
