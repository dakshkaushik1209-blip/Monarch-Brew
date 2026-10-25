// DRAFT. Must be reviewed by a qualified lawyer before real world use.

import type { Metadata } from "next";
import Link from "next/link";
import { cafeConfig } from "@/config/cafe";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy and data handling practices for ${cafeConfig.name}.`,
  openGraph: {
    title: `Privacy Policy | ${cafeConfig.name}`,
    description: `Privacy policy and data handling practices for ${cafeConfig.name}.`,
    url: `${cafeConfig.siteUrl}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      {/* Header */}
      <div className="max-w-2xl border-b border-cafe-border/60 pb-8">
        <span className="text-xs font-medium uppercase tracking-widest text-cafe-olive">
          Legal and Privacy
        </span>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-cafe-espresso sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-xs text-cafe-olive">
          Last updated: {cafeConfig.legal.privacyLastUpdated}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-cafe-espresso/80">
          This policy explains how {cafeConfig.name} handles information when you visit this website. We believe in minimal data collection and total transparency.
        </p>
      </div>

      {/* Content */}
      <div className="mt-10 max-w-prose space-y-10 text-sm leading-relaxed text-cafe-espresso/85">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            1. Information handled on this website
          </h2>
          <p>
            This website is primarily static and informational. We do not maintain a user database, and we do not require account registration or online payment.
          </p>
          <p>
            When you fill out the reservation inquiry form on the Visit page, the details you enter (your name, phone number, requested date, time, party size, and optional dietary notes) are processed entirely within your web browser. The form formats these details into a pre-filled WhatsApp message on your device.
          </p>
          <p>
            None of your form inputs are transmitted to or stored on our web server. If you decide not to send the WhatsApp message, no record of your input is retained anywhere.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            2. Third-party integrations
          </h2>
          <p>
            To keep this website fast, private, and independent, we restrict third-party connections:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-cafe-espresso/85">
            <li>
              <strong className="font-medium text-cafe-espresso">Google Maps:</strong> An interactive map of our location is provided using Google Maps. To protect your privacy, this map is not loaded automatically when you view the page. It loads only when you explicitly click the &quot;Load interactive map&quot; button. Until that click occurs, zero requests are sent to Google and zero Google cookies are placed on your browser. Once clicked, Google connects directly and processes your IP address and connection details under Google&apos;s Privacy Policy.
            </li>
            <li>
              <strong className="font-medium text-cafe-espresso">WhatsApp:</strong> Links for table reservations and inquiries direct you to WhatsApp (operated by Meta Platforms, Inc.). Any messaging conversation you initiate with us takes place on WhatsApp infrastructure and is governed by Meta&apos;s privacy policy.
            </li>
            <li>
              <strong className="font-medium text-cafe-espresso">Self-hosted typography:</strong> Fonts used on this website (Fraunces and DM Sans) are embedded in the site bundle and served directly from our own hosting domain. No live font requests are made to third-party font servers when you visit.
            </li>
            <li>
              <strong className="font-medium text-cafe-espresso">Web hosting:</strong> This website is hosted on modern cloud infrastructure. The hosting servers automatically log standard network transmission data, such as your IP address, browser type, and time of access. These logs are maintained strictly for network routing, security monitoring, and server performance.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            3. Cookies and tracking
          </h2>
          <p>
            This website does not set any analytics cookies, advertising trackers, social network tracking pixels, or profiling mechanisms.
          </p>
          <p>
            Because we do not use tracking or advertising cookies, this site does not display a cookie consent banner. You can browse all pages freely without cookie-based surveillance.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            4. Your statutory rights under Indian law
          </h2>
          <p>
            In accordance with applicable data protection legislation in India, including the Digital Personal Data Protection Act, 2023 (DPDP Act 2023), individuals have clear rights regarding their personal data:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-cafe-espresso/85">
            <li>The right to access a summary of personal data processed by a data fiduciary.</li>
            <li>The right to seek correction, completion, or updating of inaccurate or misleading data.</li>
            <li>The right to request erasure of personal data that is no longer necessary for the specified purpose.</li>
            <li>The right to readily available means of grievance redressal.</li>
          </ul>
          <p>
            Because this website does not maintain an online customer database or user accounts, we do not store customer records on our servers. If you have previously communicated with us via WhatsApp, phone, or email, you may exercise your rights by writing directly to our designated contact email below.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold text-cafe-espresso">
            5. Contact and grievance officer
          </h2>
          <p>
            If you have questions, feedback, or data privacy requests regarding {cafeConfig.name}, please contact us:
          </p>
          <div className="rounded-sm border border-cafe-border/80 bg-cafe-cream-deep/30 p-4 text-xs space-y-1">
            <p>
              <strong className="text-cafe-espresso">Cafe:</strong> {cafeConfig.name}
            </p>
            <p>
              <strong className="text-cafe-espresso">Email:</strong>{" "}
              <a
                href={`mailto:${cafeConfig.contact.email}`}
                className="text-cafe-terracotta underline hover:text-cafe-espresso"
              >
                {cafeConfig.contact.email}
              </a>
            </p>
            <p>
              <strong className="text-cafe-espresso">Phone:</strong> {cafeConfig.contact.phone}
            </p>
            <p>
              <strong className="text-cafe-espresso">Address:</strong> {cafeConfig.address.street}, {cafeConfig.address.city} {cafeConfig.address.postcode}
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