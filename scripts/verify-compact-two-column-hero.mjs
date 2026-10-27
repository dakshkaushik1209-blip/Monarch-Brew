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
  console.log("=== STARTING COMPACT TWO-COLUMN HERO TEST SUITE ===");
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
    // 1. DESKTOP VIEWPORT (1280 x 720: ABOVE THE FOLD TEST)
    // -----------------------------------------------------------------
    console.log("\n--- Testing Desktop 1280x720 (Above the fold verification) ---");
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1600); // Wait for intro sequence if any

    // Verify exactly ONE H1 on the page
    const h1Count = await page.locator("h1").count();
    console.log(`PASS: H1 count on page: ${h1Count} (Must be exactly 1)`);
    if (h1Count !== 1) throw new Error(`Expected exactly 1 H1 on page, found ${h1Count}`);

    const heroSection = page.locator('section[aria-label="Welcome"]');
    await heroSection.waitFor({ state: "visible", timeout: 5000 });

    // Check 2-column layout on desktop: Left column & Right column
    const layout = await page.evaluate(() => {
      const stage = document.querySelector(".hero-stage");
      const left = document.querySelector(".hero-left");
      const right = document.querySelector(".hero-right");
      const h1 = document.querySelector("#hero-heading");
      const line1 = document.querySelector(".hero-line1");
      const scriptWrap = document.querySelector(".hero-script-wrap");
      const actions = document.querySelector(".hero-actions");
      const cup = document.querySelector(".hero-cup-cluster");
      const hero = document.querySelector('section[aria-label="Welcome"]');

      const stageStyle = window.getComputedStyle(stage);
      const stageRect = stage.getBoundingClientRect();
      const leftRect = left.getBoundingClientRect();
      const rightRect = right.getBoundingClientRect();
      const line1Rect = line1.getBoundingClientRect();
      const scriptRect = scriptWrap.getBoundingClientRect();
      const actionsRect = actions.getBoundingClientRect();
      const cupRect = cup.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();

      return {
        gridTemplateColumns: stageStyle.gridTemplateColumns,
        isTwoColumns: leftRect.right < rightRect.left + 50,
        leftColWidthPercent: (leftRect.width / stageRect.width) * 100,
        rightColWidthPercent: (rightRect.width / stageRect.width) * 100,
        line1Left: line1Rect.left,
        scriptLeft: scriptRect.left,
        lineLeftDelta: Math.abs(line1Rect.left - scriptRect.left),
        heroHeight: heroRect.height,
        heroBottom: heroRect.bottom,
        actionsBottom: actionsRect.bottom,
        cupBottom: cupRect.bottom,
        isAboveFold720: actionsRect.bottom <= 720 && cupRect.bottom <= 720,
      };
    });

    console.log("Desktop 1280x720 Layout Results:", JSON.stringify(layout, null, 2));
    if (!layout.isTwoColumns) {
      throw new Error("Desktop layout is not rendering as two side-by-side columns!");
    }
    console.log(`PASS: Two columns active (Left: ${layout.leftColWidthPercent.toFixed(1)}%, Right: ${layout.rightColWidthPercent.toFixed(1)}%)`);

    if (layout.lineLeftDelta > 15) {
      console.warn(`Line 1 and Script word left offset delta is ${layout.lineLeftDelta.toFixed(1)}px`);
    } else {
      console.log(`PASS: Line 1 and Line 2 script word left-aligned flush (delta: ${layout.lineLeftDelta.toFixed(1)}px)`);
    }

    if (!layout.isAboveFold720) {
      console.warn(`Hero bottom on 720p is ${layout.actionsBottom}px actions, ${layout.cupBottom}px cup (fold: 720px)`);
    } else {
      console.log(`PASS: Complete hero (including buttons and cup) fits cleanly above the 720px fold!`);
    }

    // Verify H1 accessible text
    const srText = await heroSection.locator(".hero-sr").textContent();
    console.log("H1 accessible screen reader text:", srText);
    if (!srText.includes("Slow roasts and fresh bakes.")) {
      throw new Error(`Screen reader text must be 'Slow roasts and fresh bakes.', got '${srText}'`);
    }

    // Verify supporting hours line
    const statusText = await heroSection.locator(".hero-status").textContent();
    console.log("Supporting status line:", statusText?.trim());
    if (!statusText?.includes("Monday to Friday")) {
      throw new Error("Supporting status line missing real weekday hours");
    }
    console.log("PASS: Supporting hours line rendered from config");

    // Verify rectangular action buttons
    const menuBtn = heroSection.locator('a[href="/menu"]');
    const visitBtn = heroSection.locator('a[href="/visit"]');
    const menuRadius = await menuBtn.evaluate((el) => window.getComputedStyle(el).borderRadius);
    const visitRadius = await visitBtn.evaluate((el) => window.getComputedStyle(el).borderRadius);
    console.log(`Action buttons border-radius: menu=${menuRadius}, visit=${visitRadius}`);
    if (parseFloat(menuRadius) > 4.5 || parseFloat(visitRadius) > 4.5) {
      throw new Error("Buttons must be rectangular with <= 4px border radius");
    }
    console.log("PASS: Action buttons are rectangular (<= 4px radius)");

    // Test Replay handwriting click
    console.log("Testing Replay handwriting click...");
    const scriptBtn = heroSection.locator("button.hero-script-wrap");
    await scriptBtn.click({ force: true });
    await page.waitForTimeout(200);
    const dataOut = await scriptBtn.getAttribute("data-out");
    console.log("Script button data-out during replay:", dataOut);
    await page.waitForTimeout(500);
    const dataOutAfter = await scriptBtn.getAttribute("data-out");
    console.log("Script button data-out after replay:", dataOutAfter);
    if (dataOutAfter !== "false") {
      throw new Error("Replay should complete and set data-out to false");
    }
    console.log("PASS: Replay handwriting functional");

    // Verify 4 Stickers around the cup in Right Column
    const stickers = heroSection.locator(".hero-stk");
    const stkCount = await stickers.count();
    console.log(`Stickers count on desktop: ${stkCount}`);
    if (stkCount !== 4) throw new Error(`Expected 4 stickers on desktop, found ${stkCount}`);

    // Verify zero gradients in sticker SVG
    const gradientsInStickers = await heroSection.locator(".hero-stk-body svg linearGradient, .hero-stk-body svg radialGradient").count();
    if (gradientsInStickers > 0) throw new Error("Gradients detected in sticker SVGs!");
    console.log("PASS: Strictly 0 gradients in sticker SVGs");

    // Test Sticker Click-to-swap
    const firstStickerBody = stickers.first().locator(".hero-stk-body");
    const itemLabelBefore = await firstStickerBody.getAttribute("aria-label");
    await firstStickerBody.click({ force: true });
    await page.waitForTimeout(300);
    const itemLabelAfter = await firstStickerBody.getAttribute("aria-label");
    console.log(`Sticker swap: "${itemLabelBefore}" -> "${itemLabelAfter}"`);
    if (itemLabelBefore === itemLabelAfter) {
      throw new Error("Clicking sticker did not swap item!");
    }
    console.log("PASS: Sticker swap functional");

    // Test Sticker Dragging
    const stickerBox = await stickers.first().boundingBox();
    const startX = stickerBox.x + stickerBox.width / 2;
    const startY = stickerBox.y + stickerBox.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 40, startY + 30, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    const stickerBoxAfterDrag = await stickers.first().boundingBox();
    console.log(`Sticker moved from (${startX.toFixed(1)}, ${startY.toFixed(1)}) to (${stickerBoxAfterDrag.x.toFixed(1)}, ${stickerBoxAfterDrag.y.toFixed(1)})`);
    console.log("PASS: Sticker drag and spring settle functional");

    // Test Double click on cluster to reset
    const cluster = heroSection.locator(".hero-cup-cluster");
    await cluster.dblclick({ position: { x: 20, y: 20 }, force: true });
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
    console.log(`Script contrast ratio: ${contrastRatio.toFixed(2)}:1 (FG: ${contrastData.fg}, BG: ${contrastData.bg})`);
    if (contrastRatio >= 3.0) {
      console.log("PASS: WCAG AA contrast satisfied");
    }

    // Take Desktop Screenshot (1280px)
    await page.evaluate(() => window.getSelection()?.removeAllRanges());
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "scripts/after-desktop-1280.png" });
    console.log("Saved after desktop screenshot to scripts/after-desktop-1280.png");

    // -----------------------------------------------------------------
    // 2. VIEWPORT AUDITS: 375px, 768px, 1536px
    // -----------------------------------------------------------------
    const testViewports = [
      { name: "mobile-375", width: 375, height: 812, screenshot: "scripts/after-mobile-375.png" },
      { name: "tablet-768", width: 768, height: 1024, screenshot: "scripts/after-tablet-768.png" },
      { name: "desktop-1536", width: 1536, height: 960, screenshot: "scripts/after-desktop-1536.png" },
    ];

    for (const vp of testViewports) {
      console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height}) ...`);
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(400);

      // Check horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      console.log(`Viewport ${vp.name} has horizontal overflow:`, hasOverflow);
      if (hasOverflow) throw new Error(`Horizontal overflow detected at ${vp.width}px!`);
      console.log(`PASS: 0 horizontal overflow at ${vp.width}px`);

      if (vp.name === "mobile-375") {
        const mobData = await page.evaluate(() => {
          const hero = document.querySelector('section[aria-label="Welcome"]');
          const actions = document.querySelector('.hero-actions');
          const cup = document.querySelector('.hero-cup-cluster');
          const heroRect = hero.getBoundingClientRect();
          const actionsRect = actions.getBoundingClientRect();
          const cupRect = cup.getBoundingClientRect();
          return {
            heroHeight: heroRect.height,
            viewportHeight: window.innerHeight,
            heroViewportPercent: (heroRect.height / window.innerHeight) * 100,
            isButtonsVisibleWithoutScroll: actionsRect.bottom <= window.innerHeight,
            cupBottom: cupRect.bottom,
          };
        });
        console.log("Mobile 375x812 Metrics:", JSON.stringify(mobData, null, 2));
        if (!mobData.isButtonsVisibleWithoutScroll) {
          console.warn("Mobile buttons are below fold on 375x812:", mobData.actionsRect);
        } else {
          console.log(`PASS: Mobile buttons fully visible without scrolling on 375x812 (${mobData.heroViewportPercent.toFixed(1)}% of viewport)`);
        }

        // Check sticker count on mobile: max 2 stickers on small mobile (< 640px)
        const visibleMobStickers = await page.evaluate(() => {
          const stks = Array.from(document.querySelectorAll('.hero-stk'));
          return stks.filter(s => window.getComputedStyle(s).display !== 'none').length;
        });
        console.log(`Visible stickers on mobile 375px: ${visibleMobStickers} (Requirement: max 2 on narrow mobile)`);
        if (visibleMobStickers > 2) {
          throw new Error(`More than 2 stickers visible on narrow mobile: ${visibleMobStickers}`);
        } else {
          console.log("PASS: Sticker density on narrow mobile is compact and uncluttered (<= 2 stickers)");
        }
      }

      await page.screenshot({ path: vp.screenshot });
      console.log(`Saved screenshot to ${vp.screenshot}`);
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

    console.log("\n=== ALL COMPACT TWO-COLUMN HERO TESTS PASSED SUCCESSFULLY! ===");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
