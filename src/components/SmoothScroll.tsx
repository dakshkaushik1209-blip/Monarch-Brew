"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Global Smooth Scroll Provider (Lenis)
 * 
 * Delivers silky-smooth inertial scrolling across all pages.
 * - Hardware-accelerated requestAnimationFrame interpolation.
 * - Leaves native touch scrolling untouched on mobile devices (zero gesture hijacking).
 * - Smoothly glides to in-page anchor links with sticky navbar offset compensation.
 * - Fully respects `prefers-reduced-motion: reduce` by disabling smooth interpolation.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Reset or adjust scroll position immediately on route transition
  useEffect(() => {
    if (typeof window === "undefined" || !lenisRef.current) return;

    if (window.location.hash) {
      const initialTarget = document.querySelector(window.location.hash);
      if (initialTarget) {
        setTimeout(() => {
          lenisRef.current?.scrollTo(initialTarget as HTMLElement, {
            offset: -80,
            duration: 0.9,
          });
        }, 120);
        return;
      }
    }

    lenisRef.current.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    // Initialize Lenis with warm, tactile editorial scroll physics
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      syncTouch: false, // Keep native touch momentum on touchscreens
      autoRaf: false,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    // requestAnimationFrame loop
    let rafId: number;
    function update(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(update);
    }
    rafId = requestAnimationFrame(update);

    // Smoothly handle all internal in-page hash links (e.g. #reserve, #main-content)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Handle pure hash links like "#reserve" or same-page hashes like "/#reserve"
      if (href.startsWith("#") && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -80, // Sticky navbar clearance
            duration: 1.1,
          });
          // Update URL hash without jumping
          history.pushState(null, "", href);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { passive: false });

    // Handle initial hash on page load (e.g. navigating to /visit#reserve)
    if (window.location.hash) {
      const initialTarget = document.querySelector(window.location.hash);
      if (initialTarget) {
        setTimeout(() => {
          lenis.scrollTo(initialTarget as HTMLElement, {
            offset: -80,
            duration: 0.9,
          });
        }, 150);
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      window.__lenis = undefined;
      lenisRef.current = null;
    };
  }, []);

  return null;
}
