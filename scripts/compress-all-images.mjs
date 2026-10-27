import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

async function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await walk(fullPath));
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  const images = await walk("public/images");
  console.log(`Found ${images.length} images. Checking for compression candidates...`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const imgPath of images) {
    const stat = fs.statSync(imgPath);
    const sizeBefore = stat.size;
    totalBefore += sizeBefore;

    if (sizeBefore < 180000) {
      totalAfter += sizeBefore;
      continue;
    }

    const ext = path.extname(imgPath).toLowerCase();
    const buf = fs.readFileSync(imgPath);

    try {
      let compressed;
      if (ext === ".jpg" || ext === ".jpeg") {
        compressed = await sharp(buf).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
      } else if (ext === ".png") {
        // If the PNG has no alpha, check format; optimize PNG compression
        const meta = await sharp(buf).metadata();
        if (meta.hasAlpha) {
          compressed = await sharp(buf).png({ quality: 80, compressionLevel: 9, effort: 7 }).toBuffer();
        } else {
          compressed = await sharp(buf).png({ quality: 80, compressionLevel: 9, effort: 7 }).toBuffer();
        }
      }

      if (compressed && compressed.length < sizeBefore) {
        fs.writeFileSync(imgPath, compressed);
        const saved = Math.round((1 - compressed.length / sizeBefore) * 100);
        console.log(`Compressed: ${imgPath} | ${Math.round(sizeBefore / 1024)}KB -> ${Math.round(compressed.length / 1024)}KB (${saved}% saved)`);
        totalAfter += compressed.length;
      } else {
        totalAfter += sizeBefore;
      }
    } catch (err) {
      console.error(`Error compressing ${imgPath}:`, err.message);
      totalAfter += sizeBefore;
    }
  }

  console.log(`\n======================================================`);
  console.log(`Total Before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total After:  ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Overall Saved: ${Math.round((1 - totalAfter / totalBefore) * 100)}%`);
  console.log(`======================================================`);
}

main().catch(console.error);
