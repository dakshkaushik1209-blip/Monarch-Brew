import http from "http";
import fs from "fs";
import path from "path";

const PORT = parseInt(process.env.PORT || "3000", 10);
const OUT_DIR = path.join(process.cwd(), "out");
const HEADERS_FILE = path.join(OUT_DIR, "_headers");

// MIME types mapping
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Parse _headers into rule definitions
function parseHeadersFile() {
  if (!fs.existsSync(HEADERS_FILE)) return [];
  const lines = fs.readFileSync(HEADERS_FILE, "utf8").split("\n");
  const rules = [];
  let currentPattern = null;
  let currentHeaders = {};

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    if (!rawLine.startsWith(" ") && !rawLine.startsWith("\t")) {
      // New URL pattern
      if (currentPattern && Object.keys(currentHeaders).length > 0) {
        rules.push({ pattern: currentPattern, headers: currentHeaders });
      }
      currentPattern = line;
      currentHeaders = {};
    } else {
      // Header line
      const colonIdx = line.indexOf(":");
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim();
        const val = line.slice(colonIdx + 1).trim();
        currentHeaders[key] = val;
      }
    }
  }

  if (currentPattern && Object.keys(currentHeaders).length > 0) {
    rules.push({ pattern: currentPattern, headers: currentHeaders });
  }

  return rules;
}

const headerRules = parseHeadersFile();

function getMatchingHeaders(urlPath) {
  const merged = {};
  for (const rule of headerRules) {
    const pattern = rule.pattern;
    let match = false;
    if (pattern === "/*") {
      match = true;
    } else if (pattern.endsWith("/*")) {
      const prefix = pattern.slice(0, -2);
      match = urlPath.startsWith(prefix);
    } else if (pattern.includes("*")) {
      const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
      match = regex.test(urlPath);
    } else {
      match = urlPath === pattern || urlPath === pattern + "/";
    }

    if (match) {
      Object.assign(merged, rule.headers);
    }
  }
  return merged;
}

const server = http.createServer((req, res) => {
  if (!fs.existsSync(OUT_DIR)) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Build output directory 'out' does not exist. Run 'npm run build' first.");
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let reqPath = decodeURIComponent(parsedUrl.pathname);

  // Normalize path
  let filePath = path.join(OUT_DIR, reqPath);
  let is404 = false;

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  } else if (!fs.existsSync(filePath)) {
    // Try .html
    if (fs.existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
    } else if (fs.existsSync(path.join(filePath, "index.html"))) {
      filePath = path.join(filePath, "index.html");
    } else {
      // 404 fallback
      is404 = true;
      filePath = path.join(OUT_DIR, "404.html");
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
        return;
      }
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const customHeaders = getMatchingHeaders(reqPath);

  const status = is404 ? 404 : 200;
  res.writeHead(status, {
    "Content-Type": contentType,
    ...customHeaders,
  });

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

server.listen(PORT, () => {
  console.log(`[Static Server] Serving 'out' folder with _headers applied on http://localhost:${PORT}`);
});
