import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function checkOverflow() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const viewports = [320, 375, 390, 414, 768, 1280];
  const routes = ["/", "/menu", "/about", "/gallery", "/visit", "/privacy", "/terms", "/not-found"];

  for (const width of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 800 });
    for (const route of routes) {
      await page.goto("http://localhost:3000" + route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const clientWidth = docEl.clientWidth;
        
        let offending = [];
        if (scrollWidth > clientWidth) {
          const all = Array.from(document.querySelectorAll("*"));
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > clientWidth + 1) {
              offending.push({
                tag: el.tagName,
                cls: el.className?.toString().slice(0, 60),
                right: rect.right,
                width: rect.width
              });
            }
          }
        }
        return { scrollWidth, clientWidth, hasOverflow: scrollWidth > clientWidth, offending: offending.slice(0, 5) };
      });

      if (overflow.hasOverflow) {
        console.log(`[OVERFLOW] at ${width}px on ${route}: scroll=${overflow.scrollWidth} vs client=${overflow.clientWidth}`);
        console.log("  Offenders:", JSON.stringify(overflow.offending));
      } else {
        console.log(`[OK] at ${width}px on ${route}`);
      }
    }
    await page.close();
  }
  await browser.close();
}

checkOverflow().catch(console.error);
