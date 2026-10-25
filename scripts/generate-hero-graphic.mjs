import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function generateHeroGraphic() {
  const outputDir = path.resolve("public/images");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 900, height: 900 } });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 900px;
            height: 900px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            overflow: hidden;
            font-family: Georgia, serif;
          }
        </style>
      </head>
      <body>
        <svg width="900" height="900" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Drop Shadow for Cup -->
            <filter id="cup-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#3B2A20" flood-opacity="0.22" />
            </filter>
            <!-- Subtle Bean Blur for depth of field -->
            <filter id="bean-blur-far" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
            <filter id="bean-blur-near" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
            <!-- Bean Template -->
            <g id="coffee-bean">
              <ellipse cx="0" cy="0" rx="22" ry="14" fill="#3B2A20" />
              <path d="M -18 0 Q 0 -6 18 0" stroke="#F4EADB" stroke-width="2.5" fill="none" stroke-linecap="round" />
              <ellipse cx="-4" cy="-5" rx="10" ry="4" fill="#52392B" opacity="0.5" />
            </g>
          </defs>

          <!-- Back Layer: Swirling terracotta ribbon looping behind cup -->
          <path d="M 120 540 C 200 480 340 380 480 410 C 620 440 760 560 840 500" 
                fill="none" stroke="#D98A5B" stroke-width="16" stroke-linecap="round" opacity="0.65" />
          <path d="M 150 560 C 230 500 360 400 490 430 C 620 460 740 570 820 520" 
                fill="none" stroke="#B8643F" stroke-width="8" stroke-linecap="round" />

          <!-- Distant background flying beans (blurred) -->
          <use href="#coffee-bean" x="180" y="240" transform="rotate(-25 180 240) scale(0.7)" filter="url(#bean-blur-far)" opacity="0.7" />
          <use href="#coffee-bean" x="720" y="220" transform="rotate(35 720 220) scale(0.65)" filter="url(#bean-blur-far)" opacity="0.7" />
          <use href="#coffee-bean" x="780" y="620" transform="rotate(-40 780 620) scale(0.75)" filter="url(#bean-blur-far)" opacity="0.75" />
          <use href="#coffee-bean" x="140" y="660" transform="rotate(20 140 660) scale(0.7)" filter="url(#bean-blur-far)" opacity="0.7" />

          <!-- MAIN ICED COFFEE CUP -->
          <g transform="translate(450, 470) rotate(-4)" filter="url(#cup-shadow)">
            <!-- Cup Body (Trapezoid) -->
            <path d="M -150 -180 L 150 -180 L 115 220 C 115 235 100 245 85 245 L -85 245 C -100 245 -115 235 -115 220 Z" 
                  fill="#EADBC4" stroke="#3B2A20" stroke-width="6" />

            <!-- Coffee Liquid Layer (Dark Cold Brew Base) -->
            <path d="M -144 -140 L 144 -140 L 113 218 C 113 230 98 240 85 240 L -85 240 C -98 240 -113 230 -113 218 Z" 
                  fill="#3B2A20" />

            <!-- Cream / Milk Swirl in Middle -->
            <path d="M -145 -130 Q -60 -90 0 -130 Q 80 -160 145 -125 L 140 -20 Q 70 40 0 -10 Q -80 -50 -135 10 Z" 
                  fill="#F4EADB" opacity="0.9" />
            <path d="M -130 -30 Q -40 20 20 -40 Q 80 -80 135 -30 L 125 60 Q 60 100 -20 50 Q -90 10 -125 50 Z" 
                  fill="#D98A5B" opacity="0.75" />

            <!-- Clear Cup Rim & Ice Cubes -->
            <!-- Ice Cube 1 -->
            <rect x="-90" y="-140" width="70" height="70" rx="8" fill="#FAF5ED" stroke="#3B2A20" stroke-width="4" transform="rotate(12 -55 -105)" opacity="0.9" />
            <line x1="-80" y1="-120" x2="-35" y2="-120" stroke="#D4C3B3" stroke-width="3" transform="rotate(12 -55 -105)" />
            <!-- Ice Cube 2 -->
            <rect x="20" y="-150" width="75" height="75" rx="8" fill="#FAF5ED" stroke="#3B2A20" stroke-width="4" transform="rotate(-15 57 -112)" opacity="0.9" />
            <line x1="30" y1="-130" x2="80" y2="-130" stroke="#D4C3B3" stroke-width="3" transform="rotate(-15 57 -112)" />
            <!-- Ice Cube 3 (submerged) -->
            <rect x="-40" y="-50" width="65" height="65" rx="8" fill="#EADBC4" stroke="#3B2A20" stroke-width="3.5" transform="rotate(25 -7 -17)" opacity="0.7" />

            <!-- Condensation Droplets on plastic cup -->
            <ellipse cx="-80" cy="50" rx="3" ry="5" fill="#FAF5ED" opacity="0.8" />
            <ellipse cx="-75" cy="90" rx="2.5" ry="6" fill="#FAF5ED" opacity="0.7" />
            <ellipse cx="-60" cy="140" rx="3.5" ry="7" fill="#FAF5ED" opacity="0.8" />
            <ellipse cx="65" cy="40" rx="3" ry="5.5" fill="#FAF5ED" opacity="0.8" />
            <ellipse cx="80" cy="100" rx="2.5" ry="6" fill="#FAF5ED" opacity="0.75" />
            <ellipse cx="70" cy="160" rx="3" ry="7" fill="#FAF5ED" opacity="0.8" />

            <!-- Cup Lid & Rim -->
            <rect x="-165" y="-195" width="330" height="18" rx="6" fill="#F4EADB" stroke="#3B2A20" stroke-width="6" />
            <path d="M -145 -195 C -145 -225 -80 -235 0 -235 C 80 -235 145 -225 145 -195 Z" 
                  fill="#FAF5ED" stroke="#3B2A20" stroke-width="5" opacity="0.85" />

            <!-- Straw hole & Amber Kraft Paper Straw -->
            <rect x="-14" y="-320" width="28" height="160" rx="4" fill="#B8643F" stroke="#3B2A20" stroke-width="5" transform="rotate(-18 0 -240)" />
            <line x1="-10" y1="-290" x2="10" y2="-280" stroke="#F4EADB" stroke-width="3" transform="rotate(-18 0 -240)" />
            <line x1="-10" y1="-260" x2="10" y2="-250" stroke="#F4EADB" stroke-width="3" transform="rotate(-18 0 -240)" />

            <!-- Milk / Cream Splash at Lid Opening -->
            <path d="M -110 -200 Q -140 -260 -90 -250 Q -50 -240 -30 -210 Q 0 -270 40 -240 Q 80 -220 90 -250 Q 140 -260 110 -200 Z" 
                  fill="#F4EADB" stroke="#3B2A20" stroke-width="4" />
            <!-- Splash droplets flying off -->
            <circle cx="-130" cy="-280" r="7" fill="#F4EADB" stroke="#3B2A20" stroke-width="2.5" />
            <circle cx="-90" cy="-300" r="5" fill="#F4EADB" stroke="#3B2A20" stroke-width="2" />
            <circle cx="70" cy="-290" r="6" fill="#F4EADB" stroke="#3B2A20" stroke-width="2.5" />
            <circle cx="125" cy="-275" r="8" fill="#F4EADB" stroke="#3B2A20" stroke-width="2.5" />

            <!-- Cafe Logo Stamp on Cup -->
            <circle cx="0" cy="80" r="50" fill="#F4EADB" stroke="#3B2A20" stroke-width="4" />
            <!-- Coffee Bean icon in stamp -->
            <ellipse cx="0" cy="72" rx="18" ry="12" fill="#B8643F" transform="rotate(-30 0 72)" />
            <path d="M -12 70 Q 0 66 12 74" stroke="#F4EADB" stroke-width="2" fill="none" stroke-linecap="round" />
            <text x="0" y="104" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#3B2A20" text-anchor="middle" letter-spacing="2">
              EST. 2026
            </text>
          </g>

          <!-- Front Layer: Foreground swirling terracotta ribbon wrapping in front of cup -->
          <path d="M 280 620 C 360 670 490 680 600 630 C 670 600 740 550 800 480" 
                fill="none" stroke="#B8643F" stroke-width="9" stroke-linecap="round" />

          <!-- Foreground In-Focus Flying Coffee Beans -->
          <use href="#coffee-bean" x="290" y="320" transform="rotate(45 290 320) scale(1.15)" filter="url(#cup-shadow)" />
          <use href="#coffee-bean" x="650" y="340" transform="rotate(-30 650 340) scale(1.1)" filter="url(#cup-shadow)" />
          <use href="#coffee-bean" x="240" y="520" transform="rotate(-15 240 520) scale(1.2)" filter="url(#cup-shadow)" />
          <use href="#coffee-bean" x="690" y="560" transform="rotate(25 690 560) scale(1.05)" filter="url(#cup-shadow)" />
          <use href="#coffee-bean" x="590" y="680" transform="rotate(-50 590 680) scale(1.25)" filter="url(#cup-shadow)" />

          <!-- Close-up foreground bean with near blur -->
          <use href="#coffee-bean" x="160" y="410" transform="rotate(-65 160 410) scale(1.5)" filter="url(#bean-blur-near)" opacity="0.9" />
          <use href="#coffee-bean" x="780" y="430" transform="rotate(55 780 430) scale(1.4)" filter="url(#bean-blur-near)" opacity="0.9" />

          <!-- Playful Retro Starburst Badge Sticker ("FRESH PULL / ORDER NOW") -->
          <g transform="translate(310, 650) rotate(-10)">
            <!-- 16-point Scalloped Starburst Seal -->
            <path d="
              M 0 -70 
              L 14 -56 L 34 -63 L 42 -44 L 62 -42 L 60 -21 L 73 -10 L 63 9 
              L 69 29 L 52 38 L 49 58 L 29 57 L 18 72 L 0 62 
              L -18 72 L -29 57 L -49 58 L -52 38 L -69 29 L -63 9 
              L -73 -10 L -60 -21 L -62 -42 L -42 -44 L -34 -63 L -14 -56 Z" 
              fill="#B8643F" stroke="#3B2A20" stroke-width="4.5" />
            <circle cx="0" cy="0" r="48" fill="#B8643F" stroke="#FAF5ED" stroke-width="2" stroke-dasharray="4,3" />
            <text x="0" y="-8" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#FAF5ED" text-anchor="middle" letter-spacing="1">
              ORDER
            </text>
            <text x="0" y="16" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#FAF5ED" text-anchor="middle" letter-spacing="1">
              NOW
            </text>
            <text x="0" y="32" font-family="Georgia, serif" font-style="italic" font-size="11" font-weight="700" fill="#FAF5ED" text-anchor="middle" opacity="0.9">
              fresh pull
            </text>
          </g>
        </svg>
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: "load" });
  const targetFile = path.join(outputDir, "hero-iced-coffee.png");
  await page.screenshot({ path: targetFile, type: "png", omitBackground: true });
  console.log(`[PASS] Generated hero-iced-coffee.png (900x900)`);

  await browser.close();
}

generateHeroGraphic().catch((err) => {
  console.error("Error generating hero graphic:", err);
  process.exit(1);
});
