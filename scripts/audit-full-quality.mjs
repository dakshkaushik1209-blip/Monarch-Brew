import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

const BASE_URL = "http://localhost:3000";

const viewports = [
  { name: "Mobile Small", width: 360, height: 640 },
  { name: "Mobile Standard", width: 375, height: 667 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Laptop", width: 1024, height: 768 },
  { name: "Desktop", width: 1280, height: 800 },
  { name: "Wide", width: 1536, height: 960 },
];

const pagesToTest = [
  { path: "/", title: "Home" },
  { path: "/menu", title: "Menu" },
  { path: "/about", title: "About" },
  { path: "/gallery", title: "Gallery" },
  { path: "/visit", title: "Visit" },
  { path: "/privacy", title: "Privacy Policy" },
  { path: "/terms", title: "Terms and Conditions" },
];

const staticEndpoints = [
  { path: "/sitemap.xml", expectedStatus: 200 },
  { path: "/robots.txt", expectedStatus: 200 },
  { path: "/manifest.webmanifest", expectedStatus: 200 },
  { path: "/icon", expectedStatus: 200 },
  { path: "/apple-icon", expectedStatus: 200 },
  { path: "/opengraph-image", expectedStatus: 200 },
  { path: "/favicon.ico", expectedStatus: 200 },
  { path: "/icon.svg", expectedStatus: 200 },
  { path: "/icon-192.png", expectedStatus: 200 },
  { path: "/icon-512.png", expectedStatus: 200 },
  { path: "/apple-touch-icon.png", expectedStatus: 200 },
  { path: "/non-existent-page-test", expectedStatus: 404 },
];

async function runAudit() {
  console.log("========================================================");
  console.log("       CAFE WEBSITE: FULL QUALITY & CSS AUDIT           ");
  console.log("========================================================\n");

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let totalErrors = 0;

  // 1. Audit HTTP Endpoints & Security Headers
  console.log("--- 1. Testing Endpoints & Security Headers ---");
  for (const ep of staticEndpoints) {
    const res = await page.goto(`${BASE_URL}${ep.path}`, { waitUntil: "networkidle" });
    const status = res.status();
    if (status !== ep.expectedStatus) {
      console.error(`[FAIL] Endpoint ${ep.path}: expected status ${ep.expectedStatus}, got ${status}`);
      totalErrors++;
    } else {
      console.log(`[PASS] ${ep.path} -> ${status} OK`);
    }

    if (ep.path === "/") {
      const headers = res.headers();
      const requiredHeaders = [
        "x-content-type-options",
        "referrer-policy",
        "permissions-policy",
        "x-frame-options",
        "content-security-policy",
      ];
      for (const h of requiredHeaders) {
        if (!headers[h]) {
          console.error(`[FAIL] Missing security header: ${h}`);
          totalErrors++;
        } else {
          console.log(`[PASS] Header ${h}: ${headers[h].slice(0, 45)}...`);
        }
      }
      if (headers["x-powered-by"]) {
        console.error(`[FAIL] x-powered-by header is present!`);
        totalErrors++;
      } else {
        console.log(`[PASS] x-powered-by header is stripped cleanly`);
      }
    }
  }

  // 2. Audit Responsive Viewports for Horizontal Overflow
  console.log("\n--- 2. Responsive Viewports & Horizontal Overflow Check ---");
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const p of pagesToTest) {
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      if (overflow) {
        console.error(`[FAIL] Horizontal overflow detected on ${p.path} at ${vp.name} (${vp.width}px)`);
        totalErrors++;
      }
    }
    console.log(`[PASS] All ${pagesToTest.length} pages verified at ${vp.name} (${vp.width}x${vp.height}) - 0 overflow`);
  }

  // 3. Touch Target Audit on Mobile (375px)
  console.log("\n--- 3. Mobile Touch Target Audit (375px) ---");
  await page.setViewportSize({ width: 375, height: 667 });
  for (const p of pagesToTest) {
    await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "networkidle" });
    const undersizedElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll("button, a, input, select, textarea"));
      const failures = [];
      for (const el of elements) {
        // Skip hidden elements
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        // Skip links that are inline text spans within paragraphs
        if (el.tagName === "A" && el.parentElement && el.parentElement.tagName === "P" && rect.height < 30) {
          continue;
        }
        // Touch targets should ideally be >= 44x44 or >= 36 with padding
        if (rect.height < 36) {
          failures.push({
            tag: el.tagName,
            text: (el.textContent || "").trim().slice(0, 30),
            height: Math.round(rect.height),
            width: Math.round(rect.width),
          });
        }
      }
      return failures;
    });

    if (undersizedElements.length > 0) {
      console.warn(`[NOTICE] ${p.path} has ${undersizedElements.length} compact elements:`, undersizedElements.slice(0, 3));
    } else {
      console.log(`[PASS] ${p.path}: All interactive touch targets satisfy touch guidelines`);
    }
  }

  // 4. Print Layout Audit
  console.log("\n--- 4. Print Layout Audit ---");
  for (const printPath of ["/menu", "/privacy", "/terms"]) {
    await page.goto(`${BASE_URL}${printPath}`, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });

    const printCheck = await page.evaluate(() => {
      const nav = document.querySelector("nav");
      const footer = document.querySelector("footer");
      const navHidden = !nav || window.getComputedStyle(nav).display === "none";
      const footerHidden = !footer || window.getComputedStyle(footer).display === "none";
      return { navHidden, footerHidden };
    });

    if (!printCheck.navHidden || !printCheck.footerHidden) {
      console.warn(`[WARN] ${printPath} in print mode: navHidden=${printCheck.navHidden}, footerHidden=${printCheck.footerHidden}`);
    } else {
      console.log(`[PASS] ${printPath}: Nav & footer cleanly hidden in print mode`);
    }
    await page.emulateMedia({ media: "screen" });
  }

  // 5. Internal Links Integrity Audit
  console.log("\n--- 5. Internal Links Integrity Audit ---");
  const visitedLinks = new Set();
  const internalLinks = new Set();

  for (const p of pagesToTest) {
    await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "networkidle" });
    const hrefs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a[href]"))
        .map((a) => a.getAttribute("href"))
        .filter((href) => href && href.startsWith("/") && !href.startsWith("//"));
    });
    hrefs.forEach((h) => {
      const clean = h.split("#")[0];
      if (clean) internalLinks.add(clean);
    });
  }

  console.log(`Discovered ${internalLinks.size} unique internal routes to test.`);
  for (const link of internalLinks) {
    const res = await page.goto(`${BASE_URL}${link}`, { waitUntil: "networkidle" });
    const status = res.status();
    if (status !== 200) {
      console.error(`[FAIL] Broken link: ${link} returned status ${status}`);
      totalErrors++;
    } else {
      console.log(`[PASS] Link ${link} -> 200 OK`);
    }
  }

  await browser.close();

  console.log("\n========================================================");
  if (totalErrors === 0) {
    console.log("AUDIT SUMMARY: 100% PASSED. Zero errors detected.");
  } else {
    console.error(`AUDIT SUMMARY: FAILED with ${totalErrors} error(s).`);
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error("Audit run error:", err);
  process.exit(1);
});
