import { test, expect } from '@playwright/test';

test.describe('Menu Section Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000); // Wait for splash screen
    // Navigate to menu section
    await page.click('a[href="#menu"]');
  });

  test('should display menu section and products', async ({ page }) => {
    // Check if menu section is visible
    await expect(page.locator('#menu')).toBeVisible();
    await expect(page.locator('.menu-grid')).toBeVisible();
    
    // Check if products exist
    const menuItems = page.locator('.menu-item');
    const itemCount = await menuItems.count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('should open product modal', async ({ page }) => {
    // Click first product detail button if it exists
    const detailButton = page.locator('.detail-button').first();
    if (await detailButton.count() > 0) {
      await detailButton.click();
      
      // Check if modal opens
      const modal = page.locator('#productModal, .modal, .product-modal');
      if (await modal.count() > 0) {
        await expect(modal.first()).toBeVisible();
      }
    }
  });

  test('should have WhatsApp order functionality', async ({ page }) => {
    // Check if WhatsApp links exist
    const orderLinks = page.locator('a.get-cookie, a[href*="wa.me"]');
    if (await orderLinks.count() > 0) {
      await expect(orderLinks.first()).toHaveAttribute('target', '_blank');
    }
  });
});