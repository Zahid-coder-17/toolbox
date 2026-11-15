import { test, expect } from '@playwright/test';

test.describe('ToolBox Application E2E Test Suite', () => {
  test('home page renders with 24 tools and hero branding', async ({ page }) => {
    await page.goto('/');

    // Check title & branding
    await expect(page).toHaveTitle(/ToolBox/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Smart, Fast & Private');

    // Check 24 tools available
    await expect(page.getByText('All Tools (24)')).toBeVisible();
    await expect(page.getByText('Showing 24 tools')).toBeVisible();
  });

  test('quick search modal filters tools interactively', async ({ page }) => {
    await page.goto('/');

    // Open quick search modal
    const searchTrigger = page.getByRole('button', { name: /search tools/i });
    await searchTrigger.click();

    // Type query
    const searchInput = page.getByPlaceholder(/search 24 tools/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('diff');

    // Should show Text Diff Checker
    await expect(page.getByRole('link', { name: /text diff checker/i })).toBeVisible();
  });

  test('category navigation across all 4 hubs', async ({ page }) => {
    // 1. Text
    await page.goto('/category/text');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Text Utilities');
    await expect(page.getByText('8 Tools Available')).toBeVisible();

    // 2. Image
    await page.goto('/category/image');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Image Utilities');
    await expect(page.getByText('8 Tools Available')).toBeVisible();

    // 3. PDF
    await page.goto('/category/pdf');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('PDF Utilities');
    await expect(page.getByText('4 Tools Available')).toBeVisible();

    // 4. Calculators
    await page.goto('/category/calculators');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Calculators');
    await expect(page.getByText('4 Tools Available')).toBeVisible();
  });

  test('individual text tool page renders interactive workspace and updates statistics', async ({ page }) => {
    await page.goto('/tools/text/word-counter');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Word Counter');
    await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toBeVisible();

    // Type into textarea and verify live metric update
    const textarea = page.getByRole('textbox', { name: /text editor for word counting/i });
    await textarea.fill('Testing Playwright on ToolBox application.');

    // 5 words
    await expect(page.getByText('5', { exact: true })).toBeVisible();
  });

  test('calculator tool computes loan EMI correctly with amortization', async ({ page }) => {
    await page.goto('/tools/calculators/emi-calculator');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('EMI Calculator (Loan Calculator)');
    await expect(page.getByText('Monthly EMI Payment')).toBeVisible();
    await expect(page.getByText('$2,177.77')).toBeVisible();
    await expect(page.getByText('Amortization Schedule')).toBeVisible();
  });

  test('percentage calculator solves multiple scenarios', async ({ page }) => {
    await page.goto('/tools/calculators/percentage-calculator');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Percentage Calculator');
    await expect(page.getByText('30.00')).toBeVisible();
  });

  test('legal and trust pages render with valid headings', async ({ page }) => {
    // Privacy
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy Policy');

    // Terms
    await page.goto('/terms');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Terms of Service');

    // Disclaimer
    await page.goto('/disclaimer');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Disclaimer');

    // Contact
    await page.goto('/contact');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contact & Feedback');
  });
});
