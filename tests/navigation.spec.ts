import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for splash screen to fade out
    await page.waitForTimeout(4000);
  });

  test('should load the homepage and display main elements', async ({ page }) => {
    // Check if main navigation elements are present
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.logo h1')).toContainText('BISCOIDINO');
    await expect(page.locator('.nav')).toBeVisible();
    
    // Check if all navigation links are present
    await expect(page.locator('a[href="#home"]')).toBeVisible();
    await expect(page.locator('a[href="#menu"]')).toBeVisible();
    await expect(page.locator('a[href="#about"]')).toBeVisible();
    await expect(page.locator('a[href="#gallery"]')).toBeVisible();
    await expect(page.locator('a[href="#contact"]')).toBeVisible();
  });

  test('should navigate between sections correctly', async ({ page }) => {
    // Navigate to Menu section
    await page.click('a[href="#menu"]');
    await expect(page.locator('#menu')).toBeVisible();
    await expect(page.locator('.menu-section h2')).toContainText('CARDÁPIO');
    
    // Navigate to About section
    await page.click('a[href="#about"]');
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('.about-section h2')).toBeVisible();
    
    // Navigate to Gallery section
    await page.click('a[href="#gallery"]');
    await expect(page.locator('#gallery')).toBeVisible();
    await expect(page.locator('.gallery-section h2')).toContainText('GALERIA');
    
    // Navigate to Contact section
    await page.click('a[href="#contact"]');
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('.contact-section h2')).toContainText('CONTATOS');
    
    // Navigate back to Home
    await page.click('a[href="#home"]');
    await expect(page.locator('#home')).toBeVisible();
    await expect(page.locator('.home-section')).toBeVisible();
  });

  test('should highlight active navigation link', async ({ page }) => {
    // Initially home should be active
    await expect(page.locator('a[href="#home"]')).toHaveClass(/active/);
    
    // Click menu and check if it becomes active
    await page.click('a[href="#menu"]');
    await expect(page.locator('a[href="#menu"]')).toHaveClass(/active/);
    await expect(page.locator('a[href="#home"]')).not.toHaveClass(/active/);
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if navigation is responsive
    await expect(page.locator('.nav')).toBeVisible();
    const navLinkCount = await page.locator('.nav-link').count();
    expect(navLinkCount).toBeGreaterThan(0);
    
    // Test navigation on mobile
    await page.click('a[href="#menu"]');
    await expect(page.locator('#menu')).toBeVisible();
  });
});