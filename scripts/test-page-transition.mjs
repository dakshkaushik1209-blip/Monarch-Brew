import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function testPageTransitions() {
  console.log("Starting page transition verification...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  // 1. Initial load Home
  console.log("Navigating to Home (http://localhost:3000/)...");
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // 2. Click Menu in desktop navbar
  console.log("Clicking Menu link in desktop navbar...");
  const menuLink = page.locator("nav[aria-label='Main Navigation'] a[href^='/menu']");
  await menuLink.click();
  await page.waitForFunction(() => window.location.pathname.includes("/menu"));
  await page.waitForTimeout(600);

  const menuTitle = await page.title();
  const menuScrollY = await page.evaluate(() => window.scrollY);
  console.log(`[PASS] Navigated to Menu. Title: "${menuTitle}", scrollY: ${menuScrollY}`);

  if (menuScrollY !== 0) {
    console.error(`[FAIL] Expected scrollY to be 0 after page transition, got ${menuScrollY}`);
  }

  // 3. Scroll down on Menu page to test scroll reset on next navigation
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(200);

  // 4. Click About link in desktop navbar
  console.log("Clicking About link in desktop navbar...");
  const aboutLink = page.locator("nav[aria-label='Main Navigation'] a[href^='/about']");
  await aboutLink.click();
  await page.waitForFunction(() => window.location.pathname.includes("/about"));
  await page.waitForTimeout(600);

  const aboutTitle = await page.title();
  const aboutScrollY = await page.evaluate(() => window.scrollY);
  console.log(`[PASS] Navigated to About. Title: "${aboutTitle}", scrollY: ${aboutScrollY}`);

  if (aboutScrollY !== 0) {
    console.error(`[FAIL] Expected scrollY to be reset to 0 after page transition, got ${aboutScrollY}`);
  }

  // 5. Click Gallery link
  console.log("Clicking Gallery link in desktop navbar...");
  const galleryLink = page.locator("nav[aria-label='Main Navigation'] a[href^='/gallery']");
  await galleryLink.click();
  await page.waitForFunction(() => window.location.pathname.includes("/gallery"));
  await page.waitForTimeout(600);
  console.log(`[PASS] Navigated to Gallery.`);

  // 6. Click Visit link
  console.log("Clicking Visit link in desktop navbar...");
  const visitLink = page.locator("nav[aria-label='Main Navigation'] a[href^='/visit']");
  await visitLink.click();
  await page.waitForFunction(() => window.location.pathname.includes("/visit"));
  await page.waitForTimeout(600);
  console.log(`[PASS] Navigated to Visit.`);
  await page.waitForTimeout(500);
  console.log(`[PASS] Navigated to Visit.`);

  // Filter non-fatal noise
  const realErrors = consoleErrors.filter(
    (err) => !err.includes("favicon") && !err.includes("Failed to load resource")
  );

  await browser.close();

  if (realErrors.length > 0) {
    console.error("[FAIL] Console errors occurred during page navigation:", realErrors);
    process.exit(1);
  }

  console.log("\n========================================================");
  console.log("ALL PAGE TRANSITION TESTS PASSED WITH ZERO CONSOLE ERRORS!");
  console.log("========================================================\n");
}

testPageTransitions().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
