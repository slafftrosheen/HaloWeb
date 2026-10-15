/** Halo Brand Book 1.0 — website regression contract. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const exists=p=>existsSync(new URL('../'+p,import.meta.url));
const html=read('index.html'),tokens=read('css/tokens.css'),css=read('css/main.css'),fonts=read('css/fonts.css'),fx=read('css/halo-fx.css'),main=read('js/main.js');
const ORB_STATES=['idle','listening','capturing_voice','capturing_vision','thinking','planning','acting','acting_phone','speaking','streaming_text','preparing_context','waiting','approval_required','success','warning','error','recovering','model_loading','permission_missing','offline','stopped'];
const ORB_ANIMATED=['idle','listening','capturing_voice','capturing_vision','thinking','acting','speaking','streaming_text','waiting','approval_required','success','warning','error','offline','stopped'];
const ORB_STILL_ONLY=['planning','acting_phone','preparing_context','recovering','model_loading','permission_missing'];
const orbKey=s=>'state'+s.split('_').map(p=>p[0].toUpperCase()+p.slice(1)).join('');
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
 const og=readFileSync(new URL('../assets/og/halo-og-dark.png',import.meta.url));
 assert.equal(og.subarray(1,4).toString(),'PNG');
 assert.equal(og.readUInt32BE(16),1200);
 assert.equal(og.readUInt32BE(20),630);
 assert.ok(og.length<300_000,'social image should be optimized');
 assert.match(html,/og:image:width" content="1200"/);
 assert.match(html,/assets\/og\/halo-og-dark\.png\?v=3/);
});

test('every presence state has kit artwork, a selector and translated copy',()=>{
 for(const state of ORB_STATES){
  assert.ok(exists('assets/brand/orb/svg/halo_orb_'+state+'.svg'),state+' still');
  assert.ok(html.includes('data-orb-state="'+state+'"'),state+' selector');
  for(const lang of ['en','lv','ru']){
   assert.ok(bundle[lang][orbKey(state)],lang+' '+state);
   assert.ok(bundle[lang][orbKey(state)+'Info'],lang+' '+state+' info');
  }
 }
 for(const state of ORB_ANIMATED) assert.ok(exists('assets/brand/orb/lottie/halo_orb_'+state+'.json'),state+' lottie');
 // The kit animates fifteen states; the other six are stills and must not
 // pretend to be animated.
 for(const state of ORB_STILL_ONLY) assert.ok(!exists('assets/brand/orb/lottie/halo_orb_'+state+'.json'),state+' must stay a still');
 assert.match(html,/id="orb-stage"/);
 assert.match(html,/data-orb-sequence=/);
 for(const lang of ['en','lv','ru']) for(const key of ['presenceTitle','presenceIntro','presenceNote','presenceMotionNote','layersTitle','layer2Body','layer3Body','condBatteryLow','ctxOnDevice']) assert.ok(bundle[lang][key],lang+' '+key);
 // Wording refreshed in 970d175; the honesty claim is unchanged, so the
 // assertion tracks the copy as committed.
 assert.match(bundle.en.presenceIntro,/not a live phone session/);
 assert.match(bundle.en.presenceNote,/still needs device verification/);
});

test('the Lottie renderer is vendored, licensed and silent under reduced motion',()=>{
 assert.ok(exists('js/vendor/lottie_light.min.js'));
 assert.match(read('js/vendor/lottie-web-LICENSE.txt'),/MIT License/);
 assert.ok(html.indexOf('js/vendor/lottie_light.min.js')<html.indexOf('js/main.js'),'lottie loads before the site script');
 assert.match(main,/function orbMotionAllowed/);
 assert.match(main,/!reducedQuery\.matches/);
 assert.match(main,/orbStaticSource/);
 assert.match(main,/IntersectionObserver/);
});

test('the icon library is used from one sprite that defines every referenced symbol',()=>{
 const sprite=read('assets/brand/icons.svg');
 assert.match(sprite,/viewBox="0 0 24 24"/);
 assert.match(sprite,/currentColor/);
 const refs=[...html.matchAll(/assets\/brand\/icons\.svg#(i-[a-z_0-9]+)/g)].map(m=>m[1]);
 assert.ok(refs.length>8,'the page should use the in-app icon library');
 for(const ref of new Set(refs)) assert.ok(sprite.includes('id="'+ref+'"'),'sprite is missing '+ref);
});

test('every class used by the page is styled',()=>{
 const used=new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap(m=>m[1].split(/\s+/).filter(Boolean)));
 const defined=new Set([...(css+tokens+fx).matchAll(/\.([A-Za-z][A-Za-z0-9_-]*)/g)].map(m=>m[1]));
 const unstyled=[...used].filter(name=>!defined.has(name)).sort();
 // "product" is only a section anchor hook.
 assert.deepEqual(unstyled,['product'],'unstyled classes');
});
