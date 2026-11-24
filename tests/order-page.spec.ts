import { test, expect, Page } from '@playwright/test';
import { API_URL } from '../playwright.config';

const ORDER_ID = 'aaaaaaaa-0000-4000-8000-000000000001';
const BAUNILHA = '11111111-1111-1111-1111-111111111111';
const API_PRODUCTS = [
  { id: BAUNILHA, slug: 'baunilha', name: 'Baunilha', price_cents: 1500 },
  { id: '22222222-2222-2222-2222-222222222222', slug: 'parmesao', name: 'Parmesão', price_cents: 1800 },
];
const MP_URL = `${API_URL}/mp/checkout/pref-1`;

function order(overrides: Record<string, unknown> = {}) {
  return {
    id: ORDER_ID,
    status: 'aguardando_pagamento',
    cancel_reason: null,
    production_date: '2026-12-02',
    created_at: '2026-11-24T12:00:00Z',
    items: [{ product_id: BAUNILHA, name: 'Baunilha', quantity: 2, unit_price_cents: 1500 }],
    delivery: {
      type: 'melhor_envio', service_id: 1, price_cents: 2350, delivery_days: 6,
      address: {
        cep: '01310100', street: 'Avenida Paulista', number: '1000', complement: null,
        district: 'Bela Vista', city: 'São Paulo', state: 'SP',
      },
      tracking_code: null, tracking_url: null,
    },
    items_cents: 3000,
    shipping_cents: 2350,
    total_cents: 5350,
    payment_url: MP_URL,
    ...overrides,
  };
}

async function mockApi(page: Page, responses: object[]) {
  const calls = { gets: 0, payments: 0 };
  await page.route(`${API_URL}/products`, (r) => r.fulfill({ json: API_PRODUCTS }));
  await page.route(`${API_URL}/orders/${ORDER_ID}`, (r) => {
    const body = responses[Math.min(calls.gets++, responses.length - 1)];
    return r.fulfill({ json: body });
  });
  await page.route(`${API_URL}/orders/${ORDER_ID}/payment`, (r) => {
    calls.payments++;
    return r.fulfill({ status: 201, json: { preference_id: 'pref-1', init_point: MP_URL, amount_cents: 5350 } });
  });
  await page.route(`${API_URL}/mp/**`, (r) => r.fulfill({ contentType: 'text/html', body: '<h1>MP</h1>' }));
  return calls;
}

test.describe('Página do pedido', () => {
  test('link direto mostra o pedido e atualiza quando o pagamento confirma', async ({ page }) => {
    const calls = await mockApi(page, [order(), order({ status: 'pago', payment_url: null })]);
    await page.goto(`/pedido/${ORDER_ID}`);
    await expect(page.locator('.order-status')).toHaveText('Aguardando pagamento');
    await expect(page.locator('.order-total strong')).toHaveText('R$ 53,50');
    await expect(page.locator('.order-card')).toContainText('Avenida Paulista, 1000');
    await expect(page.locator('#splash-screen')).toBeHidden();

    await expect(page.locator('.order-status')).toHaveText('Pagamento confirmado', { timeout: 8000 });
    await expect(page.locator('[data-action="pay"]')).toHaveCount(0);
    expect(calls.gets).toBe(2);
    expect(await page.evaluate(() => localStorage.getItem('biscoidino-last-order'))).toBe(ORDER_ID);
  });

  test('Pagar usa payment_url', async ({ page }) => {
    const calls = await mockApi(page, [order()]);
    await page.goto(`/pedido/${ORDER_ID}`);
    await page.locator('[data-action="pay"]').click();
    await expect(page).toHaveURL(MP_URL);
    expect(calls.payments).toBe(0);
  });

  test('Pagar sem payment_url cria a preference', async ({ page }) => {
    const calls = await mockApi(page, [order({ payment_url: null })]);
    await page.goto(`/pedido/${ORDER_ID}`);
    await page.locator('[data-action="pay"]').click();
    await expect(page).toHaveURL(MP_URL);
    expect(calls.payments).toBe(1);
  });

  test('expirado explica e refaz o pedido com os mesmos itens', async ({ page }) => {
    await mockApi(page, [order({ status: 'cancelado', cancel_reason: 'expirado', payment_url: null })]);
    await page.goto(`/pedido/${ORDER_ID}`);
    await expect(page.locator('.order-status')).toHaveText('Cancelado');
    await expect(page.locator('.order-status-text')).toContainText('não foi confirmado no prazo');
    await page.locator('[data-action="reorder"]').click();
    await expect(page).toHaveURL(/\/#menu$/);
    expect(await page.evaluate(() => localStorage.getItem('biscoidino-cart'))).toBe('{"baunilha":2}');
    await page.waitForTimeout(4000); // splash
    await expect(page.locator('#cart-button .cart-count')).toHaveText('2');
  });

  test('enviado mostra código e link de rastreio', async ({ page }) => {
    const delivery = { ...order().delivery, tracking_code: 'AB123456789BR', tracking_url: 'https://rastreio.example/AB123456789BR' };
    await mockApi(page, [order({ status: 'enviado', payment_url: null, delivery })]);
    await page.goto(`/pedido/${ORDER_ID}`);
    await expect(page.locator('.order-tracking')).toContainText('AB123456789BR');
    await expect(page.locator('.order-tracking a')).toHaveAttribute('href', 'https://rastreio.example/AB123456789BR');
  });

  test('pedido inexistente', async ({ page }) => {
    await page.route(`${API_URL}/products`, (r) => r.fulfill({ json: API_PRODUCTS }));
    await page.route(`${API_URL}/orders/*`, (r) => r.fulfill({ status: 404, json: { detail: 'pedido não encontrado' } }));
    await page.goto(`/pedido/${ORDER_ID}`);
    await expect(page.locator('.order-error')).toHaveText('Pedido não encontrado. Confira o link recebido.');
  });

  test('site mostra atalho para o último pedido quando o carrinho está vazio', async ({ page }) => {
    await page.route(`${API_URL}/products`, (r) => r.fulfill({ json: API_PRODUCTS }));
    await page.addInitScript((id) => localStorage.setItem('biscoidino-last-order', id), ORDER_ID);
    await page.goto('/');
    await page.waitForTimeout(4000); // splash
    await expect(page.locator('#order-link')).toHaveAttribute('href', `/pedido/${ORDER_ID}`);
    await expect(page.locator('#cart-button')).toBeHidden();
  });
});
