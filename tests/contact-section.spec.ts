import { test, expect } from '@playwright/test';

test.describe('Contact Section Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000); // Wait for splash screen
    
    // Navigate to contact section
    await page.click('a[href="#contact"]');
  });

  test('should display contact section correctly', async ({ page }) => {
    // Check if contact section is visible
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('.contact-section h2')).toContainText('CONTATOS');
    
    // Check contact info container
    await expect(page.locator('.contact-info')).toBeVisible();
  });

  test('should display WhatsApp contact link', async ({ page }) => {
    // Check WhatsApp link
    const whatsappLink = page.locator('a[href*="wa.me"]').first();
    await expect(whatsappLink).toBeVisible();
    await expect(whatsappLink).toHaveAttribute('target', '_blank');
    
    // Check link text content
    await expect(whatsappLink).toContainText('WhatsApp');
    
    // Check if link has proper styling
    await expect(whatsappLink).toHaveClass(/contact-link/);
  });

  test('should display location/maps link', async ({ page }) => {
    // Check for location link (if present)
    const locationLink = page.locator('.contact-link.location');
    
    if (await locationLink.count() > 0) {
      await expect(locationLink).toBeVisible();
      await expect(locationLink).toHaveAttribute('target', '_blank');
    }
  });

  test('should have working contact icons', async ({ page }) => {
    // Check if contact icons are present
    const contactIcons = page.locator('.contact-icon');
    const iconCount = await contactIcons.count();
    
    if (iconCount > 0) {
      await expect(contactIcons.first()).toBeVisible();
    }
    
    // Check SVG icons in contact links
    const svgIcons = page.locator('.contact-link svg');
    const svgCount = await svgIcons.count();
    
    if (svgCount > 0) {
      await expect(svgIcons.first()).toBeVisible();
    }
  });

  test('WhatsApp link should have correct URL format', async ({ page }) => {
    const whatsappLink = page.locator('a[href*="wa.me"]').first();
    
    // Get the href attribute
    const href = await whatsappLink.getAttribute('href');
    
    // Check if it follows WhatsApp URL format
    expect(href).toMatch(/https:\/\/wa\.me\/\d+/);
    
    // Should include text parameter for pre-filled message
    expect(href).toContain('text=');
  });

  test('should have proper hover effects', async ({ page }) => {
    // Set desktop viewport for hover testing
    await page.setViewportSize({ width: 1200, height: 800 });
    
    const contactLinks = page.locator('.contact-link');
    const linkCount = await contactLinks.count();
    
    if (linkCount > 0) {
      // Hover over first contact link
      await contactLinks.first().hover();
      
      // Link should still be visible (hover effect applied)
      await expect(contactLinks.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Contact section should adapt to mobile
    await expect(page.locator('.contact-section')).toBeVisible();
    await expect(page.locator('.contact-info')).toBeVisible();
    
    // Contact links should still be functional
    const contactLinks = page.locator('.contact-link');
    const linkCount = await contactLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      await expect(contactLinks.nth(i)).toBeVisible();
    }
  });

  test('should open WhatsApp in new tab when clicked', async ({ page }) => {
    // Listen for new page/tab opening
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.locator('a[href*="wa.me"]').first().click()
    ]);
    
    // Check if new page opened with WhatsApp URL
    await expect(newPage.url()).toMatch(/wa\.me/);
    
    // Close the new page
    await newPage.close();
  });

  test('should have accessible contact information', async ({ page }) => {
    // Check if contact links have proper text content
    const contactLinks = page.locator('.contact-link');
    const linkCount = await contactLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = contactLinks.nth(i);
      
      // Each link should have visible text
      const textContent = await link.textContent();
      expect(textContent).toBeTruthy();
      expect(textContent!.trim()).not.toBe('');
    }
  });

  test('should maintain contact info layout', async ({ page }) => {
    // Check contact info structure
    await expect(page.locator('.contact-info')).toHaveCSS('text-align', 'center');
    
    // Contact links should be properly spaced
    const contactLinks = page.locator('.contact-link');
    const linkCount = await contactLinks.count();
    
    if (linkCount > 0) {
      // Each link should be visible and properly styled
      for (let i = 0; i < linkCount; i++) {
        await expect(contactLinks.nth(i)).toBeVisible();
      }
    }
  });

  test('should handle contact section navigation correctly', async ({ page }) => {
    // Verify we're in contact section
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('a[href="#contact"]')).toHaveClass(/active/);
    
    // Navigate away and back
    await page.click('a[href="#home"]');
    await expect(page.locator('#home')).toBeVisible();
    
    // Navigate back to contact
    await page.click('a[href="#contact"]');
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('a[href="#contact"]')).toHaveClass(/active/);
  });
});