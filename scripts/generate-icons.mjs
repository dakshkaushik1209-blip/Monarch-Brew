import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function generateIcons() {
  const publicDir = path.resolve("public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();

  const sizes = [
    { name: "apple-touch-icon.png", size: 180, fontSize: 110 },
    { name: "icon-192.png", size: 192, fontSize: 118 },
    { name: "icon-512.png", size: 512, fontSize: 316 },
    { name: "favicon-32.png", size: 32, fontSize: 20 },
  ];

  for (const { name, size, fontSize } of sizes) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: ${size}px;
              height: ${size}px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: transparent;
            }
            .icon-box {
              width: ${size}px;
              height: ${size}px;
              background-color: #3B2A20;
              border-radius: ${Math.max(2, Math.round(size * 0.12))}px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #F4EADB;
              font-family: Georgia, "Times New Roman", serif;
              font-weight: 700;
              font-size: ${fontSize}px;
              line-height: 1;
              padding-top: ${Math.round(size * 0.04)}px;
            }
          </style>
        </head>
        <body>
          <div class="icon-box">C</div>
        </body>
      </html>
    `;

    await page.setViewportSize({ width: size, height: size });
    await page.setContent(html);

    const destPath = path.join(publicDir, name);
    await page.screenshot({ path: destPath, omitBackground: true });
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // Create favicon.ico from favicon-32.png
  const png32 = fs.readFileSync(path.join(publicDir, "favicon-32.png"));
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // ICO type (1 for icon)
  icoHeader.writeUInt16LE(1, 4); // 1 image

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(32, 0); // width
  icoEntry.writeUInt8(32, 1); // height
  icoEntry.writeUInt8(0, 2);  // palette count
  icoEntry.writeUInt8(0, 3);  // reserved
  icoEntry.writeUInt16LE(1, 4); // color planes
  icoEntry.writeUInt16LE(32, 6); // bits per pixel
  icoEntry.writeUInt32LE(png32.length, 8); // image size
  icoEntry.writeUInt32LE(6 + 16, 12); // offset

  const icoBuffer = Buffer.concat([icoHeader, icoEntry, png32]);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);
  console.log("Generated favicon.ico");

  // Clean up favicon-32.png
  fs.unlinkSync(path.join(publicDir, "favicon-32.png"));

  await browser.close();
  console.log("Icon generation completed successfully.");
}

generateIcons().catch((err) => {
  console.error("Failed to generate icons:", err);
  process.exit(1);
});
