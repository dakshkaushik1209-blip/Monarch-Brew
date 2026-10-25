import fs from "node:fs";
import path from "node:path";

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
  { name: "Sample marker", regex: /\bSAMPLE\b/gi },
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
    // Ignore comments that explicitly discuss placeholders
    const trimmed = lineText.trim();
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

console.log("\n========================================================");
console.log("       CAFE WEBSITE: PLACEHOLDER AUDIT REPORT          ");
console.log("========================================================\n");

if (totalFound === 0) {
  console.log("STATUS: CLEAN (Zero placeholders detected)");
  console.log("The website is ready for live production launch.\n");
  process.exit(0);
}

console.log(`STATUS: Found ${totalFound} placeholder(s) across ${findingsByFile.size} file(s).\n`);

for (const [filePath, findings] of findingsByFile.entries()) {
  console.log(`File: ${filePath} (${findings.length} placeholders)`);
  findings.forEach((f) => {
    console.log(`  Line ${f.line.toString().padStart(3, " ")}: ${f.placeholder.padEnd(25, " ")} -> ${f.context}`);
  });
  console.log("");
}

console.log("--------------------------------------------------------");
console.log("GUIDANCE FOR CAFE OWNERS / OPERATORS:");
console.log("Replace all bracketed values (e.g. [Cafe name], [City]) in");
console.log("src/config/cafe.ts with your real cafe details before");
console.log("pointing your custom production domain.\n");

if (isStrict) {
  console.error("STRICT CHECK FAILED: Unresolved placeholders exist in production build.");
  process.exit(1);
} else {
  console.log("Audit complete (non-strict mode). Exiting with code 0.\n");
  process.exit(0);
}
