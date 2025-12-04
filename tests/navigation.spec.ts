import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000);
  });

  test('should load homepage with navigation', async ({ page }) => {
    // Check basic elements exist
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.nav')).toBeVisible();
  });

  test('should navigate between sections', async ({ page }) => {
    // Test basic navigation works
    await page.click('a[href="#menu"]');
    await expect(page.locator('#menu')).toBeVisible();
    
    await page.click('a[href="#home"]');
    await expect(page.locator('#home')).toBeVisible();
  });
});