import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function checkMetadata() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  const routes = ["/", "/menu", "/about", "/gallery", "/visit", "/privacy", "/terms", "/not-found"];

  for (const r of routes) {
    await page.goto("http://localhost:3000" + r, { waitUntil: "domcontentloaded" });
    const meta = await page.evaluate(() => {
      const title = document.title;
      const desc = document.querySelector('meta[name="description"]')?.getAttribute("content");
      return { title, desc };
    });
    console.log(r, "=> Title:", meta.title, "\n   Desc:", meta.desc);
  }
  await browser.close();
}
checkMetadata().catch(console.error);
