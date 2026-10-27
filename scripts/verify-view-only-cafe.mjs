import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");
import fs from "fs";
import path from "path";

async function run() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = {
    notFoundChecks: [],
    viewports: [],
    interactions: [],
    errors: [],
  };

  const screenshotsDir = "public/verify-screenshots";
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("console", (msg) => {
    // Only capture unexpected runtime errors, skip the expected 404 resource logs when navigating to 404 test pages
    if (msg.type() === "error" && !msg.text().includes("404")) {
      results.errors.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on("pageerror", (err) => {
    results.errors.push(`[Page Error] ${err.message}`);
  });

  console.log("=== 1. VERIFYING 404 ON ORDERING ROUTES ===");
  const routesTo404 = ["/cart", "/checkout", "/api/orders", "/api/payments/webhook"];
  for (const route of routesTo404) {
    const res = await page.goto(`http://localhost:3000${route}`, { waitUntil: "domcontentloaded" });
    const status = res ? res.status() : "no-response";
    const bodyText = await page.textContent("body");
    const is404 = status === 404 || bodyText?.includes("404") || bodyText?.includes("could not be found");
    results.notFoundChecks.push({ route, status, is404 });
    console.log(`Route ${route}: status=${status}, is404=${is404}`);
  }

  console.log("\n=== 2. VERIFYING DESKTOP (1280px) & MOBILE (375px) ===");
  const viewports = [
    { name: "desktop", width: 1280, height: 800 },
    { name: "mobile", width: 375, height: 667 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    
    // Test Home
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(screenshotsDir, `home-${vp.name}.png`), fullPage: false });
    const hasCartInNavbar = (await page.$$("button[aria-label*='Cart'], a[href*='cart']")).length > 0;
    const hasFloatingCup = (await page.$$("[data-floating-cup='true']")).length > 0;
    const hasOrderHeading = (await page.$$("text='What people order here'")).length > 0;
    const orderSectionMenuLink = await page.$("a[href='/menu']");
    const hasMenuLink = !!orderSectionMenuLink;

    // Test Menu
    await page.goto("http://localhost:3000/menu", { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(screenshotsDir, `menu-${vp.name}.png`), fullPage: false });
    const addButtons = await page.$$("text='+ Add'");
    const addToCartButtons = await page.$$("button[aria-label*='Add to']");
    const dietVegBtn = await page.$("button:has-text('Veg only')");
    let filterWorks = false;
    if (dietVegBtn) {
      await dietVegBtn.click();
      await page.waitForTimeout(300);
      const activeAttr = await dietVegBtn.getAttribute("aria-pressed");
      filterWorks = activeAttr === "true";
    }

    // Test Visit
    await page.goto("http://localhost:3000/visit", { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(screenshotsDir, `visit-${vp.name}.png`), fullPage: false });
    const reserveHeading = await page.$("#reserve");
    const hasReserveSection = !!reserveHeading;

    // Test Privacy and Terms
    await page.goto("http://localhost:3000/privacy", { waitUntil: "networkidle" });
    const privacyText = await page.textContent("body");
    const privacyHasOrdering = privacyText?.includes("WhatsApp order data") || privacyText?.includes("Online and WhatsApp order data");

    await page.goto("http://localhost:3000/terms", { waitUntil: "networkidle" });
    const termsText = await page.textContent("body");
    const termsHasOrdering = termsText?.includes("Digital and WhatsApp ordering terms");

    results.viewports.push({
      viewport: `${vp.name} (${vp.width}x${vp.height})`,
      hasCartInNavbar,
      hasFloatingCup,
      hasOrderHeading,
      hasMenuLink,
      addButtonsCount: addButtons.length + addToCartButtons.length,
      filterWorks,
      hasReserveSection,
      privacyHasOrdering,
      termsHasOrdering,
    });
  }

  console.log("\n=== 3. VERIFYING RESERVATION FORM WHATSAPP LINK ===");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("http://localhost:3000/visit", { waitUntil: "networkidle" });
  
  // Fill reservation form using name attributes
  await page.fill("input[name='name']", "Test Guest");
  await page.fill("input[name='phone']", "9876543210");
  
  // Set date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];
  await page.fill("input[name='date']", dateStr);
  
  await page.selectOption("select[name='time']", "10:30 AM");
  await page.fill("input[name='guests']", "2");

  // Intercept window.open
  await page.evaluate(() => {
    window.__openedUrls = [];
    window.open = (url) => {
      window.__openedUrls.push(url);
      return null;
    };
  });

  // Click Submit
  const submitBtn = await page.$("button[type='submit']");
  if (submitBtn) {
    await submitBtn.click();
    await page.waitForTimeout(500);

    const openedUrls = await page.evaluate(() => window.__openedUrls);
    const targetUrl = openedUrls[0] || "";
    const isWhatsApp = targetUrl.includes("wa.me") && targetUrl.includes("reservation");
    results.interactions.push({
      form: "reservation",
      submitted: true,
      openedUrl: targetUrl,
      isWhatsApp,
    });
    console.log("Reservation WhatsApp URL opened:", targetUrl);
  }

  console.log("\n=== SUMMARY RESULTS ===");
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
