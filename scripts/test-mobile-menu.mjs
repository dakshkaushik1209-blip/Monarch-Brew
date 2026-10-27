import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function testMobileMenu() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000); // wait for intro sequence to dismiss

  // Click mobile hamburger menu
  const menuButton = page.locator('button[aria-label="Open mobile menu"]');
  await menuButton.click();
  await page.waitForTimeout(300);

  await page.screenshot({ path: "scripts/mobile-menu-open.png" });
  console.log("Saved scripts/mobile-menu-open.png");

  // Verify links inside drawer
  const links = await page.evaluate(() => {
    const dialog = document.querySelector("#fullscreen-mobile-menu");
    if (!dialog) return [];
    return Array.from(dialog.querySelectorAll("a")).map((a) => ({
      text: a.innerText.trim(),
      href: a.getAttribute("href"),
    }));
  });
  console.log("Mobile menu links:", links);

  await browser.close();
}

testMobileMenu().catch(console.error);
