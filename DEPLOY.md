# Deployment Guide: Monarch Brew

This guide covers deploying the website as a static export to Cloudflare Pages (free plan), suitable for client websites. It also documents Cloudflare Workers with Static Assets and alternative hosting options.

---

## 1. Static Export Architecture

This site is pre-rendered at build time into pure static HTML, CSS, JavaScript, and media assets in the `out/` directory.

- No Node.js server runtime is required in production.
- There are no server-side API routes, database connections, or runtime server actions.
- Dynamic elements (opening hours calculation, today's badge, upcoming events filtering, and reservation calendar limits) execute in the visitor's browser in the `Asia/Kolkata` timezone after page load.
- Security headers and cache policies are defined in `public/_headers` and copied into `out/_headers` on build.
- URL redirects are defined in `public/_redirects` and copied into `out/_redirects` on build.

---

## 2. Operating Modes (Demo vs Live)

The site operates in two modes via the `NEXT_PUBLIC_SITE_MODE` environment variable:

### Demo Mode (`NEXT_PUBLIC_SITE_MODE=demo`, Default)
- Pages include `noindex, nofollow` robots metadata.
- `robots.txt` outputs `Disallow: /` to block crawlers.
- `sitemap.xml` returns an empty URL set.
- Schema.org JSON-LD business markup is omitted.
- Social links and WhatsApp actions function in demo mode even if specific phone numbers or handles are empty.
- `npm run check:placeholders` runs non-blocking checks.

### Live Mode (`NEXT_PUBLIC_SITE_MODE=live`)
- Search engines are allowed (`index, follow`).
- `robots.txt` points to `sitemap.xml`.
- Full `CafeOrCoffeeShop` and `Menu` JSON-LD schemas are injected.
- Empty contact fields hide their respective UI elements cleanly.
- `npm run check:placeholders --strict` runs as a build guard, failing if placeholder strings remain.

---

## 3. Deploying to Cloudflare Pages (Recommended Flow)

Cloudflare Pages provides free hosting with unlimited bandwidth, DDoS protection, global edge CDN distribution, and free automated SSL. It is approved for commercial and client use on the free tier.

### Step 1: Push Code to Git
Commit all project files and push to GitHub or GitLab:
```bash
git add .
git commit -m "Prepare static export for Cloudflare Pages"
git push origin master
```

### Step 2: Create a Cloudflare Pages Project
1. Log in to the Cloudflare dashboard at https://dash.cloudflare.com.
2. In the left navigation, select **Workers & Pages**.
3. Click **Create**, then choose the **Pages** tab.
4. Select **Connect to Git** and choose your repository.
5. Configure the build settings:
   - **Project name:** `monarch-brew` (or your client's project name)
   - **Production branch:** `master` (or `main`)
   - **Framework preset:** `None` (or `Next.js (Static HTML Export)`)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Root directory:** `/` (leave empty if repository root)
6. Expand **Environment variables** and add:
   - `NEXT_PUBLIC_SITE_URL` = `https://monarchbrew.in` (use your live custom domain; must be HTTPS with no trailing slash)
   - `NEXT_PUBLIC_SITE_MODE` = `demo` (or `live` when ready for production)
   - `NODE_VERSION` = `20`
7. Click **Save and Deploy**.

Cloudflare will clone your repository, run `npm run build`, copy the `out/` directory to its global edge network, and assign a `*.pages.dev` preview address.

---

## 4. Alternative Flow: Cloudflare Workers with Static Assets

Cloudflare also supports static websites through Cloudflare Workers Static Assets using the Wrangler CLI.

1. Ensure `wrangler` is installed or run via `npx`:
   ```bash
   npx wrangler login
   ```
2. Create a `wrangler.jsonc` file in the project root:
   ```json
   {
     "name": "monarch-brew",
     "compatibility_date": "2024-11-01",
     "assets": {
       "directory": "./out",
       "not_found_handling": "404-page"
     }
   }
   ```
3. Build the static files:
   ```bash
   npm run build
   ```
4. Deploy using Wrangler:
   ```bash
   npx wrangler deploy
   ```

Both Cloudflare Pages and Workers Static Assets read `out/_headers` and `out/_redirects` automatically.

---

## 5. Custom Domain Configuration

### Option A: Domain Managed by Cloudflare DNS
If the domain's nameservers already point to Cloudflare:
1. In Cloudflare Pages, go to **Custom domains** and click **Set up a custom domain**.
2. Enter your apex domain (e.g., `monarchbrew.in`) and click **Continue**.
3. Cloudflare will automatically configure the DNS CNAME and apex flattening records.
4. Add the `www` subdomain (e.g., `www.monarchbrew.in`) as a second custom domain in the same tab.

### Option B: Domain at an External Registrar (GoDaddy, Namecheap, etc.)
If your DNS is managed outside Cloudflare:
1. In Cloudflare Pages, navigate to **Custom domains** > **Set up a custom domain**.
2. Enter `www.monarchbrew.in`. Cloudflare displays the target host (e.g., `monarch-brew.pages.dev`).
3. Log in to your registrar's DNS panel and create:
   - **Type:** `CNAME`
   - **Host/Name:** `www`
   - **Target/Value:** `monarch-brew.pages.dev`
   - **TTL:** `Automatic` or `300` seconds
4. For the apex domain (`monarchbrew.in`):
   - If your registrar supports CNAME flattening or ALIAS/ANAME records, point `@` to `monarch-brew.pages.dev`.
   - If not supported, set up URL forwarding at your registrar from `monarchbrew.in` to `https://www.monarchbrew.in`.

### SSL and Propagation
- DNS propagation typically takes between 5 minutes and 2 hours, but can take up to 24 hours.
- Cloudflare provisions an SSL certificate automatically through Universal SSL.
- When active, the custom domain status shows a green active indicator.

---

## 6. Verification Steps After Deployment

Run these checks on the live site:

1. **Verify Security Headers:**
   ```bash
   curl -I https://monarchbrew.in/
   ```
   Confirm presence of:
   - `x-content-type-options: nosniff`
   - `x-frame-options: SAMEORIGIN`
   - `referrer-policy: strict-origin-when-cross-origin`
   - `permissions-policy: camera=(), microphone=(), geolocation=()`
   - `strict-transport-security: max-age=31536000; includeSubDomains; preload`
   - `content-security-policy: default-src 'self' ...`

2. **Verify Static Asset Caching:**
   Check response headers for `/_next/static/` chunks. The header must return:
   `cache-control: public, max-age=31536000, immutable`

3. **Verify 404 Fallback:**
   Open `https://monarchbrew.in/non-existent-page`. Verify that the custom 404 page loads with status code 404.

4. **Verify Redirects:**
   Open `https://www.monarchbrew.in/`. Confirm it redirects via 301 to `https://monarchbrew.in/`.

5. **Verify Indexing Status in Demo Mode:**
   Inspect page source for `<meta name="robots" content="noindex, nofollow">` and confirm `/robots.txt` contains `Disallow: /`.

---

## 7. Rollback Procedure

If a deployment introduces an issue:
1. In the Cloudflare dashboard, go to **Workers & Pages** > select your project.
2. Select the **Deployments** tab.
3. Locate the previous working deployment.
4. Click the three dots icon (`...`) next to that deployment and select **Rollback to this deployment**.
5. Cloudflare will instantly route production traffic back to that build without requiring a git revert.

---

## 8. Switching to Live Mode Checklist

Before handing the site over to a client or switching to live mode:

1. **Update Cafe Details in `src/config/cafe.ts`:**
   - Set real phone number in `contact.phone`.
   - Set real email in `contact.email`.
   - Set WhatsApp number in `contact.whatsapp`.
   - Set social handles in `social.instagram` and `social.facebook`.
   - Set `address.unit` if a unit or shop number is assigned.
   - Set `websiteBy.name` and `websiteBy.url` if desired.

2. **Run Strict Placeholder Check:**
   ```bash
   npm run check:placeholders -- --strict
   ```
   The command must exit with code 0.

3. **Update Cloudflare Environment Variables:**
   - In Cloudflare Pages Settings > Environment variables, set `NEXT_PUBLIC_SITE_MODE` to `live`.

4. **Trigger Deployment:**
   Re-deploy from the dashboard or push a commit.

5. **Verify Live Search Directives:**
   Confirm `/robots.txt` points to `sitemap.xml` and pages no longer include `noindex`.

---

## 9. Alternative Hosting Platforms

### Netlify
- Free tier allows commercial client work.
- Build command: `npm run build`
- Publish directory: `out`
- Reads `public/_headers` and `public/_redirects` directly.

### Vercel
- Note on Vercel Hobby Free Tier: Vercel's Terms of Service restrict the free Hobby plan to personal, non-commercial use. Commercial client websites hosted on Vercel require a paid Vercel Pro subscription ($20/seat/month). Cloudflare Pages and Netlify both permit commercial client projects on their free plans.
