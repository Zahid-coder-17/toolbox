# ToolBox — Technical Architecture & Engineering Design

This document details the software architecture, data flow, component hierarchies, and optimization strategies implemented in **ToolBox**.

---

## 1. Architectural Philosophy

ToolBox is built around three architectural tenets:

1. **Client-First Processing (Zero-Upload Security)**:
   Traditional utility websites upload user files to a backend server for conversion, introducing severe privacy vulnerabilities, bandwidth costs, and server scaling bottlenecks. ToolBox performs 100% of text processing, image compression, PDF manipulation, and math calculations directly inside the user's browser runtime.

2. **Static-Site Generation (SSG) for High SEO Performance**:
   All 38 public application routes (24 tools, 4 category pages, home page, legal pages, and sitemaps) are statically pre-rendered at build time. This ensures near-zero Time to First Byte (TTFB), superior Core Web Vitals (LCP, INP, CLS), and instant indexing by Googlebot.

3. **Modular Monolith**:
   Code is organized into decoupled layers: Central Registry, Reusable Layouts, UI Primitives, Client Engines, and Structured Data Generators. Adding a 25th tool requires only adding its definition to the central registry and its interactive component.

---

## 2. Directory Structure

```
toolbox/
├── e2e/                             # Playwright end-to-end test suites
│   └── tools.spec.ts                # Flow tests for home, categories, and tools
├── public/                          # Static assets and favicons
├── src/
│   ├── app/                         # Next.js App Router root
│   │   ├── about/page.tsx           # About page
│   │   ├── category/[category]/     # Dynamic category landing pages
│   │   ├── contact/page.tsx         # Contact & feedback page
│   │   ├── privacy/page.tsx         # Privacy policy
│   │   ├── terms/page.tsx           # Terms of service
│   │   ├── tools/[category]/[slug]/ # Dynamic tool routes (generateStaticParams)
│   │   ├── globals.css              # Tailwind v4 theme & CSS tokens
│   │   ├── layout.tsx               # Root layout (Header, AdSense, Footer)
│   │   ├── page.tsx                 # Home page (Hero, Search, 24 Tool Grid)
│   │   ├── robots.ts                # Dynamic robots.txt generator
│   │   └── sitemap.ts               # Dynamic sitemap.xml generator
│   ├── components/
│   │   ├── ads/                     # Google AdSense integration components
│   │   │   └── AdSense.tsx          # Safe AdUnit and Script injector
│   │   ├── layout/                  # Shared page layouts
│   │   │   ├── Breadcrumbs.tsx      # Semantic navigation & BreadcrumbList schema
│   │   │   ├── Footer.tsx           # Global footer with legal & trust links
│   │   │   ├── Header.tsx           # Responsive header with Cmd+K search
│   │   │   └── ToolLayout.tsx       # Standard master tool landing layout
│   │   ├── search/                  # Global search components
│   │   │   └── QuickSearchModal.tsx # Cmd+K modal for all 24 tools
│   │   ├── tools/                   # The 24 interactive tool client components
│   │   │   ├── text/                # 8 Text tools (WordCounter, Diff, JSON, etc.)
│   │   │   ├── image/               # 8 Image tools (Compressor, QR, Color, etc.)
│   │   │   ├── pdf/                 # 4 PDF tools (Compressor, Merger, Splitter, etc.)
│   │   │   ├── calculators/         # 4 Calculators (Age, EMI, Percentage, Compound)
│   │   │   └── ToolResolver.tsx     # Dynamic slug-to-component resolver
│   │   └── ui/                      # shadcn/ui inspired primitives
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── file-upload.tsx      # Reusable drag-and-drop file uploader
│   │       ├── input.tsx
│   │       ├── slider.tsx
│   │       ├── tabs.tsx
│   │       └── tool-card.tsx        # Reusable card with launch action
│   ├── config/
│   │   └── tools.ts                 # Central Single-Source-of-Truth Tool Registry
│   ├── lib/
│   │   ├── security.ts              # Magic byte validation, XSS escaping, safe URLs
│   │   ├── seo.ts                   # JSON-LD Schema generators (WebApp, HowTo, FAQ)
│   │   └── utils.ts                 # cn, formatBytes, copy, download helpers
│   └── tests/                       # Vitest & RTL test suites (55 tests)
│       ├── security.test.ts
│       ├── seo.test.ts
│       └── tools/
│           ├── calculators.test.tsx
│           ├── image.test.tsx
│           ├── pdf.test.tsx
│           └── text.test.tsx
├── next.config.ts                   # Next.js configuration & build settings
├── package.json
├── playwright.config.ts             # Playwright configuration
├── tsconfig.json                    # Strict TypeScript configuration
└── vitest.config.ts                 # Vitest test runner configuration
```

---

## 3. The Central Tool Registry (`src/config/tools.ts`)

Every tool in ToolBox is registered with full metadata in `src/config/tools.ts`:

```typescript
export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  category: 'text' | 'image' | 'pdf' | 'calculators';
  href: string;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  badge?: string;
  keywords: string[];
  features: string[];
  howToSteps: HowToStep[];
  faqs: FAQItem[];
  metaTitle: string;
  metaDescription: string;
}
```

This single configuration powers:
1. `generateStaticParams()` to pre-render the 24 static tool routes.
2. `generateMetadata()` for unique page titles, descriptions, and canonical URLs.
3. Automated JSON-LD structured data creation (`WebApplication`, `HowTo`, `FAQPage`).
4. Instant client-side search autocomplete and category filtering.
5. Related tools recommendation widgets.

---

## 4. Client-Side Processing Pipeline

### Image Processing Pipeline
```
[ User File ]
      │
      ▼
[ Magic Byte Signature Validation ]  (Ensures genuine image binary)
      │
      ▼
[ Image() Object / heic2any Decoder ]
      │
      ▼
[ HTML5 Canvas 2D Context ]  (High quality bicubic interpolation)
      │
      ▼
[ canvas.toBlob() with Quality & Format ]  (JPEG / WebP / PNG)
      │
      ▼
[ Safe Object URL ] -> [ Direct In-Browser Download ]
```

### PDF Processing Pipeline
```
[ User PDF File ]
      │
      ▼
[ ArrayBuffer Read ]
      │
      ▼
[ pdf-lib PDFDocument.load() ]
      │
      ├─► Merge: copyPages() across multiple documents
      ├─► Split: copyPages() to single document or JSZip archive
      └─► Compress: Object stream dictionary optimization
      │
      ▼
[ pdfDoc.save() ] -> [ In-Memory Blob Download ]
```

---

## 5. Performance & Bundle Optimization

- **Dynamic Imports**: Heavy client libraries like `pdfjs-dist`, `heic2any`, and `diff` are dynamically loaded only when their specific tool is visited.
- **Zero Layout Shift (CLS)**: Ad containers reserve fixed minimum heights (`min-h-[90px]`) so content does not jump when ads load.
- **Tree-Shaking**: Icons from `lucide-react` are individually referenced in `ICON_MAP`.
