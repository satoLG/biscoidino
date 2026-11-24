// Checkout: dados, entrega, frete, pedido (POST /orders) e redirecionamento ao Mercado Pago
import { Product, products } from '../data';
import { ApiError } from '../api/client';
import { formatCents } from '../api/catalog';
import {
  AddressIn, OrderIn, OrderItemIn, ShippingOption,
  createOrder, createPayment, lookupCep, productionAvailability, quoteShipping,
} from '../api/checkout';
import { Cart } from '../cart/cart';
import {
  UFS, isValidCep, isValidCpf, isValidEmail, isValidPhone, newIdempotencyKey, onlyDigits,
} from './validate';

/** Último pedido criado neste navegador (página do pedido, #50). */
export const LAST_ORDER_KEY = 'biscoidino-last-order';

const RETRY_LATER = 'Não conseguimos falar com o servidor. Tente de novo em instantes.';

type DeliveryType = 'melhor_envio' | 'retirada';

interface Hooks {
  /** A API recusou produtos inativos: o carrinho precisa se redesenhar. */
  onProductsUnavailable: () => void;
}

const esc = (value: string): string => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: '2-digit',
  });
}

export class Checkout {
  private root!: HTMLElement;
  private form!: HTMLFormElement;
  private options: ShippingOption[] = [];
  private quotedCep = '';
  private quoteSeq = 0;
  private submitting = false;
  /** Chave reaproveitada enquanto o corpo do pedido não muda (duplo clique, rede lenta). */
  private idempotency: { key: string; body: string } | null = null;
  /** Pedido já criado; uma nova tentativa só repete o pagamento. */
  private orderId: string | null = null;

  constructor(private cart: Cart, private hooks: Hooks) {}

