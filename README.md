# Independent Cafe Website

A handcrafted, high-performance website built for an independent specialty coffee shop and seasonal bakery. Built with Next.js 15 (App Router), TypeScript, and Tailwind CSS.

## Design Philosophy

- **Restrained Editorial Aesthetic:** Built with a warm, natural palette (cream `#F4EADB`, deep cream `#EADBC4`, espresso `#3B2A20`, terracotta `#B8643F`, and olive `#6B705C`).
- **Typography:** Fraunces for headings, DM Sans for body copy. Self-hosted through `next/font` for privacy and instant rendering.
- **Accessible and Honest:** No synthetic ratings, no generic stock photo clichés, no decorative gradients, and no rounded pill buttons. Every element serves a direct purpose for the cafe visitor.
- **Privacy by Default:** Zero tracking cookies, zero analytics beacons, click-to-load external maps, and client-side reservation links via WhatsApp without database storage.

## Features

- **Home (`/`):** Asymmetric hero with current operating hours, counter specials strip, curated signature orders, gallery preview, and direct map link.
- **Menu (`/menu`):** Typed catalog across 6 categories with dietary filters (All, Veg only) using Indian BIS standard square-and-dot indicators, print stylesheet, and Schema.org Menu JSON-LD.
- **About (`/about`):** Editorial background story, source ingredient standards, and optional team showcase.
- **Gallery (`/gallery`):** Category filter tabs, responsive uneven grid, and accessible native HTML5 dialog lightbox with keyboard navigation.
- **Visit (`/visit`):** Opening hours table with automatic local day highlight, contact details, click-to-load interactive map, and accessible reservation form.
- **Legal (`/privacy`, `/terms`):** Plain-language policies reflecting the real, zero-tracking behavior of this site and India's DPDP Act 2023.
- **Pre-Launch Guard:** Custom audit script to catch any bracketed placeholder text before production launch.

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

### Pre-Launch Placeholder Audit

Before launching to your production domain, run the placeholder audit to verify that all bracketed items (e.g., `[Cafe name]`, `[City]`, `[Phone number]`) in `src/config/cafe.ts` have been replaced:

```bash
# Informational audit
npm run check:placeholders

# Strict CI/CD check (fails with exit code 1 if placeholders remain)
npm run check:placeholders -- --strict
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Start local production server
npm run start
```

## Deployment

Refer to [DEPLOY.md](./DEPLOY.md) for step-by-step instructions on deploying to Vercel, configuring DNS records for custom apex and www domains, and verifying SSL certificates.
