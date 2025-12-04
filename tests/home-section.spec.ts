import { test, expect } from '@playwright/test';

test.describe('Home Section Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000); // Wait for splash screen
  });

  test('should display home section and main content', async ({ page }) => {
    // Check home section exists and is visible
    await expect(page.locator('#home')).toBeVisible();
    await expect(page.locator('.home-content')).toBeVisible();
    
    // Check essential content exists
    await expect(page.locator('.home-content h2')).toBeVisible();
    await expect(page.locator('.cta-button')).toBeVisible();
  });

  test('CTA button should work', async ({ page }) => {
    // Click CTA button and verify navigation works
    await page.click('.cta-button');
    await expect(page.locator('#menu')).toBeVisible();
  });
});