  mount(root: HTMLElement): void {
    root.insertAdjacentHTML('beforeend', `
      <div id="checkout" class="checkout-overlay" hidden>
        <form class="checkout-form" novalidate aria-labelledby="checkout-title">
          <div class="checkout-header">
            <h2 id="checkout-title" class="trademark-name">FINALIZAR PEDIDO</h2>
            <button type="button" class="checkout-close" aria-label="Fechar">✕</button>
          </div>

          <fieldset>
            <legend>Seus dados</legend>
            <label>Nome <input name="name" autocomplete="name" required minlength="2" maxlength="255"></label>
            <label>E-mail <input name="email" type="email" autocomplete="email" required maxlength="255"></label>
            <label>Telefone (com DDD) <input name="phone" type="tel" autocomplete="tel" inputmode="tel" required></label>
            <label>CPF <input name="cpf" inputmode="numeric" required maxlength="14"></label>
          </fieldset>

          <fieldset>
            <legend>Entrega</legend>
            <div class="checkout-delivery">
              <label><input type="radio" name="delivery" value="melhor_envio" checked> Envio</label>
              <label><input type="radio" name="delivery" value="retirada"> Retirada</label>
            </div>
            <div class="checkout-address">
              <label>CEP <input name="cep" inputmode="numeric" autocomplete="postal-code" maxlength="9"></label>
              <p class="checkout-cep-status" aria-live="polite"></p>
              <label>Rua <input name="street" autocomplete="address-line1" maxlength="255"></label>
              <div class="checkout-row">
                <label>Número <input name="number" maxlength="20"></label>
                <label>Complemento <input name="complement" autocomplete="address-line2" maxlength="255"></label>
              </div>
              <label>Bairro <input name="district" maxlength="255"></label>
              <div class="checkout-row">
                <label>Cidade <input name="city" autocomplete="address-level2" maxlength="255"></label>
                <label>UF <select name="state" autocomplete="address-level1">
                  <option value=""></option>
                  ${UFS.map((uf) => `<option>${uf}</option>`).join('')}
                </select></label>
              </div>
              <div class="checkout-options" aria-live="polite"></div>
            </div>
            <p class="checkout-pickup" hidden>Retirada sem custo; combinamos o horário pelo WhatsApp.</p>
          </fieldset>

          <div class="checkout-summary"></div>
          <p class="checkout-production"></p>
          <p class="checkout-error" role="alert"></p>
          <button type="submit" class="checkout-pay">Pagar com Mercado Pago</button>
        </form>
      </div>
    `);
    this.root = root.querySelector('#checkout')!;
    this.form = this.root.querySelector('form')!;
    this.root.querySelector('.checkout-close')!.addEventListener('click', () => this.close());
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      void this.submit();
    });
    this.form.addEventListener('change', (event) => this.onChange(event));
    this.field('cep').addEventListener('input', () => void this.onCep());
  }

  open(): void {
    this.root.hidden = false;
    this.setError('');
    this.renderSummary();
    void this.loadProduction();
    if (this.delivery === 'melhor_envio' && isValidCep(this.value('cep'))) void this.quote(true);
  }

  close(): void {
    this.root.hidden = true;
  }

  // ---- estado do formulário -------------------------------------------------

  private field<T extends HTMLInputElement | HTMLSelectElement = HTMLInputElement>(name: string): T {
    return this.form.elements.namedItem(name) as T;
  }

  private value(name: string): string {
    return this.field(name).value.trim();
  }

  private get delivery(): DeliveryType {
    return (this.form.querySelector<HTMLInputElement>('input[name="delivery"]:checked')!.value) as DeliveryType;
  }

  private get chosen(): ShippingOption | null {
    const id = this.form.querySelector<HTMLInputElement>('input[name="service"]:checked')?.value;
    return this.options.find((o) => String(o.service_id) === id) ?? null;
  }

  private lines(): { product: Product; quantity: number }[] {
    return this.cart.entries().flatMap(([slug, quantity]) => {
      const product = products.find((p) => p.type === slug);
      return product ? [{ product, quantity }] : [];
    });
  }

  private items(): OrderItemIn[] {
    return this.lines().map(({ product, quantity }) => ({ product_id: product.id!, quantity }));
  }

  private onChange(event: Event): void {
    const name = (event.target as HTMLInputElement).name;
    if (name === 'delivery') {
      const pickup = this.delivery === 'retirada';
      this.form.querySelector<HTMLElement>('.checkout-address')!.hidden = pickup;
      this.form.querySelector<HTMLElement>('.checkout-pickup')!.hidden = !pickup;
    }
    if (name === 'delivery' || name === 'service') this.renderSummary();
  }

  // ---- CEP, frete e produção ------------------------------------------------

  private async onCep(): Promise<void> {
    const cep = onlyDigits(this.value('cep'));
    if (cep.length !== 8 || cep === this.quotedCep) return;
    const status = this.form.querySelector('.checkout-cep-status')!;
    status.textContent = 'Buscando endereço…';
    const quoting = this.quote(false);
    try {
      const info = await lookupCep(cep);
      if (onlyDigits(this.value('cep')) !== cep) return;
      this.field('street').value = info.street;
      this.field('district').value = info.district;
      this.field('city').value = info.city;
      this.field<HTMLSelectElement>('state').value = info.state;
      status.textContent = '';
      this.field('number').focus();
    } catch (error) {
      status.textContent = error instanceof ApiError && error.status === 404
        ? 'CEP não encontrado. Confira o número.'
        : 'Não conseguimos buscar o endereço; preencha à mão.';
    }
    await quoting;
  }

  /** `keepChoice`: mantém o serviço escolhido se ele continuar na lista. */
  private async quote(keepChoice: boolean): Promise<void> {
    const cep = onlyDigits(this.value('cep'));
    const previous = keepChoice ? this.chosen?.service_id : undefined;
    const seq = ++this.quoteSeq;
    const box = this.form.querySelector<HTMLElement>('.checkout-options')!;
    this.quotedCep = cep;
    this.options = [];
    box.innerHTML = '<p>Calculando frete…</p>';
    this.renderSummary();
    try {
      const options = (await quoteShipping(cep, this.items())).filter((o) => o.type === 'melhor_envio');
      if (seq !== this.quoteSeq) return;
      this.options = options;
      box.innerHTML = options.length === 0
        ? '<p>Nenhuma opção de envio para este CEP. Escolha retirada ou fale com a gente no WhatsApp.</p>'
        : `<p class="checkout-options-title">Escolha o frete</p>${options.map((o) => `
            <label class="checkout-option">
              <input type="radio" name="service" value="${o.service_id}"
                ${o.service_id === previous ? 'checked' : ''}>
              <span>${esc(o.company)} ${esc(o.name)}</span>
              <span>${o.delivery_days ? `${o.delivery_days} dia${o.delivery_days > 1 ? 's' : ''} úteis` : ''}</span>
              <strong>${formatCents(o.price_cents)}</strong>
            </label>`).join('')}`;
    } catch (error) {
      if (seq !== this.quoteSeq) return;
      this.quotedCep = '';
      if (this.handleUnavailable(error)) return;
      box.innerHTML = `<p>${error instanceof ApiError && error.status === 422
        ? 'Confira o CEP.' : 'Frete indisponível no momento.'}</p>
        <button type="button" class="checkout-requote">Calcular de novo</button>`;
      box.querySelector('.checkout-requote')!.addEventListener('click', () => void this.quote(false));
    }
    this.renderSummary();
  }

  private async loadProduction(): Promise<void> {
    const el = this.form.querySelector<HTMLElement>('.checkout-production')!;
    const pay = this.form.querySelector<HTMLButtonElement>('.checkout-pay')!;
    el.textContent = '';
    pay.disabled = false;
    try {
      const [first] = await productionAvailability(this.cart.count);
      if (first) {
        el.textContent = `Produção a partir de ${formatDate(first.date)}.`;
      } else {
        el.textContent = 'Sem vaga de produção nos próximos dias. Fale com a gente pelo WhatsApp.';
        pay.disabled = true;
      }
    } catch {
      // informativo; a API confere a vaga de novo ao criar o pedido
    }
  }

  private renderSummary(): void {
    const itemsCents = this.lines().reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);
    const shipping = this.delivery === 'retirada' ? 0 : this.chosen?.price_cents ?? null;
    this.form.querySelector('.checkout-summary')!.innerHTML = `
      <ul>${this.lines().map((l) => `<li>${l.quantity}x ${esc(l.product.name)}</li>`).join('')}</ul>
      <p>Produtos: <strong>${formatCents(itemsCents)}</strong></p>
      <p>Frete: <strong>${shipping === null ? '—' : formatCents(shipping)}</strong></p>
      <p class="checkout-total">Total: <strong>${shipping === null ? '—' : formatCents(itemsCents + shipping)}</strong></p>
    `;
  }

  // ---- pedido e pagamento ---------------------------------------------------

  private validate(): string[] {
    const errors: string[] = [];
    const check = (name: string, ok: boolean, message: string) => {
      this.field(name).setAttribute('aria-invalid', String(!ok));
      if (!ok) errors.push(message);
    };
    check('name', this.value('name').length >= 2, 'Informe seu nome.');
    check('email', isValidEmail(this.value('email')), 'E-mail inválido.');
    check('phone', isValidPhone(this.value('phone')), 'Telefone deve ter DDD + número.');
    check('cpf', isValidCpf(this.value('cpf')), 'CPF inválido.');
    if (this.delivery === 'melhor_envio') {
      check('cep', isValidCep(this.value('cep')), 'CEP deve ter 8 dígitos.');
      check('street', this.value('street') !== '', 'Informe a rua.');
      check('number', this.value('number') !== '', 'Informe o número.');
      check('district', this.value('district') !== '', 'Informe o bairro.');
      check('city', this.value('city') !== '', 'Informe a cidade.');
      check('state', UFS.includes(this.value('state')), 'Escolha a UF.');
      if (errors.length === 0 && !this.chosen) errors.push('Escolha uma opção de frete.');
    }
    return errors;
  }

  private buildOrder(): OrderIn {
    const customer = {
      name: this.value('name'),
      email: this.value('email'),
      phone: this.value('phone'),
      cpf: onlyDigits(this.value('cpf')),
    };
    if (this.delivery === 'retirada') return { customer, items: this.items(), delivery: { type: 'retirada' } };
    const address: AddressIn = {
      cep: onlyDigits(this.value('cep')),
      street: this.value('street'),
      number: this.value('number'),
      complement: this.value('complement') || null,
      district: this.value('district'),
      city: this.value('city'),
      state: this.value('state'),
    };
    return {
      customer,
      items: this.items(),
      delivery: { type: 'melhor_envio', service_id: this.chosen!.service_id!, address },
    };
  }

  private keyFor(body: string): string {
    if (this.idempotency?.body !== body) this.idempotency = { key: newIdempotencyKey(), body };
    return this.idempotency.key;
  }

  private async submit(): Promise<void> {
    if (this.submitting) return;
    const pay = this.form.querySelector<HTMLButtonElement>('.checkout-pay')!;
    this.setError('');
    if (!this.orderId) {
      const errors = this.validate();
      if (errors.length) return this.setError(errors.join(' '));
    }
    this.submitting = true;
    pay.disabled = true;
    pay.textContent = 'Enviando…';
    try {
      if (!this.orderId) {
        const order = this.buildOrder();
        const created = await createOrder(order, this.keyFor(JSON.stringify(order)));
        this.orderId = created.id;
        try {
          localStorage.setItem(LAST_ORDER_KEY, created.id);
        } catch {
          // sem armazenamento: o link do pedido ainda chega por e-mail
        }
        this.cart.clear();
      }
      const payment = await createPayment(this.orderId);
      pay.textContent = 'Indo para o Mercado Pago…';
      window.location.assign(payment.init_point);
      return;
    } catch (error) {
      await this.handleError(error);
    } finally {
      this.submitting = false;
    }
    pay.disabled = false;
    pay.textContent = this.orderId ? 'Tentar pagamento de novo' : 'Pagar com Mercado Pago';
  }

  private async handleError(error: unknown): Promise<void> {
    if (this.orderId) {
      // pedido gravado; só o Mercado Pago falhou
      this.setError(`Pedido recebido, mas o pagamento não abriu. ${RETRY_LATER}`);
      return;
    }
    if (!(error instanceof ApiError)) return this.setError(RETRY_LATER);
    const detail = typeof error.detail === 'string' ? error.detail : '';
    if (error.status === 409 && detail.includes('frete')) {
      this.setError('O valor do frete mudou. Escolha o frete de novo.');
      await this.quote(false);
      return;
    }
    if (error.status === 409) {
      return this.setError('Sem vaga de produção nos próximos dias. Fale com a gente pelo WhatsApp.');
    }
    if (this.handleUnavailable(error)) return;
    if (error.status === 422) {
      return this.setError(detail ? `${detail[0].toUpperCase()}${detail.slice(1)}.` : 'Confira os dados preenchidos.');
    }
    this.setError(RETRY_LATER);
  }

  /** 422 com `product_ids`: marca os produtos e volta para o carrinho. */
  private handleUnavailable(error: unknown): boolean {
    const detail = error instanceof ApiError ? error.detail as { product_ids?: string[] } | null : null;
    const ids = error instanceof ApiError && error.status === 422 && Array.isArray(detail?.product_ids)
      ? detail!.product_ids
      : null;
    if (!ids) return false;
    for (const product of products) {
      if (product.id && ids.includes(product.id)) product.available = false;
    }
    this.close();
    this.hooks.onProductsUnavailable();
    return true;
  }

  private setError(message: string): void {
    this.form.querySelector('.checkout-error')!.textContent = message;
  }
}
