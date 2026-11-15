# ToolBox — Google AdSense Integration & Monetization Guide

This document outlines the AdSense preparation, configuration, and compliance architecture implemented in **ToolBox**.

---

## 1. Compliance & Best Practices

ToolBox strictly follows Google AdSense Webmaster Policies:

- **No Accidental Click Placements**: Ad slots are distinctly separated from action buttons (like "Download", "Merge", "Copy", "Compress").
- **Clear Labeling**: Every ad container displays a subtle `Advertisement` header in compliance with policy.
- **Zero Cumulative Layout Shift (CLS)**: Ad containers are pre-allocated with a reserved min-height (`min-h-[90px]`) so surrounding tool workspaces do not shift when ads render.
- **No Fake Ad Placeholders**: If no publisher ID is configured, ad containers cleanly collapse without deceptive graphic mockups.
- **Consent Readiness**: Built to support Google Consent Mode v2 and IAB Europe TCF v2.2 consent banners.

---

## 2. Configuration Steps

### Step 1: Obtain Google AdSense Approval
1. Deploy ToolBox with a custom domain and verify all 24 tools work.
2. Sign up or log into [Google AdSense](https://adsense.google.com/).
3. Add your site domain (e.g. `yourdomain.com`).
4. Wait for Google AdSense site review.

### Step 2: Configure Environment Variables
Once approved, retrieve your Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`) and Slot IDs from the AdSense dashboard:

Add these to your `.env.local` (or Vercel Environment Variables):

```bash
# Publisher Client ID
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456

# Responsive Ad Slot IDs
NEXT_PUBLIC_ADSENSE_SLOT_HEADER=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT=1234567891
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=1234567892
```

---

## 3. Ad Placements Architecture

ToolBox provides 3 non-intrusive placements per page:

1. **Header Slot (`NEXT_PUBLIC_ADSENSE_SLOT_HEADER`)**:
   - Location: Positioned beneath the tool title and breadcrumbs, directly above the workspace.
   - Format: Responsive horizontal banner.
2. **In-Content Slot (`NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT`)**:
   - Location: Positioned below the interactive workspace and above the How-To / FAQ sections.
   - Format: Auto-responsive.
3. **Footer Slot (`NEXT_PUBLIC_ADSENSE_SLOT_FOOTER`)**:
   - Location: Positioned below the FAQ section and above the global site footer.
   - Format: Horizontal responsive banner.

---

## 4. Testing Your AdSense Setup

- In development mode without credentials, no ad scripts are executed and no errors appear in the browser console.
- When `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is defined, `AdSenseScript` injects the official Google AdSense tag asynchronously in the document `<head>`.
- Use the **AdSense Sandbox / Test Mode** or Google Chrome DevTools Network tab to confirm `pagead2.googlesyndication.com` loads properly without blocking user interactions.
