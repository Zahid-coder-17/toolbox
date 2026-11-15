// scripts/test-localhost.mjs
// Comprehensive automated localhost HTTP & integration verification

const BASE_URL = 'http://localhost:3000';

const routesToTest = [
  { path: '/', name: 'Homepage' },
  { path: '/category/text', name: 'Text Category Hub' },
  { path: '/category/image', name: 'Image Category Hub' },
  { path: '/category/pdf', name: 'PDF Category Hub' },
  { path: '/category/calculators', name: 'Calculators Category Hub' },
  { path: '/tools/text/word-counter', name: 'Word Counter Tool' },
  { path: '/tools/text/character-counter', name: 'Character Counter Tool' },
  { path: '/tools/text/case-converter', name: 'Case Converter Tool' },
  { path: '/tools/text/json-formatter', name: 'JSON Formatter Tool' },
  { path: '/tools/text/base64-encoder-decoder', name: 'Base64 Tool' },
  { path: '/tools/text/text-diff-checker', name: 'Text Diff Tool' },
  { path: '/tools/text/slug-generator', name: 'Slug Generator Tool' },
  { path: '/tools/text/uuid-generator', name: 'UUID Generator Tool' },
  { path: '/tools/image/image-compressor', name: 'Image Compressor Tool' },
  { path: '/tools/image/qr-code-generator', name: 'QR Code Generator Tool' },
  { path: '/tools/pdf/pdf-merger', name: 'PDF Merger Tool' },
  { path: '/tools/calculators/emi-calculator', name: 'EMI Calculator Tool' },
  { path: '/tools/calculators/age-calculator', name: 'Age Calculator Tool' },
  { path: '/tools/calculators/percentage-calculator', name: 'Percentage Calculator Tool' },
  { path: '/tools/calculators/compound-interest-calculator', name: 'Compound Interest Calculator Tool' },
  { path: '/privacy', name: 'Privacy Policy' },
  { path: '/terms', name: 'Terms of Service' },
  { path: '/disclaimer', name: 'Disclaimer' },
  { path: '/contact', name: 'Contact' },
  { path: '/sitemap.xml', name: 'Dynamic Sitemap' },
  { path: '/robots.txt', name: 'Robots.txt' },
  { path: '/api/health', name: 'Health Check API' },
];

async function runLocalhostTests() {
  console.log(`Starting Localhost Verification against ${BASE_URL}...\n`);
  let passed = 0;
  let failed = 0;

  for (const route of routesToTest) {
    const url = `${BASE_URL}${route.path}`;
    try {
      const startTime = performance.now();
      const res = await fetch(url, { headers: { 'User-Agent': 'ToolBox-Integration-Tester/1.0' } });
      const duration = Math.round(performance.now() - startTime);

      if (res.status === 200) {
        console.log(`[PASS] ${res.status} (${duration}ms) - ${route.name.padEnd(35)} -> ${route.path}`);
        passed++;
      } else {
        console.error(`[FAIL] ${res.status} (${duration}ms) - ${route.name.padEnd(35)} -> ${route.path}`);
        failed++;
      }

      // Verify essential security headers on pages
      if (route.path === '/') {
        const hsts = res.headers.get('strict-transport-security');
        const xfo = res.headers.get('x-frame-options');
        const xcto = res.headers.get('x-content-type-options');
        if (hsts && xfo && xcto) {
          console.log(`  Security Headers verified: HSTS="${hsts}", X-Frame-Options="${xfo}", X-Content-Type-Options="${xcto}"`);
        } else {
          console.warn(`  Warning: Missing expected security headers on homepage.`);
        }
      }

      if (route.path === '/api/health') {
        const json = await res.json();
        console.log(`  Health API response payload: status="${json.status}", uptime=${json.uptime}s, activeTools=${json.toolsActive}`);
      }
    } catch (err) {
      console.error(`[ERROR] Connection failed for ${route.name} (${url}):`, err.message);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Verification Complete: ${passed} passed, ${failed} failed out of ${routesToTest.length} routes.`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runLocalhostTests();
