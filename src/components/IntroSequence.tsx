"use client";

import { useState, useEffect, useCallback } from "react";

export function IntroSequence() {
  const [showIntro, setShowIntro] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const dismiss = useCallback(() => {
    setIsExiting(true);
    try {
      sessionStorage.setItem("cafe_intro_seen", "true");
    } catch {
      // sessionStorage unavailable or restricted
    }
    setTimeout(() => {
      setShowIntro(false);
    }, 350);
  }, []);

  useEffect(() => {
    // 1. Skip completely if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    // 2. Skip if already seen in this session
    try {
      if (sessionStorage.getItem("cafe_intro_seen")) {
        return;
      }
    } catch {
      return;
    }

    // 3. Show intro sequence
    setShowIntro(true);

    // Auto-advance after 1050ms
    const timer = setTimeout(() => {
      dismiss();
    }, 1050);

    // Global skip on any keypress or click
    const handleKeyDown = () => dismiss();
    const handleClick = () => dismiss();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, [dismiss]);

  if (!showIntro) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to the workshop"
      onClick={dismiss}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-cafe-espresso text-cafe-cream transition-transform duration-base ease-out-craft cursor-pointer select-none ${
        isExiting ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated self-drawing SVG cup */}
        <svg
          viewBox="0 0 64 64"
          className="h-16 w-16 text-cafe-cream overflow-visible"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <style>{`
            .intro-line {
              stroke-dasharray: 120;
              stroke-dashoffset: 120;
              animation: introDraw 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .intro-fill {
              opacity: 0;
              animation: introFill 0.35s ease-out 0.45s forwards;
            }
            @keyframes introDraw {
              to { stroke-dashoffset: 0; }
            }
            @keyframes introFill {
              to { opacity: 0.18; }
            }
          `}</style>
          {/* Saucer */}
          <path d="M10 46h44c2 0 4 1 4 2s-2 2-4 2H10c-2 0-4-1-4-2s2-2 4-2z" className="intro-line" />
          {/* Cup Bowl */}
          <path d="M16 26h32v14a16 16 0 0 1-32 0V26z" className="intro-line" />
          <path d="M16 26h32v14a16 16 0 0 1-32 0V26z" fill="currentColor" className="intro-fill" />
          {/* Handle */}
          <path d="M48 30h4a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5h-4" className="intro-line" />
          {/* Steam */}
          <path d="M24 20c-1-3 1-5-1-8" className="intro-line" />
          <path d="M32 18c-1-3 1-5-1-8" className="intro-line" />
          <path d="M40 20c-1-3 1-5-1-8" className="intro-line" />
        </svg>

        <span className="font-heading text-lg font-light tracking-wide text-cafe-cream/90">
          The Roast & Bake
        </span>
        <span className="text-[11px] text-cafe-cream/50">
          Click or press any key to skip
        </span>
      </div>
    </div>
  );
}
