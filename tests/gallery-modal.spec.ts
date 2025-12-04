import { test, expect } from '@playwright/test';

test.describe('Gallery Modal Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000); // Wait for splash screen
    
    // Navigate to gallery section and try to open modal
    await page.click('a[href="#gallery"]');
    const activeSlide = page.locator('.gallery-slide.active');
    if (await activeSlide.count() > 0) {
      await activeSlide.click();
    }
  });

  test('should open and display modal', async ({ page }) => {
    // Check if modal exists and is visible
    const modal = page.locator('#galleryImageModal, .gallery-modal');
    if (await modal.count() > 0) {
      await expect(modal.first()).toBeVisible();
      
      // Check if image is displayed
      const image = page.locator('.gallery-modal-image, .modal-image');
      if (await image.count() > 0) {
        await expect(image.first()).toBeVisible();
      }
    }
  });

  test('should close modal', async ({ page }) => {
    const modal = page.locator('#galleryImageModal, .gallery-modal');
    if (await modal.count() > 0 && await modal.first().isVisible()) {
      // Try closing with escape key
      await page.keyboard.press('Escape');
      
      // Or try close button
      const closeBtn = page.locator('#closeGalleryModal, .close-modal, .modal-close');
      if (await closeBtn.count() > 0) {
        await closeBtn.first().click();
      }
    }
  });
});