# Technical SEO Issues & Remediation Log — ToolBox

**Date:** November 17, 2026  
**Status:** In Remediation / Partially Resolved  
**Scope:** Architecture, Codebase, Metadata, Structured Data, Automation

---

## Issue Prioritization Matrix

| Issue ID | Severity | Category | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TEC-01** | **Critical** | Indexability | Production domain fallback was defaulting to `toolbox.dev` | **Resolved** (Updated to `https://toolbox-1llw.vercel.app`) |
| **TEC-02** | **Critical** | Verification | Google verification token placeholder was emitted in live HTML | **Resolved** (Sanitized & made conditional) |
| **TEC-03** | **High** | Content Depth | Tools lacked comprehensive FAQs (only 2–3 questions per tool) | **In Progress** (Expanding to 8–15 per tool) |
| **TEC-04** | **High** | Architecture | Lack of educational content / blog architecture for informational queries | **In Progress** (Adding `/blog` and dynamic guide routes) |
| **TEC-05** | **Medium** | Internal Linking| Missing programmatic contextual linking between guides and tools | **In Progress** (Adding `RelatedArticles` & bidirectional link graph) |
| **TEC-06** | **Medium** | Structured Data | Empty `sameAs: []` in `Organization` schema causing validator warnings | **Resolved** (Cleaned up in `src/lib/seo.ts`) |
| **TEC-07** | **Medium** | Performance | Regex catastrophic backtracking in WordCounter on >50k chars | **Resolved** (Replaced with non-backtracking tokenizer) |
| **TEC-08** | **Low** | Automation | Absence of automated SEO dashboard and recurring intelligence workflows | **In Progress** (Creating FastAPI backend + GitHub Actions scheduler) |

---

## Detailed Remediation Plans

### TEC-03: FAQ Depth Expansion
- **Root Cause:** Initial tool definitions had only basic questions.
- **Action:** Create an automated FAQ database (`FAQ_DATABASE.csv`) and update `src/config/tools.ts` to include 8 to 15 questions per tool addressing real user pain points, security guarantees, algorithm nuances, and practical usage steps.

### TEC-04: Informational Blog / Guide System
- **Root Cause:** Tools only capture transactional/navigational keywords ("word counter", "compress image"). They miss the massive volume of informational queries ("how to compress png to 100kb", "how to merge pdfs on windows without adobe").
- **Action:** Build `src/app/blog/page.tsx` and `src/app/blog/[slug]/page.tsx` with dedicated Article JSON-LD markup and dynamic sitemap integration.

### TEC-08: SEO Automation & Scheduled Intelligence
- **Root Cause:** SEO tasks were manual one-offs without regular competitor tracking, keyword rank logging, or automated health audits.
- **Action:** Build Python automation modules in `backend/app/seo/` and configure a GitHub Actions workflow `.github/workflows/seo-automation.yml` for recurring execution.
