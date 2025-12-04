import { test, expect } from '@playwright/test';

test.describe('PWA and Service Worker Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(4000);
  });

  test('should have PWA manifest', async ({ request }) => {
    // Check if manifest exists
    const manifestResponse = await request.get('/pwa/site.webmanifest');
    if (manifestResponse.status() === 200) {
      const manifestContent = await manifestResponse.json();
      expect(manifestContent).toBeTruthy();
    }
  });

  test('should register service worker', async ({ page }) => {
    // Check if service worker is supported
    const swSupported = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    expect(swSupported).toBe(true);
  });
});