import { test, expect } from '@playwright/test';

test.describe('ToolBox Application Flow', () => {
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

  test('category navigation renders category landing page', async ({ page }) => {
    await page.goto('/category/text');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Text Utilities');
    await expect(page.getByText('8 Tools Available')).toBeVisible();
    await expect(page.getByRole('link', { name: /word counter/i })).toBeVisible();
  });

  test('individual tool page renders interactive workspace and SEO breadcrumbs', async ({ page }) => {
    await page.goto('/tools/text/word-counter');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Word Counter');
    await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toBeVisible();

    // Type into textarea and verify live metric update
    const textarea = page.getByRole('textbox', { name: /text editor for word counting/i });
    await textarea.fill('Testing Playwright on ToolBox application.');

    // 5 words
    await expect(page.getByText('5', { exact: true })).toBeVisible();
  });

  test('calculator tool computes loan EMI correctly', async ({ page }) => {
    await page.goto('/tools/calculators/emi-calculator');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('EMI Calculator (Loan Calculator)');
    await expect(page.getByText('Monthly EMI Payment')).toBeVisible();
    await expect(page.getByText('$2,177.77')).toBeVisible();
  });
});
