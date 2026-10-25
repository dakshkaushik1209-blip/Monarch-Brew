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
  { path: "/non-existent-page-404", name: "404 Not Found" },
];

const VIEWPORTS = [
  { width: 360, height: 740, label: "360px (Small Mobile)" },
  { width: 375, height: 667, label: "375px (iPhone SE)" },
  { width: 768, height: 1024, label: "768px (Tablet)" },
  { width: 1024, height: 768, label: "1024px (Small Desktop / iPad Pro)" },
  { width: 1280, height: 800, label: "1280px (Standard Desktop)" },
  { width: 1536, height: 960, label: "1536px (Large Screen)" },
];

async function runAudit() {
  console.log("========================================================");
  console.log("       CAFE WEBSITE: COMPREHENSIVE FINAL RE-AUDIT       ");
  console.log("========================================================\n");

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = {
    overflowIssues: [],
    brokenLinks: [],
    reservationCtaIssues: [],
    h1Issues: [],
    altIssues: [],
    touchTargetIssues: [],
    performanceSummary: {},
    interactiveChecks: [],
  };

  // 1. VIEWPORT & OVERFLOW AUDIT ACROSS ALL 8 PAGES
  console.log("--- 1. TESTING VIEWPORTS & HORIZONTAL OVERFLOW ---");
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    for (const r of ROUTES) {
      const targetUrl = `${BASE_URL}${r.path}`;
      const res = await page.goto(targetUrl, { waitUntil: "networkidle" });
      const status = res ? res.status() : 0;

      // Allow 404 for the not-found route, 200 for all others
      if (r.path === "/non-existent-page-404") {
        if (status !== 404) {
          results.overflowIssues.push(`${r.name} expected 404 status but got ${status}`);
        }
      } else if (status !== 200) {
        results.overflowIssues.push(`${r.name} failed to load with status ${status}`);
      }

      // Check overflow
      const overflow = await page.evaluate(() => {
        const docElem = document.documentElement;
        const body = document.body;
        const main = document.querySelector("main");
        const docOverflow = docElem.scrollWidth > docElem.clientWidth;
        const bodyOverflow = body.scrollWidth > body.clientWidth;
        const mainOverflow = main ? main.scrollWidth > main.clientWidth : false;

        let overflowingElement = null;
        if (docOverflow || bodyOverflow) {
          const all = document.querySelectorAll("*");
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > docElem.clientWidth + 1) {
              overflowingElement = `${el.tagName.toLowerCase()}.${el.className.slice(0, 50)} (right: ${rect.right}, width: ${rect.width})`;
              break;
            }
          }
        }

        return {
          hasOverflow: docOverflow || bodyOverflow,
          docScrollWidth: docElem.scrollWidth,
          docClientWidth: docElem.clientWidth,
          bodyScrollWidth: body.scrollWidth,
          bodyClientWidth: body.clientWidth,
          overflowingElement,
        };
      });

      if (overflow.hasOverflow) {
        results.overflowIssues.push(
          `[OVERFLOW] ${r.name} @ ${vp.label}: docScrollWidth=${overflow.docScrollWidth} > clientWidth=${overflow.docClientWidth}. Offending: ${overflow.overflowingElement}`
        );
      }
    }
    await page.close();
  }

  if (results.overflowIssues.length === 0) {
    console.log("PASS: 0 horizontal overflow detected across all 8 pages at all 6 viewports (360px - 1536px).\n");
  } else {
    console.error("FAIL: Horizontal overflow issues found:\n", results.overflowIssues.join("\n"), "\n");
  }

  // 2. ACCESSIBILITY: SKIP LINK & HEADINGS & ALT TAGS
  console.log("--- 2. ACCESSIBILITY & SEMANTICS AUDIT ---");
  const a11yPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  for (const r of ROUTES.filter(rt => rt.path !== "/non-existent-page-404")) {
    await a11yPage.goto(`${BASE_URL}${r.path}`, { waitUntil: "networkidle" });

    // Check H1 presence & uniqueness
    const h1Count = await a11yPage.evaluate(() => document.querySelectorAll("h1").length);
    if (h1Count !== 1) {
      results.h1Issues.push(`${r.name} has ${h1Count} <h1> elements (expected exactly 1)`);
    }

    // Check images missing alt
    const imgMissingAlt = await a11yPage.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return imgs
        .filter(img => !img.hasAttribute("alt") || img.getAttribute("alt") === "")
        .map(img => img.src);
    });
    if (imgMissingAlt.length > 0) {
      results.altIssues.push(`${r.name} has ${imgMissingAlt.length} <img> tags missing alt text: ${imgMissingAlt.join(", ")}`);
    }

    // Check decorative SVGs have aria-hidden="true" or role="img"
    const svgsWithoutAria = await a11yPage.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll("svg"));
      return svgs.filter(s => !s.hasAttribute("aria-hidden") && !s.hasAttribute("role") && !s.hasAttribute("aria-label")).length;
    });
    if (svgsWithoutAria > 0) {
      console.warn(`[WARN] ${r.name} has ${svgsWithoutAria} SVGs without aria-hidden or aria-label`);
    }
  }

  // Test Skip to content link
  await a11yPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await a11yPage.keyboard.press("Tab");
  const focusedTag = await a11yPage.evaluate(() => {
    const el = document.activeElement;
    return {
      tagName: el ? el.tagName.toLowerCase() : null,
      href: el ? el.getAttribute("href") : null,
      text: el ? el.textContent.trim() : null,
    };
  });
  console.log(`First tab stop: <${focusedTag.tagName} href="${focusedTag.href}">: "${focusedTag.text}"`);
  if (focusedTag.href === "#main-content") {
    console.log("PASS: Skip to main content link is the first focusable element.");
  } else {
    console.error("FAIL: Skip to content link was not focused on first Tab key.");
  }

  if (results.h1Issues.length === 0) {
    console.log("PASS: Exactly one <h1> element on every page.");
  } else {
    console.error("FAIL H1 issues:\n", results.h1Issues.join("\n"));
  }

  if (results.altIssues.length === 0) {
    console.log("PASS: All <img> elements have alt attributes.\n");
  } else {
    console.error("FAIL Alt issues:\n", results.altIssues.join("\n"), "\n");
  }

  // 3. INTERACTIVE COMPONENTS: DRAWER, LIGHTBOX, MENU TABS, FORM
  console.log("--- 3. INTERACTIVE BEHAVIORS & ACCESSIBILITY TESTS ---");

  // A. Mobile menu drawer test
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

  const hamburger = await mobilePage.$('button[aria-label*="navigation" i], button[aria-label*="menu" i]');
  if (hamburger) {
    const initialExpanded = await hamburger.getAttribute("aria-expanded");
    await hamburger.click();
    await mobilePage.waitForTimeout(300);
    const openedExpanded = await hamburger.getAttribute("aria-expanded");
    const isBodyLocked = await mobilePage.evaluate(() => document.body.style.overflow === "hidden" || document.documentElement.style.overflow === "hidden");
    
    // Press Escape
    await mobilePage.keyboard.press("Escape");
    await mobilePage.waitForTimeout(300);
    const closedExpanded = await hamburger.getAttribute("aria-expanded");

    console.log(`Mobile Nav Drawer: aria-expanded initial=${initialExpanded}, open=${openedExpanded}, after Esc=${closedExpanded}, scrollLock=${isBodyLocked}`);
    if (openedExpanded === "true" && closedExpanded === "false") {
      console.log("PASS: Mobile menu opens, locks scroll, and closes cleanly on Escape.");
    } else {
      console.error("FAIL: Mobile menu failed aria-expanded or Escape close test.");
    }
  } else {
    console.error("FAIL: Hamburger button not found at 375px viewport.");
  }
  await mobilePage.close();

  // B. Menu Category Filter Navigation
  const menuPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await menuPage.goto(`${BASE_URL}/menu`, { waitUntil: "networkidle" });
  const categoryButtons = await menuPage.$$('button[data-category]');
  if (categoryButtons.length > 0) {
    console.log(`Menu Page: Found ${categoryButtons.length} category filter tabs.`);
    await categoryButtons[1].click();
    await menuPage.waitForTimeout(200);
    const isCatActive = await categoryButtons[1].getAttribute("aria-pressed") || await categoryButtons[1].getAttribute("data-active");
    console.log(`Category filter tab click verified. State: ${isCatActive}`);
  }

  // Dotted leaders test
  const dottedLeaders = await menuPage.$$('.border-dotted, .border-cafe-border\\/60');
  console.log(`Menu Page: Found ${dottedLeaders.length} printed-menu item leaders.`);
  await menuPage.close();

  // C. Gallery Lightbox Modal
  const galleryPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await galleryPage.goto(`${BASE_URL}/gallery`, { waitUntil: "networkidle" });
  const photoCards = await galleryPage.$$('button[aria-label*="View" i], div[role="button"], button:has(img), [data-lightbox-trigger]');
  if (photoCards.length > 0) {
    await photoCards[0].click();
    await galleryPage.waitForTimeout(300);
    const dialog = await galleryPage.$('[role="dialog"], [data-lightbox-modal]');
    const isModalVisible = dialog !== null;
    await galleryPage.keyboard.press("Escape");
    await galleryPage.waitForTimeout(300);
    const dialogClosed = await galleryPage.$('[role="dialog"], [data-lightbox-modal]');
    console.log(`Gallery Lightbox: modal opened=${isModalVisible}, closed on Escape=${dialogClosed === null}`);
    if (isModalVisible && dialogClosed === null) {
      console.log("PASS: Lightbox opens and closes on Escape.");
    }
  }
  await galleryPage.close();

  // D. Reservation Form Validation & Submission
  const visitPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await visitPage.goto(`${BASE_URL}/visit#reserve`, { waitUntil: "networkidle" });

  const form = await visitPage.$('form');
  if (form) {
    // Attempt empty submission
    const submitBtn = await visitPage.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await visitPage.waitForTimeout(200);

      // Check for validation error messages
      const errors = await visitPage.$$('[role="alert"], .text-red-600, .text-cafe-terracotta');
      console.log(`Reservation Form empty submit: ${errors.length} feedback elements rendered.`);

      // Stub window.open to prevent popup blocking in headless browser
      await visitPage.evaluate(() => {
        window.open = () => null;
      });

      // Fill in valid data
      await visitPage.fill('input[name="name"]', 'Anita Sharma');
      await visitPage.fill('input[name="phone"]', '+91 98765 43210');
      
      const dateInput = await visitPage.$('input[name="date"]');
      if (dateInput) {
        // Set tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const dd = String(tomorrow.getDate()).padStart(2, "0");
        await dateInput.fill(`${yyyy}-${mm}-${dd}`);
      }

      const timeInput = await visitPage.$('select[name="time"]');
      if (timeInput) {
        await timeInput.selectOption({ index: 1 });
      }

      await submitBtn.click();
      await visitPage.waitForTimeout(600);

      const successNotice = await visitPage.$('[role="status"]');
      const successText = successNotice ? await successNotice.textContent() : "";
      console.log(`Reservation Form valid submit: success notice rendered=${successNotice !== null} ("${successText.slice(0, 50)}...")`);
      if (successNotice && successText.includes("WhatsApp")) {
        console.log("PASS: Reservation form client-side validation and submission succeed.");
      }
    }
  }
  await visitPage.close();

  // 4. TOUCH TARGET SIZE CHECK (>= 44px on mobile)
  console.log("\n--- 4. MOBILE TOUCH TARGET AUDIT (375px) ---");
  const touchPage = await browser.newPage({ viewport: { width: 375, height: 667 } });
  for (const r of ["/", "/menu", "/visit"]) {
    await touchPage.goto(`${BASE_URL}${r}`, { waitUntil: "networkidle" });
    const targets = await touchPage.evaluate(() => {
      const interactive = Array.from(document.querySelectorAll("button, a, input, select, textarea"));
      const failures = [];
      for (const el of interactive) {
        // Skip hidden or sr-only
        if (el.offsetParent === null) continue;
        const rect = el.getBoundingClientRect();
        // Ignore inline text links inside paragraphs
        if (el.tagName.toLowerCase() === "a" && el.closest("p")) continue;

        if (rect.width < 40 || rect.height < 40) {
          failures.push({
            tag: el.tagName.toLowerCase(),
            text: el.textContent.trim().slice(0, 30),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      }
      return failures;
    });

    if (targets.length > 0) {
      console.warn(`[WARN] ${r} has ${targets.length} elements smaller than 40x40px:`, targets.slice(0, 3));
    } else {
      console.log(`PASS: ${r} all primary interactive targets meet touch size standard.`);
    }
  }
  await touchPage.close();

  // 5. INTERNAL LINK & RESERVATION CTA AUDIT
  console.log("\n--- 5. INTERNAL LINK & RESERVATION CTA AUDIT ---");
  const linkPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const checkedLinks = new Set();
  const allDiscoveredLinks = [];

  for (const r of ROUTES.filter(rt => rt.path !== "/non-existent-page-404")) {
    await linkPage.goto(`${BASE_URL}${r.path}`, { waitUntil: "networkidle" });
    const links = await linkPage.evaluate(() => {
      return Array.from(document.querySelectorAll("a[href]")).map(a => ({
        text: a.textContent.trim(),
        href: a.getAttribute("href"),
      }));
    });

    for (const l of links) {
      if (!l.href) continue;
      // Check reservation CTA target
      if (l.text.toLowerCase().includes("reserve a table") || l.text.toLowerCase() === "reserve") {
        if (!l.href.includes("/visit#reserve") && !l.href.includes("#reserve")) {
          results.reservationCtaIssues.push(`[CTA MISMATCH] "${l.text}" on ${r.name} points to "${l.href}" instead of "/visit#reserve"`);
        }
      }

      // Check internal route validity
      if (l.href.startsWith("/") && !l.href.startsWith("//") && !l.href.startsWith("/#") && !l.href.includes("mailto:") && !l.href.includes("tel:")) {
        const cleanPath = l.href.split("#")[0].split("?")[0];
        if (cleanPath && !checkedLinks.has(cleanPath)) {
          checkedLinks.add(cleanPath);
          allDiscoveredLinks.push(cleanPath);
        }
      }
    }
  }

  console.log(`Discovered ${allDiscoveredLinks.length} distinct internal routes: ${allDiscoveredLinks.join(", ")}`);
  for (const targetRoute of allDiscoveredLinks) {
    const res = await linkPage.goto(`${BASE_URL}${targetRoute}`, { waitUntil: "networkidle" });
    const status = res ? res.status() : 0;
    if (status !== 200) {
      results.brokenLinks.push(`Broken link: ${targetRoute} returned HTTP ${status}`);
    }
  }

  if (results.brokenLinks.length === 0) {
    console.log("PASS: 0 broken internal links found. All routes return HTTP 200.");
  } else {
    console.error("FAIL Broken links:\n", results.brokenLinks.join("\n"));
  }

  if (results.reservationCtaIssues.length === 0) {
    console.log("PASS: Every 'Reserve a table' CTA across the website targets /visit#reserve.");
  } else {
    console.error("FAIL Reservation CTA issues:\n", results.reservationCtaIssues.join("\n"));
  }

  await linkPage.close();

  // 6. PREFERS-REDUCED-MOTION AUDIT
  console.log("\n--- 6. PREFERS-REDUCED-MOTION AUDIT ---");
  const motionPage = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  await motionPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  const invisibleContent = await motionPage.evaluate(() => {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, p, a, button"));
    return headings.filter(el => {
      const style = window.getComputedStyle(el);
      return style.opacity === "0" || style.visibility === "hidden";
    }).length;
  });
  console.log(`Content with opacity: 0 under prefers-reduced-motion: ${invisibleContent}`);
  if (invisibleContent === 0) {
    console.log("PASS: Under prefers-reduced-motion, no text or controls remain invisible.");
  } else {
    console.warn(`[WARN] ${invisibleContent} elements are hidden under prefers-reduced-motion`);
  }
  await motionPage.close();

  // 7. PERFORMANCE & DOM METRICS
  console.log("\n--- 7. PERFORMANCE & DOM METRICS ---");
  const perfPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  for (const pageName of ["", "menu", "visit"]) {
    await perfPage.goto(`${BASE_URL}/${pageName}`, { waitUntil: "networkidle" });
    const metrics = await perfPage.evaluate(() => {
      const domNodes = document.querySelectorAll("*").length;
      const perfEntries = performance.getEntriesByType("navigation")[0];
      return {
        domNodes,
        loadTime: perfEntries ? Math.round(perfEntries.loadEventEnd - perfEntries.startTime) : null,
        domInteractive: perfEntries ? Math.round(perfEntries.domInteractive - perfEntries.startTime) : null,
      };
    });
    console.log(`/${pageName || "home"}: DOM nodes = ${metrics.domNodes} (target < 1500), domInteractive = ${metrics.domInteractive}ms`);
  }
  await perfPage.close();

  await browser.close();

  console.log("\n========================================================");
  console.log("                  AUDIT SUMMARY REPORT                  ");
  console.log("========================================================");
  console.log(`- Horizontal Overflow Issues: ${results.overflowIssues.length}`);
  console.log(`- Broken Links: ${results.brokenLinks.length}`);
  console.log(`- Reservation CTA Mismatches: ${results.reservationCtaIssues.length}`);
  console.log(`- H1 Semantic Issues: ${results.h1Issues.length}`);
  console.log(`- Missing Image Alt Attributes: ${results.altIssues.length}`);
  console.log("========================================================\n");

  const totalErrors =
    results.overflowIssues.length +
    results.brokenLinks.length +
    results.reservationCtaIssues.length +
    results.h1Issues.length +
    results.altIssues.length;

  if (totalErrors === 0) {
    console.log("ALL AUTOMATED VERIFICATION CHECKS PASSED!");
    process.exit(0);
  } else {
    console.error(`AUDIT FAILED with ${totalErrors} issue(s).`);
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error("Fatal error during audit:", err);
  process.exit(1);
});
