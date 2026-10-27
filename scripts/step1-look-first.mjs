import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/daksh/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright");

async function capture() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  
  // 1. Desktop 1280x720 (standard laptop fold)
  const pageDesk = await browser.newPage();
  await pageDesk.setViewportSize({ width: 1280, height: 720 });
  await pageDesk.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await pageDesk.waitForTimeout(1600);
  await pageDesk.screenshot({ path: "scripts/before-desktop-1280x720.png" });
  
  const deskMetrics = await pageDesk.evaluate(() => {
    const hero = document.querySelector('section[aria-label="Welcome"]');
    const heroBox = hero?.getBoundingClientRect();
    const h1 = document.querySelector('h1');
    const h1Box = h1?.getBoundingClientRect();
    const buttons = document.querySelector('.hero-stage div:last-child');
    const buttonsBox = buttons?.getBoundingClientRect();
    const visual = document.querySelector('section[aria-label="Craft coffee visual"]');
    const visualBox = visual?.getBoundingClientRect();

    return {
      viewportHeight: window.innerHeight,
      heroHeight: heroBox?.height,
      heroTop: heroBox?.top,
      heroBottom: heroBox?.bottom,
      h1Height: h1Box?.height,
      h1Bottom: h1Box?.bottom,
      buttonsBottom: buttonsBox?.bottom,
      visualTop: visualBox?.top,
      visualHeight: visualBox?.height,
      isButtonsAboveFold: buttonsBox?.bottom ? buttonsBox.bottom <= 720 : false,
      isVisualAboveFold: visualBox?.bottom ? visualBox.bottom <= 720 : false,
    };
  });
  console.log("Desktop 1280x720 Metrics:", JSON.stringify(deskMetrics, null, 2));

  // 2. Mobile 375x812 (standard iPhone mobile fold)
  const pageMob = await browser.newPage();
  await pageMob.setViewportSize({ width: 375, height: 812 });
  await pageMob.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await pageMob.waitForTimeout(1600);
  await pageMob.screenshot({ path: "scripts/before-mobile-375x812.png" });

  const mobMetrics = await pageMob.evaluate(() => {
    const hero = document.querySelector('section[aria-label="Welcome"]');
    const heroBox = hero?.getBoundingClientRect();
    const buttons = document.querySelector('.hero-stage div:last-child');
    const buttonsBox = buttons?.getBoundingClientRect();
    const visual = document.querySelector('section[aria-label="Craft coffee visual"]');
    const visualBox = visual?.getBoundingClientRect();

    return {
      viewportHeight: window.innerHeight,
      heroHeight: heroBox?.height,
      heroBottom: heroBox?.bottom,
      buttonsBottom: buttonsBox?.bottom,
      visualTop: visualBox?.top,
      visualHeight: visualBox?.height,
      isButtonsAboveFold: buttonsBox?.bottom ? buttonsBox.bottom <= 812 : false,
    };
  });
  console.log("Mobile 375x812 Metrics:", JSON.stringify(mobMetrics, null, 2));

  await browser.close();
}

capture().catch(console.error);
