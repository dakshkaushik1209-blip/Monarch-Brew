"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { cafeConfig } from "@/config/cafe";
import { AnimatedButton } from "./AnimatedButton";

/**
 * Sticky Navbar adapted from 21st.dev Sticky Header (id: 23562).
 * Condenses smoothly in height on scroll with enhanced border-b definition.
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Track scroll position to compact the header
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      firstLinkRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ease-out ${
        isScrolled
          ? "border-b border-cafe-border bg-cafe-cream/98 py-3 shadow-[0_2px_8px_rgba(59,42,32,0.04)] backdrop-blur-md"
          : "border-b border-cafe-border/50 bg-cafe-cream py-5"
      }`}
    >
      <div className="mx-auto flex max-w-site items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta"
        >
          <span
            className={`font-heading font-semibold tracking-tight text-cafe-espresso transition-all duration-300 group-hover:text-cafe-terracotta ${
              isScrolled ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {cafeConfig.name}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-cafe-olive transition-opacity duration-300">
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
                className={`group relative py-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta ${
                  isActive
                    ? "text-cafe-terracotta"
                    : "text-cafe-espresso/80 hover:text-cafe-terracotta"
                }`}
              >
                <span>{item.label}</span>
                {/* Active or hover underline draw */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-[2px] w-full bg-cafe-terracotta transition-transform duration-200 ease-out ${
                    isActive ? "scale-x-100" : "origin-left scale-x-0 group-hover:scale-x-100"
                  }`}
                />
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-cafe-border bg-cafe-cream-deep p-2 text-cafe-espresso transition-colors duration-200 hover:text-cafe-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta md:hidden"
          >
            {mobileMenuOpen ? (
              <CloseIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <MenuIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-x-0 top-18 bottom-0 z-50 flex flex-col justify-between border-t border-cafe-border bg-cafe-cream px-6 py-8 md:hidden shadow-xl"
        >
          <div className="flex flex-col gap-6">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-cafe-olive">
              Menu Links
            </span>
            <nav className="flex flex-col gap-5">
              {cafeConfig.navigation.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-heading text-2xl transition-colors duration-200 ${
                      isActive
                        ? "text-cafe-terracotta font-semibold"
                        : "text-cafe-espresso hover:text-cafe-terracotta"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-4 border-t border-cafe-border/80 pt-6">
            <div className="text-xs text-cafe-espresso/80">
              <p className="font-semibold text-cafe-espresso">{cafeConfig.address.street}</p>
              <p>{cafeConfig.hours.weekday}</p>
            </div>
            <AnimatedButton
              href="/visit#reserve"
              variant="primary"
              className="w-full py-3.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reserve a table
            </AnimatedButton>
          </div>
        </div>
      )}
    </header>
  );
}
