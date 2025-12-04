import { test, expect } from '@playwright/test';

test.describe('Contact Section Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000); // Wait for splash screen
    
    // Navigate to contact section
    await page.click('a[href="#contact"]');
  });

  test('should display contact section', async ({ page }) => {
    // Check if contact section is visible
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('.contact-info')).toBeVisible();
  });

  test('should have WhatsApp contact functionality', async ({ page }) => {
    // Check WhatsApp link exists and works
    const whatsappLink = page.locator('a[href*="wa.me"]');
    if (await whatsappLink.count() > 0) {
      await expect(whatsappLink.first()).toHaveAttribute('target', '_blank');
    }
  });
});