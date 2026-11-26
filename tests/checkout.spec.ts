import { test, expect, Page, Route } from '@playwright/test';
import { API_URL } from '../playwright.config';

const BAUNILHA = '11111111-1111-1111-1111-111111111111';
const PARMESAO = '22222222-2222-2222-2222-222222222222';
const API_PRODUCTS = [
  { id: BAUNILHA, slug: 'baunilha', name: 'Baunilha', price_cents: 1500 },
  { id: PARMESAO, slug: 'parmesao', name: 'Parmesão', price_cents: 1800 },
];
const OPTIONS = [
  { type: 'melhor_envio', service_id: 1, name: 'PAC', company: 'Correios', price_cents: 2350, delivery_days: 6 },
  { type: 'melhor_envio', service_id: 2, name: 'SEDEX', company: 'Correios', price_cents: 3990, delivery_days: 2 },
  { type: 'retirada', service_id: null, name: 'Retirada', company: 'Biscoidino', price_cents: 0, delivery_days: null },
];
const CEP = { cep: '01310100', street: 'Avenida Paulista', district: 'Bela Vista', city: 'São Paulo', state: 'SP' };
const ORDER = { id: 'aaaaaaaa-0000-0000-0000-000000000001', status: 'aguardando_pagamento', total_cents: 5350 };
const MP_URL = `${API_URL}/mp/checkout/pref-1`;

interface Calls {
  orders: { body: any; key: string | null }[];
  quotes: number;
  payments: number;
}

/** Rotas da API falsa; `orders` pode ser trocado por teste. */
async function mockApi(page: Page, orders?: (route: Route, n: number) => Promise<void>): Promise<Calls> {
  const calls: Calls = { orders: [], quotes: 0, payments: 0 };
  await page.route(`${API_URL}/products`, (r) => r.fulfill({ json: API_PRODUCTS }));
  await page.route(`${API_URL}/cep/*`, (r) => r.fulfill({ json: CEP }));
  await page.route(`${API_URL}/shipping/quote`, (r) => {
    calls.quotes++;
    return r.fulfill({ json: OPTIONS });
  });
  await page.route(`${API_URL}/production/availability*`, (r) =>
    r.fulfill({ json: [{ date: '2026-12-02', remaining: 10 }] }));
  await page.route(`${API_URL}/orders`, async (r) => {
    calls.orders.push({ body: r.request().postDataJSON(), key: r.request().headers()['idempotency-key'] ?? null });
    if (orders) return orders(r, calls.orders.length);
    return r.fulfill({ status: 201, json: ORDER });
  });
  await page.route(`${API_URL}/orders/*/payment`, (r) => {
    calls.payments++;
    return r.fulfill({ status: 201, json: { preference_id: 'pref-1', init_point: MP_URL, amount_cents: 5350 } });
  });
  await page.route(`${API_URL}/mp/**`, (r) =>
    r.fulfill({ contentType: 'text/html', body: '<h1>Mercado Pago</h1>' }));
  return calls;
}

async function openCheckout(page: Page, cart = '{"baunilha":2}') {
  await page.addInitScript((c) => {
    if (location.origin !== 'http://api.test') localStorage.setItem('biscoidino-cart', c);
  }, cart);
  await page.goto('/');
  await page.waitForTimeout(4000); // splash
  await page.locator('#cart-button').click();
  await page.locator('.cart-checkout').click();
  await expect(page.locator('#checkout')).toBeVisible();
}

async function fillCustomer(page: Page) {
  const form = page.locator('#checkout');
  await form.locator('input[name="name"]').fill('Maria Teste');
  await form.locator('input[name="email"]').fill('maria@example.com');
  await form.locator('input[name="phone"]').fill('(11) 98888-7777');
  await form.locator('input[name="cpf"]').fill('529.982.247-25');
}

async function fillShipping(page: Page) {
  const form = page.locator('#checkout');
  await form.locator('input[name="cep"]').fill('01310-100');
  await expect(form.locator('input[name="street"]')).toHaveValue('Avenida Paulista');
  await form.locator('input[name="number"]').fill('1000');
  await form.locator('.checkout-option', { hasText: 'PAC' }).click();
}

