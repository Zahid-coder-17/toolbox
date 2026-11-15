# ToolBox — Search Engine Optimization (SEO) Master Guide

ToolBox is built to rank on page 1 of search engine results for utility search terms. This document details the technical, on-page, and structured data implementation.

---

## 1. On-Page SEO Architecture

### Unique Metadata per Page
Every tool landing page has hand-crafted, high-intent metadata:
- **Title Tag**: Optimized for intent (`Free Online Word Counter — Words, Characters & Reading Time | ToolBox`)
- **Meta Description**: Action-oriented and informative, under 160 characters.
- **Canonical URL**: Prevents duplicate content issues (`<link rel="canonical" href="https://yourdomain.com/tools/text/word-counter" />`).
- **OpenGraph & Twitter Cards**: High-converting preview titles, descriptions, and dimensions (`1200x630`).

### Semantic HTML Hierarchy
Each tool page adheres strictly to standard semantic HTML:
- One single `<h1>` tag containing the tool title.
- Clear `<h2>` sections:
  - `Key Features of {Tool Name}`
  - `How to Use {Tool Name}`
  - `Frequently Asked Questions`
- `<nav aria-label="Breadcrumb">` for hierarchical navigation.
- Accessible `<label>` associations for screen readers and search crawlers.

---

## 2. Structured Data (JSON-LD Schemas)

ToolBox automatically generates and injects schema.org JSON-LD structured data on every page:

### 1. `WebSite` Schema (Home Page)
Includes `SearchAction` for Google Sitelinks Searchbox:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ToolBox",
  "url": "https://toolbox.dev",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://toolbox.dev/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 2. `WebApplication` Schema (Tool Pages)
Identifies the tool as a free browser application:
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Word Counter",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### 3. `HowTo` Schema (Instructions)
Provides Google with step-by-step rich snippet instructions:
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to use Word Counter",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Paste or type text",
      "text": "Enter or paste your content directly into the editor."
    }
  ]
}
```

### 4. `FAQPage` Schema (Q&A Accordions)
Renders collapsible FAQ rich results in SERPs for increased CTR:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is my text sent to any server?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. All calculations run strictly in your web browser."
      }
    }
  ]
}
```

### 5. `BreadcrumbList` Schema
Displays search result breadcrumbs (`Home > Text Utilities > Word Counter`).

---

## 3. Dynamic XML Sitemap & Robots.txt

- **Sitemap**: Generated dynamically at `/sitemap.xml` with `<priority>` and `<changefreq>` tags for all 38 static routes.
- **Robots.txt**: Generated dynamically at `/robots.txt` allowing all crawlers and pointing directly to the sitemap index.

---

## 4. Google Search Console Setup

1. Add your property in [Google Search Console](https://search.google.com/search-console).
2. Verify ownership using DNS TXT record or HTML meta tag.
3. Submit your sitemap: `https://yourdomain.com/sitemap.xml`.
4. Run the **URL Inspection Tool** on `/tools/text/word-counter` and `/tools/calculators/emi-calculator` to confirm indexing eligibility and test rich snippet schema.
