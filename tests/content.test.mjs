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
const bundle = JSON.parse(read('js/translations.js').split('window.HaloTranslations = ')[1].replace(/;\s*$/, ''));
// Normalise CRLF so the check reads the same on Windows (core.autocrlf) and elsewhere.
const rows = read('tools/translations.tsv').replace(/\r\n?/g, '\n').trimEnd().split('\n')
  .map((line) => line.split('\t'));

test('the visitor sees the product before technical architecture', () => {
  const sections = ['product', 'actions', 'workspace', 'ai', 'devices', 'status', 'runtime', 'alpha'];
  const positions = sections.map((id) => html.indexOf('id="' + id + '"'));
  assert.ok(positions.every((pos) => pos >= 0), 'a major section is missing');
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.match(bundle.en.t019, /AI assistant for Android/);
  assert.match(bundle.en.t019, /Glasses are optional/);
  assert.match(bundle.en.t171, /compile checks, unit tests and physical device acceptance are different things/);
  assert.match(bundle.en.t188, /GitHub Releases/);
  assert.match(bundle.en.t042, /Activity shows pending approvals and results/);
  assert.match(bundle.en.t096, /Remote requests can send relevant context/);
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
  for (const [, key, fallback] of html.matchAll(/<span data-i18n="([^"]+)">([^<]*)<\/span>/g)) {
    assert.equal(fallback, bundle.en[key], 'outdated HTML fallback for ' + key);
  }
  assert.ok(html.includes('<title>' + bundle.en.title + '</title>'));
  assert.ok(html.includes('name="description" content="' + bundle.en.description + '"'));
});

test('alpha visitor can reach the actual product and testing route before design reference',()=>{
 const index=id=>html.indexOf('id="'+id+'"');
 assert.ok(index('product')>0&&index('alpha')>index('product'));
 assert.ok(index('mission')>index('alpha')&&index('ring')>index('mission')&&index('presence')>index('ring'));
 assert.match(bundle.en.t019,/AI assistant for Android/);
 assert.match(bundle.en.t075,/has changed since these captures/);
 assert.match(bundle.en.productKidsBody,/device testing/);
 assert.match(bundle.en.t126,/PDF-page extraction/);
 assert.match(bundle.en.t098,/fit estimate/);
});
