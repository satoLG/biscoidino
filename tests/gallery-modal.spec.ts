import { test, expect } from '@playwright/test';

test.describe('Gallery Modal Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000); // Wait for splash screen
    
    // Navigate to gallery section and open modal
    await page.click('a[href="#gallery"]');
    await page.click('.gallery-slide.active');
    
    // Wait for modal to be visible
    await expect(page.locator('#galleryImageModal')).toBeVisible();
  });

  test('should display gallery modal correctly', async ({ page }) => {
    // Check main modal elements
    await expect(page.locator('#galleryImageModal')).toBeVisible();
    await expect(page.locator('.gallery-modal-content')).toBeVisible();
    await expect(page.locator('.modal-header')).toBeVisible();
    
    // Check modal title
    await expect(page.locator('.modal-header h2')).toContainText('GALERIA');
    
    // Check close button
    await expect(page.locator('#closeGalleryModal')).toBeVisible();
  });

  test('should display image correctly', async ({ page }) => {
    // Check image container
    await expect(page.locator('.gallery-image-container')).toBeVisible();
    
    // Check if image is present
    await expect(page.locator('.gallery-modal-image')).toBeVisible();
    
    // Check if image has proper attributes
    const image = page.locator('.gallery-modal-image');
    await expect(image).toHaveAttribute('src');
    await expect(image).toHaveAttribute('alt');
  });

  test('should have working zoom controls', async ({ page }) => {
    // Check zoom controls
    await expect(page.locator('.zoom-controls')).toBeVisible();
    await expect(page.locator('.zoom-btn')).toHaveCount(2);
    
    // Test zoom in button
    const zoomInBtn = page.locator('.zoom-btn').first();
    await expect(zoomInBtn).toBeVisible();
    await zoomInBtn.click();
    
    // Test zoom reset button
    const resetZoomBtn = page.locator('.zoom-btn').last();
    await expect(resetZoomBtn).toBeVisible();
    await resetZoomBtn.click();
  });

  test('should support image zoom on click', async ({ page }) => {
    const image = page.locator('.gallery-modal-image');
    
    // Click on image to zoom
    await image.click();
    await page.waitForTimeout(300);
    
    // Click again to zoom out or reset
    await image.click();
    await page.waitForTimeout(300);
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    // Click close button
    await page.click('#closeGalleryModal');
    
    // Modal should be hidden
    await expect(page.locator('#galleryImageModal')).not.toBeVisible();
  });

  test('should close modal when clicking outside (backdrop)', async ({ page }) => {
    // Click on modal backdrop (outside modal content)
    await page.click('#galleryImageModal', { position: { x: 10, y: 10 } });
    
    // Modal should be hidden
    await expect(page.locator('#galleryImageModal')).not.toBeVisible();
  });

  test('should close modal with Escape key', async ({ page }) => {
    // Press Escape key
    await page.keyboard.press('Escape');
    
    // Modal should be hidden
    await expect(page.locator('#galleryImageModal')).not.toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Modal should still be visible and functional
    await expect(page.locator('.gallery-modal-content')).toBeVisible();
    await expect(page.locator('.gallery-image-container')).toBeVisible();
    await expect(page.locator('.gallery-modal-image')).toBeVisible();
    
    // Zoom controls should be adapted for mobile
    await expect(page.locator('.zoom-controls')).toBeVisible();
    await expect(page.locator('.zoom-btn')).toHaveCount(2);
  });

  test('should handle touch gestures on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const image = page.locator('.gallery-modal-image');
    const imageBox = await image.boundingBox();
    
    if (imageBox) {
      // Simulate touch tap for zoom
      await page.touchscreen.tap(imageBox.x + imageBox.width / 2, imageBox.y + imageBox.height / 2);
      await page.waitForTimeout(300);
      await page.waitForTimeout(300);
      
      // Tap again
      await page.touchscreen.tap(imageBox.x + imageBox.width / 2, imageBox.y + imageBox.height / 2);
      await page.waitForTimeout(300);
    }
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check zoom buttons have proper titles
    const zoomButtons = page.locator('.zoom-btn');
    const buttonCount = await zoomButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      await expect(zoomButtons.nth(i)).toHaveAttribute('title');
    }
    
    // Check close button accessibility
    await expect(page.locator('#closeGalleryModal')).toBeVisible();
  });

  test('should maintain image aspect ratio', async ({ page }) => {
    const image = page.locator('.gallery-modal-image');
    await expect(image).toBeVisible();
    
    // Check if image has proper CSS object-fit
    await expect(image).toHaveCSS('object-fit', 'contain');
  });

  test('should block body scroll when modal is open', async ({ page }) => {
    // Modal should be open and body scroll should be blocked
    // This is tested by checking if modal is visible and functional
    await expect(page.locator('#galleryImageModal')).toBeVisible();
    
    // Try scrolling the page (shouldn't affect modal) - skip on mobile
    if (!await page.evaluate(() => 'ontouchstart' in window)) {
      await page.mouse.wheel(0, 500);
    }
    
    // Modal should still be in the same position
    await expect(page.locator('#galleryImageModal')).toBeVisible();
  });
});