import { test, expect, Page } from '@playwright/test';
import { API_URL } from '../playwright.config';

const API_PRODUCTS = [
  { id: '11111111-1111-1111-1111-111111111111', slug: 'baunilha', name: 'Baunilha', price_cents: 1500 },
  { id: '22222222-2222-2222-2222-222222222222', slug: 'parmesao', name: 'Parmesão', price_cents: 1800 },
];

async function openMenu(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(4000); // splash
  await page.click('a[href="#menu"]');
}

function addButton(page: Page, slug: string) {
  return page.locator(`.menu-item[data-slug="${slug}"] .add-to-cart`);
}

test.describe('Carrinho', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${API_URL}/products`, (route) => route.fulfill({ json: API_PRODUCTS }));
  });

  test('adiciona, soma subtotal e sobrevive ao recarregar', async ({ page }) => {
    await openMenu(page);
    await expect(page.locator('#cart-button')).toBeHidden();

    await addButton(page, 'baunilha').click();
    await addButton(page, 'baunilha').click();
    await addButton(page, 'parmesao').click();
    await expect(page.locator('#cart-button .cart-count')).toHaveText('3');

    await page.locator('#cart-button').click();
    await expect(page.locator('.cart-subtotal strong')).toHaveText('R$ 48,00');
    await expect(page.locator('.cart-whatsapp')).toHaveAttribute('href', /2x%20BAUNILHA/);

    await page.reload();
    await page.waitForTimeout(4000);
    await expect(page.locator('#cart-button .cart-count')).toHaveText('3');
  });

  test('altera quantidade e remove', async ({ page }) => {
    await openMenu(page);
    await addButton(page, 'baunilha').click();
    await page.locator('#cart-button').click();

    const line = page.locator('.cart-line[data-slug="baunilha"]');
    await line.locator('[data-action="inc"]').click();
    await expect(line.locator('.cart-qty-value')).toHaveText('2');
    await line.locator('[data-action="dec"]').click();
    await expect(line.locator('.cart-qty-value')).toHaveText('1');
    await line.locator('[data-action="remove"]').click();
    await expect(page.locator('.cart-empty')).toBeVisible();
    await expect(page.locator('#cart-button')).toBeHidden();
  });

  test('limite de 20 pacotes', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('biscoidino-cart', '{"baunilha":20}'));
    await openMenu(page);
    await addButton(page, 'parmesao').click();
    await expect(page.locator('.cart-toast')).toHaveText('Máximo de 20 pacotes por pedido');
    await expect(page.locator('#cart-button .cart-count')).toHaveText('20');
  });

  test('item inativo na API aparece como indisponível', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('biscoidino-cart', '{"cafe_cacau":1}'));
    await openMenu(page);
    await page.locator('#cart-button').click();
    await expect(page.locator('.cart-line[data-slug="cafe_cacau"]')).toHaveClass(/unavailable/);
    await expect(page.locator('.cart-warning')).toBeVisible();
    await expect(addButton(page, 'cafe_cacau')).toBeHidden();
  });
});
