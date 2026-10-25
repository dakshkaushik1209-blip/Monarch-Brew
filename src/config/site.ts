import { cafeConfig } from "./cafe";

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
