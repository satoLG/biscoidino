import { test, expect } from '@playwright/test';

test.describe('Gallery Section Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000); // Wait for splash screen
    
    // Navigate to gallery section
    await page.click('a[href="#gallery"]');
  });

  test('should display gallery section correctly', async ({ page }) => {
    // Check if gallery section is visible
    await expect(page.locator('#gallery')).toBeVisible();
    await expect(page.locator('.gallery-section h2')).toContainText('GALERIA');
    await expect(page.locator('.gallery-subtitle')).toBeVisible();
  });

  test('should display gallery carousel', async ({ page }) => {
    // Check carousel structure
    await expect(page.locator('.gallery-carousel-container')).toBeVisible();
    await expect(page.locator('.gallery-carousel')).toBeVisible();
    await expect(page.locator('.gallery-slides-container')).toBeVisible();
    
    // Check if slides are present
    const slides = page.locator('.gallery-slide');
    const slideCount = await slides.count();
    expect(slideCount).toBeGreaterThan(0);
    
    // Check if at least one slide is active
    await expect(page.locator('.gallery-slide.active')).toHaveCount(1);
  });

  test('should have working navigation buttons', async ({ page }) => {
    // Check navigation buttons
    await expect(page.locator('.gallery-nav-btn.prev')).toBeVisible();
    await expect(page.locator('.gallery-nav-btn.next')).toBeVisible();
    
    // Test navigation (should be clickable)
    await page.click('.gallery-nav-btn.next');
    await page.waitForTimeout(600); // Wait for animation
    
    await page.click('.gallery-nav-btn.prev');
    await page.waitForTimeout(600);
  });

  test('should have working gallery indicators', async ({ page }) => {
    // Check if indicators are present
    await expect(page.locator('.gallery-indicators')).toBeVisible();
    const indicators = page.locator('.gallery-indicator');
    const indicatorCountDesktop = await indicators.count();
    expect(indicatorCountDesktop).toBeGreaterThan(0);
    
    // Check if one indicator is active
    await expect(page.locator('.gallery-indicator.active')).toHaveCount(1);
    
    // Click on different indicator
    const indicatorCount = await indicators.count();
    if (indicatorCount > 1) {
      await indicators.nth(1).click();
      await page.waitForTimeout(600); // Wait for animation
      await expect(indicators.nth(1)).toHaveClass(/active/);
    }
  });

  test('should open gallery modal when clicking on active slide', async ({ page }) => {
    // Click on the active slide
    await page.click('.gallery-slide.active');
    
    // Check if gallery modal opens
    await expect(page.locator('#galleryImageModal')).toBeVisible();
    await expect(page.locator('.gallery-modal-content')).toBeVisible();
  });

  test('should support drag/swipe navigation', async ({ page }) => {
    // Set desktop viewport for better drag testing
    await page.setViewportSize({ width: 1200, height: 800 });
    
    const slidesContainer = page.locator('.gallery-slides-container');
    await expect(slidesContainer).toBeVisible();
    
    // Get bounding box for drag simulation
    const box = await slidesContainer.boundingBox();
    if (box) {
      // Simulate drag from right to left (next slide)
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2);
      await page.mouse.up();
      
      await page.waitForTimeout(600); // Wait for animation
    }
  });

  test('should display slide overlays with text', async ({ page }) => {
    // Check if slide overlays are present
    const activeSlide = page.locator('.gallery-slide.active');
    await expect(activeSlide).toBeVisible();
    
    // Check overlay content (if present)
    const overlay = activeSlide.locator('.gallery-slide-overlay');
    if (await overlay.count() > 0) {
      await expect(overlay).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Gallery should adapt to mobile
    await expect(page.locator('.gallery-carousel')).toBeVisible();
    await expect(page.locator('.gallery-slide.active')).toBeVisible();
    
    // Navigation should still work
    await expect(page.locator('.gallery-nav-btn')).toHaveCount(2);
    
    // Test swipe on mobile
    const slidesContainer = page.locator('.gallery-slides-container');
    const box = await slidesContainer.boundingBox();
    if (box) {
      // Simulate touch interaction
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(300);
    }
  });

  test('should handle edge cases correctly', async ({ page }) => {
    // Test navigation at boundaries
    const indicators = page.locator('.gallery-indicator');
    const indicatorCount = await indicators.count();
    
    if (indicatorCount > 1) {
      // Go to last slide
      await indicators.last().click();
      await page.waitForTimeout(600);
      
      // Try to go next (should loop to first or stay)
      await page.click('.gallery-nav-btn.next');
      await page.waitForTimeout(600);
      
      // Go to first slide
      await indicators.first().click();
      await page.waitForTimeout(600);
      
      // Try to go previous (should loop to last or stay)
      await page.click('.gallery-nav-btn.prev');
      await page.waitForTimeout(600);
    }
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check navigation buttons have proper titles
    await expect(page.locator('.gallery-nav-btn.prev')).toHaveAttribute('title', 'Imagem anterior');
    await expect(page.locator('.gallery-nav-btn.next')).toHaveAttribute('title', 'Próxima imagem');
    
    // Check if images have alt attributes (if present)
    const images = page.locator('.gallery-slide img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      await expect(images.nth(i)).toHaveAttribute('alt');
    }
  });
});