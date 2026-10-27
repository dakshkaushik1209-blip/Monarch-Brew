import type { Metadata } from "next";
import { cafeConfig } from "@/config/cafe";
import { getSiteUrl, isDemoMode } from "@/config/site";
import { menuCategories } from "@/data/menu";
import { MenuInteractiveView } from "@/components/MenuInteractiveView";
import { BrewCalculator } from "@/components/BrewCalculator";
import { CoffeeBeans, Croissant } from "@/components/LineIllustrations";
import { AnimatedButton } from "@/components/AnimatedButton";
import { Reveal } from "@/components/Reveal";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Menu",
  description: `Seasonal coffee, cold brews, teas, fresh bakes, and snacks at ${cafeConfig.name}. Prices in Indian Rupees.`,
  openGraph: {
    title: `Menu | ${cafeConfig.name}`,
    description: `Seasonal coffee, cold brews, teas, fresh bakes, and snacks at ${cafeConfig.name}. Prices in Indian Rupees.`,
    url: `${siteUrl}/menu`,
    siteName: cafeConfig.name,
    locale: "en_US",
    type: "website",
  },
};

export default function MenuPage() {
  const isPlaceholder = (val?: string | null) => !val || val.startsWith("[");
  // Generate schema.org Menu JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: !isPlaceholder(cafeConfig.name) ? `${cafeConfig.name} Menu` : "Cafe Menu",
    description: `Seasonal coffee, manual brews, artisan tea, and fresh bakery selections${!isPlaceholder(cafeConfig.name) ? ` at ${cafeConfig.name}` : ""}.`,
    url: `${siteUrl}/menu`,
    hasMenuSection: menuCategories.map((category) => ({
      "@type": "MenuSection",
      name: category.name,
      description: category.description,
      hasMenuItem: category.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.description,
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: "INR",
        },
        suitableForDiet:
          item.diet === "veg" ? "https://schema.org/VegetarianDiet" : undefined,
      })),
    })),
  };

  const showJsonLd = !isDemoMode();

  return (
    <div className="py-8 sm:py-16">
      {/* Schema.org Structured Data (Omitted in demo mode) */}
      {showJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Print-only header */}
      <div className="mx-auto hidden max-w-site px-4 print:block mb-8 border-b border-black pb-4 text-black">
        <p className="font-heading text-3xl font-bold">{cafeConfig.name}</p>
        <p className="text-xs">
          {cafeConfig.address.display}
          {cafeConfig.contact.phone ? ` | ${cafeConfig.contact.phone}` : ""}
        </p>
        <p className="mt-1 text-xs font-semibold">
          Menu: All prices in Indian Rupees (INR).
        </p>
      </div>

      {/* 1. Page Header (Screen) */}
      <header className="mx-auto max-w-site px-4 sm:px-6 lg:px-8 print-hidden print:hidden mb-12">
        <Reveal className="flex flex-col items-start gap-4" isHero={true}>
          <div className="flex items-center gap-2.5 text-xs font-medium text-cafe-olive">
            <CoffeeBeans className="h-4 w-4 text-cafe-terracotta" />
            <span>Daily offerings & seasonal bakes</span>
            <Croissant className="h-4 w-4 text-cafe-olive/80" />
          </div>

          <h1 className="font-heading text-4xl font-semibold tracking-tight text-cafe-espresso text-balance sm:text-6xl">
            Seasonal menu and fresh bakes
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-cafe-espresso/85 sm:text-base">
            All prices are in Indian Rupees (INR). Please notify our team of any food allergies or dietary restrictions before placing your order.
          </p>

          <p className="text-xs text-cafe-olive">
            Seasonal menu updated: {cafeConfig.legal.menuLastUpdated}
          </p>
        </Reveal>
      </header>

      {/* 2 & 3 & 4. Category Tabs, Diet Filter, and Category Item Sections */}
      <MenuInteractiveView categories={menuCategories} />

      {/* 4.5 Interactive Brew Ratio & Pour Calculator */}
      <section
        aria-labelledby="brew-calculator-heading"
        className="mx-auto mt-16 max-w-site px-4 sm:px-6 lg:px-8 print-hidden print:hidden"
      >
        <Reveal>
          <BrewCalculator />
        </Reveal>
      </section>

      {/* 5. Bottom Allergen Note Block */}
      <section
        aria-labelledby="allergen-note-heading"
        className="mx-auto mt-20 max-w-site px-4 sm:px-6 lg:px-8 print-hidden print:hidden"
      >
        <Reveal className="rounded-[2px] border border-cafe-border bg-cafe-cream-deep/70 p-6 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl flex flex-col gap-2">
              <h2
                id="allergen-note-heading"
                className="font-heading text-xl font-semibold text-cafe-espresso text-balance sm:text-2xl"
              >
                Allergen and preparation notice
              </h2>
              <p className="text-xs leading-relaxed text-cafe-espresso/80 sm:text-sm">
                Please tell us about any allergy before you order. Our kitchen handles tree nuts, dairy, wheat, sesame, and eggs. We do our best to avoid cross-contamination, but cannot guarantee a completely allergen-free environment.
              </p>
            </div>

            <div className="shrink-0">
              <AnimatedButton
                href="/visit#reserve"
                variant="primary"
              >
                Reserve a table
              </AnimatedButton>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
