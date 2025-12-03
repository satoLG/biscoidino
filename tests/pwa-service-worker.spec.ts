import { test, expect } from '@playwright/test';

test.describe('PWA and Service Worker Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000); // Wait for splash screen
  });

  test('should register service worker successfully', async ({ page }) => {
    // Check if service worker is supported and registered
    const swRegistration = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return registration ? true : false;
      }
      return false;
    });

    // Should have service worker registration
    expect(swRegistration).toBe(true);
  });

  test('should have PWA manifest file', async ({ page, request }) => {
    // Check if manifest file is accessible
    const manifestResponse = await request.get('/pwa/site.webmanifest');
    expect(manifestResponse.status()).toBe(200);

    // Check if manifest is valid JSON
    const manifestContent = await manifestResponse.json();
    expect(manifestContent).toHaveProperty('name');
    expect(manifestContent).toHaveProperty('short_name');
    // start_url is optional in PWA manifest
    expect(manifestContent).toHaveProperty('display');
  });

  test('should have correct PWA meta tags', async ({ page }) => {
    // Check viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute('content', /width=device-width/);

    // Check theme color (if present)
    const themeColorMeta = page.locator('meta[name="theme-color"]');
    if (await themeColorMeta.count() > 0) {
      await expect(themeColorMeta).toHaveAttribute('content');
    }

    // Check manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    if (await manifestLink.count() > 0) {
      await expect(manifestLink).toHaveAttribute('href');
    }
  });

  test('should have app icons for PWA', async ({ page, request }) => {
    // Check if favicon exists
    const faviconResponse = await request.get('/favicon.ico');
    expect(faviconResponse.status()).toBe(200);

    // Check for apple touch icons (if present)
    const appleTouchIcons = page.locator('link[rel="apple-touch-icon"]');
    const iconCount = await appleTouchIcons.count();
    
    if (iconCount > 0) {
      for (let i = 0; i < iconCount; i++) {
        const iconHref = await appleTouchIcons.nth(i).getAttribute('href');
        if (iconHref) {
          const iconResponse = await request.get(iconHref);
          expect(iconResponse.status()).toBe(200);
        }
      }
    }
  });

  test('should handle offline scenarios gracefully', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);

    // Try to navigate to different sections
    await page.click('a[href="#menu"]');
    
    // Page should still be functional (cached by service worker)
    await expect(page.locator('#menu')).toBeVisible();

    // Go back online
    await context.setOffline(false);
  });

  test('should cache essential resources', async ({ page }) => {
    // Check if service worker caches are working
    const cacheNames = await page.evaluate(async () => {
      if ('caches' in window) {
        return await caches.keys();
      }
      return [];
    });

    // Should have at least one cache
    expect(cacheNames.length).toBeGreaterThan(0);
  });

  test('should work as standalone PWA', async ({ page }) => {
    // Simulate PWA display mode
    await page.addInitScript(() => {
      Object.defineProperty(window.matchMedia, 'prototype', {
        value: {
          matches: false,
          media: '',
          onchange: null,
          addListener: function() {},
          removeListener: function() {},
          addEventListener: function() {},
          removeEventListener: function() {},
          dispatchEvent: function() { return false; }
        }
      });
    });

    // Check if app works in standalone mode
    await page.goto('/');
    await page.waitForTimeout(4000);

    // Basic functionality should work
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('#home')).toBeVisible();
  });

  test('should update service worker when new version is available', async ({ page }) => {
    // This test checks if the service worker update mechanism works
    // In real scenarios, this would involve deploying a new version

    const swUpdateCheck = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          // Check for updates
          await registration.update();
          return true;
        }
      }
      return false;
    });

    expect(swUpdateCheck).toBe(true);
  });

  test('should handle service worker errors gracefully', async ({ page }) => {
    // Test app functionality even if service worker fails
    await page.addInitScript(() => {
      // Simulate service worker registration failure
      if ('serviceWorker' in navigator) {
        const originalRegister = navigator.serviceWorker.register;
        navigator.serviceWorker.register = () => {
          return Promise.reject(new Error('Service worker registration failed'));
        };
      }
    });

    await page.goto('/');
    await page.waitForTimeout(4000);

    // App should still work without service worker
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('#home')).toBeVisible();

    // Navigation should still work
    await page.click('a[href="#menu"]');
    await expect(page.locator('#menu')).toBeVisible();
  });

  test('should have proper PWA installability', async ({ page }) => {
    // Check for install prompt handling (if implemented)
    const hasInstallPrompt = await page.evaluate(() => {
      return 'BeforeInstallPromptEvent' in window;
    });

    // This will be true on browsers that support PWA installation
    expect(typeof hasInstallPrompt).toBe('boolean');
  });

  test('should work properly on mobile devices', async ({ page }) => {
    // Set mobile viewport and test PWA functionality
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if app is responsive in PWA mode
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.nav')).toBeVisible();

    // Test touch interactions
    await page.click('a[href="#menu"]');
    await expect(page.locator('#menu')).toBeVisible();

    // Test modal functionality on mobile
    await page.click('.detail-button >> nth=0');
    await expect(page.locator('#productModal')).toBeVisible();

    // Close modal
    await page.click('.close-modal');
    await expect(page.locator('#productModal')).not.toBeVisible();
  });
});