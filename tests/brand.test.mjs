/** Halo Brand Book v1.0 — public site contract. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = p => readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),tokens=read('css/tokens.css'),css=read('css/main.css');
const mark=read('assets/brand/halo-ring.svg'),favicon=read('favicon.svg');
const bundle=JSON.parse(read('js/translations.js').split('window.HaloTranslations = ')[1].replace(/;\s*$/,''));
test('uses approved brand tokens and typography',()=>{
 for(const color of ['#0CF2BA','#060330','#047A5E','#FAFAF4','#4A4F63','#FF9F6B','#B4E6D6'])assert.ok(tokens.includes(color),color);
 assert.match(tokens,/Sora/);assert.match(tokens,/Atkinson Hyperlegible Next/);
});
test('uses an open ring in header, footer and icon',()=>{
 assert.ok(html.includes('assets/brand/halo-ring.svg'));assert.match(mark,/stroke-linecap="round"/);
 assert.doesNotMatch(mark,/<circle/);assert.doesNotMatch(favicon,/<circle/);
 assert.doesNotMatch(html,/<span class="brand-core"/);
});
test('translates identity message in English, Latvian and Russian',()=>{
 for(const lang of ['en','lv','ru'])for(const key of ['t016','t017','brandPromise'])assert.ok(bundle[lang][key]);
 assert.match(html,/data-i18n="brandPromise"/);
});
test('hero keeps actual screenshot, real alpha CTA and approved motif',()=>{
 assert.match(html,/assets\/screens\/home.jpg/);assert.match(html,/href="#alpha"/);
 assert.match(css,/halo-ring\.svg/);assert.match(css,/var\(--night-ink\)/);
});
