# ToolBox — Installation & Local Development Guide

This guide walks you through setting up, configuring, and running **ToolBox** on your local machine or staging environment.

---

## 1. System Requirements

Before beginning, ensure you have the following installed on your operating system (macOS, Windows, or Linux):

- **Node.js**: Version `18.18.0` or higher (Node.js 20 or 22 LTS recommended).
- **npm**: Version `9.0.0` or higher.
- **Git**: Installed for version control.

Verify your environment:
```bash
node -v
npm -v
git --version
```

---

## 2. Cloning the Repository

```bash
git clone https://github.com/your-org/toolbox.git
cd toolbox
```

---

## 3. Installing Dependencies

Install all production and development dependencies:

```bash
npm install
```

This installs:
- Core framework: `next`, `react`, `react-dom`, `tailwindcss`, `lucide-react`
- Utilities & engines: `pdf-lib`, `pdfjs-dist`, `qrcode`, `diff`, `jszip`, `heic2any`, `zod`
- Testing framework: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test`

---

## 4. Environment Variables Setup

Copy the sample environment file to create your local `.env.local`:

```bash
cp .env.example .env.local
```

### Available Environment Variables:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Base canonical domain for SEO & JSON-LD | `http://localhost:3000` |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense Publisher ID (leave blank in dev) | `ca-pub-XXXXXXXXXXXXXXXX` |
| `NEXT_PUBLIC_ADSENSE_SLOT_HEADER` | Header ad slot ID from AdSense dashboard | `1234567890` |
| `NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT` | In-content ad slot ID | `1234567891` |
| `NEXT_PUBLIC_ADSENSE_SLOT_FOOTER` | Footer ad slot ID | `1234567892` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional Google Analytics 4 Measurement ID | `G-XXXXXXXXXX` |

*Note: In local development, if `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is left blank, ad slots are safely omitted without layout shift or console errors.*

---

## 5. Running the Application

### Development Server
Start the development server with live reload:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Type Checking
Run strict TypeScript verification:
```bash
npm run typecheck
```

### Running Tests
Execute the unit and integration test suite:
```bash
npm test
```

### Production Build
Generate an optimized, production-ready static build:
```bash
npm run build
```

### Serving Production Build Locally
Run the built application locally:
```bash
npm run start
```

---

## 6. Troubleshooting Common Issues

### EPERM / Lockfile warning on Windows
If running on Windows in an isolated sandbox and you see an EPERM warning, clear the `.next` directory and re-run:
```powershell
if (Test-Path .next) { Remove-Item -Recurse -Force .next }; npm run build
```

### Port 3000 already in use
Specify an alternate port:
```bash
PORT=3001 npm run dev
```
