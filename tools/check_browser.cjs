// Run with NODE_PATH pointing to an installed Playwright package directory.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({channel:'msedge', headless:true});
 const page = await browser.newPage();
 const errors = [];
 page.on('pageerror', e => errors.push(e.message));
 page.on('response', r => {if(r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);});
 const output = path.resolve(__dirname, '../../.codex/haloweb-review-20261013');
 fs.mkdirSync(output, {recursive:true});
 for (const width of [1440, 1280, 1024, 768, 390, 320]) {
  await page.setViewportSize({width, height:960});
  await page.goto('http://127.0.0.1:8765/?lang=en');
  for (const lang of ['en','lv','ru']) {
   await page.selectOption('#site-language', lang);
   assert.equal(await page.locator('html').getAttribute('lang'), lang);
   for (const theme of ['light','dark']) {
    await page.locator(`[data-theme-mode="${theme}"]`).click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    const issues = await page.evaluate(() => {
     const problems = [];
     if(document.documentElement.scrollWidth > innerWidth + 1) problems.push('horizontal page overflow');
     for(const el of document.querySelectorAll('[data-i18n]')) {
      if(el.textContent === 'undefined') problems.push('missing translation');
     }
     const header = document.querySelector('.header-actions').getBoundingClientRect();
     if(header.right > innerWidth || header.left < 0) problems.push('header clipped');
     const masthead = document.querySelector('.site-header');
     const nav = document.querySelector('.site-nav');
     const navRect = nav.getBoundingClientRect();
     if(getComputedStyle(nav).display === 'none' || navRect.width < 140 || navRect.height < 35)
      problems.push('navigation is missing or too small');
     if([...nav.querySelectorAll('a')].some(link => link.getBoundingClientRect().height < 43))
      problems.push('navigation touch target below 44px');
     const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sticky-header-height'));
     if(!Number.isFinite(offset) || offset + 1 < masthead.getBoundingClientRect().height)
      problems.push('in-page links can hide behind sticky header');
     const hero = document.querySelector('.hero-shot img').getBoundingClientRect();
     if(hero.height > 635) problems.push('hero screenshot is oversized');
     for(const img of document.images) {
      if(img.complete && !img.naturalWidth) problems.push(`broken image ${img.src}`);
      if(img.complete && img.naturalWidth && img.getBoundingClientRect().width) {
       const r = img.getBoundingClientRect();
       if(Math.abs(r.width/r.height - img.naturalWidth/img.naturalHeight) > .01) problems.push(`distorted image ${img.src}`);
      }
     }
     return problems;
    });
    assert.deepEqual(issues, [], `${width} ${lang} ${theme}`);
   }
  }
 }
 // Verify an anchor actually lands below the two-row sticky header.
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://127.0.0.1:8765/?lang=ru');
 await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  document.querySelector('.site-nav a[href="#alpha"]').click();
 });
 await page.waitForTimeout(100);
 const anchorMetrics = await page.evaluate(() => ({
  top: document.getElementById('alpha').getBoundingClientRect().top,
  header: document.querySelector('.site-header').getBoundingClientRect().height
 }));
 assert.ok(anchorMetrics.top >= anchorMetrics.header - 3
   && anchorMetrics.top <= anchorMetrics.header + 60,
   'alpha anchor must remain visible below responsive header');
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://127.0.0.1:8765/?lang=en');
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.app-slide').count(),12);
 await page.locator('[data-app-screen="11"]').click();
 await page.waitForTimeout(100);
 assert.equal(await page.locator('[data-app-screen="11"]').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('#app-position').textContent(),'Screen 12 of 12');
 await page.locator('#app-track').focus();
 await page.keyboard.press('Home');
 await page.waitForTimeout(100);
 assert.equal(await page.locator('#app-position').textContent(),'Screen 1 of 12');
 await page.keyboard.press('ArrowRight');
 await page.waitForTimeout(100);
 assert.equal(await page.locator('#app-position').textContent(),'Screen 2 of 12');
 await page.locator('#app-previous').click();
 await page.waitForTimeout(100);
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.locator('[data-theme-mode="light"]').click();
 await page.waitForTimeout(900);
 await page.screenshot({path:path.join(output,'desktop-en-light.png')});
 await page.evaluate(()=>scrollTo(0,document.getElementById('product').offsetTop - 70));
 await page.waitForTimeout(900);
 await page.screenshot({path:path.join(output,'gallery-en-light.png')});
 await page.setViewportSize({width:390,height:844});
 await page.selectOption('#site-language','ru');
 await page.locator('[data-theme-mode="dark"]').click();
 await page.evaluate(()=>scrollTo(0,0));
 await page.waitForTimeout(900);
 await page.screenshot({path:path.join(output,'mobile-ru-dark.png')});
 await page.locator('[data-alpha-step="setup"]').check();
 assert.equal(await page.locator('#alpha-progress-label').textContent(), 'Попробовано: 1 из 7');
 await page.selectOption('#site-language','lv');
 assert.equal(await page.locator('#alpha-progress-label').textContent(), 'Izmēģināts: 1 no 7');
 assert.match(await page.locator('#alpha-issue-template').textContent(), /Halo versija/);
 await page.reload();
 assert.equal(await page.locator('html').getAttribute('lang'), 'lv');
 assert.equal(await page.locator('[data-alpha-step="setup"]').isChecked(), true);
 await page.locator('#alpha-reset').click();
 assert.equal(await page.locator('#alpha-progress-label').textContent(), 'Izmēģināts: 0 no 7');
 await page.locator('.alpha-report__template summary').click();
 await page.locator('#alpha-copy-template').click();
 await page.waitForTimeout(200);
 assert.match(await page.locator('#alpha-copy-status').textContent(), /Veidne|veidni/);
 // Inspect the exact mail draft without launching a mail app or sending email.
 await page.evaluate(()=>document.addEventListener('click',e=>{
  const a=e.target.closest('a');
  if(a && a.protocol === 'mailto:'){e.preventDefault();window.testMailDraft=a.href;}
 },true));
 const form=page.locator('#feedback-form');
 await form.locator('[name="screen"]').fill('Canvas & Study');
 await form.locator('[name="summary"]').fill('A confusing button?\nPlease explain.');
 await form.locator('[name="kind"]').selectOption('kindBug');
 await form.locator('[name="email"]').fill('tester@example.com');
 await page.locator('[data-alpha-step="setup"]').check();
 await form.locator('[type="submit"]').click();
 const draft=await page.evaluate(()=>window.testMailDraft);
 assert.equal(new URL(draft).pathname,'slaff.trosheen@gmail.com');
 assert.match(new URL(draft).searchParams.get('body'),/Canvas & Study/);
 assert.match(new URL(draft).searchParams.get('body'),/A confusing button\?\nPlease explain\./);
 assert.match(new URL(draft).searchParams.get('body'),/Iepazīsti lietotni/);
 assert.match(await page.locator('#feedback-status').textContent(),/vēl nav nosūtīta/);
 await page.selectOption('#site-language','ru');
 assert.equal(await form.locator('[name="summary"]').inputValue(),'A confusing button?\nPlease explain.');
 assert.equal(await form.locator('[name="kind"]').inputValue(),'kindBug');
 assert.match(await page.locator('#feedback-body').textContent(),/Попробованные шаги/);
 await page.locator('#feedback-copy').click();
 await page.waitForTimeout(100);
 assert.match(await page.locator('#feedback-status').textContent(),/Отзыв скопирован|Копирование недоступно/);
 await page.locator('#feedback').scrollIntoViewIfNeeded();
 await page.screenshot({path:path.join(output,'feedback-ru-dark.png')});
 await form.locator('[type="reset"]').click();
 assert.equal(await form.locator('[name="summary"]').inputValue(),'');
 assert.equal(await page.locator('#feedback-body').textContent(),'');
 assert.equal(await page.locator('[data-alpha-step="setup"]').isChecked(),true);
 await form.locator('[name="screen"]').fill(' ');
 await form.locator('[name="summary"]').fill(' ');
 await form.locator('[type="submit"]').click();
 assert.equal(await form.evaluate(f=>f.checkValidity()),false);
 assert.equal(await page.locator('#feedback-body').textContent(),'');
 // Scroll through all lazy-loaded captures before checking them.
 for (const img of await page.locator('img:visible').all()) await img.scrollIntoViewIfNeeded();
 for (const name of ['notebook','canvas','study']) {
  await page.locator('#workspace-tab-'+name).click();
  assert.equal(await page.locator('#workspace-panel-'+name).isVisible(),true);
  assert.equal(await page.locator('.workspace-panel:visible').count(),1);
  await page.locator('#workspace-panel-'+name+' img').scrollIntoViewIfNeeded();
 }
 await page.locator('#workspace-tab-study').focus();
 await page.keyboard.press('Home');
 assert.equal(await page.locator('#workspace-tab-notebook').getAttribute('aria-selected'),'true');
 await page.keyboard.press('ArrowDown');
 assert.equal(await page.locator('#workspace-tab-canvas').getAttribute('aria-selected'),'true');
 await page.selectOption('#site-language','lv');
 assert.equal(await page.locator('#workspace-tab-canvas').getAttribute('aria-selected'),'true');
 await page.setViewportSize({width:1440,height:1000});
 await page.evaluate(()=>scrollTo(0,document.querySelector('.workspace-explorer').getBoundingClientRect().top + scrollY - 110));
 await page.screenshot({path:path.join(output,'workspace-lv-dark.png')});
 await page.waitForTimeout(300);
 assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete || !i.naturalWidth).length),0);
 // The static page remains readable if JavaScript or local storage is unavailable.
 const staticPage = await browser.newPage({javaScriptEnabled:false});
 await staticPage.goto('http://127.0.0.1:8765/');
 assert.equal(await staticPage.locator('h1').isVisible(),true);
 assert.equal(await staticPage.locator('#feedback-form [type="submit"]').isDisabled(),true);
 const blockedPage = await browser.newPage();
 await blockedPage.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}}));
 await blockedPage.goto('http://127.0.0.1:8765/?lang=lv');
 await blockedPage.selectOption('#site-language','ru');
 assert.equal(await blockedPage.locator('html').getAttribute('lang'),'ru');
 assert.deepEqual(errors,[]);
 console.log('PASS: 36 viewport/language/theme combinations, workspace tabs and keyboard navigation, carousel navigation, mail draft encoding and recipient, form state and reset, assets, persistence, checklist, copy, no-JS and blocked-storage fallback.');
 console.log(`Review images: ${output}`);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
