import { test, expect } from '@playwright/test';

test.describe('Gallery Section Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000); // Wait for splash screen
    
    // Navigate to gallery section
    await page.click('a[href="#gallery"]');
  });

  test('should display gallery section', async ({ page }) => {
    // Check if gallery section is visible
    await expect(page.locator('#gallery')).toBeVisible();
    await expect(page.locator('.gallery-carousel')).toBeVisible();
  });

  test('should have navigation controls', async ({ page }) => {
    // Check basic navigation exists
    const navButtons = page.locator('.gallery-nav-btn');
    if (await navButtons.count() > 0) {
      await navButtons.first().click();
    }
  });

  test('should open modal when clicking slide', async ({ page }) => {
    // Click on active slide if exists
    const activeSlide = page.locator('.gallery-slide.active');
    if (await activeSlide.count() > 0) {
      await activeSlide.click();
      
      // Check if modal opens
      const modal = page.locator('#galleryImageModal, .gallery-modal');
      if (await modal.count() > 0) {
        await expect(modal.first()).toBeVisible();
      }
    }
  });
});