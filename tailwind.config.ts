import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          cream: "#F4EADB",
          "cream-deep": "#EADBC4",
          espresso: "#3B2A20",
          terracotta: "#B8643F",
          olive: "#6B705C",
          border: "#D4C3B3",
          veg: "#2D6A4F",
          nonveg: "#8B4513",
        },
      },
      fontFamily: {
        heading: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
      },
      maxWidth: {
        site: "1200px",
      },
      transitionDuration: {
        short: "200ms",
      },
    },
  },
  plugins: [],
};

export default config;
