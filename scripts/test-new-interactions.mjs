import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function testInteractions() {
  console.log("Starting New Interactions Verification...\n");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = [];

  // 1. Home Page: Bar Live Rhythm & Expandable Schedule
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

    const rhythmHeading = await page.$("text=View Daily Rhythm");
    if (!rhythmHeading) {
      throw new Error("[FAIL] 'View Daily Rhythm' button not found on Home.");
    }
    await rhythmHeading.click();
    await page.waitForTimeout(300);

    const scheduleItem = await page.$("text=Doors Open & Espresso Dial-in");
    if (!scheduleItem) {
      throw new Error("[FAIL] Daily rhythm schedule failed to expand on click.");
    }
    results.push("[PASS] Home: BarLiveRhythm widget renders live clock and expands daily schedule on click.");

    await page.close();
  }

  // 2. Menu Page: Brew Ratio Calculator & Live Stopwatch
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto("http://localhost:3000/menu", { waitUntil: "networkidle" });

    const calcHeading = await page.$("h3:has-text('Brew Ratio & Pour Calculator')");
    if (!calcHeading) {
      throw new Error("[FAIL] BrewCalculator heading not found on Menu.");
    }

    // Switch brew method to French Press
    const frenchPressBtn = await page.$("button:has-text('French Press')");
    await frenchPressBtn.click();
    await page.waitForTimeout(200);

    // Dose check
    const doseDisplay = await page.$("span:has-text('18g')");
    if (!doseDisplay) {
      throw new Error("[FAIL] Dose display not showing initial 18g.");
    }

    // Increase dose by +1g
    const plusBtn = await page.$("button[aria-label='Increase dose by 1 gram']");
    await plusBtn.click();
    await page.waitForTimeout(100);

    // French press ratio is 1:15, so 19g * 15 = 285 ml
    const targetWater = await page.$("text=285 ml");
    if (!targetWater) {
      throw new Error("[FAIL] Target water calculation mismatch for 19g French Press (expected 285 ml).");
    }
    results.push("[PASS] Menu: BrewCalculator dynamically updates water target to 285 ml for 19g French Press.");

    // Test Stopwatch Start / Pause
    const startTimerBtn = await page.$("button:has-text('Start Timer')");
    if (startTimerBtn) {
      await startTimerBtn.click();
      await page.waitForTimeout(1200);
      const pauseBtn = await page.$("button:has-text('Pause')");
      if (!pauseBtn) {
        throw new Error("[FAIL] Timer failed to switch to Pause state.");
      }
      await pauseBtn.click();
      results.push("[PASS] Menu: Live Brew Stopwatch started and paused successfully.");
    }

    await page.close();
  }

  // 3. Visit Page: One-click Copy Feedback
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto("http://localhost:3000/visit", { waitUntil: "networkidle" });

    const copyBtn = await page.$("button[aria-label='Copy address to clipboard']");
    if (!copyBtn) {
      throw new Error("[FAIL] Copy address button not found on Visit.");
    }
    await copyBtn.click();
    await page.waitForTimeout(200);

    const copiedFeedback = await page.$("text=Copied!");
    if (!copiedFeedback) {
      throw new Error("[FAIL] 'Copied!' toast feedback not visible after click.");
    }
    results.push("[PASS] Visit: CopyPill triggers tactile 'Copied!' feedback badge on click.");

    await page.close();
  }

  await browser.close();

  console.log("\n========================================================");
  console.log("INTERACTIVE POLISH VERIFICATION SUMMARY:");
  results.forEach((r) => console.log("  " + r));
  console.log("========================================================\n");
}

testInteractions().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
