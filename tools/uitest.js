// Browser test: creates a character, plays the party and a few weeks, reloads to check the save replays.
// Usage: NODE_PATH=$(npm root -g) node tools/uitest.js <outdir>
const { chromium } = require('playwright');
const path = require('path');
const out = process.argv[2] || '.';
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  const url = 'file://' + path.resolve(__dirname, '..', 'index.html');
  await page.goto(url);
  // build a quick world instead of the 30-second full one
  await page.waitForSelector('.cc', { timeout: 120000 });
  await page.evaluate(() => { build(2027, 2027, 'quick'); });
  await page.waitForSelector('.cc', { timeout: 120000 });
  await page.screenshot({ path: out + '/1-creator.png', fullPage: true });
  await page.fill('#cc-name', 'Sam Tester');
  await page.click('[data-cc="edu"][data-v="filmcam"]');
  await page.click('[data-cc="love"][data-v="Horror"]');
  await page.click('[data-cc="hate"][data-v="Musical"]');
  await page.click('[data-cc="randfav"]');
  await page.click('[data-look="skin:6"]');
  await page.selectOption('[data-lookk="hair"]', '6');
  await page.selectOption('[data-lookk="glasses"]', '1');
  await page.click('[data-cc="quirk"][data-v="rival"]');
  for (let i = 0; i < 4; i++) await page.click('[data-cc="pt"][data-v="cam:1"]');
  await page.click('[data-cc="trait"][data-v="Charming"]');
  await page.click('[data-cc="go"]');
  await page.waitForSelector('[data-party]');
  await page.screenshot({ path: out + '/2-party.png', fullPage: true });
  for (let i = 0; i < 12; i++) { const b = await page.$('[data-party]'); if (!b) break; await b.click(); if (i === 2) await page.screenshot({ path: out + '/2b-rooms.png', fullPage: true }); }
  await page.waitForSelector('.desk');
  await page.screenshot({ path: out + '/3-desk.png', fullPage: true });
  // plan: two hunting days, apply to the first two jobs
  await page.selectOption('#pl-0', 'hunt');
  await page.selectOption('#pl-1', 'hunt');
  for (let i = 0; i < 4; i++) { const b = page.locator('[data-apply]').nth(i); if (await b.isEnabled()) await b.check(); }
  // live the first three days one at a time; the mixer on Wednesday rolls a die
  await page.selectOption('#pl-2', 'network');
  for (let d = 0; d < 7; d++) { const c = await page.$('.beat.decide [data-pick]:not([disabled])'); if (c) { await c.click(); await page.waitForTimeout(150); continue; } await page.click('.beat.next [data-next]'); }
  await page.waitForTimeout(1300);
  await page.screenshot({ path: out + '/3b-days.png', fullPage: true });
  console.log('mid-week day/beat', await page.evaluate(() => S.me.wk && [S.me.wk.day, S.me.wk.beat]));
  for (let w = 0; w < 6; w++) {
    // answer anything pending
    for (let k = 0; k < 30; k++) { const c = await page.$('.beat.decide [data-pick]:not([disabled])'); if (c) { await c.click(); continue; } const w = await page.evaluate(() => S.week); await page.click('header [data-endweek="1"]'); await page.waitForFunction(() => !UI.busy); if (await page.evaluate(w0 => S.week !== w0, w)) break; }
    await page.waitForFunction(() => !UI.busy);
  }
  await page.screenshot({ path: out + '/4-desk-later.png', fullPage: true });
  const before = await page.evaluate(() => ({ week: S.week, cash: S.me.cash, known: Object.keys(S.me.known).length, log: S.log.length }));
  // reload: the saved career should replay to the same place
  await page.reload();
  await page.waitForFunction(() => S && S.me && S.me.party && S.me.party.done && !UI.replaying, null, { timeout: 180000 });
  const after = await page.evaluate(() => ({ week: S.week, cash: S.me.cash, known: Object.keys(S.me.known).length, log: S.log.length }));
  console.log('before', JSON.stringify(before), '\nafter ', JSON.stringify(after), JSON.stringify(before) === JSON.stringify(after) ? 'SAVE OK' : 'SAVE MISMATCH');
  // the player's own sheet
  await page.click('a[data-go^="person:"] >> nth=0');
  await page.screenshot({ path: out + '/5-sheet.png' });
  // phone width
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click('[data-tab="you"]');
  await page.screenshot({ path: out + '/6-phone.png', fullPage: false });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log('phone horizontal overflow px:', overflow);
  console.log('errors:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
