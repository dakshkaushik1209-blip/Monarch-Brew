import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { cafeConfig } from "@/config/cafe";
import { cafeEvents } from "@/data/events";
import { Photo } from "@/components/Photo";
import { ClickToLoadMap } from "@/components/ClickToLoadMap";
import { ReservationForm } from "@/components/ReservationForm";
import { OpeningHoursTable } from "@/components/OpeningHoursTable";
import { CoffeeCupWithSteam } from "@/components/LineIllustrations";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Visit",
  description: `Location, operating hours, directions, and table reservations for ${cafeConfig.name} on ${cafeConfig.address.street}.`,
  openGraph: {
    title: `Visit | ${cafeConfig.name}`,
    description: `Location, operating hours, directions, and table reservations for ${cafeConfig.name} on ${cafeConfig.address.street}.`,
    url: `${cafeConfig.siteUrl}/visit`,
    siteName: cafeConfig.name,
    locale: "en_US",
    type: "website",
  },
};

export default function VisitPage() {
  const fullAddressString = `${cafeConfig.address.street}, ${cafeConfig.address.city} ${cafeConfig.address.postcode}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddressString
  )}`;

  const cleanPhone = cafeConfig.contact.phone.replace(/[^0-9]/g, "") || "919999999999";
  const whatsAppDirectUrl = `https://wa.me/${cleanPhone}`;

  // Filter upcoming events (ignore past events)
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const upcomingEvents = cafeEvents
    .filter((event) => event.date >= todayIso)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Build schema.org CafeOrCoffeeShop structured data
  // Skip fields that are unconfigured placeholders
  const isPlaceholder = (val: string) => !val || val.startsWith("[");

  const openingHoursSpec = [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "08:30",
      closes: "16:00",
    },
  ];

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: !isPlaceholder(cafeConfig.name) ? cafeConfig.name : undefined,
    url: `${cafeConfig.siteUrl}/visit`,
    telephone: !isPlaceholder(cafeConfig.contact.phone) ? cafeConfig.contact.phone : undefined,
    openingHoursSpecification: openingHoursSpec,
    sameAs: [cafeConfig.social.instagram, cafeConfig.social.facebook].filter(
      (url) => !isPlaceholder(url)
    ),
  };

  if (
    !isPlaceholder(cafeConfig.address.street) &&
    !isPlaceholder(cafeConfig.address.city)
  ) {
    jsonLd.address = {
      "@type": "PostalAddress",
      streetAddress: cafeConfig.address.street,
      addressLocality: cafeConfig.address.city,
      postalCode: !isPlaceholder(cafeConfig.address.postcode)
        ? cafeConfig.address.postcode
        : undefined,
      addressCountry: "IN",
    };
  }

  return (
    <div className="py-8 sm:py-16">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto flex max-w-site flex-col gap-16 px-4 sm:gap-24 sm:px-6 lg:px-8">
        {/* 1. Header */}
        <Reveal as="header" className="flex flex-col items-start gap-4" isHero={true}>
          <div className="flex items-center gap-2">
            <CoffeeCupWithSteam className="h-5 w-5 text-cafe-terracotta" />
            <span className="inline-block rounded-[2px] border border-cafe-border bg-cafe-cream-deep/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-cafe-olive">
              Location & Hours
            </span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-cafe-espresso sm:text-6xl">
            Plan your <em className="font-normal italic text-cafe-terracotta">visit</em> to {cafeConfig.name}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-cafe-espresso/85 sm:text-lg">
            Serving fresh brews and daily bakery items on {cafeConfig.address.street} in {cafeConfig.address.neighborhood}.
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
                <span className="text-xs font-semibold uppercase tracking-widest text-cafe-olive">
                  Street Address
                </span>
                <div className="flex items-start gap-3 text-sm text-cafe-espresso">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cafe-terracotta" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-cafe-espresso">{cafeConfig.address.street}</p>
                    <p>
                      {cafeConfig.address.city}, {cafeConfig.address.postcode}
                    </p>
                    <p className="mt-1 text-xs text-cafe-olive">{cafeConfig.address.directions}</p>
                  </div>
                </div>
              </div>

              {/* Hours Table with highlighted current day */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-cafe-olive">
                  Weekly Opening Hours
                </span>
                <OpeningHoursTable
                  hoursTable={cafeConfig.hoursTable}
                  kitchenCloses={cafeConfig.hours.kitchenCloses}
                />
              </div>

              {/* Contact and Messaging Links */}
              <div className="flex flex-col gap-3 border-t border-cafe-border pt-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-cafe-olive">
                  Direct Inquiries
                </span>

                <div className="flex flex-col gap-2 text-sm text-cafe-espresso">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-cafe-terracotta" aria-hidden="true" />
                    <a
                      href={`tel:${cafeConfig.contact.phone}`}
                      className="inline-block py-1 transition-colors duration-short hover:text-cafe-terracotta hover:underline"
                    >
                      {cafeConfig.contact.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-cafe-terracotta" aria-hidden="true" />
                    <a
                      href={`mailto:${cafeConfig.contact.email}`}
                      className="inline-block py-1 transition-colors duration-short hover:text-cafe-terracotta hover:underline"
                    >
                      {cafeConfig.contact.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 shrink-0 text-cafe-terracotta" aria-hidden="true" />
                    <a
                      href={whatsAppDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-1 font-medium text-cafe-terracotta underline underline-offset-2 transition-colors duration-short hover:text-cafe-espresso"
                    >
                      Chat with us on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="flex items-center gap-4 border-t border-cafe-border pt-4 text-xs">
                <span className="text-cafe-olive uppercase tracking-wider font-semibold">
                  Follow:
                </span>
                <a
                  href={cafeConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-cafe-espresso transition-colors duration-short hover:text-cafe-terracotta"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span>Instagram</span>
                </a>
                <a
                  href={cafeConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-cafe-espresso transition-colors duration-short hover:text-cafe-terracotta"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span>Facebook</span>
                </a>
              </div>
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
            <span className="text-xs uppercase tracking-widest text-cafe-olive">
              Table Bookings
            </span>
            <h2
              id="reserve-heading"
              className="font-heading text-2xl font-bold tracking-tight text-cafe-espresso sm:text-4xl"
            >
              Reserve a table
            </h2>
            <p className="text-sm leading-relaxed text-cafe-espresso/85 sm:text-base">
              Walk-ins are always welcomed. For parties of four or more, or weekend brunch seating, send your reservation request below.
            </p>
          </div>

          <ReservationForm />
        </Reveal>

        {/* 4. Events: Rendered only if upcoming events exist */}
        {upcomingEvents.length > 0 && (
          <Reveal
            as="section"
            className="border-t border-cafe-border pt-12 sm:pt-16"
          >
            <div className="flex flex-col gap-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-cafe-olive">
                  Gatherings
                </span>
                <h2
                  id="events-heading"
                  className="mt-2 font-heading text-2xl font-bold tracking-tight text-cafe-espresso sm:text-3xl"
                >
                  Upcoming events
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <article
                    key={event.id}
                    className="flex flex-col gap-3 rounded border border-cafe-border bg-cafe-cream-deep/40 p-5"
                  >
                    {event.photo && (
                      <Photo
                        src={event.photo}
                        alt={event.title}
                        aspectRatio="16/9"
                        label={event.title}
                      />
                    )}
                    <div className="text-xs text-cafe-olive uppercase tracking-wider font-semibold">
                      {event.date} at {event.time}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-cafe-espresso">
                      {event.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-cafe-espresso/80 sm:text-sm">
                      {event.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* 5. Closing line */}
        <section
          aria-label="Visit page inquiry line"
          className="border-t border-cafe-border pt-8 text-xs text-cafe-espresso/80 sm:text-sm"
        >
          <p>
            For daily bakery availability, private room bookings, or same-day queries, call us at{" "}
            <a
              href={`tel:${cafeConfig.contact.phone}`}
              className="font-medium text-cafe-terracotta underline underline-offset-2 hover:text-cafe-espresso"
            >
              {cafeConfig.contact.phone}
            </a>{" "}
            or view our{" "}
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
