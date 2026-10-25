import type { Metadata } from "next";
import { cafeConfig } from "@/config/cafe";
import { galleryItems } from "@/data/gallery";
import { GalleryInteractiveView } from "@/components/GalleryInteractiveView";
import { DraggablePrints } from "@/components/DraggablePrints";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photographs of espresso service, daily bakes, and counter seating at ${cafeConfig.name}.`,
  openGraph: {
    title: `Gallery | ${cafeConfig.name}`,
    description: `Photographs of espresso service, daily bakes, and counter seating at ${cafeConfig.name}.`,
    url: `${cafeConfig.siteUrl}/gallery`,
    siteName: cafeConfig.name,
    locale: "en_US",
    type: "website",
  },
};

export default function GalleryPage() {
  const realPrints = galleryItems.filter((i) => i.src && i.src.trim().length > 0);
  const showPrintsSection = realPrints.length >= 3;

  return (
    <div className="py-8 sm:py-16">
      <div className="mx-auto flex max-w-site flex-col gap-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col items-start gap-4">
          <Reveal className="flex flex-col items-start gap-3" isHero={true}>
            <span className="inline-block rounded-[2px] border border-cafe-border bg-cafe-cream-deep/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-cafe-olive">
              Visual Record
            </span>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-cafe-espresso sm:text-6xl">
              Photographs of our <em className="font-normal italic text-cafe-terracotta">rooms</em> and craft
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-cafe-espresso/85 sm:text-lg">
              Daily work at our espresso bar, morning sourdough baking, and community seating on {cafeConfig.address.street}.
            </p>
          </Reveal>
        </header>

        {/* On the Table - Draggable loose prints */}
        {showPrintsSection && (
          <section aria-labelledby="on-the-table-heading" className="flex flex-col gap-4">
            <Reveal className="flex flex-col gap-1.5">
              <h2
                id="on-the-table-heading"
                className="font-heading text-2xl font-semibold tracking-tight text-cafe-espresso sm:text-3xl"
              >
                On the table
              </h2>
              <p className="text-sm text-cafe-espresso/80 sm:text-base">
                Loose paper prints from our espresso bar and bakery routine. Drag to arrange.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <DraggablePrints items={galleryItems} />
            </Reveal>
          </section>
        )}

        {/* Interactive Gallery with Category Tabs & Native Dialog Lightbox */}
        <GalleryInteractiveView items={galleryItems} />
      </div>
    </div>
  );
}
