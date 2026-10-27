import React from "react";

interface SectionDividerProps {
  fillColor?: string; // Tailwind text color class matching the adjacent background
  variant?: "scallop" | "handcut";
  flip?: boolean;
  className?: string;
}

/**
 * Flat hand-cut or scalloped SVG edge divider between full-width color bands.
 * Strictly 0 gradients; uses exact palette tokens.
 */
export function SectionDivider({
  fillColor = "text-cafe-cream-deep/30",
  variant = "scallop",
  flip = false,
  className = "",
}: SectionDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-none select-none pointer-events-none relative z-10 ${
        flip ? "rotate-180 -mb-px" : "-mt-px"
      } ${className}`}
    >
      {variant === "scallop" ? (
        <svg
          viewBox="0 0 1200 24"
          preserveAspectRatio="none"
          className={`w-full h-3 sm:h-5 ${fillColor}`}
          fill="currentColor"
        >
          {/* Gentle craftsman scallops */}
          <path d="M0,0 C50,18 100,18 150,0 C200,18 250,18 300,0 C350,18 400,18 450,0 C500,18 550,18 600,0 C650,18 700,18 750,0 C800,18 850,18 900,0 C950,18 1000,18 1050,0 C1100,18 1150,18 1200,0 L1200,24 L0,24 Z" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 1200 20"
          preserveAspectRatio="none"
          className={`w-full h-3 sm:h-4 ${fillColor}`}
          fill="currentColor"
        >
          {/* Subtle hand-cut deckled edge */}
          <path d="M0,10 L75,5 L150,12 L225,6 L300,13 L375,5 L450,11 L525,4 L600,12 L675,6 L750,14 L825,5 L900,11 L975,4 L1050,13 L1125,6 L1200,10 L1200,20 L0,20 Z" />
        </svg>
      )}
    </div>
  );
}
