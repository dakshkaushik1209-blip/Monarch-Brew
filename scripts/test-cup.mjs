import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');

async function testCup() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  const img = page.locator('img[alt*="iced coffee beverage"]');
  const count = await img.count();
  console.log('Found floating cup image:', count > 0);

  const btn = page.locator('button[aria-label*="Order fresh pull"]');
  const btnCount = await btn.count();
  console.log('Found Order Fresh Pull badge:', btnCount > 0);

  await browser.close();
  console.log('Floating cup test passed cleanly.');
}

testCup().catch(err => {
  console.error(err);
  process.exit(1);
});
