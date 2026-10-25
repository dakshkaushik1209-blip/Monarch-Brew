# Production Deployment Guide: Independent Cafe Website

This guide walks you through deploying this Next.js website to Vercel with a custom domain, automated SSL encryption, and production security headers.

---

## 1. Pre-Launch Verification

Before publishing to your public domain, run the placeholder audit to verify that all placeholder data (such as `[Cafe name]`, address, phone number, and hours) have been replaced with real cafe details:

```bash
# Informational audit
npm run check:placeholders

# Strict audit (fails build if any [placeholder] remains)
npm run check:placeholders -- --strict
```

Make sure all real details are configured in `src/config/cafe.ts` and `src/data/menu.ts`.

---

## 2. Deploying to Vercel

### Option A: Via GitHub Repository (Recommended)

1. Push this project repository to your GitHub account.
2. Log in to [Vercel](https://vercel.com) and click **Add New... > Project**.
3. Import your GitHub repository.
4. In the **Configure Project** screen:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `next build`
   - Output Directory: `.next`
5. Under **Environment Variables**, add:
   - Key: `SITE_URL`
   - Value: `https://yourcafedomain.com` (use your actual registered domain without a trailing slash).
6. Click **Deploy**. Vercel will build and assign an initial `*.vercel.app` preview URL.

### Option B: Via Vercel CLI

1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Run the deployment command from the project root:
   ```bash
   vercel
   ```
3. For production deployment:
   ```bash
   vercel --prod
   ```

---

## 3. Configuring Your Custom Domain

1. In the Vercel Project Dashboard, navigate to **Settings > Domains**.
2. Enter your custom domain name (e.g. `yourcafedomain.com` and `www.yourcafedomain.com`).
3. Vercel will recommend redirecting one variant to the other (e.g., redirect `yourcafedomain.com` to `www.yourcafedomain.com` or vice versa). Select your preferred canonical URL.

---

## 4. DNS Configuration at Your Domain Registrar

Log in to the management portal where you purchased your domain name (GoDaddy, Namecheap, Cloudflare, Google Domains/Squarespace, etc.) and add the following DNS records:

### For the Root Apex Domain (`yourcafedomain.com`)
* **Type:** `A`
* **Name / Host:** `@` (or leave blank depending on registrar)
* **Value / Points to:** `76.76.21.21`
* **TTL:** `60` seconds or `Automatic`

### For the WWW Subdomain (`www.yourcafedomain.com`)
* **Type:** `CNAME`
* **Name / Host:** `www`
* **Value / Points to:** `cname.vercel-dns.com.`
* **TTL:** `60` seconds or `Automatic`

---

## 5. DNS Propagation and SSL Verification

1. **Propagation Time:** DNS changes usually take between 5 minutes and 2 hours to propagate worldwide, though in rare cases it may take up to 24 to 48 hours.
2. **Automatic SSL Certificate:** Once DNS records resolve to Vercel servers, Vercel automatically provisions a free, auto-renewing Let's Encrypt SSL/TLS certificate.
3. **Status Check:** In your Vercel Domains tab, the status indicator will switch from a blue "Pending" icon to a green checkmark once the domain is active and SSL is verified.

---

## 6. Environment Variables and Canonical URL

Ensure that `SITE_URL` is configured in **Vercel Settings > Environment Variables**:

* **Key:** `SITE_URL`
* **Value:** `https://yourcafedomain.com` (or `https://www.yourcafedomain.com` matching your primary domain)
* **Environments:** Production, Preview, Development

This variable ensures that:
* The sitemap at `/sitemap.xml` generates absolute canonical URLs.
* Search engine metadata and Open Graph social sharing cards reference the live domain.
* The `robots.txt` points search engine crawlers to the correct sitemap location.

---

## 7. Post-Launch Verification Checklist

After pointing your domain, test the following endpoints in your browser:

1. **Homepage:** `https://yourcafedomain.com` (verifies HTTPS and visual layout)
2. **Menu Page:** `https://yourcafedomain.com/menu`
3. **Visit & Reservation:** `https://yourcafedomain.com/visit`
4. **Privacy Policy:** `https://yourcafedomain.com/privacy`
5. **Terms & Conditions:** `https://yourcafedomain.com/terms`
6. **Sitemap:** `https://yourcafedomain.com/sitemap.xml` (returns valid XML)
7. **Robots:** `https://yourcafedomain.com/robots.txt`
8. **Web Manifest:** `https://yourcafedomain.com/manifest.webmanifest`
9. **Open Graph Image:** `https://yourcafedomain.com/opengraph-image`
10. **Favicon:** `https://yourcafedomain.com/favicon.ico`
11. **Custom 404:** `https://yourcafedomain.com/non-existent-page` (verifies styled error page)

---

## 8. Security Headers Verification

You can verify that your production security headers are active by inspecting your domain headers in your terminal:

```bash
curl -I https://yourcafedomain.com
```

The response should include:
* `x-content-type-options: nosniff`
* `referrer-policy: strict-origin-when-cross-origin`
* `permissions-policy: camera=(), microphone=(), geolocation=()`
* `x-frame-options: SAMEORIGIN`
* `content-security-policy: default-src 'self' ...`
