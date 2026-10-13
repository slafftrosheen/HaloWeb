/**
 * Contract for the public visitor story and editable tri-lingual copy.
 * Run with: node --test tests/content.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const html = read('index.html');
const english = JSON.parse(read('tools/english-catalog.json'));
const bundle = JSON.parse(read('js/translations.js').split('window.HaloTranslations = ')[1].replace(/;\\s*$/, ''));
const rows = read('tools/translations.tsv').trimEnd().split('\\n')
  .map((line) => line.split('\\t'));

test('the visitor sees the product before technical architecture', () => {
  const sections = ['product', 'actions', 'workspace', 'ai', 'devices', 'status', 'runtime', 'alpha'];
  const positions = sections.map((id) => html.indexOf('id="' + id + '"'));
  assert.ok(positions.every((pos) => pos >= 0), 'a major section is missing');
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.match(bundle.en.t019, /AI assistant for Android/);
  assert.match(bundle.en.t019, /Glasses are optional/);
  assert.match(bundle.en.t171, /not every workflow has passed hands-on testing/);
  assert.match(bundle.en.t188, /GitHub Releases/);
  assert.ok(html.includes('href="https://github.com/slafftrosheen/Halo/releases"'));
});

test('editable catalogs match the generated EN, LV and RU bundle', () => {
  assert.equal(rows.length, Object.keys(english).length);
  for (const [key, lv, ru] of rows) {
    assert.equal(bundle.en[key], english[key], 'English ' + key);
    assert.equal(bundle.lv[key], lv, 'Latvian ' + key);
    assert.equal(bundle.ru[key], ru, 'Russian ' + key);
    assert.ok(lv.trim() && ru.trim(), key + ' must not be blank');
  }
});

test('English HTML works without JavaScript and matches the copy source', () => {
  for (const [, key, fallback] of html.matchAll(/<span data-i18n="([^"]+)">([^<]*)<\\/span>/g)) {
    assert.equal(fallback, bundle.en[key], 'outdated HTML fallback for ' + key);
  }
  assert.ok(html.includes('<title>' + bundle.en.title + '</title>'));
  assert.ok(html.includes('name="description" content="' + bundle.en.description + '"'));
});
