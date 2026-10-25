import React from "react";
import Link from "next/link";
import { cafeConfig } from "@/config/cafe";
import { CoffeeCupWithSteam } from "./LineIllustrations";

/**
 * Closing footer adapted from 21st.dev Giant Wordmark Footer (id: 35508).
 * Set on a rich dark espresso color band with cream text,
 * warm terracotta accents, and a monumental Fraunces wordmark running across the bottom.
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-cafe-espresso bg-cafe-espresso text-cafe-cream">
      <div className="mx-auto max-w-site px-4 pt-16 pb-12 sm:px-6 sm:pt-20 lg:px-8">
        {/* Top 3-Column Section */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Column 1: Brand & Craft Manifesto (Asymmetric 5 cols) */}
          <div className="flex flex-col gap-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <CoffeeCupWithSteam className="h-8 w-8 text-cafe-terracotta" />
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-cafe-cream">
                {cafeConfig.name}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-cafe-cream/80">
              {cafeConfig.description}
            </p>
            <div className="mt-2 text-xs text-cafe-cream/60">
              <span>Fresh batches baked daily. Kitchen closes at 3:00 PM.</span>
            </div>
          </div>

          {/* Column 2: Location & Hours (4 cols) */}
          <div className="flex flex-col gap-3 md:col-span-4">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-widest text-cafe-terracotta">
              Location & Hours
            </h3>
            <div className="text-xs leading-relaxed text-cafe-cream/80">
              <p className="font-medium text-cafe-cream">{cafeConfig.address.street}</p>
              <p>
                {cafeConfig.address.city}, {cafeConfig.address.postcode}
              </p>
              <p className="mt-1 text-cafe-cream/60">{cafeConfig.address.directions}</p>
            </div>
            <div className="mt-2 space-y-1 text-xs text-cafe-cream/70">
              <p>{cafeConfig.hours.weekday}</p>
              <p>{cafeConfig.hours.saturday}</p>
              <p>{cafeConfig.hours.sunday}</p>
            </div>
          </div>

          {/* Column 3: Navigation & Connect (3 cols) */}
          <div className="flex flex-col gap-3 md:col-span-3">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-widest text-cafe-terracotta">
              Explore
            </h3>
            <ul className="flex flex-col gap-2 text-xs">
              {cafeConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-cafe-cream/80 transition-colors duration-200 hover:text-cafe-terracotta"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/visit#reserve"
                  className="inline-block py-1 text-cafe-cream/80 transition-colors duration-200 hover:text-cafe-terracotta"
                >
                  Reserve a table
                </Link>
              </li>
              <li>
                <a
                  href={cafeConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1 text-cafe-cream/80 transition-colors duration-200 hover:text-cafe-terracotta"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={cafeConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1 text-cafe-cream/80 transition-colors duration-200 hover:text-cafe-terracotta"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Monumental Wordmark (Giant typography across bottom) */}
        <div className="mt-16 overflow-hidden border-t border-cafe-cream/15 pt-8 text-center select-none" aria-hidden="true">
          <span className="block font-heading text-5xl font-bold tracking-tighter text-cafe-cream/15 sm:text-7xl md:text-8xl lg:text-9xl">
            {cafeConfig.name}
          </span>
        </div>

        {/* Bottom Bar: Legal & Credit */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-cafe-cream/10 pt-6 text-xs text-cafe-cream/60 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {new Date().getFullYear()} {cafeConfig.name}. All rights reserved.</span>
            <Link
              href="/privacy"
              className="inline-block py-1.5 underline underline-offset-2 transition-colors duration-200 hover:text-cafe-cream"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="inline-block py-1.5 underline underline-offset-2 transition-colors duration-200 hover:text-cafe-cream"
            >
              Terms of Service
            </Link>
          </div>

          <div>
            <span>Website by </span>
            <a
              href={cafeConfig.creator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cafe-terracotta underline underline-offset-2 transition-colors duration-200 hover:text-cafe-cream"
            >
              {cafeConfig.creator.name}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
