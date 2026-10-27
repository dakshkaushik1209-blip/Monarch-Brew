import fs from "node:fs";
import path from "node:path";

const siteMode = (process.env.NEXT_PUBLIC_SITE_MODE || "demo").toLowerCase().trim();
const isLive = siteMode === "live";
const isStrict = process.argv.includes("--strict");

const targetFiles = [
  "src/config/cafe.ts",
  "src/data/menu.ts",
  "src/data/events.ts",
  "src/data/gallery.ts",
  "src/data/team.ts",
];

const placeholderPatterns = [
  { name: "Bracketed placeholder", regex: /\[([A-Za-z0-9\s/,-]+)\]/g },
];

let totalFound = 0;
const findingsByFile = new Map();

for (const relPath of targetFiles) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, "utf-8");
  const lines = content.split(/\r?\n/);
  const fileFindings = [];

  lines.forEach((lineText, lineIdx) => {
    const trimmed = lineText.trim();
    // Ignore pure comment lines discussing placeholders or sample notes
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      return;
    }

    for (const pattern of placeholderPatterns) {
      pattern.regex.lastIndex = 0;
      let match;
      while ((match = pattern.regex.exec(lineText)) !== null) {
        fileFindings.push({
          line: lineIdx + 1,
          placeholder: match[0],
          context: trimmed,
        });
        totalFound++;
      }
    }
  });

  if (fileFindings.length > 0) {
    findingsByFile.set(relPath, fileFindings);
  }
}

// Check required live launch fields in src/config/cafe.ts and data files
const liveBlockers = [];

// Check cafeConfig file for missing live production fields
const cafeConfigFile = path.resolve("src/config/cafe.ts");
if (fs.existsSync(cafeConfigFile)) {
  const cafeCode = fs.readFileSync(cafeConfigFile, "utf-8");

  // Check contact.phone
  if (/phone:\s*(null|""|''|`\s*`)/.test(cafeCode)) {
    liveBlockers.push({
      field: "contact.phone",
      file: "src/config/cafe.ts",
      description: "Direct phone number is empty (needed for WhatsApp reservations and calling)",
    });
  }

  // Check contact.email
  if (/email:\s*(null|""|''|`\s*`)/.test(cafeCode)) {
    liveBlockers.push({
      field: "contact.email",
      file: "src/config/cafe.ts",
      description: "Direct email address is empty (needed for customer inquiries)",
    });
  }

  // Check address.unit
  if (/const unit\s*=\s*(""|''|``)/.test(cafeCode) || /unit:\s*(""|''|``|undefined)/.test(cafeCode)) {
    liveBlockers.push({
      field: "address.unit",
      file: "src/config/cafe.ts",
      description: "Unit / Shop number is empty (e.g. Shop 4 or Plot 12)",
    });
  }

  // Check websiteBy
  if (/websiteBy:\s*(null|""|''|undefined)/.test(cafeCode)) {
    liveBlockers.push({
      field: "websiteBy",
      file: "src/config/cafe.ts",
      description: "Creator credit (websiteBy.name and url) is empty",
    });
  }

  // Check social.instagram
  if (/instagram:\s*(null|""|''|`\s*`)/.test(cafeCode)) {
    liveBlockers.push({
      field: "social.instagram",
      file: "src/config/cafe.ts",
      description: "Instagram handle is empty (platform fallback https://www.instagram.com/ in use)",
    });
  }

  // Check social.facebook
  if (/facebook:\s*(null|""|''|`\s*`)/.test(cafeCode)) {
    liveBlockers.push({
      field: "social.facebook",
      file: "src/config/cafe.ts",
      description: "Facebook page is empty (platform fallback https://www.facebook.com/ in use)",
    });
  }

  // Check whatsapp
  if (/whatsapp:\s*(null|""|''|`\s*`)/.test(cafeCode)) {
    liveBlockers.push({
      field: "whatsapp",
      file: "src/config/cafe.ts",
      description: "WhatsApp number is empty (generic https://wa.me/?text= fallback in use)",
    });
  }
}

// Check for SAMPLE markers across data files
const sampleMarkerFiles = [];
const dataFilesToCheck = [
  "src/data/menu.ts",
  "src/data/events.ts",
  "src/data/gallery.ts",
  "src/data/team.ts",
];

for (const relPath of dataFilesToCheck) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, "utf-8");
  if (/\bSAMPLE\b/i.test(content)) {
    sampleMarkerFiles.push(relPath);
  }
}

console.log("\n========================================================");
console.log("       CAFE WEBSITE: PLACEHOLDER & LAUNCH AUDIT         ");
console.log("========================================================");
console.log(`CURRENT SITE MODE : ${siteMode.toUpperCase()} (NEXT_PUBLIC_SITE_MODE=${siteMode})`);
console.log(`STRICT VALIDATION : ${isStrict ? "ENABLED (--strict)" : "DISABLED"}`);
console.log("--------------------------------------------------------\n");

// 1. Bracketed placeholders
if (totalFound > 0) {
  console.log(`[!] Found ${totalFound} bracketed placeholder(s) in code:`);
  for (const [filePath, findings] of findingsByFile.entries()) {
    console.log(`  File: ${filePath}`);
    findings.forEach((f) => {
      console.log(`    Line ${f.line}: ${f.placeholder} -> ${f.context}`);
    });
  }
  console.log("");
} else {
  console.log("[OK] Bracketed Placeholders: CLEAN (0 detected in code/config)");
}

// 2. Sample data markers
if (sampleMarkerFiles.length > 0) {
  console.log(`[!] Sample Data Markers present in ${sampleMarkerFiles.length} file(s):`);
  sampleMarkerFiles.forEach((file) => {
    console.log(`  - ${file} (contains SAMPLE data marker)`);
  });
  console.log("");
} else {
  console.log("[OK] Sample Data Markers: CLEAN (0 detected)");
}

// 3. Live launch configuration items
if (liveBlockers.length > 0) {
  console.log(`[!] Pending Live Configuration Fields (${liveBlockers.length} items):`);
  liveBlockers.forEach((item) => {
    console.log(`  - ${item.field.padEnd(16, " ")}: ${item.description}`);
  });
  console.log("");
} else {
  console.log("[OK] Live Configuration Fields: COMPLETE");
}

console.log("--------------------------------------------------------");

const hasLiveGaps = liveBlockers.length > 0 || sampleMarkerFiles.length > 0 || totalFound > 0;

if (!hasLiveGaps) {
  console.log("STATUS: PRODUCTION READY");
  console.log("All cafe details, contact info, and production data are in place.");
  process.exit(0);
}

if (isLive) {
  console.error("STATUS: LIVE MODE VALIDATION FAILED");
  console.error("Site is running in 'live' mode, but real business fields or sample markers remain.");
  console.error("To publish as live, replace sample data and fill in contact/unit details.");
  if (isStrict) {
    process.exit(1);
  } else {
    process.exit(0);
  }
} else {
  // Demo mode
  console.log("STATUS: DEMO MODE ACTIVE");
  console.log("The website is safely configured with demo guardrails:");
  console.log("  - Search engine indexing is blocked (robots noindex, nofollow)");
  console.log("  - Robots.txt disallows all crawling");
  console.log("  - Business JSON-LD is omitted");
  console.log("  - Sample menu and vegetarian offerings are available for evaluation");
  console.log("  - Fallback notice: social.instagram, social.facebook, and whatsapp are empty; interactive fallbacks are in use.\n");
  process.exit(0);
}
