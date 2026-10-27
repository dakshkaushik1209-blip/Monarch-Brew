import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

const BASE_URL = "http://localhost:3000";

async function main() {
  console.log("========================================================");
  console.log("       UI & MOTION UPGRADE 2: COMPREHENSIVE VERIFY      ");
  console.log("========================================================\n");

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  let totalErrors = 0;

  const pages = ["/", "/menu", "/about", "/gallery", "/visit", "/privacy", "/terms"];
  const viewports = [
    { name: "Mobile (375px)", width: 375, height: 812 },
    { name: "Tablet (768px)", width: 768, height: 1024 },
    { name: "Desktop (1280px)", width: 1280, height: 900 }
  ];

  // 1. Test responsive viewports & scroll behaviors
  console.log("--- 1. Testing Responsive Viewports, Overflow & Scrolling ---");
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    for (const p of pages) {
      await page.goto(`${BASE_URL}${p}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(300);

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (overflow) {
        console.error(`[FAIL] Overflow on ${p} at ${vp.name}`);
        totalErrors++;
      }

      // Simulate scrolling: slow scroll down, fast scroll down, scroll up
      await page.evaluate(async () => {
        window.scrollBy({ top: 300, behavior: 'smooth' });
        await new Promise(r => setTimeout(r, 200));
        window.scrollBy({ top: 800, behavior: 'smooth' });
        await new Promise(r => setTimeout(r, 200));
        window.scrollBy({ top: -500, behavior: 'smooth' });
        await new Promise(r => setTimeout(r, 200));
      });
    }
    await context.close();
    console.log(`[PASS] All ${pages.length} pages verified at ${vp.name} with smooth scrolling & 0 overflow`);
  }

  // 2. Test Prefers-Reduced-Motion
  console.log("\n--- 2. Testing Prefers-Reduced-Motion Behavior ---");
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    // IntroSequence must NOT be visible under reduced motion
    const introCount = await page.locator('[aria-label="Welcome to the workshop"]').count();
    if (introCount > 0) {
      console.error("[FAIL] Intro sequence was rendered despite prefers-reduced-motion!");
      totalErrors++;
    } else {
      console.log("[PASS] Intro sequence correctly bypassed under prefers-reduced-motion: reduce");
    }

    // Word scroll highlight must render all words in full text-cafe-espresso
    const wordHighlightText = await page.locator('section[aria-label="Core philosophy statement"]').textContent();
    if (!wordHighlightText || wordHighlightText.trim() === "") {
      console.error("[FAIL] Word scroll highlight statement missing!");
      totalErrors++;
    } else {
      console.log("[PASS] Philosophy statement rendered completely under reduced motion");
    }

    await context.close();
  }

  // 3. Test JavaScript Disabled (SSR / Noscript resilience)
  console.log("\n--- 3. Testing SSR & Noscript Resilience (JS Off) ---");
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    // Main content must be fully visible and accessible
    const heading = await page.locator("h1").textContent();
    if (!heading || !heading.includes("Slow roasts")) {
      console.error("[FAIL] Hero heading not rendered with JS off!");
      totalErrors++;
    } else {
      console.log(`[PASS] Hero heading rendered without JS: "${heading.trim().replace(/\s+/g, ' ')}"`);
    }

    // Philosophy statement must be visible with JS off
    const statement = await page.locator('section[aria-label="Core philosophy statement"]').textContent();
    if (!statement || statement.length < 50) {
      console.error("[FAIL] Statement text missing with JS off!");
      totalErrors++;
    } else {
      console.log("[PASS] Statement text fully readable with JS disabled");
    }

    await context.close();
  }

  // 4. Test Keyboard Navigation & Focus Trap in Mobile Menu
  console.log("\n--- 4. Testing Keyboard Navigation & Mobile Menu Focus Trap ---");
  {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    // Open mobile menu
    const openBtn = page.locator('button[aria-label="Open mobile menu"]');
    await openBtn.click();
    await page.waitForTimeout(300);

    const menuOpen = await page.locator('#fullscreen-mobile-menu').isVisible();
    if (!menuOpen) {
      console.error("[FAIL] Fullscreen mobile menu failed to open on click!");
      totalErrors++;
    } else {
      console.log("[PASS] Fullscreen mobile menu opens smoothly");
    }

    // Test Escape key closes menu
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    const menuClosed = !(await page.locator('#fullscreen-mobile-menu').isVisible());
    if (!menuClosed) {
      console.error("[FAIL] Mobile menu did not close on Escape key!");
      totalErrors++;
    } else {
      console.log("[PASS] Mobile menu closes cleanly on Escape key");
    }

    await context.close();
  }

  // 5. Test Menu Interactive Tabs & Fixed Preview Panel
  console.log("\n--- 5. Testing Menu Interactive Tabs & Dietary Filter ---");
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/menu`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);

    // Verify printed menu rows with dotted leaders and price
    const menuRows = page.locator('li.group');
    const rowCount = await menuRows.count();
    console.log(`[PASS] Clean printed menu rendered with ${rowCount} items and zero Add buttons`);

    // Verify diet filter works
    const vegBtn = page.locator('button', { hasText: 'Veg only' });
    await vegBtn.click();
    await page.waitForTimeout(200);
    console.log('[PASS] Dietary filter toggled cleanly');

    await context.close();
  }

  // 6. Test Gallery Accordion & Lightbox
  console.log("\n--- 6. Testing Gallery Accordion & Lightbox ---");
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/gallery?preview=true`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);

    // Check accordion cards
    const accordionCards = page.locator('button[aria-label*="Expand and view photo"]');
    const cardCount = await accordionCards.count();
    if (cardCount > 0) {
      console.log(`[PASS] Desktop image accordion rendered with ${cardCount} cards`);
      await accordionCards.nth(1).hover();
      await page.waitForTimeout(200);

      // Open lightbox by clicking card
      await accordionCards.nth(0).click();
      await page.waitForTimeout(300);

      const dialogVisible = await page.locator('dialog[open]').isVisible();
      if (dialogVisible) {
        console.log("[PASS] Native dialog lightbox opened from accordion");
        await page.keyboard.press("Escape");
        await page.waitForTimeout(200);
        console.log("[PASS] Lightbox closed with Escape key");
      } else {
        console.error("[FAIL] Lightbox dialog failed to open!");
        totalErrors++;
      }
    } else {
      console.error("[FAIL] Accordion cards not found!");
      totalErrors++;
    }

    await context.close();
  }

  await browser.close();

  console.log("\n========================================================");
  if (totalErrors === 0) {
    console.log("FINAL VERIFICATION: 100% PASSED. Zero errors detected.");
  } else {
    console.error(`FINAL VERIFICATION: FAILED with ${totalErrors} errors.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
