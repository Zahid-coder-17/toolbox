# Automated SEO Architecture & Scheduled Engine — ToolBox

**Date:** November 17, 2026  
**Architecture:** Next.js 16 (Frontend/Vercel) + FastAPI (Backend Services) + GitHub Actions (Scheduler)

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TOOLBOX SEO GROWTH ENGINE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────────────────┐             ┌────────────────────────────┐   │
│   │   Next.js 16 Frontend    │             │      FastAPI Backend       │   │
│   │   (Vercel Edge & SSG)    │             │   (backend/app/seo/)       │   │
│   ├──────────────────────────┤             ├────────────────────────────┤   │
│   │ • 24 Client Tools        │◄───────────►│ • technical_audit.py       │   │
│   │ • 4 Category Hubs        │   API /     │ • keyword_research.py      │   │
│   │ • /blog & /blog/[slug]   │ Telemetry   │ • competitor_analysis.py   │   │
│   │ • /admin/seo Dashboard   │             │ • search_console.py        │   │
│   │ • /api/seo/gsc Route     │             │ • scheduler.py             │   │
│   └──────────────────────────┘             └────────────────────────────┘   │
│                ▲                                         ▲                  │
│                │                                         │                  │
│                └─────────────────┬───────────────────────┘                  │
│                                  │                                          │
│                 ┌────────────────┴────────────────┐                         │
│                 │      GitHub Actions Workflows   │                         │
│                 │   .github/workflows/seo-...yml  │                         │
│                 │   (Daily, Weekly, Monthly Cron) │                         │
│                 └─────────────────────────────────┘                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Directory Structure

```
├── .github/
│   └── workflows/
│       └── seo-automation.yml         # Scheduled daily, weekly, monthly routines
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI server exposing SEO endpoints
│   │   └── seo/
│   │       ├── __init__.py
│   │       ├── technical_audit.py     # Live sitemap, robots, canonical checker
│   │       ├── keyword_research.py    # Keyword clustering & scoring
│   │       ├── competitor_analysis.py # Competitor monitoring & advantages
│   │       ├── content_generator.py   # AI article briefs & outlines
│   │       ├── faq_generator.py       # Automated FAQ generators
│   │       ├── internal_linking.py    # Graph analysis & orphan detection
│   │       ├── search_console.py      # GSC API integration client
│   │       ├── scheduler.py           # CLI scheduler (--daily, --weekly, --monthly)
│   │       └── reporting.py           # Automated digest generation
│   └── requirements.txt               # Backend dependencies
├── src/
│   ├── app/
│   │   ├── admin/seo/page.tsx         # Interactive SEO telemetry dashboard
│   │   ├── api/seo/gsc/route.ts       # GSC metrics route handler
│   │   ├── blog/                      # Knowledge Base & Guides hub
│   │   │   ├── page.tsx               # Blog index
│   │   │   └── [slug]/page.tsx        # Dynamic guide reader
│   │   ├── robots.ts                  # Production robots.txt generator
│   │   └── sitemap.ts                 # Dynamic XML sitemap generator
│   ├── components/
│   │   └── blog/
│   │       └── RelatedArticles.tsx    # Contextual programmatic internal links
│   └── config/
│       ├── articles.ts                # Educational content registry
│       └── tools.ts                   # 24 tools with enriched FAQs
```

---

## 3. Automation Cadence

### Daily Workflow (04:00 UTC)
- Fetches `https://toolbox-1llw.vercel.app/`
- Validates HTTP 200 responses for all sitemap endpoints
- Confirms robots.txt and sitemap.xml availability
- Checks Google Search Console verification meta tag persistence

### Weekly Workflow (Mondays 04:00 UTC)
- Identifies keyword ranking shifts
- Benchmarks competitor availability
- Checks link graph integrity between tools and articles

### Monthly Workflow (1st of Month 04:00 UTC)
- Generates full performance digest
- Re-evaluates content gaps for editorial calendar expansion
- Audits backlink acquisition targets
