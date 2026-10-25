import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function generateGalleryPrints() {
  const outputDir = path.resolve("public/images/gallery");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();

  const prints = [
    {
      filename: "espresso-bar.png",
      width: 800,
      height: 600,
      title: "Espresso Bar",
      subtitle: "Copper group heads and ceramic cups on oiled oak counter",
      svgContent: `
        <!-- Counter Top Line -->
        <rect x="60" y="420" width="680" height="24" fill="#3B2A20" rx="2" />
        <rect x="70" y="444" width="660" height="90" fill="#EADBC4" stroke="#3B2A20" stroke-width="3" rx="2" />
        <!-- Espresso Machine Body -->
        <rect x="220" y="160" width="360" height="260" fill="#F4EADB" stroke="#3B2A20" stroke-width="4" rx="4" />
        <rect x="240" y="180" width="320" height="70" fill="#EADBC4" stroke="#3B2A20" stroke-width="3" rx="2" />
        <!-- Pressure Gauges -->
        <circle cx="280" cy="215" r="18" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <line x1="280" y1="215" x2="290" y2="208" stroke="#B8643F" stroke-width="3" stroke-linecap="round" />
        <circle cx="520" cy="215" r="18" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <line x1="520" y1="215" x2="526" y2="204" stroke="#B8643F" stroke-width="3" stroke-linecap="round" />
        <!-- Cup Warmer Rail with Cups -->
        <line x1="230" y1="150" x2="570" y2="150" stroke="#3B2A20" stroke-width="4" stroke-linecap="round" />
        <path d="M 260 150 C 260 135 285 135 285 150 Z" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <path d="M 300 150 C 300 135 325 135 325 150 Z" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <path d="M 340 150 C 340 135 365 135 365 150 Z" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <path d="M 440 150 C 440 130 475 130 475 150 Z" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <path d="M 490 150 C 490 130 525 130 525 150 Z" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <!-- Two Group Heads -->
        <rect x="300" y="250" width="50" height="40" fill="#3B2A20" rx="2" />
        <path d="M 315 290 L 335 290 L 325 330 Z" fill="#B8643F" stroke="#3B2A20" stroke-width="2" />
        <rect x="250" y="300" width="65" height="12" fill="#3B2A20" rx="3" transform="rotate(-15 315 306)" />
        <rect x="450" y="250" width="50" height="40" fill="#3B2A20" rx="2" />
        <path d="M 465 290 L 485 290 L 475 330 Z" fill="#B8643F" stroke="#3B2A20" stroke-width="2" />
        <rect x="400" y="300" width="65" height="12" fill="#3B2A20" rx="3" transform="rotate(-15 465 306)" />
        <!-- Ceramic Cups Under Spouts -->
        <rect x="310" y="350" width="30" height="35" rx="3" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <rect x="460" y="350" width="30" height="35" rx="3" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <!-- Steam Wand -->
        <path d="M 230 250 Q 180 290 190 380" fill="none" stroke="#3B2A20" stroke-width="4" stroke-linecap="round" />
        <!-- Steam Whiff lines -->
        <path d="M 325 340 Q 320 325 325 315" fill="none" stroke="#B8643F" stroke-width="2" stroke-linecap="round" />
        <path d="M 475 340 Q 470 325 475 315" fill="none" stroke="#B8643F" stroke-width="2" stroke-linecap="round" />
      `,
    },
    {
      filename: "sourdough-loaf.png",
      width: 600,
      height: 800,
      title: "Sourdough Country Loaf",
      subtitle: "Naturally leavened country loaf on baker cutting board",
      svgContent: `
        <!-- Cutting Board -->
        <rect x="100" y="380" width="400" height="260" rx="8" fill="#EADBC4" stroke="#3B2A20" stroke-width="4" />
        <circle cx="130" cy="510" r="14" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <!-- Bread Loaf Body -->
        <ellipse cx="300" cy="460" rx="160" ry="110" fill="#D98A5B" stroke="#3B2A20" stroke-width="4" />
        <!-- Loaf Scoring Ear -->
        <path d="M 180 430 Q 300 370 420 440" fill="none" stroke="#3B2A20" stroke-width="5" stroke-linecap="round" />
        <path d="M 200 440 Q 300 395 400 450" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <!-- Slices Off to the Right -->
        <path d="M 380 410 C 440 400 460 480 420 530 C 380 540 360 470 380 410 Z" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <ellipse cx="400" cy="465" rx="8" ry="12" fill="#EADBC4" />
        <ellipse cx="415" cy="485" rx="6" ry="9" fill="#EADBC4" />
        <ellipse cx="390" cy="495" rx="5" ry="8" fill="#EADBC4" />
        <!-- Bread Knife -->
        <line x1="120" y1="350" x2="480" y2="350" stroke="#3B2A20" stroke-width="4" stroke-linecap="round" />
        <rect x="80" y="342" width="60" height="16" rx="3" fill="#B8643F" stroke="#3B2A20" stroke-width="3" />
        <!-- Linen Towel Drape -->
        <path d="M 80 580 Q 200 550 320 620 L 280 670 Q 150 630 60 620 Z" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <line x1="110" y1="585" x2="270" y2="640" stroke="#5C6B47" stroke-width="2" stroke-dasharray="6,4" />
      `,
    },
    {
      filename: "pour-over.png",
      width: 800,
      height: 600,
      title: "Pour-over Brew Service",
      subtitle: "Ceramic dripper, glass server carafe, and copper kettle stream",
      svgContent: `
        <!-- Table Line -->
        <line x1="80" y1="480" x2="720" y2="480" stroke="#3B2A20" stroke-width="4" stroke-linecap="round" />
        <!-- Glass Carafe -->
        <path d="M 360 330 L 440 330 L 470 460 L 330 460 Z" fill="#F4EADB" stroke="#3B2A20" stroke-width="4" />
        <!-- Carafe Handle -->
        <path d="M 450 350 C 490 360 490 430 460 445" fill="none" stroke="#3B2A20" stroke-width="4" stroke-linecap="round" />
        <!-- Amber Coffee Level in Carafe -->
        <polygon points="340,445 460,445 450,395 350,395" fill="#B8643F" stroke="#3B2A20" stroke-width="2" />
        <!-- Ceramic Dripper Cone -->
        <polygon points="330,240 470,240 430,330 370,330" fill="#EADBC4" stroke="#3B2A20" stroke-width="4" />
        <line x1="335" y1="330" x2="465" y2="330" stroke="#3B2A20" stroke-width="4" stroke-linecap="round" />
        <!-- Fluted ribs on cone -->
        <line x1="360" y1="245" x2="385" y2="325" stroke="#3B2A20" stroke-width="2" />
        <line x1="400" y1="245" x2="400" y2="325" stroke="#3B2A20" stroke-width="2" />
        <line x1="440" y1="245" x2="415" y2="325" stroke="#3B2A20" stroke-width="2" />
        <!-- Filter Paper Peak -->
        <polygon points="340,240 460,240 445,225 355,225" fill="#F4EADB" stroke="#3B2A20" stroke-width="2" />
        <!-- Copper Kettle Swan Neck Spout -->
        <path d="M 180 320 C 220 300 240 210 330 200" fill="none" stroke="#B8643F" stroke-width="6" stroke-linecap="round" />
        <!-- Kettle Spout Tip & Water Stream -->
        <path d="M 330 200 L 338 206" stroke="#3B2A20" stroke-width="3" />
        <path d="M 338 208 Q 365 220 380 240" fill="none" stroke="#5C6B47" stroke-width="2.5" stroke-dasharray="4,4" />
        <!-- Ceramic Tasting Cup to Side -->
        <rect x="520" y="420" width="50" height="60" rx="4" fill="#EADBC4" stroke="#3B2A20" stroke-width="3" />
        <path d="M 570 435 C 585 440 585 460 570 465" fill="none" stroke="#3B2A20" stroke-width="3" />
      `,
    },
    {
      filename: "courtyard.png",
      width: 800,
      height: 600,
      title: "Rear Courtyard",
      subtitle: "Paved limestone courtyard, terracotta pots, and olive branch canopy",
      svgContent: `
        <!-- Courtyard Stone Wall Backing -->
        <rect x="80" y="100" width="640" height="260" fill="#EADBC4" stroke="#3B2A20" stroke-width="3" rx="2" />
        <line x1="80" y1="180" x2="720" y2="180" stroke="#3B2A20" stroke-width="1.5" stroke-dasharray="12,8" />
        <line x1="80" y1="260" x2="720" y2="260" stroke="#3B2A20" stroke-width="1.5" stroke-dasharray="12,8" />
        <!-- Arched Window in Wall -->
        <path d="M 320 220 L 320 160 A 80 80 0 0 1 480 160 L 480 220 Z" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <line x1="400" y1="120" x2="400" y2="220" stroke="#3B2A20" stroke-width="2" />
        <line x1="320" y1="170" x2="480" y2="170" stroke="#3B2A20" stroke-width="2" />
        <!-- Ground Paver Line -->
        <line x1="60" y1="360" x2="740" y2="360" stroke="#3B2A20" stroke-width="4" />
        <!-- Terracotta Planter Left -->
        <polygon points="160,370 240,370 225,480 175,480" fill="#B8643F" stroke="#3B2A20" stroke-width="3" />
        <rect x="150" y="360" width="100" height="14" rx="2" fill="#B8643F" stroke="#3B2A20" stroke-width="3" />
        <!-- Olive Tree / Foliage Left -->
        <line x1="200" y1="360" x2="200" y2="260" stroke="#3B2A20" stroke-width="4" stroke-linecap="round" />
        <circle cx="180" cy="240" r="30" fill="#5C6B47" stroke="#3B2A20" stroke-width="2" />
        <circle cx="220" cy="225" r="35" fill="#5C6B47" stroke="#3B2A20" stroke-width="2" />
        <circle cx="195" cy="195" r="32" fill="#5C6B47" stroke="#3B2A20" stroke-width="2" />
        <!-- Wooden Garden Bench -->
        <rect x="290" y="370" width="240" height="14" fill="#3B2A20" rx="2" />
        <rect x="290" y="340" width="240" height="12" fill="#3B2A20" rx="2" />
        <line x1="310" y1="384" x2="305" y2="460" stroke="#3B2A20" stroke-width="4" stroke-linecap="round" />
        <line x1="510" y1="384" x2="515" y2="460" stroke="#3B2A20" stroke-width="4" stroke-linecap="round" />
        <!-- Terracotta Planter Right -->
        <polygon points="580,380 650,380 638,470 592,470" fill="#B8643F" stroke="#3B2A20" stroke-width="3" />
        <rect x="572" y="372" width="86" height="12" rx="2" fill="#B8643F" stroke="#3B2A20" stroke-width="3" />
        <circle cx="615" cy="330" r="35" fill="#5C6B47" stroke="#3B2A20" stroke-width="2" />
      `,
    },
    {
      filename: "window-table.png",
      width: 800,
      height: 600,
      title: "Window Table",
      subtitle: "Morning light across steel-framed window, ceramic mug, and reading table",
      svgContent: `
        <!-- Steel Frame Window Pane -->
        <rect x="120" y="80" width="560" height="320" fill="#F4EADB" stroke="#3B2A20" stroke-width="5" rx="2" />
        <line x1="400" y1="80" x2="400" y2="400" stroke="#3B2A20" stroke-width="4" />
        <line x1="120" y1="240" x2="680" y2="240" stroke="#3B2A20" stroke-width="4" />
        <!-- Window Sill / Table Surface -->
        <rect x="80" y="390" width="640" height="26" fill="#EADBC4" stroke="#3B2A20" stroke-width="4" rx="2" />
        <!-- Warm Light Rays from Window -->
        <polygon points="140,85 240,85 360,390 220,390" fill="#F4EADB" opacity="0.6" />
        <polygon points="420,85 520,85 640,390 500,390" fill="#F4EADB" opacity="0.6" />
        <!-- Ceramic Mug on Table -->
        <rect x="250" y="335" width="46" height="55" rx="3" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <path d="M 296 348 C 312 352 312 372 296 376" fill="none" stroke="#3B2A20" stroke-width="3" />
        <!-- Steaming aroma -->
        <path d="M 273 325 Q 268 310 273 295" fill="none" stroke="#B8643F" stroke-width="2" stroke-linecap="round" />
        <!-- Open Notebook / Journal -->
        <polygon points="350,370 410,360 470,370 460,390 410,380 360,390" fill="#F4EADB" stroke="#3B2A20" stroke-width="3" />
        <line x1="410" y1="360" x2="410" y2="380" stroke="#3B2A20" stroke-width="2" />
        <!-- Small Bud Vase with Dried Stalk -->
        <rect x="520" y="325" width="22" height="65" rx="3" fill="#B8643F" stroke="#3B2A20" stroke-width="3" />
        <line x1="531" y1="325" x2="531" y2="240" stroke="#3B2A20" stroke-width="2" stroke-linecap="round" />
        <circle cx="531" cy="235" r="5" fill="#5C6B47" stroke="#3B2A20" stroke-width="1.5" />
        <circle cx="538" cy="250" r="4" fill="#5C6B47" stroke="#3B2A20" stroke-width="1.5" />
      `,
    },
  ];

  for (const print of prints) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: ${print.width}px;
              height: ${print.height}px;
              background-color: #F4EADB;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-family: Georgia, serif;
              overflow: hidden;
            }
            .plate {
              width: ${print.width}px;
              height: ${print.height}px;
              position: relative;
              background-color: #F4EADB;
              border: 1px solid #D8C7B5;
            }
          </style>
        </head>
        <body>
          <div class="plate">
            <svg width="${print.width}" height="${print.height}" viewBox="0 0 ${print.width} ${print.height}" xmlns="http://www.w3.org/2000/svg">
              <!-- Background subtle tint -->
              <rect width="${print.width}" height="${print.height}" fill="#FAF5ED" />
              <!-- Outer plate margin -->
              <rect x="24" y="24" width="${print.width - 48}" height="${print.height - 48}" fill="none" stroke="#EADBC4" stroke-width="2" />
              ${print.svgContent}
            </svg>
          </div>
        </body>
      </html>
    `;

    await page.setViewportSize({ width: print.width, height: print.height });
    await page.setContent(html, { waitUntil: "load" });
    const targetFile = path.join(outputDir, print.filename);
    await page.screenshot({ path: targetFile, type: "png" });
    console.log(`[PASS] Generated ${print.filename} (${print.width}x${print.height})`);
  }

  await browser.close();
  console.log("All gallery photo plates generated successfully.");
}

generateGalleryPrints().catch((err) => {
  console.error("Error generating gallery plates:", err);
  process.exit(1);
});
