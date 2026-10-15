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
 assert.match(bundle.en.t075,/test build/);
 assert.match(bundle.en.productKidsBody,/device testing/);
 assert.match(bundle.en.t126,/PDF-page extraction/);
 assert.match(bundle.en.t098,/device-fit estimate/);
});

test('new brand reference art and Android capability wording stay clear',()=>{
  for(const image of ['BrandAssets/devices/02-devices.png','BrandAssets/devices/03-pairing.png','BrandAssets/settings/01-settings-intelligence.png','BrandAssets/settings/02-voice-privacy-advanced.png'])
    assert.ok(html.includes('src="'+image+'"'),image);
  assert.match(bundle.en.phoneAbilitiesBody,/not a grant/);
  assert.match(bundle.en.pairingBody,/does not automatically start recording/);
  assert.match(bundle.en.brandUpdateIntro,/not verified captures/);
  assert.match(bundle.en.settingsMapDisclaimer,/differ by build/);
  assert.match(bundle.en.ringGradientBody,/symbolic, not a live indicator/);
});

test('generator reads the merged translation catalog for workspace, brand and metadata fallbacks',()=>{
 const builder=read('tools/build_translations.py');
 assert.match(builder,/catalog\['en'\]\[m\[2\]\]/);
 assert.match(builder,/catalog\['en'\]\['title'\]/);
 assert.match(builder,/catalog\['en'\]\['description'\]/);
 assert.match(builder,/Placeholder mismatch/);
 // Workspace and annotation keys live outside the editable main-page English catalog.
 for(const key of ['workspaceCanvasBody','workspaceIntro','feedbackAbout']){
   assert.equal(english[key],undefined);
   assert.ok(bundle.en[key],key);
 }
});

test('four design images have accessible full-resolution links and stable layout dimensions',()=>{
 const pages=[
  ['BrandAssets/devices/02-devices.png','brandOpenDevices'],
  ['BrandAssets/devices/03-pairing.png','brandOpenPairing'],
  ['BrandAssets/settings/01-settings-intelligence.png','brandOpenSettings'],
  ['BrandAssets/settings/02-voice-privacy-advanced.png','brandOpenPrivacy']
 ];
 for(const [path,key] of pages){
  const expected='<a class="brand-design-board__link" href="'+path+'" target="_blank" rel="noopener noreferrer"';
  assert.ok(html.includes(expected),'missing full-resolution link: '+path);
  const image=readFileSync(join(root,path));
  assert.equal(image.readUInt32BE(16),2400,path+' width');
  assert.equal(image.readUInt32BE(20),1500,path+' height');
  assert.match(html,/width="2400" height="1500"/);
  for(const lang of ['en','lv','ru'])assert.ok(bundle[lang][key]?.trim(),lang+' '+key);
 }
 for(const lang of ['en','lv','ru'])assert.ok(bundle[lang].brandViewFull?.trim());
 const nav=id=>html.indexOf('href="#'+id+'"');
 assert.ok(nav('alpha')<nav('presence'),'navigation should match the product-first page order');
});
test('Russian support instructions consistently use formal address',()=>{
 assert.match(bundle.ru.copyManual,/Выделите/);
 assert.match(bundle.ru.copyFailure,/скопируйте/);
 assert.match(bundle.ru.template,/скройте личные данные/);
});
