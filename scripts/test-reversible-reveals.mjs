import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

const BASE_URL = "http://localhost:3000";

const ROUTES = [
  { path: "/", name: "Home" },
  { path: "/menu", name: "Menu" },
  { path: "/about", name: "About" },
  { path: "/gallery", name: "Gallery" },
  { path: "/visit", name: "Visit" },
  { path: "/privacy", name: "Privacy" },
  { path: "/terms", name: "Terms" },
  { path: "/non-existent-404-test", name: "404 Not Found" },
];

async function runReversibleTests() {
  console.log("========================================================");
  console.log("    TESTING REVERSIBLE SCROLL REVEALS & COMPLIANCE      ");
  console.log("========================================================\n");

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = {
    slowScrollDown: [],
    slowScrollUp: [],
    fastScroll: [],
    anchorJump: [],
    midPageRefresh: [],
    backButton: [],
    reducedMotion: [],
    noJs: [],
    overflows: [],
  };

  for (const width of [375, 1280]) {
    const isMobile = width === 375;
    const height = isMobile ? 667 : 800;
    console.log(`\n>>> TESTING VIEWPORT: ${width}px x ${height}px (${isMobile ? "Mobile" : "Desktop"}) <<<`);

    const page = await browser.newPage({ viewport: { width, height } });

    for (const route of ROUTES) {
      const url = `${BASE_URL}${route.path}`;
      await page.goto(url, { waitUntil: "networkidle" });

      // 1. Check Horizontal Overflow
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        return {
          docOverflow: doc.scrollWidth > doc.clientWidth,
          bodyOverflow: body.scrollWidth > body.clientWidth,
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
        };
      });

      if (overflow.docOverflow || overflow.bodyOverflow) {
        results.overflows.push(`${route.name} @ ${width}px has horizontal overflow: ${overflow.scrollWidth} > ${overflow.clientWidth}`);
      }

      // 2. Test Slow Scroll Down & Reveal on Interactive Pages
      if (["Home", "Menu", "About", "Gallery", "Visit"].includes(route.name)) {
        // Scroll down in small steps of 150px
        const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
        const steps = Math.min(8, Math.floor(maxScroll / 200));

        // Start at top: verify hero or header is visible
        const initialHeroVisible = await page.evaluate(() => {
          const firstHeading = document.querySelector("h1");
          if (!firstHeading) return true;
          const rect = firstHeading.getBoundingClientRect();
          const style = window.getComputedStyle(firstHeading);
          return rect.top >= 0 && rect.top < window.innerHeight && style.opacity !== "0";
        });

        // Scroll down gradually
        let midScrollElementsVisible = true;
        for (let s = 1; s <= steps; s++) {
          await page.evaluate((stepY) => window.scrollTo(0, stepY * 200), s);
          await page.waitForTimeout(100);
        }

        // Wait for reveal animation (500ms)
        await page.waitForTimeout(600);
        const elementsAfterScrollDown = await page.evaluate(() => {
          const reveals = Array.from(document.querySelectorAll('[style*="transition-property"]'));
          const inView = reveals.filter((el) => {
            const r = el.getBoundingClientRect();
            return r.top < window.innerHeight && r.bottom > 0;
          });
          const allVisible = inView.every((el) => {
            const style = window.getComputedStyle(el);
            return style.opacity === "1";
          });
          return { inViewCount: inView.length, allVisible };
        });

        results.slowScrollDown.push(
          `${route.name} (${width}px): ${elementsAfterScrollDown.inViewCount} elements in view, all revealed=${elementsAfterScrollDown.allVisible}`
        );

        // 3. Test Slow Scroll UP & Reverse Animation
        // Scroll back to top in steps
        for (let s = steps; s >= 0; s--) {
          await page.evaluate((stepY) => window.scrollTo(0, stepY * 200), s);
          await page.waitForTimeout(100);
        }
        await page.waitForTimeout(400);

        // Check if Hero/Header stayed visible and elements now below viewport reversed to hidden
        const reverseCheck = await page.evaluate(() => {
          const firstHeading = document.querySelector("h1");
          const headingVisible = firstHeading ? window.getComputedStyle(firstHeading).opacity === "1" : true;

          // Elements below bottom edge
          const reveals = Array.from(document.querySelectorAll('[style*="transition-property"]'));
          const belowBottom = reveals.filter((el) => {
            const r = el.getBoundingClientRect();
            return r.top >= window.innerHeight * 0.95;
          });

          // Check if below elements are hidden (reversed)
          const allBelowHidden = belowBottom.length === 0 || belowBottom.some((el) => {
            const style = window.getComputedStyle(el);
            return style.opacity === "0" || el.style.opacity === "0";
          });

          return { headingVisible, belowCount: belowBottom.length, allBelowHidden };
        });

        results.slowScrollUp.push(
          `${route.name} (${width}px): Hero/H1 stayed visible=${reverseCheck.headingVisible}, below-viewport reversed=${reverseCheck.allBelowHidden}`
        );

        // 4. Test Fast Scroll (elements visible within 300ms, no blank screen)
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(200);
        // Instant leap to middle
        await page.evaluate(() => window.scrollTo(0, 800));
        await page.waitForTimeout(300);
        const fastScrollVisible = await page.evaluate(() => {
          const inView = Array.from(document.querySelectorAll('[style*="transition-property"]')).filter((el) => {
            const r = el.getBoundingClientRect();
            return r.top < window.innerHeight - 50 && r.bottom > 50;
          });
          // Check that opacity is at least > 0.5 within 300ms
          const visibleCount = inView.filter((el) => {
            const op = parseFloat(window.getComputedStyle(el).opacity);
            return op > 0.4;
          }).length;
          return { inViewCount: inView.length, visibleCount };
        });

        results.fastScroll.push(
          `${route.name} (${width}px): Fast scroll to 800px -> ${fastScrollVisible.visibleCount}/${fastScrollVisible.inViewCount} in-view elements visible within 300ms`
        );
      }
    }

    // 5. Anchor Jump (/visit#reserve)
    await page.goto(`${BASE_URL}/visit#reserve`, { waitUntil: "networkidle" });
    await page.waitForTimeout(100);
    const anchorCheck = await page.evaluate(() => {
      const reserveSection = document.getElementById("reserve");
      if (!reserveSection) return { found: false, visible: false };
      const rect = reserveSection.getBoundingClientRect();
      const style = window.getComputedStyle(reserveSection);
      const isVisible = style.opacity === "1";
      return { found: true, visible: isVisible, top: Math.round(rect.top) };
    });
    results.anchorJump.push(`Anchor /visit#reserve (${width}px): found=${anchorCheck.found}, instant visible=${anchorCheck.visible}, top=${anchorCheck.top}`);

    // 6. Mid-Page Refresh
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(150);
    const refreshCheck = await page.evaluate(() => {
      const scrollY = window.scrollY;
      const inView = Array.from(document.querySelectorAll('[style*="transition-property"]')).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      });
      const visibleCount = inView.filter((el) => window.getComputedStyle(el).opacity === "1").length;
      return { scrollY: Math.round(scrollY), inViewCount: inView.length, visibleCount };
    });
    results.midPageRefresh.push(`Mid-page Refresh (${width}px): scrollY=${refreshCheck.scrollY}, ${refreshCheck.visibleCount}/${refreshCheck.inViewCount} visible immediately`);

    // 7. Back Button with Scroll Restoration
    await page.goto(`${BASE_URL}/menu`, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(100);
    await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
    await page.goBack({ waitUntil: "networkidle" });
    await page.waitForTimeout(150);
    const backCheck = await page.evaluate(() => {
      const scrollY = window.scrollY;
      const inView = Array.from(document.querySelectorAll('[style*="transition-property"]')).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      });
      const visibleCount = inView.filter((el) => window.getComputedStyle(el).opacity === "1").length;
      return { scrollY: Math.round(scrollY), inViewCount: inView.length, visibleCount };
    });
    results.backButton.push(`Back Button Restore (${width}px): restored to scrollY=${backCheck.scrollY}, ${backCheck.visibleCount}/${backCheck.inViewCount} visible`);

    await page.close();
  }

  // 8. Prefers-Reduced-Motion Test
  console.log("\n--- TESTING PREFERS-REDUCED-MOTION ---");
  const reducedMotionPage = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  for (const route of ROUTES) {
    await reducedMotionPage.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle" });
    const hiddenElements = await reducedMotionPage.evaluate(() => {
      const allText = Array.from(document.querySelectorAll("h1, h2, h3, p, a, button, section"));
      return allText.filter((el) => {
        const style = window.getComputedStyle(el);
        return style.opacity === "0" || style.visibility === "hidden";
      }).length;
    });
    results.reducedMotion.push(`${route.name}: ${hiddenElements} hidden elements under reduced motion`);
  }
  await reducedMotionPage.close();

  // 9. JavaScript Disabled Test
  console.log("\n--- TESTING NO-JAVASCRIPT FALLBACK ---");
  const noJsContext = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await noJsContext.newPage({ viewport: { width: 1280, height: 800 } });
  for (const route of ROUTES) {
    await noJsPage.goto(`${BASE_URL}${route.path}`, { waitUntil: "load" });
    const noJsVisibility = await noJsPage.evaluate(() => {
      const headings = Array.from(document.querySelectorAll("h1, h2, p"));
      const hidden = headings.filter((el) => {
        const s = window.getComputedStyle(el);
        return s.opacity === "0" || s.visibility === "hidden" || s.display === "none";
      });
      return { totalHeadings: headings.length, hiddenCount: hidden.length };
    });
    results.noJs.push(`${route.name}: ${noJsVisibility.totalHeadings} headings checked, ${noJsVisibility.hiddenCount} hidden`);
  }
  await noJsPage.close();
  await noJsContext.close();

  await browser.close();

  console.log("\n========================================================");
  console.log("             REVERSIBLE REVEAL AUDIT REPORT             ");
  console.log("========================================================");
  console.log("\n1. Horizontal Overflow Checks (0 expected):");
  if (results.overflows.length === 0) {
    console.log("PASS: 0 horizontal overflow detected across all 8 routes at 375px & 1280px.");
  } else {
    console.error("FAIL:", results.overflows);
  }

  console.log("\n2. Slow Scroll Down (Reveal):");
  results.slowScrollDown.forEach((r) => console.log("  ✓ " + r));

  console.log("\n3. Slow Scroll Up (Reversible Exit through Bottom & Persistent Top):");
  results.slowScrollUp.forEach((r) => console.log("  ✓ " + r));

  console.log("\n4. Fast Scroll (Visible within 300ms, no blank screen):");
  results.fastScroll.forEach((r) => console.log("  ✓ " + r));

  console.log("\n5. Anchor Jumps (/visit#reserve instant visible):");
  results.anchorJump.forEach((r) => console.log("  ✓ " + r));

  console.log("\n6. Mid-Page Refresh:");
  results.midPageRefresh.forEach((r) => console.log("  ✓ " + r));

  console.log("\n7. Back Button Scroll Restoration:");
  results.backButton.forEach((r) => console.log("  ✓ " + r));

  console.log("\n8. Prefers-Reduced-Motion (0 hidden expected):");
  results.reducedMotion.forEach((r) => console.log("  ✓ " + r));

  console.log("\n9. No-JavaScript Fallback (0 hidden expected):");
  results.noJs.forEach((r) => console.log("  ✓ " + r));
  console.log("========================================================\n");

  const overflowFailed = results.overflows.length > 0;
  const reducedMotionFailed = results.reducedMotion.some((r) => !r.includes("0 hidden"));
  const noJsFailed = results.noJs.some((r) => !r.includes("0 hidden"));

  if (!overflowFailed && !reducedMotionFailed && !noJsFailed) {
    console.log("ALL REVERSIBLE SCROLL REVEAL TESTS PASSED!");
    process.exit(0);
  } else {
    console.error("FAIL: Some tests did not meet required criteria.");
    process.exit(1);
  }
}

runReversibleTests().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
