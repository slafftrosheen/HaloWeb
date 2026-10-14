/** Halo Brand Book 1.0 — website regression contract. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const exists=p=>existsSync(new URL('../'+p,import.meta.url));
const html=read('index.html'),tokens=read('css/tokens.css'),css=read('css/main.css'),fonts=read('css/fonts.css');
const mark=read('assets/brand/halo-ring.svg'),wordmark=read('assets/brand/halo-wordmark.svg');
const bundle=JSON.parse(read('js/translations.js').split('window.HaloTranslations = ')[1].replace(/;\s*$/,''));
test('palette and typography are canonical',()=>{
 for(const color of ['#0CF2BA','#060330','#047A5E','#FAFAF4','#4A4F63','#FF9F6B','#B4E6D6'])assert.ok(tokens.includes(color),color);
 assert.match(tokens,/Sora/);assert.match(tokens,/Atkinson Hyperlegible Next/);assert.match(tokens,/Onest/);
});
test('open-ring artwork and faithful traced wordmark replace generated text',()=>{
 assert.match(mark,/gradientUnits="objectBoundingBox"/);
 assert.match(mark,/M234,4/);assert.doesNotMatch(mark,/<circle/);
 assert.match(wordmark,/fill-rule="evenodd"/);
 assert.match(html,/src="assets\/brand\/halo-wordmark\.svg"/);
 assert.doesNotMatch(html,/<span class="brand-word">/);
 assert.match(html,/footer-brand-wordmark/);
});
test('licensed self-hosted fonts cover Latin, Latvian, and Cyrillic glyphs',()=>{
 for(const name of ['sora-variable.ttf','atkinson-hyperlegible-next-variable.ttf','atkinson-hyperlegible-next-italic-variable.ttf','onest-cyrillic-variable.ttf'])assert.ok(exists('assets/fonts/'+name),name);
 for(const file of ['OFL-Sora.txt','OFL-Atkinson-Hyperlegible-Next.txt','OFL-Onest.txt'])assert.match(read('assets/fonts/'+file),/SIL OPEN FONT LICENSE/);
 assert.match(fonts,/font-display:swap/);assert.match(fonts,/unicode-range:U\+0400-052F/);
 assert.doesNotMatch(html,/<link[^>]+rel="stylesheet"[^>]+href="https?:\/\//);
});
test('EN/LV/RU brand messages and existing alpha workflow remain',()=>{
 for(const lang of ['en','lv','ru'])for(const key of ['t016','t017','brandPromise'])assert.ok(bundle[lang][key]);
 assert.match(html,/data-i18n="brandPromise"/);assert.match(html,/id="app-track"/);
 assert.match(html,/id="feedback-form"/);assert.match(html,/id="site-language"/);
 assert.match(html,/href="https:\/\/github.com\/slafftrosheen\/Halo\/releases"/);
 assert.match(css,/halo-ring\.svg/);assert.match(css,/var\(--night-ink\)/);
});

test('Open Graph preview is a lightweight, brand-aligned PNG with correct dimensions',()=>{
 const og=readFileSync(new URL('../assets/halo-og.png',import.meta.url));
 assert.equal(og.subarray(1,4).toString(),'PNG');
 assert.equal(og.readUInt32BE(16),600);
 assert.equal(og.readUInt32BE(20),315);
 assert.ok(og.length<300_000,'social image should be optimized');
 assert.match(html,/og:image:width" content="600"/);
 assert.match(html,/halo-og\.png\?v=2/);
});
