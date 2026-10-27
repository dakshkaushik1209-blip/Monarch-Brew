import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function checkLinks() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();

  const routes = ["/", "/menu", "/about", "/gallery", "/visit", "/privacy", "/terms", "/not-found"];
  const collectedLinks = new Set();

  for (const route of routes) {
    await page.goto("http://localhost:3000" + route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);

    const hrefs = await page.$$eval("a", (elements) =>
      elements.map((el) => ({
        href: el.getAttribute("href"),
        text: el.innerText.trim() || el.getAttribute("aria-label"),
      }))
    );

    for (const item of hrefs) {
      if (item.href) {
        collectedLinks.add(JSON.stringify({ ...item, foundOn: route }));
      }
    }
  }

  const allLinks = Array.from(collectedLinks).map((s) => JSON.parse(s));
  console.log(`Found ${allLinks.length} total links across the site.`);

  const broken = [];
  for (const item of allLinks) {
    const { href, text, foundOn } = item;
    if (!href || href === "#" || href === "undefined" || href === "null") {
      broken.push({ href, text, foundOn, reason: "Empty, unrouted or dummy '#' anchor" });
      continue;
    }

    if (href.startsWith("/")) {
      // Internal link
      const [path, hash] = href.split("#");
      const testUrl = "http://localhost:3000" + (path || foundOn);
      try {
        const res = await page.request.get(testUrl);
        if (res.status() >= 400) {
          broken.push({ href, text, foundOn, reason: `Status ${res.status()}` });
        }
      } catch (err) {
        broken.push({ href, text, foundOn, reason: err.message });
      }
    }
  }

  console.log("Broken / suspicious links found:", broken.length);
  if (broken.length > 0) {
    console.log(JSON.stringify(broken, null, 2));
  } else {
    console.log("All internal links verified successfully!");
  }

  await browser.close();
}

checkLinks().catch(console.error);
