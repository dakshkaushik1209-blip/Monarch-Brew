"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Menu as MenuIcon, X as CloseIcon, Phone as PhoneIcon, Mail as MailIcon } from "lucide-react";
import { cafeConfig } from "@/config/cafe";
import { getPhoneLink, getEmailLink } from "@/lib/links";
import { AnimatedButton } from "./AnimatedButton";

/**
 * Sticky Glass Navbar:
 * - Always visible and fixed at the top while scrolling in both directions (no hide/reveal, no compacting).
 * - At top (scrollY < 24px): flat state matching cream page background, borderless, shadowless.
 * - Past 24px: frosted glass state with backdrop-filter blur(12px) saturate(1.2), 80% cream opacity,
 *   subtle border, and light soft shadow.
 * - State toggled reactively via an IntersectionObserver on a 24px top sentinel element (zero continuous scroll event listeners).
 * - Full fallbacks for @supports not backdrop-filter, prefers-reduced-transparency, and prefers-reduced-motion.
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const savedScrollY = useRef(0);

  // Smooth scroll reading progress bar update via requestAnimationFrame (compositor-only)
  useEffect(() => {
    let rafId: number | null = null;
    const bar = progressBarRef.current;
    if (!bar) return;

    const update = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollHeight > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollHeight))
          : 0;
      bar.style.transform = `scaleX(${progress})`;
      rafId = null;
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // IntersectionObserver on a 24px sentinel placed at the top of the page
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // Immediately evaluate scroll position for mid-page refresh, back navigation, anchor jumps
    if (typeof window !== "undefined") {
      setIsScrolled(window.scrollY > 24);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is intersecting the viewport top, user is within the top 24px (flat state)
        // When not intersecting, user has scrolled down past ~24px (glass state)
        setIsScrolled(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Sync scroll state and close mobile drawer on route changes or anchor jumps
  useEffect(() => {
    setMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 24);
      });
    }
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  }, []);

  // Keyboard navigation & Focus trap for fullscreen mobile menu
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!mobileMenuOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstEl) {
            event.preventDefault();
            lastEl?.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            event.preventDefault();
            firstEl?.focus();
          }
        }
      }
    }

    if (mobileMenuOpen) {
      savedScrollY.current = window.scrollY;
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        closeButtonRef.current?.focus({ preventScroll: true });
      }, 50);
    } else {
      document.body.style.overflow = "";
      if (savedScrollY.current > 0) {
        window.scrollTo({ top: savedScrollY.current, behavior: "instant" });
        setIsScrolled(savedScrollY.current > 24);
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, closeMenu]);

  return (
    <>
      {/* 24px sentinel element at the very top of the page for zero-jank IntersectionObserver scroll detection */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-6 w-full -z-10 opacity-0"
      />

      <header
        className={`sticky top-0 z-40 w-full py-4 navbar-transition ${
          mobileMenuOpen
            ? "navbar-solid"
            : isScrolled
            ? "navbar-glass"
            : "navbar-flat"
        }`}
      >
        <div className="mx-auto flex max-w-site items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="group flex flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta"
          >
            <span className="font-heading text-2xl font-semibold tracking-tight text-cafe-espresso transition-colors duration-fast group-hover:text-cafe-terracotta sm:text-3xl">
              {cafeConfig.name}
            </span>
            <span className="text-[11px] font-medium text-cafe-olive">
              {cafeConfig.tagline}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center gap-8 md:flex"
          >
            {cafeConfig.navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative py-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta ${
                    isActive
                      ? "text-cafe-terracotta"
                      : "text-cafe-espresso/80 hover:text-cafe-terracotta"
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Fluid sliding active indicator or hover preview */}
                  {isActive ? (
                    shouldReduceMotion ? (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-[2px] w-full bg-cafe-terracotta"
                      />
                    ) : (
                      <motion.span
                        layoutId="navbar-active-underline"
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-[2px] w-full bg-cafe-terracotta"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-cafe-terracotta transition-transform duration-base ease-out-craft group-hover:scale-x-100"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <AnimatedButton
              href="/visit#reserve"
              variant="primary"
              className="hidden sm:inline-flex"
            >
              Reserve a table
            </AnimatedButton>

            {/* Mobile Menu Toggle Button */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => {
                savedScrollY.current = window.scrollY;
                setMobileMenuOpen(true);
              }}
              aria-expanded={mobileMenuOpen}
              aria-controls="fullscreen-mobile-menu"
              aria-label="Open mobile menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-cafe-border bg-cafe-cream-deep p-2 text-cafe-espresso transition-colors duration-fast hover:text-cafe-terracotta active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta md:hidden"
            >
              <MenuIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Subtle craft scroll progress bar along the bottom edge of sticky navbar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full overflow-hidden"
        >
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left bg-cafe-terracotta"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </header>

      {/* Fullscreen Espresso Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div
          ref={drawerRef}
          id="fullscreen-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Main Navigation Menu"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-cafe-espresso text-cafe-cream p-6 sm:p-10 md:hidden animate-view-fade"
        >
          {/* Header Bar inside Mobile Panel */}
          <div className="flex items-center justify-between border-b border-cafe-cream/15 pb-4">
            <Link
              href="/"
              onClick={closeMenu}
              aria-label={`${cafeConfig.name} - Home`}
              className="font-heading text-lg font-light tracking-wide text-cafe-cream/90 transition-colors duration-fast hover:text-cafe-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta"
            >
              {cafeConfig.name}
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-[2px] border border-cafe-cream/20 bg-cafe-espresso text-cafe-cream transition-colors duration-fast hover:bg-cafe-cream/10 active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta"
            >
              <CloseIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Staggered Large Fraunces Nav Links */}
          <nav className="my-auto flex flex-col gap-6 py-6">
            {cafeConfig.navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <div
                  key={item.href}
                  className="overflow-hidden"
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={`block font-heading text-3xl font-semibold tracking-tight transition-colors duration-fast ${
                      isActive
                        ? "text-cafe-terracotta"
                        : "text-cafe-cream/90 hover:text-cafe-terracotta"
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Drawer Bottom Actions & Address */}
          <div className="flex flex-col gap-4 border-t border-cafe-cream/15 pt-5">
            <div className="text-xs text-cafe-cream/70 space-y-1.5">
              <p className="font-semibold text-cafe-cream">{cafeConfig.address.display}</p>
              <p>{cafeConfig.hours.weekday}</p>
              {getPhoneLink() && (
                <p className="pt-1">
                  <a
                    href={getPhoneLink()!.href}
                    className="inline-flex min-h-[36px] items-center gap-2 text-cafe-cream/90 transition-colors duration-fast hover:text-cafe-terracotta underline underline-offset-2"
                  >
                    <PhoneIcon className="h-3.5 w-3.5 text-cafe-terracotta" aria-hidden="true" />
                    <span>{getPhoneLink()!.display}</span>
                  </a>
                </p>
              )}
              {getEmailLink() && (
                <p>
                  <a
                    href={getEmailLink()!.href}
                    className="inline-flex min-h-[36px] items-center gap-2 text-cafe-cream/90 transition-colors duration-fast hover:text-cafe-terracotta underline underline-offset-2"
                  >
                    <MailIcon className="h-3.5 w-3.5 text-cafe-terracotta" aria-hidden="true" />
                    <span>{getEmailLink()!.display}</span>
                  </a>
                </p>
              )}
            </div>

            <AnimatedButton
              href="/visit#reserve"
              variant="dark"
              className="w-full py-3.5"
              onClick={closeMenu}
            >
              Reserve a table
            </AnimatedButton>
          </div>
        </div>
      )}
    </>
  );
}
