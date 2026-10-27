import { cafeConfig } from "./cafe";

export type SiteMode = "demo" | "live";

/**
 * Returns the configured site mode: "demo" (default) or "live".
 * Controlled via NEXT_PUBLIC_SITE_MODE environment variable.
 */
export function getSiteMode(): SiteMode {
  const mode = process.env.NEXT_PUBLIC_SITE_MODE?.toLowerCase().trim();
  if (mode === "live") {
    return "live";
  }
  return "demo";
}

/**
 * Returns true if the site is currently operating in demo mode.
 */
export function isDemoMode(): boolean {
  return getSiteMode() === "demo";
}

/**
 * Returns the canonical base URL for the site.
 * Reads from SITE_URL or NEXT_PUBLIC_SITE_URL environment variables when deployed,
 * or falls back to cafeConfig.siteUrl.
 */
export function getSiteUrl(): string {
  const envUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return cafeConfig.siteUrl;
}
