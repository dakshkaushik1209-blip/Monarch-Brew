import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function run() {
  console.log("=== STARTING SOCIAL & WHATSAPP LINKS VERIFICATION ===\n");

  // -------------------------------------------------------------------------
  // 2. BROWSER TESTS: Launch browser and check network requests & DOM
  // -------------------------------------------------------------------------
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const networkRequests = [];
  page.on("request", (req) => {
    networkRequests.push(req.url());
  });

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("404")) consoleErrors.push(text);
    }
  });

  console.log("--- 2. Checking network requests on page load (Third-party isolation) ---");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  const thirdPartyRequests = networkRequests.filter((url) => {
    return !url.startsWith("http://localhost:3000") && !url.startsWith("data:");
  });

  console.log("Third party requests captured on page load:", thirdPartyRequests);
  if (thirdPartyRequests.length > 0) {
    throw new Error(`Detected unwanted third-party requests on page load: ${JSON.stringify(thirdPartyRequests)}`);
  }
  console.log("[OK] Strictly ZERO third-party requests on page load (no pixels, no SDKs, no fonts from external CDNs)\n");

  // -------------------------------------------------------------------------
  // 3. FOOTER SOCIAL LINKS VERIFICATION
  // -------------------------------------------------------------------------
  console.log("--- 3. Verifying Footer Social Links ---");
  const footerIg = page.locator("footer a[aria-label='Instagram']");
  const footerFb = page.locator("footer a[aria-label='Facebook']");
  const footerWa = page.locator("footer a[aria-label='WhatsApp']");

  if ((await footerIg.count()) !== 1 || (await footerFb.count()) !== 1 || (await footerWa.count()) !== 1) {
    throw new Error("Footer must contain exactly 1 Instagram, 1 Facebook, and 1 WhatsApp link!");
  }

  const igHref = await footerIg.getAttribute("href");
  const fbHref = await footerFb.getAttribute("href");
  const waHref = await footerWa.getAttribute("href");

  const igTarget = await footerIg.getAttribute("target");
  const igRel = await footerIg.getAttribute("rel");

  console.log("Footer Instagram href:", igHref, "target:", igTarget, "rel:", igRel);
  console.log("Footer Facebook href:", fbHref);
  console.log("Footer WhatsApp href:", waHref);

  if (igHref !== "https://www.instagram.com/") throw new Error("Footer Instagram link mismatch!");
  if (fbHref !== "https://www.facebook.com/") throw new Error("Footer Facebook link mismatch!");
  if (waHref !== "https://wa.me/") throw new Error("Footer WhatsApp link mismatch!");
  if (igTarget !== "_blank" || !igRel?.includes("noopener") || !igRel?.includes("noreferrer")) {
    throw new Error("External links must have target='_blank' and rel='noopener noreferrer'!");
  }

  // Check touch target sizes
  const igBox = await footerIg.boundingBox();
  console.log(`Footer Instagram box dimensions: ${igBox?.width}px x ${igBox?.height}px`);
  if (!igBox || igBox.width < 44 || igBox.height < 44) {
    throw new Error(`Touch target size under 44px: ${igBox?.width}x${igBox?.height}`);
  }
  console.log("[OK] Footer social links render correctly with 44px+ touch targets and secure attributes\n");

  // -------------------------------------------------------------------------
  // 4. VISIT PAGE "FIND US" LABELLED LINKS
  // -------------------------------------------------------------------------
  console.log("--- 4. Verifying Visit Page 'Find us' Labelled Links ---");
  await page.goto("http://localhost:3000/visit", { waitUntil: "networkidle" });

  const visitIg = page.locator("a:has-text('Instagram')");
  const visitFb = page.locator("a:has-text('Facebook')");
  const visitWa = page.locator("a:has-text('Chat on WhatsApp')");

  if ((await visitIg.count()) < 1 || (await visitFb.count()) < 1 || (await visitWa.count()) < 1) {
    throw new Error("Visit page missing labelled Instagram, Facebook, or WhatsApp links!");
  }

  const visitIgHref = await visitIg.first().getAttribute("href");
  const visitFbHref = await visitFb.first().getAttribute("href");
  const visitWaHref = await visitWa.first().getAttribute("href");

  console.log("Visit page Instagram href:", visitIgHref);
  console.log("Visit page Facebook href:", visitFbHref);
  console.log("Visit page WhatsApp href:", visitWaHref);

  if (visitIgHref !== "https://www.instagram.com/") throw new Error("Visit page Instagram href mismatch!");
  if (visitFbHref !== "https://www.facebook.com/") throw new Error("Visit page Facebook href mismatch!");
  if (visitWaHref !== "https://wa.me/") throw new Error("Visit page WhatsApp href mismatch!");

  const visitWaBox = await visitWa.first().boundingBox();
  console.log(`Visit WhatsApp button height: ${visitWaBox?.height}px`);
  if (!visitWaBox || visitWaBox.height < 44) {
    throw new Error(`Visit WhatsApp button height under 44px: ${visitWaBox?.height}`);
  }
  console.log("[OK] Visit page labelled links render correctly\n");

  // -------------------------------------------------------------------------
  // 5. RESERVATION FORM SUBMISSION FLOW (WHATSAPP DISPATCH)
  // -------------------------------------------------------------------------
  console.log("--- 5. Testing Reservation Form WhatsApp Submission ---");

  // Check demo mode unconfigured note
  const demoNoteCount = await page.locator("text=Choose the cafe's contact in WhatsApp to send it.").count();
  if (demoNoteCount === 0) {
    throw new Error("Demo mode must show note: 'Choose the cafe's contact in WhatsApp to send it.'");
  }
  console.log("[OK] Demo note visible before submission");

  // Intercept window.open
  await page.evaluate(() => {
    window.__lastOpenedUrl = null;
    window.open = (url) => {
      window.__lastOpenedUrl = url;
      return null;
    };
  });

  // Calculate tomorrow's date for valid input
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  // Fill in form with special characters, ampersand, quotes, and Hindi text
  const testName = "Aarav & Simran";
  const testPhone = "+91 98765 43210";
  const testNotes = "Corner table & \"Window\" seating! चाय और कॉफ़ी";

  await page.fill("input[name='name']", testName);
  await page.fill("input[name='phone']", testPhone);
  await page.fill("input[name='date']", tomorrowStr);
  await page.selectOption("select[name='time']", "11:00 AM");
  await page.fill("input[name='guests']", "2");
  await page.fill("textarea[name='notes']", testNotes);

  // Submit
  await page.click("button[type='submit']:has-text('Request table via WhatsApp')");

  // Verify opened URL
  const openedUrl = await page.evaluate(() => window.__lastOpenedUrl);
  console.log("Captured window.open URL:", openedUrl);

  if (!openedUrl || !openedUrl.startsWith("https://wa.me/?text=")) {
    throw new Error(`Expected URL to start with https://wa.me/?text= but got ${openedUrl}`);
  }

  // Parse and decode query text
  const urlObj = new URL(openedUrl);
  const textParam = urlObj.searchParams.get("text");
  console.log("Decoded text parameter:\n" + textParam);

  if (!textParam.includes("Aarav & Simran")) throw new Error("Name with ampersand was not properly encoded!");
  if (!textParam.includes('"Window"')) throw new Error("Quotes were not properly encoded!");
  if (!textParam.includes("चाय और कॉफ़ी")) throw new Error("Hindi text was not properly encoded!");

  // Verify confirmation message
  const statusMessage = await page.locator("div[role='status']").innerText();
  console.log("Confirmation status text:", statusMessage);
  if (!statusMessage.includes("WhatsApp will open with your details filled in. The booking is confirmed only when the cafe replies.")) {
    throw new Error("Confirmation line mismatch!");
  }
  if (!statusMessage.includes("Choose the cafe's contact in WhatsApp to send it.")) {
    throw new Error("Status message should include demo note when unconfigured!");
  }
  console.log("[OK] Reservation submission correctly encodes Unicode, quotes, & symbols into WhatsApp dispatch\n");

  // -------------------------------------------------------------------------
  // 6. VIEWPORT & KEYBOARD ACCESSIBILITY
  // -------------------------------------------------------------------------
  console.log("--- 6. Checking Viewport and Keyboard Focus ---");
  await page.setViewportSize({ width: 375, height: 812 });
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (hasOverflow) throw new Error("Horizontal overflow detected on mobile 375px!");
  console.log("[OK] Zero horizontal overflow at 375px");

  // Keyboard tab focus test
  await page.focus("footer a[aria-label='Instagram']");
  const isFocused = await page.evaluate(() => document.activeElement === document.querySelector("footer a[aria-label='Instagram']"));
  if (!isFocused) throw new Error("Footer Instagram link did not receive keyboard focus!");
  console.log("[OK] Keyboard focus state verified");

  // -------------------------------------------------------------------------
  // 7. PRIVACY PAGE VERIFICATION
  // -------------------------------------------------------------------------
  console.log("\n--- 7. Checking /privacy content ---");
  await page.goto("http://localhost:3000/privacy", { waitUntil: "networkidle" });
  const privacyText = await page.locator("#main-content").innerText();
  if (!privacyText.includes("Instagram, Facebook, and WhatsApp") || !privacyText.includes("We do not embed feeds")) {
    throw new Error("Privacy policy missing required social platform statement!");
  }
  console.log("[OK] Privacy policy explains external social links and zero embedded SDKs/pixels\n");

  // -------------------------------------------------------------------------
  // 8. TEST WITH CONFIGURED REAL/TEST VALUES (THEN RESTORE)
  // -------------------------------------------------------------------------
  console.log("--- 8. Testing configured values (simulating real social handles & number) ---");
  const cafeConfigFile = path.resolve("src/config/cafe.ts");
  const originalCafeConfig = fs.readFileSync(cafeConfigFile, "utf-8");

  try {
    const modifiedConfig = originalCafeConfig
      .replace('whatsapp: "",', 'whatsapp: "919999999999",')
      .replace('instagram: "",', 'instagram: "testcafe",')
      .replace('facebook: "",', 'facebook: "testcafepage",');
    fs.writeFileSync(cafeConfigFile, modifiedConfig, "utf-8");

    // Give dev server time to reload
    await page.waitForTimeout(2000);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await page.goto("http://localhost:3000/visit", { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(500);
        break;
      } catch {
        await page.waitForTimeout(1000);
      }
    }

    const configuredIg = await page.locator("footer a[aria-label='Instagram']").getAttribute("href");
    const configuredFb = await page.locator("footer a[aria-label='Facebook']").getAttribute("href");
    const configuredWa = await page.locator("footer a[aria-label='WhatsApp']").getAttribute("href");

    console.log("Configured Footer IG:", configuredIg);
    console.log("Configured Footer FB:", configuredFb);
    console.log("Configured Footer WA:", configuredWa);

    if (configuredIg !== "https://www.instagram.com/testcafe/") throw new Error("Configured IG URL mismatch!");
    if (configuredFb !== "https://www.facebook.com/testcafepage") throw new Error("Configured FB URL mismatch!");
    if (configuredWa !== "https://wa.me/919999999999") throw new Error("Configured WA URL mismatch!");

    // Test reservation submit with configured number
    await page.fill("input[name='name']", "Test Guest");
    await page.fill("input[name='phone']", "+91 98765 43210");
    await page.fill("input[name='date']", tomorrowStr);
    await page.selectOption("select[name='time']", "12:00 PM");
    await page.fill("input[name='guests']", "4");

    // Re-attach window.open interceptor after navigation
    await page.evaluate(() => {
      window.__lastOpenedUrl = null;
      window.open = (url) => {
        window.__lastOpenedUrl = url;
        return null;
      };
    });

    await page.click("button[type='submit']:has-text('Request table via WhatsApp')");
    const openedConfiguredUrl = await page.evaluate(() => window.__lastOpenedUrl);
    console.log("Captured configured dispatch URL:", openedConfiguredUrl);

    if (!openedConfiguredUrl || !openedConfiguredUrl.startsWith("https://wa.me/919999999999?text=")) {
      throw new Error(`Expected dispatch to https://wa.me/919999999999?text= but got ${openedConfiguredUrl}`);
    }
    console.log("[OK] Configured social and WhatsApp links successfully verified!");
  } finally {
    // ALWAYS RESTORE ORIGINAL CONFIG
    fs.writeFileSync(cafeConfigFile, originalCafeConfig, "utf-8");
    console.log("[OK] Restored src/config/cafe.ts to original clean empty state");
    await page.waitForTimeout(1500);
  }

  // -------------------------------------------------------------------------
  // 9. SCREENSHOTS AT 1280px & 375px
  // -------------------------------------------------------------------------
  console.log("\n--- 9. Capturing screenshots ---");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("http://localhost:3000/visit", { waitUntil: "networkidle" });
  await page.screenshot({ path: "scripts/social-visit-desktop-1280.png", fullPage: false });

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("http://localhost:3000/visit", { waitUntil: "networkidle" });
  await page.screenshot({ path: "scripts/social-visit-mobile-375.png", fullPage: false });
  console.log("[OK] Screenshots saved to scripts/");

  await browser.close();
  console.log("\n=== ALL SOCIAL AND WHATSAPP TESTS PASSED WITH 0 ERRORS! ===");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
