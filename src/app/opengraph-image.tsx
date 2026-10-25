import { ImageResponse } from "next/og";
import { cafeConfig } from "@/config/cafe";
import { THEME_COLORS } from "@/config/theme";

export const alt = `${cafeConfig.name} - ${cafeConfig.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: THEME_COLORS.cream,
          padding: "60px",
          fontFamily: "serif",
          boxSizing: "border-box",
        }}
      >
        {/* Inner border container */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: `1px solid ${THEME_COLORS.border}`,
            padding: "48px 56px",
            boxSizing: "border-box",
            backgroundColor: THEME_COLORS.cream,
          }}
        >
          {/* Top header strip */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: THEME_COLORS.terracotta,
                fontFamily: "sans-serif",
              }}
            >
              Independent Cafe and Bakery
            </span>
            <span
              style={{
                fontSize: 15,
                color: THEME_COLORS.olive,
                fontFamily: "sans-serif",
              }}
            >
              {cafeConfig.address.neighborhood || cafeConfig.address.city}
            </span>
          </div>

          {/* Main typography */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: THEME_COLORS.espresso,
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {cafeConfig.name}
            </h1>
            <p
              style={{
                fontSize: 28,
                color: THEME_COLORS.terracotta,
                lineHeight: 1.3,
                margin: 0,
                fontWeight: 600,
              }}
            >
              {cafeConfig.tagline}
            </p>
            <p
              style={{
                fontSize: 20,
                color: THEME_COLORS.espresso,
                opacity: 0.85,
                lineHeight: 1.5,
                margin: 0,
                maxWidth: "850px",
                fontFamily: "sans-serif",
              }}
            >
              {cafeConfig.description}
            </p>
          </div>

          {/* Bottom details strip */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: `1px solid ${THEME_COLORS.border}`,
              paddingTop: "24px",
              fontFamily: "sans-serif",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: THEME_COLORS.olive }}>
                Location
              </span>
              <span style={{ fontSize: 16, color: THEME_COLORS.espresso, fontWeight: 500 }}>
                {cafeConfig.address.street}, {cafeConfig.address.city}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
              <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: THEME_COLORS.olive }}>
                Service Hours
              </span>
              <span style={{ fontSize: 16, color: THEME_COLORS.espresso, fontWeight: 500 }}>
                {cafeConfig.hours.summary}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}