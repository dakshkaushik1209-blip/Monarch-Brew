"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * BackToTop Floating Smooth Scroll Button
 * 
 * Appears smoothly once the user scrolls past 400px.
 * Smoothly glides the page back to the top when pressed.
 * Follows strict design guidelines:
 * - Rectangular (2px radius, <= 4px max, 0 pill shape)
 * - Theme tokens only (cafe-espresso, cafe-cream, cafe-terracotta)
 * - Zero gradients, zero emoji, zero em dashes
 * - Compositor-only animations (opacity, transform)
 * - Respects prefers-reduced-motion
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.15 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed bottom-6 right-6 z-30 inline-flex h-10 items-center gap-2 rounded-[2px] border border-cafe-border bg-cafe-espresso px-3 text-xs font-semibold uppercase tracking-wider text-cafe-cream shadow-md transition-all duration-200 ease-out hover:border-cafe-terracotta hover:bg-cafe-terracotta active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-3 opacity-0 pointer-events-none"
      }`}
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">Top</span>
    </button>
  );
}
