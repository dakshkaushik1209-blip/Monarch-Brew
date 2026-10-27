import React from "react";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { cafeConfig } from "@/config/cafe";
import { instagramUrl, facebookUrl, whatsappUrl, getPhoneLink, getEmailLink } from "@/lib/links";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/SocialIcons";
import { CoffeeCupWithSteam } from "./LineIllustrations";
import { Reveal } from "./Reveal";
import { FooterWordmark } from "./FooterWordmark";

/**
 * Closing footer adapted from 21st.dev Giant Wordmark Footer (id: 35508).
 * Set on a rich dark espresso color band with cream text,
 * warm terracotta accents, and a monumental Fraunces wordmark running across the bottom.
 */
export function Footer() {
  const igUrl = instagramUrl();
  const fbUrl = facebookUrl();
  const waUrl = whatsappUrl();
  const hasAnySocial = Boolean(igUrl || fbUrl || waUrl);

  return (
    <footer className="w-full border-t border-cafe-espresso bg-cafe-espresso text-cafe-cream">
      <div className="mx-auto max-w-site px-4 pt-16 pb-12 sm:px-6 sm:pt-20 lg:px-8">
        <Reveal>
          {/* Top 3-Column Section */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
            {/* Column 1: Brand & Craft Manifesto (Asymmetric 5 cols) */}
            <div className="flex flex-col gap-4 md:col-span-5">
              <Link
                href="/"
                aria-label={`${cafeConfig.name} - Home`}
                className="group inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cafe-espresso w-fit"
              >
                <CoffeeCupWithSteam className="h-8 w-8 text-cafe-terracotta transition-transform duration-short group-hover:scale-105" />
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-cafe-cream transition-colors duration-fast group-hover:text-cafe-terracotta">
                  {cafeConfig.name}
                </h2>
              </Link>
              <p className="max-w-md text-sm leading-relaxed text-cafe-cream/80">
                {cafeConfig.description}
              </p>
              <div className="mt-2 text-xs text-cafe-cream/60">
                <span>Fresh batches baked daily. Kitchen closes at 10:30 PM daily.</span>
              </div>
            </div>

            {/* Column 2: Location & Hours (4 cols) */}
            <div className="flex flex-col gap-3 md:col-span-4">
              <h3 className="text-xs font-medium text-cafe-terracotta">
                Location & hours
              </h3>
              <div className="text-xs leading-relaxed text-cafe-cream/80">
                <p className="font-medium text-cafe-cream">{cafeConfig.address.display}</p>
                <p className="mt-1 text-xs text-cafe-cream/60">
                  <a
                    href={cafeConfig.address.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-cafe-terracotta"
                  >
                    Open in Google Maps
                  </a>
                </p>
              </div>
              <div className="mt-2 space-y-1 text-xs text-cafe-cream/70">
                <p>{cafeConfig.hours.weekday}</p>
                {getPhoneLink() && (
                  <p className="pt-1">
                    <a
                      href={getPhoneLink()!.href}
                      className="inline-flex items-center gap-2 text-cafe-cream/80 transition-colors duration-fast hover:text-cafe-terracotta underline underline-offset-2"
                    >
                      <Phone className="h-3.5 w-3.5 text-cafe-terracotta shrink-0" aria-hidden="true" />
                      <span>{getPhoneLink()!.display}</span>
                    </a>
                  </p>
                )}
                {getEmailLink() && (
                  <p>
                    <a
                      href={getEmailLink()!.href}
                      className="inline-flex items-center gap-2 text-cafe-cream/80 transition-colors duration-fast hover:text-cafe-terracotta underline underline-offset-2"
                    >
                      <Mail className="h-3.5 w-3.5 text-cafe-terracotta shrink-0" aria-hidden="true" />
                      <span>{getEmailLink()!.display}</span>
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Column 3: Navigation & Connect (3 cols) */}
            <div className="flex flex-col gap-3 md:col-span-3">
              <h3 className="text-xs font-medium text-cafe-terracotta">
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
              </ul>

              {/* Social Channels: 3 square tiles with visible focus states and 44px min touch target */}
              {hasAnySocial && (
                <div className="mt-4 flex flex-col gap-2">
                  <span className="text-xs font-medium text-cafe-terracotta">
                    Connect
                  </span>
                  <div className="flex items-center gap-2.5">
                    {igUrl && (
                      <a
                        href={igUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="inline-flex h-11 w-11 items-center justify-center rounded border border-cafe-cream/20 bg-cafe-cream/5 text-cafe-cream/80 transition-[color,transform,border-color,background-color] duration-short hover:-translate-y-px hover:border-cafe-terracotta hover:bg-cafe-cream/10 hover:text-cafe-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cafe-espresso"
                      >
                        <InstagramIcon className="h-5 w-5" />
                      </a>
                    )}
                    {fbUrl && (
                      <a
                        href={fbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="inline-flex h-11 w-11 items-center justify-center rounded border border-cafe-cream/20 bg-cafe-cream/5 text-cafe-cream/80 transition-[color,transform,border-color,background-color] duration-short hover:-translate-y-px hover:border-cafe-terracotta hover:bg-cafe-cream/10 hover:text-cafe-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cafe-espresso"
                      >
                        <FacebookIcon className="h-5 w-5" />
                      </a>
                    )}
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        className="inline-flex h-11 w-11 items-center justify-center rounded border border-cafe-cream/20 bg-cafe-cream/5 text-cafe-cream/80 transition-[color,transform,border-color,background-color] duration-short hover:-translate-y-px hover:border-cafe-terracotta hover:bg-cafe-cream/10 hover:text-cafe-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cafe-espresso"
                      >
                        <WhatsAppIcon className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Monumental Wordmark (Giant typography with staggered rising letters) */}
          <FooterWordmark />
        </Reveal>

        {/* Bottom Bar: Legal & Credit */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-cafe-cream/10 pt-6 text-xs text-cafe-cream/60 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-4">
            <span suppressHydrationWarning>© {new Date().getFullYear()} {cafeConfig.name}. All rights reserved.</span>
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

          <div className="flex flex-wrap items-center gap-4 text-cafe-cream/60">
            {cafeConfig.websiteBy?.name && (
              <span>
                Website by{" "}
                {cafeConfig.websiteBy.url ? (
                  <a
                    href={cafeConfig.websiteBy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-cafe-cream"
                  >
                    {cafeConfig.websiteBy.name}
                  </a>
                ) : (
                  cafeConfig.websiteBy.name
                )}
              </span>
            )}
            <span>{cafeConfig.address.area}, {cafeConfig.address.city}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
