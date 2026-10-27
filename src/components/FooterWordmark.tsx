"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { cafeConfig } from "@/config/cafe";

/**
 * Monumental cafe wordmark in Fraunces across footer bottom.
 * Letters rise in with a short stagger when entering view, and reverse cleanly on scroll out.
 * Strictly respects prefers-reduced-motion.
 */
export function FooterWordmark() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const letters = cafeConfig.name.split("");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Reversible: true when entering, false when leaving
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-16 overflow-hidden border-t border-cafe-cream/15 pt-8 text-center select-none"
    >
      <Link
        href="/"
        aria-label={`${cafeConfig.name} - Return to top`}
        className="group block overflow-hidden font-heading text-5xl font-bold tracking-tighter text-cafe-cream/20 sm:text-7xl md:text-8xl lg:text-9xl transition-colors duration-fast group-hover:text-cafe-terracotta/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta"
      >
        <div className="flex items-center justify-center overflow-hidden">
          {letters.map((char, index) => (
            <span key={index} className="inline-block overflow-hidden py-1">
              <span
                style={{
                  transitionDelay: isInView
                    ? `${index * 35}ms`
                    : `${(letters.length - 1 - index) * 20}ms`,
                }}
                className={`inline-block transition-transform duration-base ease-out-craft motion-reduce:transition-none group-hover:text-cafe-terracotta/40 ${
                  isInView ? "translate-y-0" : "translate-y-full"
                }`}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}
