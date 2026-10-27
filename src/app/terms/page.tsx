// DRAFT. Must be reviewed by a qualified lawyer before real world use.

import type { Metadata } from "next";
import Link from "next/link";
import { cafeConfig } from "@/config/cafe";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: `Terms and conditions for visiting and interacting with ${cafeConfig.name}.`,
  openGraph: {
    title: `Terms and Conditions | ${cafeConfig.name}`,
    description: `Terms and conditions for visiting and interacting with ${cafeConfig.name}.`,
    url: `${cafeConfig.siteUrl}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      {/* Header */}
      <div className="max-w-2xl border-b border-cafe-border/60 pb-8">
        <span className="text-xs font-medium text-cafe-olive">
          Legal and terms
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-cafe-espresso sm:text-4xl">
          Terms and Conditions
        </h1>
        <p className="mt-3 text-xs text-cafe-olive">
          Last updated: {cafeConfig.legal.termsLastUpdated}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-cafe-espresso/80">
          These terms govern your use of the website operated by {cafeConfig.name}. By browsing or using this site, you agree to these standard conditions.
        </p>
      </div>

      {/* Content */}
      <div className="mt-10 max-w-prose space-y-10 text-sm leading-relaxed text-cafe-espresso/85">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            1. Purpose of this website
          </h2>
          <p>
            This website provides general information regarding {cafeConfig.name}, our coffee selections, bakery offerings, operating hours, and location. It is an informational resource and does not support direct electronic commerce or payment transactions.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            2. Menu items, seasonal availability, and pricing
          </h2>
          <p>
            We take pride in small-batch baking and single-origin coffee roasting. As a result, certain items may sell out early in the day or change based on seasonal ingredient availability.
          </p>
          <p>
            All prices and item descriptions listed on this website are provided for convenience and guidance only. They are subject to change without prior notice. In the event of any difference, the physical menu and current register pricing displayed at the cafe counter always take precedence.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            3. Table reservation requests
          </h2>
          <p>
            Submitting a table inquiry via our website form and WhatsApp does not constitute a guaranteed or confirmed booking.
          </p>
          <p>
            A reservation is confirmed only when our team reviews availability and sends you an explicit written confirmation message via WhatsApp or telephone. Reserved tables are held for a maximum of 15 minutes past the agreed time, after which seating may be released to waiting walk-in guests.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            4. Dietary information and food allergen advisory
          </h2>
          <p>
            Dietary classifications shown on our digital menu (such as Veg, Non-veg, Contains dairy, Contains gluten, and Contains nuts) are provided to assist guests in making informed selections.
          </p>
          <p>
            Our bakery and kitchen operate in a shared culinary environment. We prepare items containing wheat flour, dairy, tree nuts, and seeds throughout the day. While our kitchen team follows strict cleanliness practices, airborne flour dust and surface cross-contact can occur.
          </p>
          <p>
            Guests with severe or life-threatening food allergies must notify our service team directly and in person before placing any order.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            5. Intellectual property
          </h2>
          <p>
            All original photography, written copy, branding marks, and layout designs published on this website are the intellectual property of {cafeConfig.name} or their respective copyright holders.
          </p>
          <p>
            You may not copy, reproduce, modify, republish, or distribute any material from this site for commercial purposes without prior written authorization from {cafeConfig.name}.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            6. Limitation of liability
          </h2>
          <p>
            This website is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, whether express or implied.
          </p>
          <p>
            {cafeConfig.name} will not be held liable for any damages resulting from typographical errors, temporary website unavailability, or issues arising from third-party platforms such as WhatsApp or Google Maps.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            7. Governing law and dispute resolution
          </h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India.
          </p>
          <p>
            Any disputes, controversies, or claims arising out of or relating to the use of this website or the services of {cafeConfig.name} shall be subject to the exclusive jurisdiction of the competent courts in {cafeConfig.address.city}, India.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            8. Questions and inquiries
          </h2>
          <p>
            For any legal or operational questions regarding these terms, write to:
          </p>
          <div className="rounded-sm border border-cafe-border/80 bg-cafe-cream-deep/30 p-4 text-xs space-y-1">
            <p>
              <strong className="text-cafe-espresso">Cafe:</strong> {cafeConfig.name}
            </p>
            {cafeConfig.contact.email && (
              <p>
                <strong className="text-cafe-espresso">Email:</strong>{" "}
                <a
                  href={`mailto:${cafeConfig.contact.email}`}
                  className="text-cafe-terracotta underline hover:text-cafe-espresso"
                >
                  {cafeConfig.contact.email}
                </a>
              </p>
            )}
            {cafeConfig.contact.phone && (
              <p>
                <strong className="text-cafe-espresso">Phone:</strong> {cafeConfig.contact.phone}
              </p>
            )}
            <p>
              <strong className="text-cafe-espresso">Address:</strong> {cafeConfig.address.display}
            </p>
          </div>
        </section>

        {/* Navigation back */}
        <div className="pt-6 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center py-3 text-xs font-medium text-cafe-terracotta underline underline-offset-4 hover:text-cafe-espresso"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}