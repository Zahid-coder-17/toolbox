# ToolBox — Quality Assurance & Testing Suite Guide

This document explains the testing architecture, test coverage, and execution instructions for **ToolBox**.

---

## 1. Testing Architecture Overview

ToolBox maintains an automated test suite comprising:
1. **Unit & Integration Tests (Vitest + React Testing Library)**: 55 passing tests validating algorithmic logic, tool rendering, user interactions, and edge cases.
2. **End-to-End Tests (Playwright)**: Full browser automation tests for desktop and mobile viewports.
3. **Type Safety & Build Checks**: Strict TypeScript compilation (`tsc --noEmit`) and production static page generation checks.

---

## 2. Test Coverage Matrix

Every one of the 24 tools has dedicated test coverage for both **successful execution** and **invalid or boundary input**:

| Tool Category | Tool Name | Success Test Case | Invalid / Boundary Input Test Case |
| :--- | :--- | :--- | :--- |
| **Text** | Word Counter | Counts words, chars, sentences | Whitespace / empty string handling |
| **Text** | Character Counter | Counts letters, digits, symbols | Empty text handling |
| **Text** | Case Converter | UPPERCASE, camelCase, kebab-case | Disables actions on empty input |
| **Text** | JSON Formatter | Prettify & minify valid JSON | Unclosed brackets & syntax diagnostics |
| **Text** | Base64 Tool | Encodes and decodes UTF-8 text | Malformed Base64 string error handling |
| **Text** | Text Diff Checker | Highlights additions & deletions | Identical inputs test (+0 / -0) |
| **Text** | Slug Generator | Transliterates accents (é -> e) | Empty string preview |
| **Text** | UUID Generator | Generates cryptographically secure v4 | Custom format options (uppercase/no hyphens) |
| **Image** | QR Code Generator | Renders QR code and SVG/PNG export | Color and error correction adjustments |
| **Image** | Color Picker | Converts HEX, RGB, HSL, CMYK | WCAG contrast ratio calculations |
| **Image** | Image Compressor | Dropzone accepts images | Size limit validation |
| **Image** | Image Resizer | Dimensions & percentage controls | Aspect ratio locking verification |
| **Image** | JPG to PNG | Dropzone accepts JPG files | Batch file conversion handling |
| **Image** | PNG to WebP | Quality slider changes | File size reduction calculations |
| **Image** | HEIC to JPG | HEIC dropzone & quality slider | Non-HEIC error handling |
| **Image** | Favicon Generator | Renders 6 target icon sizes | Browser tab mock simulation |
| **PDF** | PDF Compressor | Dropzone accepts PDF files | 50 MB limit validation |
| **PDF** | PDF Merger | Multiple PDF upload dropzone | Reorder controls validation |
| **PDF** | PDF Splitter | Range input (e.g. 1-3, 5) | Invalid range string error handling |
| **PDF** | PDF to JPG | 150 DPI vs 300 DPI selector | Page-by-page progress rendering |
| **Calculators** | Age Calculator | Years, months, days, day born | Target date before birth error |
| **Calculators** | Percentage Calc | X% of Y, % Change, Discounts | Division by zero protection |
| **Calculators** | EMI Calculator | Computes monthly loan EMI | Zero principal & tenure toggling |
| **Calculators** | Compound Interest | Future portfolio value & growth | Compounding frequency changes |

---

## 3. Running Tests

### Run All Vitest Tests
```bash
npm test
```

### Run Vitest in Watch Mode (Interactive)
```bash
npm run test:watch
```

### Run TypeScript Verification
```bash
npm run typecheck
```

### Run Playwright End-to-End Tests
Ensure the application is built first:
```bash
npm run build
npm run test:e2e
```

### Run E2E Tests with Visible UI Inspector
```bash
npx playwright test --ui
```
