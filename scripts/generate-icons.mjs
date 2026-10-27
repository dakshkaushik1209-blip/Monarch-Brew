import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function generate() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();

  const renderIcon = async (size, outputPath) => {
    await page.setViewportSize({ width: size, height: size });
    const fontSize = Math.round(size * 0.62);
    const radius = Math.round(size * 0.125);
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;overflow:hidden;background:transparent;">
        <div style="width:${size}px;height:${size}px;background:#3B2A20;display:flex;align-items:center;justify-content:center;border-radius:${radius}px;">
          <span style="color:#F4EADB;font-family:Fraunces,Georgia,serif;font-weight:700;font-size:${fontSize}px;line-height:1;margin-top:-2%;">M</span>
        </div>
      </body>
      </html>
    `);
    await page.screenshot({ path: outputPath, omitBackground: true });
    console.log("Generated:", outputPath);
  };

  await renderIcon(192, "public/icon-192.png");
  await renderIcon(512, "public/icon-512.png");
  await renderIcon(180, "public/apple-touch-icon.png");
  await renderIcon(32, "public/favicon.png");
  const fs = require("node:fs");
  fs.copyFileSync("public/favicon.png", "public/favicon.ico");
  console.log("Generated: public/favicon.ico");
  await browser.close();
}

generate().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
