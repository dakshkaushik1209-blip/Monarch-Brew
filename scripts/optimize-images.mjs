import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");
const OPTIMIZED_DIR = path.join(PHOTOS_DIR, "optimized");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "photos-manifest.json");

const TARGET_WIDTHS = [480, 800, 1200, 1600];

async function main() {
  console.log("[optimize:images] Checking for photos in public/photos...");

  if (!fs.existsSync(PHOTOS_DIR)) {
    console.log("[optimize:images] public/photos directory does not exist yet. Nothing to optimize.");
    if (!fs.existsSync(MANIFEST_PATH)) {
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify({}, null, 2));
    }
    process.exit(0);
  }

  // Find all image files directly in public/photos (excluding optimized subfolder)
  const entries = fs.readdirSync(PHOTOS_DIR, { withFileTypes: true });
  const photoFiles = entries
    .filter((e) => e.isFile() && /\.(jpe?g|png|webp|avif|tiff)$/i.test(e.name))
    .map((e) => e.name);

  if (photoFiles.length === 0) {
    console.log("[optimize:images] No photos found in public/photos. Manifest remains clean.");
    if (!fs.existsSync(MANIFEST_PATH)) {
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify({}, null, 2));
    }
    process.exit(0);
  }

  if (!fs.existsSync(OPTIMIZED_DIR)) {
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
  }

  const manifest = fs.existsSync(MANIFEST_PATH)
    ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"))
    : {};

  console.log(`[optimize:images] Found ${photoFiles.length} photo(s) to optimize...`);

  for (const filename of photoFiles) {
    const inputPath = path.join(PHOTOS_DIR, filename);
    const parsed = path.parse(filename);
    const baseName = parsed.name;

    const metadata = await sharp(inputPath).metadata();
    const origWidth = metadata.width || 1200;
    const origHeight = metadata.height || 800;

    const avifSrcSetParts = [];
    const webpSrcSetParts = [];

    for (const width of TARGET_WIDTHS) {
      if (width > origWidth * 1.25) continue; // Don't upscale heavily

      const height = Math.round((origHeight / origWidth) * width);

      const avifName = `${baseName}-${width}w.avif`;
      const avifPath = path.join(OPTIMIZED_DIR, avifName);
      await sharp(inputPath)
        .resize(width, height, { fit: "cover" })
        .avif({ quality: 75, effort: 5 })
        .toFile(avifPath);
      avifSrcSetParts.push(`/photos/optimized/${avifName} ${width}w`);

      const webpName = `${baseName}-${width}w.webp`;
      const webpPath = path.join(OPTIMIZED_DIR, webpName);
      await sharp(inputPath)
        .resize(width, height, { fit: "cover" })
        .webp({ quality: 80, effort: 5 })
        .toFile(webpPath);
      webpSrcSetParts.push(`/photos/optimized/${webpName} ${width}w`);
    }

    // Default webp fallback at 1200 (or orig width)
    const defaultWebp = `${baseName}-default.webp`;
    await sharp(inputPath)
      .resize(Math.min(origWidth, 1200), null, { fit: "inside" })
      .webp({ quality: 82 })
      .toFile(path.join(OPTIMIZED_DIR, defaultWebp));

    const photoKey = `/photos/${filename}`;
    manifest[photoKey] = {
      original: photoKey,
      defaultSrc: `/photos/optimized/${defaultWebp}`,
      width: origWidth,
      height: origHeight,
      aspectRatio: `${origWidth}/${origHeight}`,
      avifSrcSet: avifSrcSetParts.join(", "),
      webpSrcSet: webpSrcSetParts.join(", "),
    };

    console.log(`[optimize:images] Processed: ${filename} (AVIF & WebP generated)`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`[optimize:images] Manifest updated at ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("[optimize:images] Error:", err);
  process.exit(1);
});