test.describe('Checkout', () => {
  test('envio: CEP preenche endereço, frete entra no total e vai ao Mercado Pago', async ({ page }) => {
    const calls = await mockApi(page);
    await openCheckout(page);
    await expect(page.locator('.checkout-production')).toContainText('02/12');
    await fillCustomer(page);
    await fillShipping(page);
    await expect(page.locator('.checkout-option')).toHaveCount(2); // retirada fica no seletor de entrega
    await expect(page.locator('.checkout-total strong')).toHaveText('R$ 53,50');

    await page.locator('.checkout-pay').click();
    await expect(page).toHaveURL(MP_URL);

    expect(calls.orders).toHaveLength(1);
    const { body, key } = calls.orders[0];
    expect(key).toMatch(/^[0-9a-f-]{32,36}$/);
    expect(body).toEqual({
      customer: { name: 'Maria Teste', email: 'maria@example.com', phone: '(11) 98888-7777', cpf: '52998224725' },
      items: [{ product_id: BAUNILHA, quantity: 2 }],
      delivery: {
        type: 'melhor_envio',
        service_id: 1,
        address: {
          cep: '01310100', street: 'Avenida Paulista', number: '1000', complement: null,
          district: 'Bela Vista', city: 'São Paulo', state: 'SP',
        },
      },
    });
    expect(JSON.stringify(body)).not.toContain('price');
  });

  test('duplo clique em Pagar cria um pedido só', async ({ page }) => {
    const calls = await mockApi(page, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.fulfill({ status: 201, json: ORDER });
    });
    await openCheckout(page);
    await fillCustomer(page);
    await page.locator('#checkout input[value="retirada"]').check();
    await page.locator('.checkout-pay').dblclick();
    await expect(page).toHaveURL(MP_URL);
    expect(calls.orders).toHaveLength(1);
    expect(calls.payments).toBe(1);
  });

  test('retentativa após falha de rede reaproveita a Idempotency-Key', async ({ page }) => {
    const calls = await mockApi(page, (route, n) => n === 1
      ? route.fulfill({ status: 503, json: { detail: 'cotação de frete indisponível' } })
      : route.fulfill({ status: 201, json: ORDER }));
    await openCheckout(page);
    await fillCustomer(page);
    await page.locator('#checkout input[value="retirada"]').check();
    await page.locator('.checkout-pay').click();
    await expect(page.locator('.checkout-error')).toContainText('Tente de novo em instantes');
    await page.locator('.checkout-pay').click();
    await expect(page).toHaveURL(MP_URL);
    expect(calls.orders).toHaveLength(2);
    expect(calls.orders[1].key).toBe(calls.orders[0].key);
    expect(calls.orders[0].body.delivery).toEqual({ type: 'retirada' });
  });

  test('409 frete mudou: recota e pede nova escolha', async ({ page }) => {
    const calls = await mockApi(page, (route, n) => n === 1
      ? route.fulfill({ status: 409, json: { detail: 'frete mudou; cote novamente' } })
      : route.fulfill({ status: 201, json: ORDER }));
    await openCheckout(page);
    await fillCustomer(page);
    await fillShipping(page);
    const quotesBefore = calls.quotes;
    await page.locator('.checkout-pay').click();
    await expect(page.locator('.checkout-error')).toContainText('frete mudou');
    await expect.poll(() => calls.quotes).toBe(quotesBefore + 1);
    await expect(page.locator('input[name="service"]:checked')).toHaveCount(0);
  });

  test('409 sem vaga de produção avisa', async ({ page }) => {
    await mockApi(page, (route) =>
      route.fulfill({ status: 409, json: { detail: 'sem vaga de produção nos próximos dias' } }));
    await openCheckout(page);
    await fillCustomer(page);
    await page.locator('#checkout input[value="retirada"]').check();
    await page.locator('.checkout-pay').click();
    await expect(page.locator('.checkout-error')).toContainText('Sem vaga de produção');
  });

  test('422 produto inativo volta ao carrinho com o item indisponível', async ({ page }) => {
    await mockApi(page, (route) => route.fulfill({
      status: 422,
      json: { detail: { message: 'produto inexistente ou inativo', product_ids: [PARMESAO] } },
    }));
    await openCheckout(page, '{"baunilha":1,"parmesao":1}');
    await fillCustomer(page);
    await page.locator('#checkout input[value="retirada"]').check();
    await page.locator('.checkout-pay').click();
    await expect(page.locator('#checkout')).toBeHidden();
    await expect(page.locator('.cart-line[data-slug="parmesao"]')).toHaveClass(/unavailable/);
    await expect(page.locator('.cart-checkout')).toBeDisabled();
  });

  test('valida CPF e e-mail antes de chamar a API', async ({ page }) => {
    const calls = await mockApi(page);
    await openCheckout(page);
    await fillCustomer(page);
    await page.locator('#checkout input[name="cpf"]').fill('111.111.111-11');
    await page.locator('#checkout input[name="email"]').fill('maria@');
    await page.locator('#checkout input[value="retirada"]').check();
    await page.locator('.checkout-pay').click();
    await expect(page.locator('.checkout-error')).toContainText('CPF inválido');
    await expect(page.locator('.checkout-error')).toContainText('E-mail inválido');
    expect(calls.orders).toHaveLength(0);
  });
});
