import { test, expect } from '@playwright/test';

test.describe('Home Section Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000); // Wait for splash screen
  });

  test('should display home section content correctly', async ({ page }) => {
    // Check home section is visible and active
    await expect(page.locator('#home')).toBeVisible();
    await expect(page.locator('.home-section')).toHaveClass(/active/);
    
    // Check main content
    await expect(page.locator('.home-content h2')).toContainText('OLÁ');
    await expect(page.locator('.home-content p')).toContainText('biscoitos amanteigados caseiros');
    await expect(page.locator('.cta-button')).toBeVisible();
  });

  test('should load physics canvas', async ({ page }) => {
    // Check if physics canvas is present
    await expect(page.locator('#homePhysicsCanvas')).toBeVisible();
    
    // Check if canvas has correct attributes
    const canvas = page.locator('#homePhysicsCanvas');
    await expect(canvas).toHaveAttribute('id', 'homePhysicsCanvas');
  });

  test('CTA button should navigate to menu section', async ({ page }) => {
    // Click CTA button
    await page.click('.cta-button');
    
    // Should navigate to menu section
    await expect(page.locator('#menu')).toBeVisible();
    await expect(page.locator('.menu-section')).toBeVisible();
    await expect(page.locator('a[href="#menu"]')).toHaveClass(/active/);
  });

  test('should display floating biscuits on larger screens', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Check if home image container is visible
    await expect(page.locator('.home-image')).toBeVisible();
    await expect(page.locator('#homeImageContainer')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if content is still visible and properly arranged
    await expect(page.locator('.home-content')).toBeVisible();
    await expect(page.locator('.home-content h2')).toBeVisible();
    await expect(page.locator('.cta-button')).toBeVisible();
  });

  test('should have correct styling and layout', async ({ page }) => {
    // Check if home section has correct styling
    const homeSection = page.locator('.home-section');
    await expect(homeSection).toBeVisible();
    
    // Check layout elements
    await expect(page.locator('.home-content')).toBeVisible();
    await expect(page.locator('.home-image')).toBeVisible();
  });
});