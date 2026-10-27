import type { NextConfig } from "next";

// Validate environment variables during production builds
const isProd = process.env.NODE_ENV === "production";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (isProd) {
  if (!siteUrl || !siteUrl.trim()) {
    throw new Error(
      "BUILD ERROR: NEXT_PUBLIC_SITE_URL environment variable is required for production builds. Please set NEXT_PUBLIC_SITE_URL to a valid HTTPS URL (e.g., https://monarchbrew.in) in your environment variables."
    );
  }
  if (!siteUrl.startsWith("https://")) {
    throw new Error(
      `BUILD ERROR: NEXT_PUBLIC_SITE_URL must start with 'https://' (received: '${siteUrl}'). Secure HTTPS is required for production deployment.`
    );
  }
  if (siteUrl.endsWith("/")) {
    throw new Error(
      `BUILD ERROR: NEXT_PUBLIC_SITE_URL must not contain a trailing slash (received: '${siteUrl}').`
    );
  }
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
