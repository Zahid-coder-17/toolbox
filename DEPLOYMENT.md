# ToolBox — Production Deployment Guide

This guide covers deploying ToolBox to **Vercel** (the recommended hosting platform for Next.js App Router applications) and other modern edge platforms.

---

## 1. Deploying to Vercel (Recommended)

ToolBox is fully optimized for zero-config Vercel deployment.

### Option A: Deploy via Vercel Web Dashboard

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Navigate to [vercel.com/new](https://vercel.com/new).
3. Import your `toolbox` repository.
4. Set the Framework Preset to **Next.js**.
5. Add your Environment Variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SITE_URL`: `https://yourdomain.com`
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID`: `ca-pub-XXXXXXXXXXXXXXXX` (Optional/when approved)
   - `NEXT_PUBLIC_ADSENSE_SLOT_HEADER`: `XXXXXXXXXX`
   - `NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT`: `XXXXXXXXXX`
   - `NEXT_PUBLIC_ADSENSE_SLOT_FOOTER`: `XXXXXXXXXX`
6. Click **Deploy**. Vercel will run `npm run build` and deploy all 38 static pages to its global Edge network in under 2 minutes.

### Option B: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod
```

---

## 2. Custom Domain Configuration

1. In the Vercel Project Dashboard, navigate to **Settings** → **Domains**.
2. Enter your custom domain (e.g., `toolbox.dev` or `www.toolbox.dev`).
3. Configure your DNS provider with the recommended records:
   - **A Record**: `@` → `76.76.21.21`
   - **CNAME Record**: `www` → `cname.vercel-dns.com`
4. Update `NEXT_PUBLIC_SITE_URL` in your Vercel Environment Variables to match your custom domain.
5. Trigger a quick redeploy so canonical tags and sitemaps reflect the new domain.

---

## 3. GitHub Actions Continuous Integration (CI)

Create `.github/workflows/ci.yml` in your repository to automatically run tests and builds on every pull request:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Strict Typecheck
        run: npm run typecheck

      - name: Unit & Integration Tests
        run: npm test

      - name: Production Build
        run: npm run build
```

---

## 4. Edge Caching & Response Headers

Because ToolBox generates static HTML (SSG) for all tools and categories:
- Pages are served from Vercel's Edge Caches (`s-maxage=31536000, stale-while-revalidate`).
- Static JS/CSS chunks in `_next/static` are immutable with 1-year cache headers (`max-age=31536000, immutable`).
- `robots.txt` and `sitemap.xml` are dynamically generated and cached at the edge.

---

## 5. Post-Deployment Verification Checklist

- [ ] Verify root URL `https://yourdomain.com` loads instantly with HTTP 200.
- [ ] Verify sitemap is accessible at `https://yourdomain.com/sitemap.xml`.
- [ ] Verify `robots.txt` is accessible at `https://yourdomain.com/robots.txt`.
- [ ] Check Google Rich Results Test on `/tools/text/word-counter` for valid JSON-LD.
- [ ] Test client-side tools (e.g. Word Counter, Color Picker, Image Compressor) in Chrome, Firefox, and Safari.
