# ToolBox SEO Engine — Deployment & Operations Guide

**Target Website:** https://toolbox-1llw.vercel.app  
**Repository:** https://github.com/Zahid-coder-17/toolbox  
**Branch:** main  

---

## 1. Environment Variables Configuration

### Required for Production (Vercel Project Settings)
| Variable | Environment | Description | Example |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical site root URL | `https://toolbox-1llw.vercel.app` |
| `GOOGLE_SITE_VERIFICATION` | Production (Server-Side) | Google Search Console token | `qf7HT7T3pytnY-zGWN3M0FPJDApE-jKAU8K5HDHcFJ0` |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID`| Production | Google AdSense publisher ID | `ca-pub-6319866397206659` |

### Optional for GSC API Integration & Analytics
| Variable | Environment | Description |
| :--- | :--- | :--- |
| `GSC_CLIENT_EMAIL` | Vercel / GitHub Secrets | Google Cloud Service Account Email |
| `GSC_PRIVATE_KEY` | Vercel / GitHub Secrets | Google Cloud Service Account Private Key |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`| Vercel | Google Analytics 4 Measurement ID |

---

## 2. Local Testing Commands

```bash
# 1. Run Vitest Unit & Integration Suites
npm test

# 2. Run TypeScript Typecheck
npm run typecheck

# 3. Test Production Turbopack Build
npm run build

# 4. Test Backend Python Audit Routine
python -m backend.app.seo.technical_audit

# 5. Test Scheduler Routine
python -m backend.app.seo.scheduler --daily
```

---

## 3. GitHub & Vercel Deployment Workflow

1. **Verify git status is clean:**
   ```bash
   git status
   ```
2. **Review staged commits on main:**
   ```bash
   git log -n 3 --oneline
   ```
3. **Push to GitHub to trigger Vercel deployment:**
   ```bash
   git push origin main
   ```
4. **Inspect live production endpoints:**
   - Homepage: `https://toolbox-1llw.vercel.app/`
   - Educational Hub: `https://toolbox-1llw.vercel.app/blog`
   - SEO Dashboard: `https://toolbox-1llw.vercel.app/admin/seo`
   - Robots: `https://toolbox-1llw.vercel.app/robots.txt`
   - Sitemap: `https://toolbox-1llw.vercel.app/sitemap.xml`
