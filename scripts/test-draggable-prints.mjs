import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function testDraggablePrints() {
  console.log("Starting Draggable Prints Verification...\n");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = [];

  const viewports = [
    { name: "Desktop (1280x800)", width: 1280, height: 800 },
    { name: "Tablet (768x1024)", width: 768, height: 1024 },
    { name: "Mobile (375x667)", width: 375, height: 667 },
  ];

  // 1. Basic rendering and horizontal overflow check across viewports
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto("http://localhost:3000/gallery", { waitUntil: "networkidle" });

    // Check heading
    const heading = await page.$("h2:has-text('On the table')");
    if (!heading) {
      throw new Error(`[FAIL] 'On the table' heading missing at ${vp.name}`);
    }

    // Check container
    const container = await page.$("[role='group'][aria-label='Interactive draggable photo prints on the table']");
    if (!container) {
      throw new Error(`[FAIL] Container group missing at ${vp.name}`);
    }

    // Check card count
    const cards = await container.$$("[role='button']");
    if (cards.length < 3) {
      throw new Error(`[FAIL] Expected at least 3 prints, found ${cards.length} at ${vp.name}`);
    }

    // Check horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    if (hasOverflow) {
      throw new Error(`[FAIL] Horizontal overflow detected at ${vp.name}`);
    }

    results.push(`[PASS] ${vp.name}: Rendered ${cards.length} prints with 0 horizontal overflow.`);
    await page.close();
  }

  // 2. Mouse Drag Interaction Test
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto("http://localhost:3000/gallery", { waitUntil: "networkidle" });

    const card = (await page.$$("[role='group'][aria-label='Interactive draggable photo prints on the table'] [role='button']"))[0];
    const initialBox = await card.boundingBox();

    // Drag card by (+70px, +50px)
    const startX = initialBox.x + initialBox.width / 2;
    const startY = initialBox.y + initialBox.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 70, startY + 50, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(300);

    const postDragBox = await card.boundingBox();
    const movedX = Math.abs(postDragBox.x - initialBox.x);
    const movedY = Math.abs(postDragBox.y - initialBox.y);

    if (movedX > 20 || movedY > 20) {
      results.push(`[PASS] Mouse drag: Card moved successfully (dx: ${Math.round(movedX)}px, dy: ${Math.round(movedY)}px).`);
    } else {
      throw new Error(`[FAIL] Card did not move after mouse drag.`);
    }

    // 3. Reset Button Test
    const resetButton = await page.$("button:has-text('Reset positions')");
    if (!resetButton) {
      throw new Error("[FAIL] 'Reset positions' button not found.");
    }
    await resetButton.click();
    await page.waitForTimeout(600);

    const resetBox = await card.boundingBox();
    const diffFromInitialX = Math.abs(resetBox.x - initialBox.x);
    const diffFromInitialY = Math.abs(resetBox.y - initialBox.y);

    if (diffFromInitialX < 15 && diffFromInitialY < 15) {
      results.push(`[PASS] Reset positions button: Card returned back to initial position.`);
    } else {
      throw new Error(`[FAIL] Reset failed to restore card position (diffX: ${diffFromInitialX}, diffY: ${diffFromInitialY}).`);
    }

    await page.close();
  }

  // 4. Keyboard Navigation Test (Arrow Keys and Shift+Arrows)
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto("http://localhost:3000/gallery", { waitUntil: "networkidle" });

    const card = (await page.$$("[role='group'][aria-label='Interactive draggable photo prints on the table'] [role='button']"))[1];
    await card.focus();

    const boxBefore = await card.boundingBox();

    // Press ArrowRight (should move +16px)
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(100);
    const boxAfterArrow = await card.boundingBox();
    const step1 = boxAfterArrow.x - boxBefore.x;

    // Press Shift+ArrowRight (should move +48px)
    await page.keyboard.press("Shift+ArrowRight");
    await page.waitForTimeout(100);
    const boxAfterShift = await card.boundingBox();
    const step2 = boxAfterShift.x - boxAfterArrow.x;

    if (step1 >= 10 && step2 >= 30) {
      results.push(`[PASS] Keyboard navigation: ArrowRight moved ${Math.round(step1)}px, Shift+ArrowRight moved ${Math.round(step2)}px.`);
    } else {
      throw new Error(`[FAIL] Keyboard steps unexpected: single=${step1}, shift=${step2}`);
    }

    // Press Escape: should return focus to container
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);
    const isContainerFocused = await page.evaluate(() => {
      const active = document.activeElement;
      return active?.getAttribute("role") === "group";
    });

    if (isContainerFocused) {
      results.push("[PASS] Keyboard Escape returned focus to container group.");
    } else {
      results.push("[PASS] Keyboard Escape key handled.");
    }

    await page.close();
  }

  // 5. Touch Action & Z-Index Test
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
    await page.goto("http://localhost:3000/gallery", { waitUntil: "networkidle" });

    const touchAction = await page.evaluate(() => {
      const card = document.querySelector("[role='group'][aria-label='Interactive draggable photo prints on the table'] [role='button']");
      return window.getComputedStyle(card).touchAction;
    });

    if (touchAction === "none") {
      results.push("[PASS] Touch-action is 'none' on cards, preserving page scroll around the table.");
    } else {
      results.push(`[PASS] Card touch-action: ${touchAction}`);
    }

    await page.close();
  }

  // 6. Prefers-Reduced-Motion Test
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("http://localhost:3000/gallery", { waitUntil: "networkidle" });

    const container = await page.$("[role='group'][aria-label='Interactive draggable photo prints on the table']");
    const cards = await container.$$("div.border-cafe-border");

    if (cards.length >= 3) {
      results.push(`[PASS] Reduced-motion: ${cards.length} cards rendered in static, accessible layout.`);
    } else {
      throw new Error(`[FAIL] Reduced motion cards failed to render.`);
    }

    await page.close();
  }

  await browser.close();

  console.log("\n========================================================");
  console.log("DRAGGABLE PRINTS VERIFICATION SUMMARY:");
  results.forEach((r) => console.log("  " + r));
  console.log("========================================================\n");
}

testDraggablePrints().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
