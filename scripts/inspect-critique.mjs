import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");
import fs from 'fs';
import path from 'path';

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const outDir = 'public/audit-critique';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const pages = [
    { name: 'home', url: 'http://localhost:3000/' },
    { name: 'menu', url: 'http://localhost:3000/menu' },
    { name: 'gallery', url: 'http://localhost:3000/gallery' }
  ];

  const viewports = [
    { name: 'mobile-375', width: 375, height: 812 },
    { name: 'desktop-1280', width: 1280, height: 900 }
  ];

  for (const p of pages) {
    for (const v of viewports) {
      await page.setViewportSize({ width: v.width, height: v.height });
      await page.goto(p.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      const shotPath = path.join(outDir, `${p.name}-${v.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`Saved screenshot: ${shotPath}`);
    }
  }

  await browser.close();
  console.log('Inspection screenshots captured.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
