import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { cafeConfig } from "@/config/cafe";
import { isDemoMode } from "@/config/site";
import { instagramUrl, facebookUrl, whatsappUrl, getLiveSocialUrls } from "@/lib/links";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/SocialIcons";
import { CopyPill } from "@/components/CopyPill";
import { ClickToLoadMap } from "@/components/ClickToLoadMap";
import { ReservationForm } from "@/components/ReservationForm";
import { OpeningHoursTable } from "@/components/OpeningHoursTable";
import { CoffeeCupWithSteam } from "@/components/LineIllustrations";
import { Reveal } from "@/components/Reveal";
import { UpcomingEventsSection } from "@/components/UpcomingEventsSection";

export const metadata: Metadata = {
  title: "Visit",
  description: `Location, operating hours, directions, and table reservations for ${cafeConfig.name} at ${cafeConfig.address.display}.`,
  openGraph: {
    title: `Visit | ${cafeConfig.name}`,
    description: `Location, operating hours, directions, and table reservations for ${cafeConfig.name} at ${cafeConfig.address.display}.`,
    url: `${cafeConfig.siteUrl}/visit`,
    siteName: cafeConfig.name,
    locale: "en_US",
    type: "website",
  },
};

export default function VisitPage() {
  const fullAddressString = cafeConfig.address.display;
  const googleMapsDirectionsUrl = cafeConfig.address.mapsUrl;

  const igUrl = instagramUrl();
  const fbUrl = facebookUrl();
  const waUrl = whatsappUrl();

  // Build schema.org CafeOrCoffeeShop structured data (omitted in demo mode)
  const showJsonLd = !isDemoMode();

  const openingHoursSpec = [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "23:00",
    },
  ];

  const liveSocialUrls = getLiveSocialUrls();

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: cafeConfig.name,
    url: `${cafeConfig.siteUrl}/visit`,
    telephone: cafeConfig.contact.phone || undefined,
    openingHoursSpecification: openingHoursSpec,
    sameAs: !isDemoMode() && liveSocialUrls.length > 0 ? liveSocialUrls : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: cafeConfig.address.street,
      addressLocality: cafeConfig.address.city,
      addressRegion: cafeConfig.address.state,
      postalCode: cafeConfig.address.postalCode,
      addressCountry: cafeConfig.address.country,
    },
  };

  const hasDirectInquiries = Boolean(cafeConfig.contact.phone || cafeConfig.contact.email);
  const hasSocialOrChat = Boolean(igUrl || fbUrl || waUrl);

  return (
    <div className="py-8 sm:py-16">
      {/* Schema.org Structured Data (Omitted in demo mode) */}
      {showJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="mx-auto flex max-w-site flex-col gap-16 px-4 sm:gap-24 sm:px-6 lg:px-8">
        {/* 1. Header */}
        <Reveal as="header" className="flex flex-col items-start gap-3" isHero={true}>
          <div className="flex items-center gap-2 text-xs font-medium text-cafe-olive">
            <CoffeeCupWithSteam className="h-5 w-5 text-cafe-terracotta" />
            <span>Location and service hours</span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-cafe-espresso text-balance sm:text-6xl">
            Plan your visit to {cafeConfig.name}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-cafe-espresso/85 sm:text-lg">
            Serving filter coffee, cold brews, and fresh bakes at {cafeConfig.address.display}.
          </p>
        </Reveal>

        {/* 2. Find us: Two column layout */}
        <Reveal as="section" className="w-full">
          <h2 id="find-us-heading" className="sr-only">
            Find us
          </h2>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Address, Hours table, Contacts, Social links */}
            <div className="flex flex-col gap-8 lg:col-span-6">
              {/* Address */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-cafe-olive">
                  Street address
                </span>
                <div className="flex items-start gap-3 text-sm text-cafe-espresso">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cafe-terracotta" aria-hidden="true" />
                  <div>
                    <CopyPill textToCopy={fullAddressString} label="Copy address to clipboard">
                      <span className="font-semibold text-cafe-espresso">{cafeConfig.address.display}</span>
                    </CopyPill>
                    <p className="mt-1 text-xs text-cafe-olive">
                      <a
                        href={googleMapsDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-cafe-terracotta"
                      >
                        Open in Google Maps
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours Table with highlighted current day */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-cafe-olive">
                  Weekly opening hours
                </span>
                <OpeningHoursTable
                  hoursTable={cafeConfig.hoursTable}
                  kitchenCloses={cafeConfig.hours.kitchenCloses || ""}
                />
              </div>

              {/* Direct phone and email lines only if they exist */}
              {hasDirectInquiries && (
                <div className="flex flex-col gap-3 border-t border-cafe-border pt-6">
                  <span className="text-xs font-medium text-cafe-olive">
                    Direct inquiries
                  </span>

                  <div className="flex flex-col gap-2 text-sm text-cafe-espresso">
                    {cafeConfig.contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 shrink-0 text-cafe-terracotta" aria-hidden="true" />
                        <a
                          href={`tel:${cafeConfig.contact.phone.replace(/[^0-9+]/g, "")}`}
                          className="inline-block py-1 transition-colors duration-short hover:text-cafe-terracotta hover:underline font-medium"
                        >
                          {cafeConfig.contact.phone}
                        </a>
                        <CopyPill textToCopy={cafeConfig.contact.phone} label="Copy phone number">
                          <span className="text-[11px] text-cafe-olive transition-colors duration-fast hover:text-cafe-terracotta py-0.5 px-2 border border-cafe-border rounded-[2px] bg-cafe-cream">
                            Copy
                          </span>
                        </CopyPill>
                      </div>
                    )}

                    {cafeConfig.contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 shrink-0 text-cafe-terracotta" aria-hidden="true" />
                        <a
                          href={`mailto:${cafeConfig.contact.email}`}
                          className="inline-block py-1 transition-colors duration-short hover:text-cafe-terracotta hover:underline"
                        >
                          {cafeConfig.contact.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Labelled links: Instagram, Facebook, Chat on WhatsApp */}
              {hasSocialOrChat && (
                <div className="flex flex-col gap-3 border-t border-cafe-border pt-6">
                  <span className="text-xs font-medium text-cafe-olive">
                    Connect & chat
                  </span>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {igUrl && (
                      <a
                        href={igUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded border border-cafe-border bg-cafe-cream px-3.5 py-2 text-xs font-medium text-cafe-espresso transition-[color,transform,border-color,background-color] duration-short hover:-translate-y-px hover:border-cafe-terracotta hover:text-cafe-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cafe-cream"
                      >
                        <InstagramIcon className="h-4 w-4 shrink-0 text-cafe-terracotta" />
                        <span>Instagram</span>
                      </a>
                    )}

                    {fbUrl && (
                      <a
                        href={fbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded border border-cafe-border bg-cafe-cream px-3.5 py-2 text-xs font-medium text-cafe-espresso transition-[color,transform,border-color,background-color] duration-short hover:-translate-y-px hover:border-cafe-terracotta hover:text-cafe-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cafe-cream"
                      >
                        <FacebookIcon className="h-4 w-4 shrink-0 text-cafe-terracotta" />
                        <span>Facebook</span>
                      </a>
                    )}

                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 rounded border border-cafe-border bg-cafe-cream px-3.5 py-2 text-xs font-medium text-cafe-espresso transition-[color,transform,border-color,background-color] duration-short hover:-translate-y-px hover:border-cafe-terracotta hover:text-cafe-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cafe-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cafe-cream"
                      >
                        <WhatsAppIcon className="h-4 w-4 shrink-0 text-cafe-terracotta" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Click-to-load Map */}
            <div className="lg:col-span-6 w-full">
              <ClickToLoadMap
                address={fullAddressString}
                directionsUrl={googleMapsDirectionsUrl}
              />
            </div>
          </div>
        </Reveal>

        {/* 3. Reserve a table: Accessible form */}
        <Reveal
          id="reserve"
          as="section"
          className="scroll-mt-28 border-t border-cafe-border pt-12 sm:pt-16"
        >
          <div className="flex flex-col gap-4 mb-8 max-w-2xl">
            <span className="text-xs font-medium text-cafe-olive">
              Table bookings
            </span>
            <h2
              id="reserve-heading"
              className="font-heading text-2xl font-bold tracking-tight text-cafe-espresso text-balance sm:text-4xl"
            >
              Reserve a table
            </h2>
            <p className="text-sm leading-relaxed text-cafe-espresso/85 sm:text-base">
              Walk-ins are always welcomed. For parties of four or more, or weekend brunch seating, send your reservation request below.
            </p>
          </div>

          <ReservationForm />
        </Reveal>

        {/* 4. Events: Rendered only if upcoming events exist (evaluated client-side) */}
        <UpcomingEventsSection />

        {/* 5. Closing line */}
        <section
          aria-label="Visit page inquiry line"
          className="border-t border-cafe-border pt-8 text-xs text-cafe-espresso/80 sm:text-sm"
        >
          <p>
            {cafeConfig.contact.phone ? (
              <>
                For daily bakery availability, private room bookings, or same-day queries, call us at{" "}
                <a
                  href={`tel:${cafeConfig.contact.phone}`}
                  className="font-medium text-cafe-terracotta underline underline-offset-2 hover:text-cafe-espresso"
                >
                  {cafeConfig.contact.phone}
                </a>{" "}
                or view our{" "}
              </>
            ) : (
              <>
                For daily bakery availability or questions, visit our counter or view our{" "}
              </>
            )}
            <Link
              href="/menu"
              className="font-medium text-cafe-terracotta underline underline-offset-2 hover:text-cafe-espresso"
            >
              seasonal menu
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
