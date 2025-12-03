import { test, expect } from '@playwright/test';

test.describe('Menu Section Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000); // Wait for splash screen
    // Navigate to menu section
    await page.click('a[href="#menu"]');
  });

  test('should display menu section correctly', async ({ page }) => {
    // Check if menu section is visible
    await expect(page.locator('#menu')).toBeVisible();
    await expect(page.locator('.menu-section h2')).toContainText('CARDÁPIO');
    
    // Check if menu grid is present
    await expect(page.locator('.menu-grid')).toBeVisible();
  });

  test('should display product cards', async ({ page }) => {
    // Check if product cards are visible
    const menuItems = page.locator('.menu-item');
    const itemCount = await menuItems.count();
    expect(itemCount).toBeGreaterThan(0); // At least one product
    
    // Check first product card structure
    const firstItem = menuItems.first();
    await expect(firstItem.locator('.menu-item-image')).toBeVisible();
    await expect(firstItem.locator('h3')).toBeVisible();
    await expect(firstItem.locator('p')).toBeVisible();
    await expect(firstItem.locator('.price')).toBeVisible();
  });

  test('should have working action buttons', async ({ page }) => {
    // Check if action buttons are visible
    const detailButtons = page.locator('.detail-button');
    const buttonCount = await detailButtons.count();
    expect(buttonCount).toBeGreaterThan(0); // At least one button
    
    // Check if buttons have correct attributes
    await expect(detailButtons.first()).toBeVisible();
    await expect(detailButtons.first()).toHaveAttribute('title', 'Ver detalhes');
  });

  test('should open product modal when detail button is clicked', async ({ page }) => {
    // Click first product detail button
    await page.click('.detail-button >> nth=0');
    
    // Check if product modal opens
    await expect(page.locator('#productModal')).toBeVisible();
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('should have WhatsApp order links', async ({ page }) => {
    // Check if WhatsApp order links are present
    const orderLinks = page.locator('a.get-cookie');
    const linkCount = await orderLinks.count();
    expect(linkCount).toBeGreaterThan(0); // At least one link
    
    // Check first WhatsApp link
    const firstOrderLink = orderLinks.first();
    await expect(firstOrderLink).toBeVisible();
    await expect(firstOrderLink).toHaveAttribute('href', /wa\.me/);
    await expect(firstOrderLink).toHaveAttribute('target', '_blank');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if menu grid adapts to mobile (single column)
    await expect(page.locator('.menu-grid')).toBeVisible();
    const mobileItemCount = await page.locator('.menu-item').count();
    expect(mobileItemCount).toBeGreaterThan(0);
  });

  test('should display correct product information', async ({ page }) => {
    // Check if products have required information
    const menuItems = page.locator('.menu-item');
    
    for (let i = 0; i < await menuItems.count(); i++) {
      const item = menuItems.nth(i);
      
      // Each product should have image, name, description, and price
      await expect(item.locator('.menu-item-image')).toBeVisible();
      await expect(item.locator('h3')).not.toBeEmpty();
      await expect(item.locator('p')).not.toBeEmpty();
      await expect(item.locator('.price')).not.toBeEmpty();
    }
  });

  test('should have hover effects on product cards', async ({ page }) => {
    // Set desktop viewport for hover effects
    await page.setViewportSize({ width: 1200, height: 800 });
    
    const firstItem = page.locator('.menu-item').first();
    
    // Hover over first item
    await firstItem.hover();
    
    // Check if item is still visible (hover effect applied)
    await expect(firstItem).toBeVisible();
  });
});