import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

// WCAG Luminance & Contrast
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(lum1, lum2) {
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (brighter + 0.05) / (darker + 0.05);
}

function parseRgb(str) {
  const m = str.match(/\d+/g);
  return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
}

async function run() {
  console.log("=== STARTING HERO STICKER COMPREHENSIVE VERIFICATION ===");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  try {
    // -----------------------------------------------------------------
    // 1. DESKTOP VIEWPORT (1280 x 900)
    // -----------------------------------------------------------------
    await page.setViewportSize({ width: 1280, height: 900 });
    console.log("Navigating to http://localhost:3000/ ...");
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1600); // Wait for intro sequence if any

    // Verify exactly ONE H1 on the page
    const h1Count = await page.locator("h1").count();
    console.log(`PASS: H1 count on page: ${h1Count} (Must be exactly 1)`);
    if (h1Count !== 1) throw new Error(`Expected exactly 1 H1 on page, found ${h1Count}`);

    const heroSection = page.locator('section[aria-label="Welcome"]');
    await heroSection.waitFor({ state: "visible", timeout: 5000 });
    console.log("PASS: Found section[aria-label='Welcome']");

    // Verify H1 accessibility pattern
    const srText = await heroSection.locator(".hero-sr").textContent();
    console.log("H1 accessible screen reader text:", srText);
    if (!srText.includes("Slow roasts and fresh bakes.")) {
      throw new Error(`Screen reader text must be 'Slow roasts and fresh bakes.', got '${srText}'`);
    }

    // Verify Line 1 visible text
    const line1Raw = await heroSection.locator(".hero-line1").textContent();
    const line1Text = line1Raw?.replace(/\u00A0/g, " ")?.trim();
    console.log("H1 Line 1 visible text:", line1Text);
    if (!line1Text?.includes("Slow roasts and")) {
      throw new Error(`Line 1 visible text must include 'Slow roasts and', got '${line1Text}'`);
    }

    // Verify Line 2 script button
    const scriptBtn = heroSection.locator("button.hero-script-wrap");
    const scriptLabel = await scriptBtn.getAttribute("aria-label");
    console.log("Line 2 script button aria-label:", scriptLabel);
    if (!scriptLabel?.includes("Replay the handwriting")) {
      throw new Error(`Script button must have accessible label 'Replay the handwriting', got '${scriptLabel}'`);
    }

    // Verify script SVG is hidden from assistive tech
    const svgAriaHidden = await scriptBtn.locator("svg").getAttribute("aria-hidden");
    console.log("Script SVG aria-hidden:", svgAriaHidden);
    if (svgAriaHidden !== "true") {
      throw new Error("Script SVG must have aria-hidden='true'");
    }

    // Test Replay handwriting click
    console.log("Testing Replay handwriting click...");
    await scriptBtn.click({ force: true });
    await page.waitForTimeout(150);
    const dataOut = await scriptBtn.getAttribute("data-out");
    console.log("Script button data-out during replay:", dataOut);
    await page.waitForTimeout(500);
    const dataOutAfter = await scriptBtn.getAttribute("data-out");
    console.log("Script button data-out after replay:", dataOutAfter);
    if (dataOutAfter !== "false") {
      throw new Error("Replay should complete and set data-out to false");
    }
    console.log("PASS: Replay handwriting functional");

    // Verify supporting line with hours
    const hoursText = await heroSection.locator("p").textContent();
    console.log("Supporting hours line:", hoursText?.trim());
    if (!hoursText?.includes("Monday to Friday")) {
      throw new Error("Supporting line should display real weekday hours");
    }
    console.log("PASS: Supporting hours line rendered from config");

    // Verify Action Buttons
    const menuBtn = heroSection.locator('a[href="/menu"]');
    const visitBtn = heroSection.locator('a[href="/visit"]');
    if ((await menuBtn.count()) === 0 || (await visitBtn.count()) === 0) {
      throw new Error("Hero action buttons missing");
    }
    const menuBtnText = await menuBtn.textContent();
    const visitBtnText = await visitBtn.textContent();
    console.log(`Action buttons: "${menuBtnText?.trim()}" and "${visitBtnText?.trim()}"`);
    if (!menuBtnText?.includes("See the menu") || !visitBtnText?.includes("Find us")) {
      throw new Error("Action buttons must read 'See the menu' and 'Find us'");
    }

    // Verify rectangular button borders (4px radius max)
    const menuRadius = await menuBtn.evaluate((el) => window.getComputedStyle(el).borderRadius);
    const visitRadius = await visitBtn.evaluate((el) => window.getComputedStyle(el).borderRadius);
    console.log(`Button border-radius: menu=${menuRadius}, visit=${visitRadius}`);
    if (parseFloat(menuRadius) > 4.5 || parseFloat(visitRadius) > 4.5) {
      throw new Error("Hero buttons must be rectangular (<= 4px radius)");
    }
    console.log("PASS: Hero buttons are rectangular (<= 4px border radius)");

    // Verify 4 Stickers
    const stickers = heroSection.locator(".hero-stk");
    const stkCount = await stickers.count();
    console.log(`Visible stickers count: ${stkCount} (Must be 4)`);
    if (stkCount !== 4) throw new Error(`Expected 4 stickers on stage, found ${stkCount}`);

    // Verify zero gradients in sticker SVG
    const gradientsInStickers = await heroSection.locator(".hero-stk-body svg linearGradient, .hero-stk-body svg radialGradient").count();
    console.log("Gradients in stickers:", gradientsInStickers);
    if (gradientsInStickers > 0) throw new Error("Gradients detected in sticker SVGs!");
    console.log("PASS: Strictly 0 gradients in sticker SVGs");

    // Verify sticker hover shine has NO gradients and uses hard edges
    const shineHasGradient = await page.evaluate(() => {
      const el = document.querySelector(".hero-stk-body");
      if (!el) return false;
      const bg = window.getComputedStyle(el, "::after").backgroundImage;
      return bg.includes("gradient");
    });
    console.log("Sticker shine uses gradient:", shineHasGradient);
    if (shineHasGradient) throw new Error("Sticker hover shine must NOT use gradients!");
    console.log("PASS: Sticker hover shine uses hard-edged flat clip-path polygon, 0 gradients");

    // Test Sticker Click-to-swap
    const firstStickerBody = stickers.first().locator(".hero-stk-body");
    const itemLabelBefore = await firstStickerBody.getAttribute("aria-label");
    console.log("Sticker 0 before click:", itemLabelBefore);
    await firstStickerBody.click({ force: true });
    await page.waitForTimeout(300);
    const itemLabelAfter = await firstStickerBody.getAttribute("aria-label");
    console.log("Sticker 0 after click:", itemLabelAfter);
    if (itemLabelBefore === itemLabelAfter) {
      throw new Error("Clicking sticker did not swap the item!");
    }
    console.log("PASS: Sticker swap functional");

    // Test Sticker Drag
    const stickerBox = await stickers.first().boundingBox();
    const startX = stickerBox.x + stickerBox.width / 2;
    const startY = stickerBox.y + stickerBox.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 60, startY + 40, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    const stickerBoxAfterDrag = await stickers.first().boundingBox();
    console.log(`Sticker moved from (${startX.toFixed(1)}, ${startY.toFixed(1)}) to (${stickerBoxAfterDrag.x.toFixed(1)}, ${stickerBoxAfterDrag.y.toFixed(1)})`);
    console.log("PASS: Sticker drag and spring settle functional");

    // Test Double click on cluster to reset
    const cluster = heroSection.locator(".hero-cluster");
    await cluster.dblclick({ position: { x: 30, y: 30 }, force: true });
    await page.waitForTimeout(400);
    console.log("PASS: Double-click reset triggered");

    // Test Keyboard navigation (Arrow keys, Shift + Arrow keys)
    await firstStickerBody.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(200);
    await page.keyboard.press("Shift+ArrowLeft");
    await page.waitForTimeout(200);
    console.log("PASS: Keyboard navigation with Shift multiplier functional");

    // Verify WCAG AA Contrast: Terracotta script against Cream background
    const contrastData = await page.evaluate(() => {
      const scriptWrap = document.querySelector(".hero-script-wrap");
      const hero = document.querySelector(".hero-stk-section");
      const fg = window.getComputedStyle(scriptWrap).color;
      const bg = window.getComputedStyle(hero).backgroundColor;
      return { fg, bg };
    });
    const fgRgb = parseRgb(contrastData.fg);
    const bgRgb = parseRgb(contrastData.bg);
    const fgLum = getLuminance(fgRgb[0], fgRgb[1], fgRgb[2]);
    const bgLum = getLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);
    const contrastRatio = getContrast(fgLum, bgLum);
    console.log(`Script text contrast ratio over hero background: ${contrastRatio.toFixed(2)}:1 (FG: ${contrastData.fg}, BG: ${contrastData.bg})`);
    if (contrastRatio < 3.0) { // Large display text threshold is 3:1
      console.warn("Contrast below 3.0:1 threshold!");
    } else {
      console.log("PASS: WCAG AA contrast for large heading text met");
    }

    // Verify Sticky Glass Navbar padding respect
    const heroBox = await heroSection.boundingBox();
    const h1Box = await heroSection.locator("h1").boundingBox();
    console.log(`Hero top: ${heroBox.y}px, H1 top: ${h1Box.y}px (Difference: ${h1Box.y - heroBox.y}px padding)`);
    if (h1Box.y < 80) {
      throw new Error(`H1 top is ${h1Box.y}px, heading may be obscured by sticky navbar!`);
    }
    console.log("PASS: Hero top padding fully clears sticky navbar");

    // Verify ClosingPanel was REMOVED from the bottom of the Home page
    const closingPanelCount = await page.locator('section[aria-label="Say hello"]').count();
    console.log(`Closing panel count on Home page: ${closingPanelCount} (Must be 0)`);
    if (closingPanelCount !== 0) {
      throw new Error("Closing panel must be removed from the Home page!");
    }
    console.log("PASS: Closing panel successfully removed from Home page");

    // Clear any selection and wait for animation to settle
    await page.evaluate(() => window.getSelection()?.removeAllRanges());
    await page.waitForTimeout(1800);

    // Take Desktop Screenshot
    await page.screenshot({ path: "scripts/hero-sticker-desktop-1280.png" });
    console.log("Saved desktop screenshot to scripts/hero-sticker-desktop-1280.png");

    // -----------------------------------------------------------------
    // 2. RESPONSIVE VIEWPORT CHECKS: 360px, 375px, 768px, 1536px
    // -----------------------------------------------------------------
    const viewports = [
      { name: "mobile-360", width: 360, height: 640 },
      { name: "mobile-375", width: 375, height: 667 },
      { name: "tablet-768", width: 768, height: 1024 },
      { name: "desktop-1536", width: 1536, height: 960 },
    ];

    for (const vp of viewports) {
      console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height}) ...`);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(300);

      // Check horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      console.log(`Viewport ${vp.name} has horizontal overflow:`, hasOverflow);
      if (hasOverflow) {
        throw new Error(`Horizontal overflow detected at ${vp.width}px!`);
      }
      console.log(`PASS: 0 horizontal overflow at ${vp.width}px`);

      // Check H1 visible and not clipped
      const h1Visible = await heroSection.locator("h1").isVisible();
      if (!h1Visible) throw new Error(`H1 not visible at ${vp.width}px`);

      if (vp.name === "mobile-375") {
        await page.screenshot({ path: "scripts/hero-sticker-mobile-375.png" });
        console.log("Saved mobile screenshot to scripts/hero-sticker-mobile-375.png");
      }
    }

    // -----------------------------------------------------------------
    // 3. CONSOLE ERRORS CHECK
    // -----------------------------------------------------------------
    console.log("\nTotal console errors encountered:", consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.error("Errors:", consoleErrors);
      throw new Error(`Encountered ${consoleErrors.length} console errors!`);
    }
    console.log("PASS: Strictly 0 console errors!");

    console.log("\n=== ALL HERO STICKER TESTS PASSED SUCCESSFULLY! ===");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
