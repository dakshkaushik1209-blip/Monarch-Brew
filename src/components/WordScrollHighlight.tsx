"use client";

import React, { useRef, useState, useEffect } from "react";
import { cafeConfig } from "@/config/cafe";

export function WordScrollHighlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(1); // default 1 for full visibility if no JS
  const [isClient, setIsClient] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const statementText = cafeConfig.aboutIntro;
  const words = statementText.split(" ");

  useEffect(() => {
    setIsClient(true);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setReducedMotion(true);
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start highlighting when top of element enters 75% of viewport
      // Complete highlighting when element passes 30% of viewport
      const totalDistance = windowHeight * 0.55;
      const currentPos = windowHeight * 0.75 - rect.top;
      const progress = Math.max(0, Math.min(1, currentPos / totalDistance));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      aria-label="Core philosophy statement"
      className="w-full bg-cafe-cream-deep/30 py-20 sm:py-28 border-y border-cafe-border/50"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center" ref={containerRef}>
        <span className="text-xs font-medium text-cafe-olive">
          Our Everyday Standard
        </span>

        <p className="mt-6 font-heading text-2xl font-medium leading-relaxed tracking-tight sm:text-3xl lg:text-4xl lg:leading-snug">
          {words.map((word, index) => {
            // If SSR or reduced motion or not mounted yet, full espresso color
            if (!isClient || reducedMotion) {
              return (
                <span key={index} className="text-cafe-espresso">
                  {word}{" "}
                </span>
              );
            }

            const wordThreshold = index / words.length;
            const isHighlighted = scrollProgress >= wordThreshold;

            return (
              <span
                key={index}
                className={`transition-colors duration-fast ease-out-craft ${
                  isHighlighted ? "text-cafe-espresso" : "text-cafe-border"
                }`}
              >
                {word}{" "}
              </span>
            );
          })}
        </p>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-cafe-olive">
          <span className="h-1.5 w-1.5 rounded-[1px] bg-cafe-terracotta" />
          <span>Served daily at {cafeConfig.address.display}</span>
        </div>
      </div>
    </section>
  );
}
