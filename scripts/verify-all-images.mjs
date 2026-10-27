import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function verifyAllImages() {
  console.log("Launching Chromium for full image verification...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const pagesToTest = [
    { url: "http://localhost:3000/", name: "Home" },
    { url: "http://localhost:3000/menu", name: "Menu" },
    { url: "http://localhost:3000/about", name: "About" },
    { url: "http://localhost:3000/gallery", name: "Gallery" },
    { url: "http://localhost:3000/visit", name: "Visit" },
  ];

  const brokenImages = [];
  const consoleErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  for (const p of pagesToTest) {
    console.log(`\nTesting page: ${p.name} (${p.url})`);
    await page.goto(p.url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Smooth scroll down the page to trigger all lazy-loaded images
    await page.evaluate(async () => {
      const scrollHeight = document.body.scrollHeight;
      for (let y = 0; y <= scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });

    await page.waitForTimeout(1500);

    // Check all visible <img> tags on page
    const images = await page.$$eval("img", (imgs) =>
      imgs
        .filter((img) => img.offsetParent !== null) // only check actually rendered/visible elements
        .map((img) => ({
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          alt: img.alt,
          complete: img.complete,
        }))
    );

    console.log(`  Found ${images.length} images on ${p.name}`);
    for (const img of images) {
      if (!img.complete || img.naturalWidth === 0) {
        console.error(`  [BROKEN IMAGE] on ${p.name}:`, img.src, `(alt: "${img.alt}")`);
        brokenImages.push({ page: p.name, ...img });
      } else {
        // Log image success
        const shortSrc = img.src.replace("http://localhost:3000", "");
        console.log(`  [OK] ${shortSrc} (${img.naturalWidth}x${img.naturalHeight})`);
      }
    }

    // Take screenshots for desktop
    const screenshotPath = `scripts/audit-${p.name.toLowerCase()}-desktop.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`  Saved screenshot: ${screenshotPath}`);
  }

  // Also test mobile viewport for Menu and About
  console.log("\nTesting mobile viewport (375px)...");
  await page.setViewportSize({ width: 375, height: 812 });

  await page.goto("http://localhost:3000/menu", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scripts/audit-menu-mobile.png", fullPage: false });
  console.log("  Saved screenshot: scripts/audit-menu-mobile.png");

  await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "scripts/audit-about-mobile.png", fullPage: false });
  console.log("  Saved screenshot: scripts/audit-about-mobile.png");

  await browser.close();

  console.log("\n========================================================");
  console.log(`BROKEN IMAGES DETECTED: ${brokenImages.length}`);
  console.log(`CONSOLE ERRORS DETECTED: ${consoleErrors.length}`);
  console.log("========================================================");

  if (brokenImages.length > 0) {
    process.exit(1);
  }
}

verifyAllImages().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
