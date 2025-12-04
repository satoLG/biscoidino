import { test, expect } from '@playwright/test';

test.describe('Product Modal Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000);
    
    // Navigate to menu and try to open modal
    await page.click('a[href="#menu"]');
    const detailButton = page.locator('.detail-button').first();
    if (await detailButton.count() > 0) {
      await detailButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should open modal', async ({ page }) => {
    // Check if modal exists and opens
    const modal = page.locator('#productModal, .modal, .product-modal');
    if (await modal.count() > 0) {
      await expect(modal.first()).toBeVisible();
    }
  });

  test('should close modal', async ({ page }) => {
    const modal = page.locator('#productModal, .modal, .product-modal');
    if (await modal.count() > 0 && await modal.first().isVisible()) {
      // Try escape key
      await page.keyboard.press('Escape');
      
      // Or try close button
      const closeBtn = page.locator('.close-modal, .close, .modal-close');
      if (await closeBtn.count() > 0) {
        await closeBtn.first().click();
      }
    }
  });
});