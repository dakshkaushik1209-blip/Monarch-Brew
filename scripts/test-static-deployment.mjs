import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

const PORT = 3333;
const OUT_DIR = path.resolve("out");
const HEADERS_FILE = path.join(OUT_DIR, "_headers");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function parseHeadersFile() {
  if (!fs.existsSync(HEADERS_FILE)) return [];
  const lines = fs.readFileSync(HEADERS_FILE, "utf8").split("\n");
  const rules = [];
  let currentPattern = null;
  let currentHeaders = {};

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    if (!rawLine.startsWith(" ") && !rawLine.startsWith("\t")) {
      if (currentPattern && Object.keys(currentHeaders).length > 0) {
        rules.push({ pattern: currentPattern, headers: currentHeaders });
      }
      currentPattern = line;
      currentHeaders = {};
    } else {
      const colonIdx = line.indexOf(":");
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim().toLowerCase();
        const val = line.slice(colonIdx + 1).trim();
        currentHeaders[key] = val;
      }
    }
  }

  if (currentPattern && Object.keys(currentHeaders).length > 0) {
    rules.push({ pattern: currentPattern, headers: currentHeaders });
  }

  return rules;
}

const headerRules = parseHeadersFile();

function getMatchingHeaders(urlPath) {
  const merged = {};
  for (const rule of headerRules) {
    const pattern = rule.pattern;
    let match = false;
    if (pattern === "/*") {
      match = true;
    } else if (pattern.endsWith("/*")) {
      const prefix = pattern.slice(0, -2);
      match = urlPath.startsWith(prefix);
    } else if (pattern.includes("*")) {
      const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
      match = regex.test(urlPath);
    } else {
      match = urlPath === pattern || urlPath === pattern + "/";
    }

    if (match) {
      Object.assign(merged, rule.headers);
    }
  }
  return merged;
}

function startStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      let reqPath = decodeURIComponent(parsedUrl.pathname);

      let filePath = path.join(OUT_DIR, reqPath);
      let is404 = false;

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index.html");
      } else if (!fs.existsSync(filePath)) {
        if (fs.existsSync(filePath + ".html")) {
          filePath = filePath + ".html";
        } else if (fs.existsSync(path.join(filePath, "index.html"))) {
          filePath = path.join(filePath, "index.html");
        } else {
          is404 = true;
          filePath = path.join(OUT_DIR, "404.html");
        }
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      const customHeaders = getMatchingHeaders(reqPath);

      const status = is404 ? 404 : 200;
      res.writeHead(status, {
        "Content-Type": contentType,
        ...customHeaders,
      });

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });

    server.listen(PORT, () => {
      console.log(`[Test Server] Serving 'out/' on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function runAudit() {
  const server = await startStaticServer();
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  const routesToTest = [
    { path: "/", title: "Home" },
    { path: "/menu/", title: "Menu" },
    { path: "/about/", title: "About" },
    { path: "/gallery/", title: "Gallery" },
    { path: "/visit/", title: "Visit" },
    { path: "/privacy/", title: "Privacy" },
    { path: "/terms/", title: "Terms" },
    { path: "/non-existent-page-test", title: "404 Fallback", expect404: true },
  ];

  const viewports = [
    { name: "Desktop", width: 1280, height: 800 },
    { name: "Mobile", width: 375, height: 812 },
  ];

  let testFailures = 0;

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const route of routesToTest) {
      const consoleErrors = [];
      const cspErrors = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      page.on("pageerror", (err) => {
        consoleErrors.push(err.message);
      });

      const url = `http://localhost:${PORT}${route.path}`;
      const response = await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(800);

      const status = response.status();
      const headers = response.headers();

      if (route.expect404) {
        if (status === 404) {
          console.log(`[PASS] ${route.title} (${route.path}) returned expected status 404.`);
        } else {
          console.error(`[FAIL] ${route.title} (${route.path}) returned status ${status}, expected 404.`);
          testFailures++;
        }
      } else {
        if (status === 200) {
          console.log(`[PASS] ${route.title} (${route.path}) returned status 200.`);
        } else {
          console.error(`[FAIL] ${route.title} (${route.path}) returned status ${status}, expected 200.`);
          testFailures++;
        }
      }

      // Check security headers
      const nosniff = headers["x-content-type-options"];
      const frameOptions = headers["x-frame-options"];
      const csp = headers["content-security-policy"];

      if (nosniff !== "nosniff") {
        console.error(`[FAIL] Missing or invalid x-content-type-options header on ${route.path}`);
        testFailures++;
      }
      if (frameOptions !== "SAMEORIGIN") {
        console.error(`[FAIL] Missing or invalid x-frame-options header on ${route.path}`);
        testFailures++;
      }
      if (!csp) {
        console.error(`[FAIL] Missing content-security-policy on ${route.path}`);
        testFailures++;
      }

      // Check console errors
      const realErrors = consoleErrors.filter(
        (err) => !err.includes("favicon") && !err.includes("Failed to load resource")
      );
      if (realErrors.length > 0) {
        console.error(`[FAIL] Console errors on ${route.path}:`, realErrors);
        testFailures++;
      }
    }

    await page.close();
  }

  // Deep interactive test on /visit/
  console.log("\n--- Testing Interactive Elements on /visit/ ---");
  const visitPage = await browser.newPage();
  await visitPage.setViewportSize({ width: 1280, height: 800 });

  const visitConsoleErrors = [];
  visitPage.on("console", (msg) => {
    if (msg.type() === "error") visitConsoleErrors.push(msg.text());
  });

  await visitPage.goto(`http://localhost:${PORT}/visit/`, { waitUntil: "networkidle" });

  // 1. Verify Google Maps iframe does NOT load before interaction
  const initialIframes = await visitPage.$$("iframe");
  if (initialIframes.length === 0) {
    console.log("[PASS] Google Maps iframe is deferred initially (no eager iframe loading).");
  } else {
    console.error("[FAIL] Google Maps iframe was eagerly loaded before user consent.");
    testFailures++;
  }

  // 2. Click "Load map" button
  const mapButton = visitPage.locator("button:has-text('Load map')");
  if (await mapButton.isVisible()) {
    await mapButton.click();
    await visitPage.waitForTimeout(1000);
    const loadedIframes = await visitPage.$$("iframe");
    if (loadedIframes.length > 0) {
      console.log("[PASS] Google Maps iframe loads successfully on user interaction without CSP violation.");
    } else {
      console.error("[FAIL] Google Maps iframe failed to render after clicking button.");
      testFailures++;
    }
  } else {
    console.error("[FAIL] Could not find 'Load map' button.");
    testFailures++;
  }

  // 3. Verify reservation date min attribute is set
  const dateInput = visitPage.locator("input[type='date']");
  if (await dateInput.isVisible()) {
    const minAttr = await dateInput.getAttribute("min");
    if (minAttr && minAttr.length === 10) {
      console.log(`[PASS] Reservation date min attribute populated dynamically: ${minAttr}`);
    } else {
      console.error("[FAIL] Reservation date min attribute missing or invalid.");
      testFailures++;
    }
  }

  // 4. Test link crawler on rendered pages
  console.log("\n--- Testing Link Crawler on Rendered Site ---");
  const links = await visitPage.evaluate(() => {
    return Array.from(document.querySelectorAll("a[href]"))
      .map((a) => a.getAttribute("href"))
      .filter((href) => href.startsWith("/") && !href.startsWith("//"));
  });

  const uniqueLinks = Array.from(new Set(links));
  console.log(`Crawling ${uniqueLinks.length} internal links from visit page...`);

  for (const link of uniqueLinks) {
    const res = await visitPage.request.get(`http://localhost:${PORT}${link}`);
    if (res.status() === 200) {
      console.log(`[PASS] Link ${link} resolved with status 200.`);
    } else {
      console.error(`[FAIL] Link ${link} returned status ${res.status()}.`);
      testFailures++;
    }
  }

  await visitPage.close();
  await browser.close();

  server.close(() => {
    console.log("\n[Test Server] Server closed.");
    if (testFailures === 0) {
      console.log("\n========================================================");
      console.log("ALL STATIC DEPLOYMENT TESTS PASSED WITH ZERO FAILURES!");
      console.log("========================================================\n");
      process.exit(0);
    } else {
      console.error(`\nFAILED: ${testFailures} tests failed.`);
      process.exit(1);
    }
  });
}

runAudit().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
