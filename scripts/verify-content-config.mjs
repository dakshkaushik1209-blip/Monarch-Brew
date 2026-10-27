import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");
const { getOpeningStatus } = require("../src/config/hours.ts");

async function run() {
  console.log("=== STARTING CONTENT & CONFIG VERIFICATION ===\n");

  // -------------------------------------------------------------------------
  // 1. UNIT TEST: Opening status logic at 9:59 AM, 10:00 AM, 10:59 PM, 11:00 PM
  // -------------------------------------------------------------------------
  console.log("--- 1. Testing Opening Status in Asia/Kolkata ---");
  // 9:59 AM Asia/Kolkata is 04:29 UTC
  const t959 = getOpeningStatus(new Date("2026-10-26T04:29:00Z"));
  console.log("9:59 AM Asia/Kolkata ->", t959);
  if (t959.isOpen !== false || !t959.statusText.includes("10:00 AM")) {
    throw new Error("9:59 AM failed: should be closed and open at 10:00 AM");
  }

  // 10:00 AM Asia/Kolkata is 04:30 UTC
  const t1000 = getOpeningStatus(new Date("2026-10-26T04:30:00Z"));
  console.log("10:00 AM Asia/Kolkata ->", t1000);
  if (t1000.isOpen !== true || t1000.statusText !== "Open until 11:00 PM") {
    throw new Error("10:00 AM failed: should be open until 11:00 PM");
  }

  // 10:59 PM Asia/Kolkata is 17:29 UTC
  const t2259 = getOpeningStatus(new Date("2026-10-26T17:29:00Z"));
  console.log("10:59 PM Asia/Kolkata ->", t2259);
  if (t2259.isOpen !== true || t2259.statusText !== "Open until 11:00 PM") {
    throw new Error("10:59 PM failed: should be open until 11:00 PM");
  }

  // 11:00 PM Asia/Kolkata is 17:30 UTC
  const t2300 = getOpeningStatus(new Date("2026-10-26T17:30:00Z"));
  console.log("11:00 PM Asia/Kolkata ->", t2300);
  if (t2300.isOpen !== false || !t2300.statusText.includes("tomorrow")) {
    throw new Error("11:00 PM failed: should be closed and open tomorrow at 10:00 AM");
  }
  console.log("PASS: Opening status logic validated at all 4 threshold times\n");

  // -------------------------------------------------------------------------
  // 2. BROWSER TESTS: Desktop (1280) & Mobile (375) across all core pages
  // -------------------------------------------------------------------------
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (text.includes("404") || text.includes("Not Found")) return;
      consoleErrors.push(text);
    }
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  const pagesToTest = [
    { url: "http://localhost:3000/", name: "Home" },
    { url: "http://localhost:3000/menu", name: "Menu" },
    { url: "http://localhost:3000/about", name: "About" },
    { url: "http://localhost:3000/visit", name: "Visit" },
    { url: "http://localhost:3000/privacy", name: "Privacy" },
    { url: "http://localhost:3000/terms", name: "Terms" },
    { url: "http://localhost:3000/non-existent-page", name: "404 Not Found" },
  ];

  for (const p of pagesToTest) {
    console.log(`\n--- Testing ${p.name} Page (${p.url}) ---`);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(p.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);

    // Verify Brand Name in Navbar or title
    const brandText = await page.locator("header.navbar-transition").first().innerText();
    if (!brandText.includes("Monarch Brew")) {
      throw new Error(`Navbar on ${p.name} missing 'Monarch Brew'! Content: ${brandText}`);
    }
    console.log(`[OK] ${p.name} has 'Monarch Brew' in navbar`);

    // Specific Page Assertions
    if (p.name === "Home") {
      // Check Hero H1
      const h1Text = await page.locator("h1#hero-heading .hero-sr").innerText();
      console.log("Home H1 Screen reader text:", h1Text);
      if (h1Text !== "Slow roasts and fresh bakes.") {
        throw new Error(`Hero H1 mismatch! Got: ${h1Text}`);
      }

      // Check "What people order here" items
      const popularArticles = await page.locator("section[aria-labelledby='popular-items-heading'] h3").allInnerTexts();
      console.log("Popular items on Home:", popularArticles);
      const expectedPopular = ["Filter Coffee", "Hazelnut Cold Brew", "Masala Chai", "Almond Croissant"];
      for (const item of expectedPopular) {
        if (!popularArticles.includes(item)) {
          throw new Error(`Expected popular item "${item}" not found on Home!`);
        }
      }
      console.log("PASS: Home 'What people order here' contains all 4 expected items");
    }

    if (p.name === "Menu") {
      // Check prices and categories
      const menuH2s = await page.locator("main h2").allInnerTexts();
      console.log("Menu Categories:", menuH2s);
      if (!menuH2s.includes("Coffee") || !menuH2s.includes("Cold Brews") || !menuH2s.includes("Tea") || !menuH2s.includes("Combos")) {
        throw new Error("Missing expected categories on Menu page!");
      }
      const samplePrice = await page.locator("text=₹190").first().innerText();
      console.log("Sample formatted price found:", samplePrice);
      console.log("PASS: Menu categories and prices formatted with ₹");

      // Verify JSON-LD in demo mode is omitted
      const ldJsonCount = await page.locator('script[type="application/ld+json"]').count();
      console.log(`Menu JSON-LD script count in demo mode: ${ldJsonCount}`);
      if (ldJsonCount !== 0) {
        throw new Error("JSON-LD should be omitted in demo mode!");
      }
      console.log("PASS: Menu JSON-LD omitted in demo mode");
    }

    if (p.name === "About") {
      const aboutParas = await page.locator("section[aria-labelledby='story-heading'] p").allInnerTexts();
      console.log("About plain sentences:", aboutParas);
      if (aboutParas.length < 3 || !aboutParas[0].includes("Monarch Brew is a cafe at RDC, Raj Nagar, Ghaziabad.")) {
        throw new Error("About sentences do not match config!");
      }
      console.log("PASS: About plain sentences correctly displayed");

      // Verify facts section is hidden (since facts = [])
      const factsHeading = await page.locator("#facts-heading").count();
      if (factsHeading !== 0) {
        throw new Error("Facts section should remain hidden when facts array is empty!");
      }
      console.log("PASS: Sourcing facts section is hidden");
    }

    if (p.name === "Visit") {
      // Check address
      const addressText = await page.locator("main").innerText();
      if (!addressText.includes("RDC, Raj Nagar, Ghaziabad 201002")) {
        throw new Error("Visit page missing 'RDC, Raj Nagar, Ghaziabad 201002'!");
      }
      console.log("PASS: Visit page displays 'RDC, Raj Nagar, Ghaziabad 201002'");

      // Check plain demo note when WhatsApp number is unconfigured
      const demoNote = await page.locator("text=Choose the cafe's contact in WhatsApp to send it.").first().isVisible();
      console.log("Demo note visible:", demoNote);
      if (!demoNote) {
        throw new Error("Reservation form should show demo contact selection note when phone is empty!");
      }
      console.log("PASS: Reservation form shows graceful fallback note");

      // Verify no direct phone link when phone is empty
      const phoneLinks = await page.locator("a[href^='tel:']").count();
      console.log("Phone links count (should be 0 when phone is empty):", phoneLinks);
      if (phoneLinks !== 0) {
        throw new Error("Phone link rendered while phone is empty!");
      }
      console.log("PASS: Phone link cleanly hidden when empty");

      // Verify JSON-LD omitted in demo mode
      const visitJsonLdCount = await page.locator('script[type="application/ld+json"]').count();
      console.log(`Visit JSON-LD script count in demo mode: ${visitJsonLdCount}`);
      if (visitJsonLdCount !== 0) {
        throw new Error("CafeOrCoffeeShop JSON-LD should be omitted in demo mode!");
      }
      console.log("PASS: CafeOrCoffeeShop JSON-LD omitted in demo mode");
    }

    // Mobile Viewport Check (375x812)
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(200);
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if (hasOverflow) throw new Error(`Horizontal overflow detected on ${p.name} at 375px!`);
    console.log(`[OK] ${p.name} renders cleanly at 375px with 0 horizontal overflow`);
  }

  // -------------------------------------------------------------------------
  // 3. TEST ROBOTS.TXT & SITEMAP IN DEMO MODE
  // -------------------------------------------------------------------------
  console.log("\n--- Testing Robots.txt and Sitemap in Demo Mode ---");
  const robotsRes = await page.goto("http://localhost:3000/robots.txt");
  const robotsText = await robotsRes.text();
  console.log("Robots.txt content:\n" + robotsText);
  if (!robotsText.includes("Disallow: /") || robotsText.includes("sitemap.xml")) {
    throw new Error("Robots.txt in demo mode must disallow / and omit sitemap!");
  }
  console.log("PASS: Robots.txt disallows all and omits sitemap in demo mode");

  // Verify meta robots tag on HTML
  await page.goto("http://localhost:3000/");
  const metaRobots = await page.locator('meta[name="robots"]').getAttribute("content");
  console.log("Meta robots tag content:", metaRobots);
  if (!metaRobots || !metaRobots.includes("noindex") || !metaRobots.includes("nofollow")) {
    throw new Error("Meta robots tag must specify noindex, nofollow in demo mode!");
  }
  console.log("PASS: Meta robots tag has noindex, nofollow in demo mode");

  // Check console errors
  console.log(`\nTotal browser console errors across all pages: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    throw new Error(`Console errors detected: ${JSON.stringify(consoleErrors)}`);
  }
  console.log("PASS: Strictly 0 console errors!");

  await browser.close();
  console.log("\n=== ALL CONTENT & CONFIG TESTS PASSED SUCCESSFULLY! ===");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
