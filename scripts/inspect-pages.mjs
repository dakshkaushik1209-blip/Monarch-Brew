import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

const outDir = path.resolve(".audit-screens-upgraded");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function inspect() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  const routes = ["", "menu", "about", "gallery", "visit"];
  const widths = [375, 768, 1280];

  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: width === 375 ? 667 : width === 768 ? 1024 : 800 } });

    for (const r of routes) {
      const url = `http://localhost:3000/${r}`;
      await page.goto(url, { waitUntil: "networkidle" });
      const filename = `${r || "home"}-${width}.png`;
      await page.screenshot({ path: path.join(outDir, filename), fullPage: false });
    }

    await page.close();
  }

  await browser.close();
  console.log("Upgraded visual captures complete in .audit-screens-upgraded");
}

inspect().catch(console.error);
