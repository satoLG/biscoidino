import { test, expect } from '@playwright/test';
import { API_URL } from '../playwright.config';

const API_PRODUCTS = [
  { id: '11111111-1111-1111-1111-111111111111', slug: 'baunilha', name: 'Baunilha', price_cents: 1800 },
  { id: '22222222-2222-2222-2222-222222222222', slug: 'parmesao', name: 'Parmesão', price_cents: 1500 },
  // cafe_cacau fora da lista = inativo na API
];

async function openMenu(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.waitForTimeout(4000); // splash
  await page.click('a[href="#menu"]');
}

test.describe('Catálogo vindo da API', () => {
  test('usa preço e disponibilidade da API', async ({ page }) => {
    await page.route(`${API_URL}/products`, (route) => route.fulfill({ json: API_PRODUCTS }));
    await openMenu(page);

    await expect(page.locator('.menu-item[data-slug="baunilha"] .price')).toHaveText('R$ 18,00');
    await expect(page.locator('.menu-item[data-slug="parmesao"] .price')).toHaveText('R$ 15,00');
    await expect(page.locator('.menu-item[data-slug="cafe_cacau"]')).toHaveClass(/unavailable/);
  });

  test('API fora: mantém preços locais', async ({ page }) => {
    await page.route(`${API_URL}/**`, (route) => route.fulfill({ status: 503, json: { detail: 'fora' } }));
    await openMenu(page);

    await expect(page.locator('.menu-item[data-slug="baunilha"] .price')).toHaveText('R$ 15,00');
    await expect(page.locator('.menu-item[data-slug="cafe_cacau"]')).not.toHaveClass(/unavailable/);
  });
});
