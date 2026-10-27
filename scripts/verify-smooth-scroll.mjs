import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function run() {
  console.log("=== STARTING SMOOTH SCROLL VERIFICATION ===");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
      console.error("Browser Console Error:", msg.text());
    }
  });

  try {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // 1. Verify Lenis Smooth Scroll initialized
    const lenisStatus = await page.evaluate(() => {
      return {
        hasLenisInstance: typeof window.__lenis !== "undefined",
        hasLenisClass: document.documentElement.classList.contains("lenis"),
      };
    });
    console.log("Lenis Status:", lenisStatus);
    if (!lenisStatus.hasLenisInstance) {
      throw new Error("Lenis smooth scroll instance was not initialized on window!");
    }
    console.log("PASS: Lenis smooth scroll initialized on window");

    // 2. Verify Scroll Progress Bar initially at 0
    const initialProgress = await page.evaluate(() => {
      const bar = document.querySelector("header div[style*='scaleX']");
      return bar ? bar.getAttribute("style") : null;
    });
    console.log("Initial progress bar style:", initialProgress);

    // 3. Test "Scroll to explore" cue in Hero
    const scrollCue = page.locator(".hero-scroll-cue");
    await scrollCue.waitFor({ state: "visible" });
    console.log("Clicking 'Scroll to explore' cue...");
    await scrollCue.click();

    // Wait for smooth scroll animation to glide down
    await page.waitForTimeout(1400);

    const scrollYAfterCue = await page.evaluate(() => window.scrollY);
    console.log("Scroll position after 'Scroll to explore' click:", scrollYAfterCue);
    if (scrollYAfterCue < 200) {
      throw new Error(`Smooth scroll cue did not scroll down! scrollY: ${scrollYAfterCue}`);
    }
    console.log("PASS: 'Scroll to explore' cue smoothly animated scroll position down");

    // 4. Verify Scroll Progress Bar scaled up
    const midProgress = await page.evaluate(() => {
      const bar = document.querySelector("header div[style*='scaleX']");
      return bar ? bar.getAttribute("style") : null;
    });
    console.log("Progress bar style after scroll:", midProgress);
    if (!midProgress || midProgress.includes("scaleX(0)")) {
      throw new Error("Scroll progress bar did not scale up after scrolling!");
    }
    console.log("PASS: Scroll progress bar scaled smoothly with scroll depth");

    // 5. Verify BackToTop button appears after scrolling down
    const backToTopBtn = page.locator("button[aria-label='Back to top']");
    await backToTopBtn.waitFor({ state: "visible" });
    const isVisible = await backToTopBtn.isVisible();
    console.log("BackToTop button visible:", isVisible);
    if (!isVisible) {
      throw new Error("BackToTop button did not appear after scrolling down!");
    }
    console.log("PASS: BackToTop button is visible");

    // 6. Click BackToTop button and verify smooth scroll back to 0
    console.log("Clicking BackToTop button...");
    await backToTopBtn.click();
    await page.waitForTimeout(1400);

    const scrollYAfterTop = await page.evaluate(() => window.scrollY);
    console.log("Scroll position after BackToTop click:", scrollYAfterTop);
    if (scrollYAfterTop > 50) {
      throw new Error(`BackToTop did not return to top! scrollY: ${scrollYAfterTop}`);
    }
    console.log("PASS: BackToTop smoothly glided back to top");

    // 7. Test Anchor Link Smooth Scroll with Lenis
    console.log("Testing in-page anchor smooth scroll (Reserve a table)...");
    const reserveLink = page.locator("a[href='/visit#reserve']").first();
    await reserveLink.click();
    await page.waitForTimeout(1500);

    const currentUrl = page.url();
    console.log("Current URL after reserve click:", currentUrl);
    if (!currentUrl.includes("/visit#reserve")) {
      throw new Error("Navigation to /visit#reserve failed!");
    }
    console.log("PASS: Smooth anchor navigation to /visit#reserve functional");

    // 8. Test Reduced Motion Support
    console.log("\nTesting prefers-reduced-motion: reduce...");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const lenisReduced = await page.evaluate(() => {
      return typeof window.__lenis === "undefined";
    });
    console.log("Lenis disabled under reduced motion:", lenisReduced);
    if (!lenisReduced) {
      throw new Error("Lenis should not be initialized under prefers-reduced-motion: reduce!");
    }
    console.log("PASS: Reduced motion properly disables smooth scroll interpolation");

    // Check console errors
    console.log(`\nTotal console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      throw new Error(`Console errors detected: ${JSON.stringify(consoleErrors)}`);
    }
    console.log("PASS: Strictly 0 console errors!");

    console.log("\n=== ALL SMOOTH SCROLL TESTS PASSED! ===");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
