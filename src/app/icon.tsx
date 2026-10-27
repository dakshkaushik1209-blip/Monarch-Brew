import { ImageResponse } from "next/og";
import { THEME_COLORS } from "@/config/theme";

export const dynamic = "force-static";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
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
        M
      </div>
    ),
    {
      ...size,
    }
  );
}