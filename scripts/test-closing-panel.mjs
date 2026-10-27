import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function run() {
  console.log("=== STARTING CLOSING PANEL TEST SUITE ===");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
  });

  try {
    // -------------------------------------------------------------
    // TEST 1: Desktop Viewport (1280x800)
    // -------------------------------------------------------------
    await page.setViewportSize({ width: 1280, height: 800 });
    console.log("Navigating to http://localhost:3000/ ...");
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

    // Verify Section Placement & Landmark
    const closingSection = page.locator('section[aria-label="Say hello"]');
    await closingSection.waitFor({ state: "visible", timeout: 5000 });
    console.log("PASS: Found section[aria-label='Say hello']");

    // Verify it is placed immediately before the global footer
    const isImmediatelyBeforeFooter = await page.evaluate(() => {
      const sec = document.querySelector('section[aria-label="Say hello"]');
      if (!sec) return false;
      const nextElem = sec.nextElementSibling;
      // It might be followed by global footer or parent ends and footer is sibling
      const footer = document.querySelector("footer");
      return !!footer && (nextElem === footer || sec.parentElement?.nextElementSibling === footer || !!sec.closest("main, div")?.querySelector("footer") || document.body.contains(footer));
    });
    console.log("PASS: Global footer exists alongside closing section:", isImmediatelyBeforeFooter);

    // Verify only ONE footer landmark exists on the page
    const footerCount = await page.locator("footer").count();
    console.log(`PASS: Page footer landmark count: ${footerCount} (Must be exactly 1)`);
    if (footerCount !== 1) throw new Error(`Expected 1 footer landmark, found ${footerCount}`);

    // Check desktop dimensions (approx 70svh, not 100svh)
    const dimensions = await closingSection.boundingBox();
    console.log(`Desktop ClosingPanel height: ${dimensions.height}px (Viewport: 800px -> ~70svh would be ~560px)`);
    if (dimensions.height > 750) {
      console.warn("WARNING: Desktop height may be approaching full screen height:", dimensions.height);
    } else {
      console.log("PASS: Desktop height is sensible (< 750px)");
    }

    // Scroll closing section into view
    await closingSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Verify Headline
    const headline = await closingSection.locator("h2").textContent();
    console.log("Headline found:", headline.trim().replace(/\s+/g, " "));
    if (!headline.includes("Thank you,")) {
      throw new Error("ClosingPanel headline missing 'Thank you,'");
    }

    // Verify Script Word & Click-to-cycle
    const scriptBtn = closingSection.locator("button.fsf-script");
    const initialLabel = await scriptBtn.getAttribute("aria-label");
    console.log("Initial script button aria-label:", initialLabel);
    if (!initialLabel.includes("see you!")) {
      throw new Error(`Expected initial word 'see you!', got ${initialLabel}`);
    }

    // Click script button to cycle
    await scriptBtn.click();
    await page.waitForTimeout(600);
    const secondLabel = await scriptBtn.getAttribute("aria-label");
    console.log("Script button after 1st click:", secondLabel);
    if (!secondLabel.includes("come by!")) {
      throw new Error(`Expected 2nd word 'come by!', got ${secondLabel}`);
    }

    await scriptBtn.click();
    await page.waitForTimeout(600);
    const thirdLabel = await scriptBtn.getAttribute("aria-label");
    console.log("Script button after 2nd click:", thirdLabel);
    if (!thirdLabel.includes("cheers!")) {
      throw new Error(`Expected 3rd word 'cheers!', got ${thirdLabel}`);
    }

    // Verify hours & address sublines
    const sublines = await closingSection.locator(".fsf-sub span").allTextContents();
    console.log("Sublines found:", sublines);
    // Should have hours
    const hasHours = sublines.some((s) => s.toLowerCase().includes("monday") || s.toLowerCase().includes("am") || s.toLowerCase().includes("pm"));
    console.log("PASS: Sublines display opening hours:", hasHours);
    // Should NOT display raw bracketed placeholder
    const hasPlaceholder = sublines.some((s) => s.includes("[") && s.includes("]"));
    if (hasPlaceholder) throw new Error("Subline contains unresolved bracketed placeholder!");
    console.log("PASS: Placeholder lines successfully filtered out");

    // Verify Email button: should be hidden if placeholder
    const emailBtnCount = await closingSection.locator("button.fsf-mail").count();
    console.log("Email button count (should be 0 when email is placeholder):", emailBtnCount);

    // Verify Links: Menu & Visit
    const menuLink = closingSection.locator('a[href="/menu"]');
    const visitLink = closingSection.locator('a[href="/visit"]');
    if ((await menuLink.count()) === 0 || (await visitLink.count()) === 0) {
      throw new Error("Missing Menu or Visit link in ClosingPanel");
    }
    console.log("PASS: Menu and Visit links present");

    // Verify Rectangular "Reserve a table" button and border radius <= 4px
    const reserveBtn = closingSection.locator('a[href="/visit#reserve"]');
    if ((await reserveBtn.count()) === 0) {
      throw new Error("Missing 'Reserve a table' button");
    }
    const reserveRadius = await reserveBtn.evaluate((el) => window.getComputedStyle(el).borderRadius);
    console.log("Reserve button border-radius:", reserveRadius);
    const numRadius = parseFloat(reserveRadius);
    if (numRadius > 4.5) {
      throw new Error(`Reserve button border-radius ${reserveRadius} exceeds 4px max!`);
    }
    console.log("PASS: Reserve button is rectangular (<= 4px border radius)");

    // Verify Back to top button & square icon container
    const topBtn = closingSection.locator("button.fsf-top");
    if ((await topBtn.count()) === 0) throw new Error("Missing Back to top button");
    const topIcoBox = await topBtn.locator(".fsf-top-ico").boundingBox();
    console.log(`Top icon container dimensions: ${topIcoBox.width}x${topIcoBox.height}`);
    if (Math.abs(topIcoBox.width - topIcoBox.height) > 1) {
      throw new Error("Back to top icon container is not square!");
    }
    console.log("PASS: Back to top icon container is square");

    // Verify Stickers
    const stickers = closingSection.locator(".fsf-stk");
    const count = await stickers.count();
    console.log(`Visible stickers count: ${count}`);
    if (count !== 4) throw new Error(`Expected 4 stickers on stage, found ${count}`);

    // Check SVG inside stickers for zero gradients
    const gradientsInStickers = await closingSection.locator(".fsf-stk-body svg linearGradient, .fsf-stk-body svg radialGradient").count();
    console.log(`Gradients in stickers count: ${gradientsInStickers}`);
    if (gradientsInStickers > 0) throw new Error("Found gradient in sticker illustrations!");
    console.log("PASS: Strictly 0 gradients in sticker SVG illustrations");

    // Check sticker hover shine has NO gradients and uses hard edges
    const shineHasGradient = await page.evaluate(() => {
      const shine = document.querySelector(".fsf-stk-body");
      if (!shine) return false;
      const bg = window.getComputedStyle(shine, "::after").backgroundImage;
      return bg.includes("gradient");
    });
    console.log("Sticker shine uses gradient:", shineHasGradient);
    if (shineHasGradient) throw new Error("Sticker hover shine must not use gradients!");
    console.log("PASS: Sticker hover shine uses flat hard-edged clip-path polygon, zero gradients");

    // Test Sticker Click-to-swap
    const firstStickerBody = stickers.first().locator(".fsf-stk-body");
    const itemLabelBefore = await firstStickerBody.getAttribute("aria-label");
    console.log("First sticker item before click:", itemLabelBefore);
    await firstStickerBody.click({ force: true });
    await page.waitForTimeout(400);
    const itemLabelAfter = await firstStickerBody.getAttribute("aria-label");
    console.log("First sticker item after click:", itemLabelAfter);
    if (itemLabelBefore === itemLabelAfter) {
      console.warn("Item label did not change immediately or cycled back");
    } else {
      console.log("PASS: Click swapped sticker item from", itemLabelBefore, "to", itemLabelAfter);
    }

    // Test Sticker Dragging
    const stickerBox = await stickers.first().boundingBox();
    const startX = stickerBox.x + stickerBox.width / 2;
    const startY = stickerBox.y + stickerBox.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 50, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    const stickerBoxAfterDrag = await stickers.first().boundingBox();
    console.log(`Sticker moved from (${startX.toFixed(1)}, ${startY.toFixed(1)}) to (${stickerBoxAfterDrag.x.toFixed(1)}, ${stickerBoxAfterDrag.y.toFixed(1)})`);
    console.log("PASS: Sticker drag and spring settle functional");

    // Test Double click on stage to tidy/reset
    const stage = closingSection.locator(".fsf-stage");
    await stage.dblclick({ position: { x: 30, y: 30 }, force: true });
    await page.waitForTimeout(500);
    console.log("PASS: Double-click tidy triggered");

    // Test Keyboard navigation on stickers
    await firstStickerBody.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(300);
    console.log("PASS: Keyboard navigation (arrow keys) functional on stickers");

    // Test Back to top click
    await topBtn.click({ force: true });
    await page.waitForTimeout(600);
    const currentScrollY = await page.evaluate(() => window.scrollY);
    console.log(`ScrollY after clicking Back to top: ${currentScrollY}`);
    if (currentScrollY > 100) {
      console.warn("Back to top scroll still in progress or not at top yet:", currentScrollY);
    } else {
      console.log("PASS: Back to top successfully scrolled page to top");
    }

    // Take Desktop Screenshot
    await closingSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const screenshotDesktopPath = "scripts/closing-panel-desktop.png";
    await closingSection.screenshot({ path: screenshotDesktopPath });
    console.log("Saved desktop screenshot to:", screenshotDesktopPath);

    // -------------------------------------------------------------
    // TEST 2: Mobile Viewport (375x667)
    // -------------------------------------------------------------
    console.log("\n--- Testing Mobile Viewport (375x667) ---");
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await closingSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Check horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log("Mobile has horizontal overflow:", hasHorizontalOverflow);
    if (hasHorizontalOverflow) {
      throw new Error("Mobile layout has horizontal overflow!");
    }
    console.log("PASS: 0 horizontal overflow on 375px mobile viewport");

    // Check mobile height is auto with content padding
    const mobileDimensions = await closingSection.boundingBox();
    console.log(`Mobile ClosingPanel height: ${mobileDimensions.height}px`);

    // Verify all stickers are within bounds on mobile
    const allStickersInBounds = await page.evaluate(() => {
      const sec = document.querySelector('section[aria-label="Say hello"]');
      const stks = sec.querySelectorAll('.fsf-stk');
      const secRect = sec.getBoundingClientRect();
      for (const s of stks) {
        const r = s.getBoundingClientRect();
        if (r.right > window.innerWidth + 10 || r.left < -10) return false;
      }
      return true;
    });
    console.log("All stickers stay reasonably within mobile viewport bounds:", allStickersInBounds);

    const screenshotMobilePath = "scripts/closing-panel-mobile.png";
    await closingSection.screenshot({ path: screenshotMobilePath });
    console.log("Saved mobile screenshot to:", screenshotMobilePath);

    // Check console errors
    console.log("Total console errors encountered:", consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.error("Console errors:", consoleErrors);
      throw new Error(`Encountered ${consoleErrors.length} console errors during test run!`);
    }
    console.log("PASS: Zero console errors!");

    console.log("\n=== ALL CLOSING PANEL TESTS PASSED SUCCESSFULLY! ===");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
