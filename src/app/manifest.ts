import type { MetadataRoute } from "next";
import { cafeConfig } from "@/config/cafe";
import { THEME_COLORS } from "@/config/theme";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: cafeConfig.name,
    short_name: cafeConfig.name,
    description: cafeConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: THEME_COLORS.cream,
    theme_color: THEME_COLORS.espresso,
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}