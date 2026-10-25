import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function testAllMastFeatures() {
  console.log("Starting Full Feature Verification...\n");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = [];

  // 1. Home Page: Taste Matchmaker
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const matchmakerTitle = await page.$("h3:has-text('Find your morning')");
    if (!matchmakerTitle) throw new Error("[FAIL] Taste Matchmaker title missing on Home.");

    // Step 1: Click "Black & Pure"
    await page.click("button:has-text('Black & Pure')");
    await page.waitForTimeout(300);

    // Step 2: Click "Zero Sweetness"
    await page.click("button:has-text('Zero Sweetness')");
    await page.waitForTimeout(300);

    // Step 3: Click "Deep Focus & Work"
    await page.click("button:has-text('Deep Focus & Work')");
    await page.waitForTimeout(400);

    // Verify result card
    const resultHeader = await page.$("text=Your Curated Cafe Order");
    if (!resultHeader) throw new Error("[FAIL] Curated order result not displayed after step 3.");

    const comboTotal = await page.$("text=Combo Order Total:");
    if (!comboTotal) throw new Error("[FAIL] Combo total missing in matchmaker result.");

    await page.screenshot({ path: "scripts/matchmaker-result.png", fullPage: false });
    results.push("[PASS] Home: CoffeeMatchmaker completed 3-step quiz and generated custom pairing order.");
    await page.close();
  }

  // 2. Menu Page: Add to Tray + Counter Order Slip
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto("http://localhost:3000/menu", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Add first item to tray
    const addBtns = await page.$$("button:has-text('+ Add')");
    if (addBtns.length === 0) throw new Error("[FAIL] No '+ Add' buttons found on Menu items.");
    
    // Add two items
    await addBtns[0].click();
    await page.waitForTimeout(200);
    await addBtns[1].click();
    await page.waitForTimeout(300);

    // Floating tray button should be visible
    const trayBtn = await page.$("button[aria-label*='Open counter order tray']");
    if (!trayBtn) throw new Error("[FAIL] Floating Order Tray button did not appear after adding items.");

    // Open order slip modal
    await trayBtn.click();
    await page.waitForTimeout(400);

    // Verify ticket header
    const ticketTitle = await page.$("text=Counter Order Ticket");
    if (!ticketTitle) throw new Error("[FAIL] Counter Order Ticket modal not visible.");

    // Test Barista Mode
    await page.click("button:has-text('Show Barista View')");
    await page.waitForTimeout(300);
    const baristaHeader = await page.$("text=Barista View (Counter Display)");
    if (!baristaHeader) throw new Error("[FAIL] Barista View mode failed to activate.");

    // Test Copy Order Text
    await page.click("button:has-text('Copy Order Text')");
    await page.waitForTimeout(200);
    const copiedConfirm = await page.$("text=Order Copied!");
    if (!copiedConfirm) throw new Error("[FAIL] Order Copied confirmation feedback not displayed.");

    await page.screenshot({ path: "scripts/order-tray-slip.png", fullPage: false });
    results.push("[PASS] Menu: OrderTray adds items, opens Counter Order Ticket, activates Barista View, and copies order text.");
    await page.close();
  }

  await browser.close();

  console.log("\n========================================================");
  console.log("ALL NEW MAST FEATURES VERIFIED SUCCESSFULLY:");
  results.forEach((r) => console.log("  " + r));
  console.log("========================================================\n");
}

testAllMastFeatures().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
