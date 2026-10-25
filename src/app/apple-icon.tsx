import { ImageResponse } from "next/og";
import { THEME_COLORS } from "@/config/theme";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
          background: THEME_COLORS.espresso,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: THEME_COLORS.cream,
          fontFamily: "serif",
          fontWeight: 700,
          borderRadius: 4,
        }}
      >
        C
      </div>
    ),
    {
      ...size,
    }
  );
}