import type { Metadata } from "next";
import { MapPin, Clock, Phone, ArrowUpRight, ArrowRight } from "lucide-react";
import { cafeConfig } from "@/config/cafe";
import { popularItems, formatPrice } from "@/data/menu";
import { Photo } from "@/components/Photo";
import { AnimatedButton, AnimatedLink } from "@/components/AnimatedButton";
import { CoffeeCupWithSteam, CoffeeBeans, BotanicalSprig } from "@/components/LineIllustrations";
import { Reveal, ImageReveal, TextReveal } from "@/components/Reveal";
import { StaggerContainer, StaggerItem } from "@/components/TextReveal";

export const metadata: Metadata = {
  title: `${cafeConfig.name} | ${cafeConfig.tagline}`,
  description: `${cafeConfig.name} on ${cafeConfig.address.street}. ${cafeConfig.description}`,
  openGraph: {
    title: `${cafeConfig.name} | ${cafeConfig.tagline}`,
    description: `${cafeConfig.name} on ${cafeConfig.address.street}. ${cafeConfig.description}`,
    url: cafeConfig.siteUrl,
    siteName: cafeConfig.name,
    locale: "en_US",
    type: "website",
  },
};

export default function HomePage() {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${cafeConfig.address.street}, ${cafeConfig.address.city} ${cafeConfig.address.postcode}`
  )}`;

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section: Asymmetric layout with animated typography & steaming cup */}
      <section
        aria-labelledby="hero-heading"
        className="w-full bg-cafe-cream py-12 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Heading, hours, buttons */}
            <div className="flex flex-col items-start gap-6 lg:col-span-7">
              {/* Steaming cup line illustration */}
              <div className="flex items-center gap-3">
                <CoffeeCupWithSteam className="h-12 w-12 text-cafe-terracotta" />
                <span className="inline-block rounded-[2px] border border-cafe-border bg-cafe-cream-deep/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-cafe-olive">
                  {cafeConfig.address.neighborhood}
                </span>
              </div>

              {/* Masked Hero Title with natural italic contrast word */}
              <TextReveal as="h1" className="w-full" isHero={true}>
                <span
                  id="hero-heading"
                  className="block font-heading text-4xl font-semibold tracking-tight text-cafe-espresso sm:text-5xl lg:text-6xl lg:leading-[1.12]"
                >
                  Filter coffee and fresh <em className="font-normal italic text-cafe-terracotta">bakes</em> on {cafeConfig.address.street}
                </span>
              </TextReveal>

              <StaggerContainer className="flex flex-col gap-6" delayChildren={0.2}>
                <StaggerItem>
                  <p className="max-w-xl text-base leading-relaxed text-cafe-espresso/85 sm:text-lg">
                    {cafeConfig.hours.summary} {cafeConfig.description}
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <AnimatedButton href="/menu" variant="primary">
                      See the menu
                    </AnimatedButton>

                    <AnimatedButton href="/visit" variant="secondary">
                      Find us
                    </AnimatedButton>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>

            {/* Right Column: Overlapping photo slots with soft scale entrance */}
            <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
              <ImageReveal delay={0.25} isHero={true}>
                {/* Primary large portrait slot */}
                <div className="w-full sm:w-5/6">
                  <Photo
                    alt="Main espresso counter and morning prep"
                    aspectRatio="3/4"
                    label="Front espresso counter"
                    priority
                    illustration="cup"
                    className="shadow-sm"
                  />
                </div>
              </ImageReveal>

              {/* Smaller secondary landscape slot tucked at bottom corner with subtle 1.5 deg rotation */}
              <div className="mt-4 sm:absolute sm:bottom-4 sm:right-0 sm:mt-0 sm:w-3/5 sm:rotate-[1.5deg] transition-transform duration-300 hover:rotate-0">
                <Photo
                  alt="Freshly baked sourdough and laminated pastries"
                  aspectRatio="4/3"
                  label="Fresh morning bakes"
                  illustration="beans"
                  className="border-2 border-cafe-cream shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Today at the counter: Full-width deeper cream color band */}
      {cafeConfig.todaySpecial && cafeConfig.todaySpecial.name && (
        <section
          aria-labelledby="counter-special-heading"
          className="w-full border-y border-cafe-border bg-cafe-cream-deep py-8 sm:py-10"
        >
          <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
            <Reveal className="flex flex-col items-start justify-between gap-6 rounded-[2px] border border-cafe-border bg-cafe-cream/80 p-6 sm:flex-row sm:items-center sm:px-8 sm:py-6">
              <div className="flex items-start gap-4">
                <CoffeeBeans className="mt-1 h-7 w-7 shrink-0 text-cafe-terracotta" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="inline-block rounded-[2px] border border-cafe-border bg-cafe-cream-deep px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-cafe-terracotta">
                      Today at the counter
                    </span>
                    <span className="text-xs text-cafe-olive">Limited morning batch</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                    <h2
                      id="counter-special-heading"
                      className="font-heading text-lg font-semibold text-cafe-espresso sm:text-xl"
                    >
                      {cafeConfig.todaySpecial.name}
                    </h2>
                    <p className="text-xs text-cafe-espresso/80 sm:text-sm">
                      {cafeConfig.todaySpecial.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 self-end sm:self-center">
                <span className="font-heading text-lg font-bold text-cafe-espresso sm:text-xl">
                  {cafeConfig.todaySpecial.price}
                </span>
                <AnimatedButton href="/menu" variant="secondary" className="px-4 py-2">
                  Order at counter
                </AnimatedButton>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* 3. What people order here: Cream band with printed editorial list layout */}
      <section
        aria-labelledby="popular-items-heading"
        className="w-full bg-cafe-cream py-16 sm:py-24"
      >
        <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Heading and editorial item list */}
            <div className="flex flex-col gap-8 lg:col-span-7">
              <Reveal>
                <span className="text-xs font-semibold uppercase tracking-widest text-cafe-olive">
                  Daily Staples
                </span>
                <h2
                  id="popular-items-heading"
                  className="mt-2 font-heading text-3xl font-semibold tracking-tight text-cafe-espresso sm:text-4xl"
                >
                  What people <em className="font-normal italic text-cafe-terracotta">order</em> here
                </h2>
                <p className="mt-2 text-sm text-cafe-espresso/80">
                  Prepared with ethical estate beans, regional whole milk, and stone ground flours.
                </p>
              </Reveal>

              {/* Editorial list with interactive row shift on hover */}
              <div className="divide-y divide-cafe-border border-y border-cafe-border">
                {popularItems.map((item, idx) => (
                  <Reveal
                    key={item.id}
                    delay={idx * 0.08}
                    reverseDelay={(popularItems.length - 1 - idx) * 0.06}
                    as="article"
                  >
                    <div className="group cursor-pointer py-5 transition-transform duration-200 ease-out hover:translate-x-1.5">
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="flex items-baseline gap-2">
                          <h3 className="font-heading text-lg font-semibold text-cafe-espresso transition-colors duration-200 group-hover:text-cafe-terracotta">
                            {item.name}
                          </h3>
                        </div>
                        {/* Dotted leader connection */}
                        <span
                          aria-hidden="true"
                          className="min-w-6 flex-1 -translate-y-1 border-b border-dotted border-cafe-border/80 transition-colors duration-200 group-hover:border-cafe-terracotta/50"
                        />
                        <span className="font-heading text-base font-semibold text-cafe-espresso transition-colors duration-200 group-hover:text-cafe-terracotta tabular-nums">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-cafe-espresso/75 sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <div>
                <AnimatedLink href="/menu" className="gap-2 font-semibold uppercase tracking-wider text-xs">
                  <span>View full seasonal menu</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </AnimatedLink>
              </div>
            </div>

            {/* Right Column: Tactile photo slot beside list */}
            <div className="flex flex-col gap-4 lg:col-span-5">
              <Reveal delay={0.2} reverseDelay={0.1}>
                <Photo
                  alt="Traditional drip coffee brewing and service"
                  aspectRatio="4/5"
                  label="Drip brew service"
                  illustration="beans"
                  className="w-full"
                />
                <p className="mt-3 text-xs text-cafe-olive">
                  Coffee beans ground to order for each pour. Filter roasts rotate monthly.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4. About summary: Deeper cream full-width band */}
      <section
        aria-labelledby="about-summary-heading"
        className="w-full border-y border-cafe-border bg-cafe-cream-deep py-16 sm:py-24"
      >
        <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Photo slot */}
            <div className="lg:col-span-5">
              <Reveal>
                <Photo
                  alt="Bakery flour prep and sourdough kneading table"
                  aspectRatio="4/3"
                  label="Baking table and stone mill"
                  illustration="sprig"
                  className="w-full"
                />
              </Reveal>
            </div>

            {/* Right Plain text */}
            <div className="flex flex-col items-start gap-5 lg:col-span-7">
              <Reveal delay={0.15} reverseDelay={0.08}>
                <div className="flex items-center gap-2">
                  <BotanicalSprig className="h-6 w-6 text-cafe-olive" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-cafe-olive">
                    Our Philosophy
                  </span>
                </div>

                <h2
                  id="about-summary-heading"
                  className="mt-2 font-heading text-3xl font-semibold tracking-tight text-cafe-espresso sm:text-4xl"
                >
                  A small, independent neighborhood <em className="font-normal italic text-cafe-terracotta">workshop</em>
                </h2>

                <p className="mt-4 text-sm leading-relaxed text-cafe-espresso/85 sm:text-base">
                  {cafeConfig.aboutIntro}
                </p>

                <div className="pt-4">
                  <AnimatedLink href="/about" className="gap-2 font-semibold uppercase tracking-wider text-xs">
                    <span>Read our story</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </AnimatedLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Gallery teaser: Cream band with tactile uneven grid */}
      <section
        aria-labelledby="gallery-teaser-heading"
        className="w-full bg-cafe-cream py-16 sm:py-24"
      >
        <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 border-b border-cafe-border pb-6 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-cafe-olive">
                  Our Space
                </span>
                <h2
                  id="gallery-teaser-heading"
                  className="mt-2 font-heading text-3xl font-semibold tracking-tight text-cafe-espresso sm:text-4xl"
                >
                  Moments around the <em className="font-normal italic text-cafe-terracotta">room</em>
                </h2>
              </div>

              <AnimatedLink href="/gallery" className="gap-2 font-semibold uppercase tracking-wider text-xs">
                <span>See all photos</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </AnimatedLink>
            </div>
          </Reveal>

          {/* Uneven photo grid with varying aspect ratios and hover zoom */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-12">
            <Reveal className="sm:col-span-7" delay={0.05} reverseDelay={0.15}>
              <Photo
                alt="Sunlit indoor wood tables and reading bench"
                aspectRatio="16/9"
                label="Indoor reading bench"
                hoverZoom
                className="h-full"
              />
            </Reveal>

            <Reveal className="sm:col-span-5" delay={0.1} reverseDelay={0.1}>
              <Photo
                alt="Fresh morning pastries on wooden cooling rack"
                aspectRatio="1/1"
                label="Morning pastry rack"
                illustration="beans"
                hoverZoom
                className="h-full"
              />
            </Reveal>

            <Reveal className="sm:col-span-5" delay={0.15} reverseDelay={0.05}>
              <Photo
                alt="Espresso machine portafilter extraction"
                aspectRatio="4/3"
                label="Espresso extraction"
                illustration="cup"
                hoverZoom
                className="h-full"
              />
            </Reveal>

            <Reveal className="sm:col-span-7" delay={0.2} reverseDelay={0}>
              <Photo
                alt="Quiet rear courtyard with green potted plants"
                aspectRatio="16/9"
                label="Rear garden tables"
                illustration="sprig"
                hoverZoom
                className="h-full"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6. Visit strip: Full-width dark espresso band with cream text */}
      <section
        aria-labelledby="visit-strip-heading"
        className="w-full border-t border-cafe-espresso bg-cafe-espresso text-cafe-cream py-16 sm:py-24"
      >
        <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
              {/* Col 1: Address and directions */}
              <div className="flex flex-col gap-4 lg:col-span-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-cafe-terracotta">
                  Location
                </span>
                <h2
                  id="visit-strip-heading"
                  className="font-heading text-3xl font-semibold tracking-tight text-cafe-cream sm:text-4xl"
                >
                  Visit us on <em className="font-normal italic text-cafe-terracotta">{cafeConfig.address.street}</em>
                </h2>

                <div className="flex items-start gap-3 text-sm text-cafe-cream/85">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cafe-terracotta" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-cafe-cream">{cafeConfig.address.street}</p>
                    <p>
                      {cafeConfig.address.city}, {cafeConfig.address.postcode}
                    </p>
                    <p className="mt-1 text-xs text-cafe-cream/60">{cafeConfig.address.directions}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-cafe-cream/85">
                  <Phone className="h-4 w-4 shrink-0 text-cafe-terracotta" aria-hidden="true" />
                  <a
                    href={`tel:${cafeConfig.contact.phone}`}
                    className="font-medium text-cafe-cream hover:text-cafe-terracotta hover:underline"
                  >
                    {cafeConfig.contact.phone}
                  </a>
                </div>

                <div className="pt-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cafe-terracotta underline underline-offset-4 transition-colors duration-200 hover:text-cafe-cream"
                  >
                    <span>Get directions on Google Maps</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Col 2: Opening hours table */}
              <div className="flex flex-col gap-4 lg:col-span-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-cafe-terracotta">
                  Service Hours
                </span>
                <div className="flex items-start gap-2 text-sm font-semibold text-cafe-cream">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cafe-terracotta" aria-hidden="true" />
                  <span>Weekly Schedule</span>
                </div>

                <dl className="divide-y divide-cafe-cream/15 text-xs">
                  {cafeConfig.hoursTable.map((item) => (
                    <div key={item.days} className="flex justify-between py-2.5">
                      <dt className="text-cafe-cream/80">{item.days}</dt>
                      <dd className="font-medium text-cafe-cream">{item.hours}</dd>
                    </div>
                  ))}
                </dl>

                <p className="text-xs text-cafe-cream/60">
                  {cafeConfig.hours.kitchenCloses}
                </p>
              </div>

              {/* Col 3: Actions */}
              <div className="flex flex-col justify-between gap-6 border-t border-cafe-cream/20 pt-6 lg:col-span-3 lg:border-t-0 lg:border-l lg:border-cafe-cream/20 lg:pl-10 lg:pt-0">
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-lg font-semibold text-cafe-cream">
                    Table Reservations
                  </h3>
                  <p className="text-xs leading-relaxed text-cafe-cream/80">
                    Walk-ins are always welcomed. For parties of four or more, please reserve in advance.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <AnimatedButton
                    href="/visit#reserve"
                    variant="dark"
                    className="w-full py-3.5"
                  >
                    Reserve a table
                  </AnimatedButton>

                  <AnimatedButton
                    href="/menu"
                    variant="secondary"
                    className="w-full py-3 border-cafe-cream/30 text-cafe-cream bg-cafe-espresso hover:bg-cafe-cream hover:text-cafe-espresso"
                  >
                    See menu
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
