import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function check() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto("http://localhost:3000/gallery", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const section = page.locator('section[aria-labelledby="on-the-table-heading"]');
  await section.screenshot({ path: "scripts/current-table-screenshot.png" });
  console.log("Saved scripts/current-table-screenshot.png");

  const prints = await page.evaluate(() => {
    const table = document.querySelector('section[aria-labelledby="on-the-table-heading"]');
    if (!table) return [];
    return Array.from(table.querySelectorAll("img")).map((img) => ({
      src: img.src,
      currentSrc: img.currentSrc,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      alt: img.alt,
    }));
  });
  console.log("Prints in DOM:", JSON.stringify(prints, null, 2));

  await browser.close();
}

check().catch(console.error);
