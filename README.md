# ToolBox — Production-Ready Global Online Utility Platform

[![Next.js](https://img.shields.io/badge/Next.js-16%20App%20Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-55%20Passing-emerald)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-purple)]()

**ToolBox** is a fast, responsive, accessible, and SEO-engineered web application offering **24 free online utilities** across 4 categories: **Text**, **Image**, **PDF**, and **Calculators**.

Engineered with a **client-first architecture**, all document conversions, calculations, and transformations execute locally within the user's web browser using modern HTML5 Canvas, Web Workers, and Web Crypto APIs. Sensitive files, photos, contracts, and code never leave the user's device.

---

## 🛠️ Complete Tool Catalog (24 Tools)

### 📝 Text Utilities (8 Tools)
1. **[Word Counter](/tools/text/word-counter)** — Real-time word, character, sentence, paragraph counts, reading/speaking time, and keyword density.
2. **[Character Counter](/tools/text/character-counter)** — Character breakdown with live progress meters for X/Twitter, SMS, and SEO tags.
3. **[Case Converter](/tools/text/case-converter)** — Convert between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case.
4. **[JSON Formatter & Validator](/tools/text/json-formatter)** — Prettify (2/4 spaces, tabs), minify, and validate JSON with line/column syntax error highlighting and interactive tree view.
5. **[Base64 Encoder / Decoder](/tools/text/base64-encoder-decoder)** — Encode and decode UTF-8 text or binary files to Data URIs safely without character corruption.
6. **[Text Diff Checker](/tools/text/text-diff-checker)** — Side-by-side or unified difference comparison with line and word-level addition/deletion highlights.
7. **[Slug Generator](/tools/text/slug-generator)** — URL-safe slug creator with accent normalization, stop word removal, and custom separators.
8. **[UUID Generator](/tools/text/uuid-generator)** — Generate cryptographically secure RFC 4122 Version 4 UUIDs individually or in bulk (up to 1,000) with custom formatting.

### 🖼️ Image Utilities (8 Tools)
9. **[Image Compressor](/tools/image/image-compressor)** — Shrink JPEG, PNG, and WebP file sizes client-side with quality sliders and before/after comparison.
10. **[Image Resizer](/tools/image/image-resizer)** — Resize images by exact pixels or percentage scale with aspect ratio lock and high-quality downsampling.
11. **[JPG to PNG Converter](/tools/image/jpg-to-png)** — Convert JPG images to lossless PNG format with 100% pixel fidelity and batch support.
12. **[PNG to WebP Converter](/tools/image/png-to-webp)** — Convert heavy PNGs to modern WebP format while preserving alpha transparency channels.
13. **[HEIC to JPG Converter](/tools/image/heic-to-jpg)** — Convert Apple iPhone HEIC/HEIF photos to universal JPEG format in-browser.
14. **[QR Code Generator](/tools/image/qr-code-generator)** — Generate custom high-resolution QR codes for URLs, WiFi, and text with custom colors and SVG/PNG export.
15. **[Favicon Generator](/tools/image/favicon-generator)** — Create complete multi-size favicon bundles (16x16, 32x32, 180x180, 512x512) with browser tab simulation and ZIP export.
16. **[Color Picker & Converter](/tools/image/color-picker)** — Convert HEX, RGB, HSL, CMYK, check WCAG 2.1 AA/AAA contrast ratios, and generate harmonious palettes.

### 📄 PDF Utilities (4 Tools)
17. **[PDF Compressor](/tools/pdf/pdf-compressor)** — Optimize PDF document object streams and shrink file sizes locally without cloud uploads.
18. **[PDF Merger](/tools/pdf/pdf-merger)** — Combine multiple PDF documents into a single unified file with drag/reorder controls.
19. **[PDF Splitter](/tools/pdf/pdf-splitter)** — Extract specific page ranges (e.g. 1-3, 5) or split all pages into a downloadable ZIP archive.
20. **[PDF to JPG Converter](/tools/pdf/pdf-to-jpg)** — Render PDF document pages into high-resolution JPG images with 150 DPI or 300 DPI print quality.

### 🧮 Calculators (4 Tools)
21. **[Age Calculator](/tools/calculators/age-calculator)** — Calculate exact age in years, months, days, hours, next birthday countdown, day born, and zodiac signs.
22. **[Percentage Calculator](/tools/calculators/percentage-calculator)** — 4 calculation modes: X% of Y, X is what % of Y, percentage change, and sales discount/tax.
23. **[EMI Calculator](/tools/calculators/emi-calculator)** — Loan EMI calculator with principal vs interest breakdown, interactive amortization table, and CSV export.
24. **[Compound Interest Calculator](/tools/calculators/compound-interest-calculator)** — Investment growth forecaster with regular contributions, multiple compounding frequencies, and growth schedule.

---

## ⚡ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router) with static generation (SSG) for all 38 routes.
- **Language**: TypeScript in strict mode.
- **Styling**: Tailwind CSS v4 with custom responsive design tokens (White background, Deep Navy text, Blue primary, Violet accent).
- **Icons**: Lucide React.
- **Libraries**:
  - `pdf-lib` & `pdfjs-dist`: Local PDF processing and canvas rendering.
  - `qrcode`: Vector and raster QR code generation.
  - `diff`: Text difference algorithms.
  - `jszip`: Multi-file compression and bundle exports.
  - `heic2any`: iPhone image decoding.
  - `zod`: Type validation schemas.
- **Monetization**: Google AdSense ready with configurable responsive slots and zero layout shift.
- **Testing**: Vitest, React Testing Library, and Playwright.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open application
http://localhost:3000
```

---

## 🧪 Testing & Verification

```bash
# Run unit & integration test suite (55 tests)
npm test

# Run TypeScript typechecks
npm run typecheck

# Run production build (compiles all 38 static pages)
npm run build
```

---

## 📚 Documentation Index

- **[Installation Guide](INSTALLATION.md)** — Step-by-step setup and environment configuration.
- **[Architecture Deep-Dive](ARCHITECTURE.md)** — Modular monolith design, client-side data pipelines, and directory layout.
- **[Deployment Manual](DEPLOYMENT.md)** — Vercel zero-config deployment, custom domains, and CI/CD.
- **[SEO & Structured Data](SEO_GUIDE.md)** — Metadata, JSON-LD schemas (WebSite, WebApplication, HowTo, FAQPage), and canonical URLs.
- **[Google AdSense Setup](ADSENSE_SETUP.md)** — Publisher ID configuration, ad placement guidelines, and policy compliance.
- **[Security Architecture](SECURITY.md)** — File magic byte validation, XSS prevention, and object URL lifecycle management.
- **[Testing & QA Suite](TESTING.md)** — Unit tests, integration tests, E2E tests, and testing commands.

---

## 🛡️ License

MIT License. Open source and built for speed, privacy, and utility.
