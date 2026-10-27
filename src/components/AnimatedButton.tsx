"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "dark";
  className?: string;
  ariaLabel?: string;
  showArrow?: boolean;
}

/**
 * Rectangular button (4px radius max, no pill buttons, no gradients)
 * with a flat color slide fill on hover (transform 250ms, ease-out-craft),
 * 4px arrow nudge, and pressed scale 0.98 feedback.
 */
export function AnimatedButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  ariaLabel,
  showArrow = false,
}: ButtonProps) {
  // Variant styles
  const baseClasses =
    "group relative inline-flex items-center justify-center overflow-hidden rounded-[2px] px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-[color,transform] duration-base ease-out-craft active:scale-[0.98] motion-reduce:active:scale-100 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta focus-visible:ring-offset-2";

  let colorClasses = "";
  let slideOverlayColor = "";

  if (variant === "primary") {
    // Espresso base with Terracotta slide-in
    colorClasses = "bg-cafe-espresso text-cafe-cream border border-cafe-espresso";
    slideOverlayColor = "bg-cafe-terracotta";
  } else if (variant === "secondary") {
    // Deep cream base with Border, Espresso slide-in
    colorClasses = "bg-cafe-cream-deep/60 text-cafe-espresso border border-cafe-border hover:text-cafe-cream";
    slideOverlayColor = "bg-cafe-espresso";
  } else if (variant === "dark") {
    // Cream text on Espresso with Terracotta slide
    colorClasses = "bg-cafe-cream text-cafe-espresso border border-cafe-cream hover:text-cafe-cream";
    slideOverlayColor = "bg-cafe-terracotta";
  }

  const content = (
    <>
      {/* Flat sliding color overlay (slides from left to right: transform 250ms) */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 -translate-x-full transition-transform duration-base ease-out-craft group-hover:translate-x-0 motion-reduce:hidden ${slideOverlayColor}`}
      />
      {/* Button label text sitting above overlay with optional 4px nudging arrow */}
      <span className="relative z-10 flex items-center gap-2">
        <span>{children}</span>
        {showArrow && (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 transition-transform duration-base ease-out-craft group-hover:translate-x-1"
            aria-hidden="true"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${colorClasses} ${className}`}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${colorClasses} ${className}`}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}

/**
 * Editorial link with an animated underline that draws in on hover.
 */
export function AnimatedLink({
  href,
  children,
  className = "",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const linkClasses = `group relative inline-flex items-center py-1 text-sm font-medium transition-colors text-cafe-espresso hover:text-cafe-terracotta ${className}`;

  const inner = (
    <>
      <span>{children}</span>
      {/* Underline draw animation */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-cafe-terracotta transition-transform duration-base ease-out-craft group-hover:scale-x-100"
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClasses}>
      {inner}
    </Link>
  );
}
