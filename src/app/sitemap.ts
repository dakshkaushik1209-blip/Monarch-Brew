import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const routes = ["", "/menu", "/about", "/gallery", "/visit", "/privacy", "/terms"];
  const currentDate = new Date().toISOString();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === "" || route === "/menu" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/menu" ? 0.9 : 0.7,
  }));
}