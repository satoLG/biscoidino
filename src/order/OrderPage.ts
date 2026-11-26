// Página /pedido/{id}: status, pagamento pendente, expiração e rastreio (volta do Mercado Pago)
import { ApiError, isApiConfigured } from '../api/client';
import { formatCents } from '../api/catalog';
import { OrderView, createPayment, fetchOrder } from '../api/checkout';
import { Cart } from '../cart/cart';
import { LAST_ORDER_KEY } from '../checkout';
import { products } from '../data';

/** Depois do Mercado Pago o webhook pode atrasar: consulta de novo por ~1 min. */
export const POLL_INTERVAL_MS = 5_000;
const POLL_ATTEMPTS = 12;
const WHATSAPP_NUMBER = '5511953826504';

const UUID_PATH = /^\/pedido\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?$/i;

export function orderIdFromPath(pathname: string): string | null {
  return UUID_PATH.exec(pathname)?.[1].toLowerCase() ?? null;
}

const STATUS: Record<string, { title: string; text: (o: OrderView) => string }> = {
  aguardando_pagamento: {
    title: 'Aguardando pagamento',
    text: () => 'Assim que o Mercado Pago confirmar o pagamento, o pedido entra na fila de produção.',
  },
  pago: {
    title: 'Pagamento confirmado',
    text: (o) => `Obrigado! A produção está marcada para ${formatDate(o.production_date)}.`,
  },
  em_producao: { title: 'Em produção', text: () => 'Seus biscoitos estão sendo feitos agora.' },
  enviado: { title: 'Enviado', text: () => 'O pedido está a caminho.' },
  pronto_para_retirada: {
    title: 'Pronto para retirada',
    text: () => 'Combine o horário da retirada com a gente pelo WhatsApp.',
  },
  entregue: { title: 'Entregue', text: () => 'Obrigado pela compra! Esperamos que goste.' },
  cancelado: {
    title: 'Cancelado',
    text: (o) => o.cancel_reason === 'expirado'
      ? 'O pagamento não foi confirmado no prazo e o pedido foi cancelado. Você pode refazer o pedido com os mesmos itens.'
      : 'Este pedido foi cancelado. Qualquer dúvida, fale com a gente pelo WhatsApp.',
  },
};

const esc = (value: string): string => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: '2-digit',
  });
}

export class OrderPage {
  private root!: HTMLElement;
  private order: OrderView | null = null;
  private polls = 0;
  private timer: number | undefined;
  private busy = false;

  /** `catalog` resolve quando os ids da API já estão em `products` (para refazer o pedido). */
  constructor(private orderId: string, private catalog: Promise<void>, private cart = new Cart()) {}

  mount(root: HTMLElement): void {
    root.innerHTML = `
      <div class="container order-page">
        <header class="order-header">
          <a href="/" class="order-home trademark-name">
            <img src="/biscoidino_logo.png" alt="" class="header-logo"> BISCOIDINO
          </a>
        </header>
        <main class="order-card" aria-live="polite"><p>Carregando pedido…</p></main>
      </div>
    `;
    this.root = root.querySelector('.order-card')!;
    this.root.addEventListener('click', (event) => this.onClick(event));
    void this.load();
  }

  private async load(): Promise<void> {
    if (!isApiConfigured()) return this.renderError('Acompanhamento de pedidos indisponível no momento.');
    try {
      this.order = await fetchOrder(this.orderId);
    } catch (error) {
      if (this.order) return this.schedulePoll(); // falha numa consulta repetida: tenta na próxima
      if (error instanceof ApiError && (error.status === 404 || error.status === 422)) {
        return this.renderError('Pedido não encontrado. Confira o link recebido.', false);
      }
      return this.renderError('Não conseguimos carregar o pedido. Tente de novo em instantes.');
    }
    try {
      localStorage.setItem(LAST_ORDER_KEY, this.order.id);
    } catch {
      // sem armazenamento: o link continua valendo
    }
    this.render(this.order);
    this.schedulePoll();
  }

  private schedulePoll(): void {
    window.clearTimeout(this.timer);
    if (this.order?.status !== 'aguardando_pagamento' || this.polls >= POLL_ATTEMPTS) return;
    this.polls++;
    this.timer = window.setTimeout(() => void this.load(), POLL_INTERVAL_MS);
  }

  private render(order: OrderView): void {
    const status = STATUS[order.status] ?? { title: order.status, text: () => '' };
    const d = order.delivery;
    const address = d.address
      ? `${esc(d.address.street)}, ${esc(d.address.number)}${d.address.complement ? ` - ${esc(d.address.complement)}` : ''},
         ${esc(d.address.district)}, ${esc(d.address.city)}/${esc(d.address.state)}`
      : '';
    const tracking = d.tracking_code
      ? `<p class="order-tracking">Rastreio: <strong>${esc(d.tracking_code)}</strong>
          ${d.tracking_url ? `<a href="${esc(d.tracking_url)}" target="_blank" rel="noopener">Acompanhar entrega</a>` : ''}</p>`
      : '';
    this.root.innerHTML = `
      <h2 class="trademark-name">Pedido ${esc(order.id.slice(0, 8).toUpperCase())}</h2>
      <p class="order-status order-status-${esc(order.status)}">${esc(status.title)}</p>
      <p class="order-status-text">${esc(status.text(order))}</p>
      ${order.status === 'aguardando_pagamento' ? `
        <button type="button" class="order-action" data-action="pay">Pagar com Mercado Pago</button>
        <p class="order-hint">Já pagou? Esta página se atualiza sozinha em alguns segundos.</p>` : ''}
      ${order.status === 'cancelado' && order.cancel_reason === 'expirado'
        ? '<button type="button" class="order-action" data-action="reorder">Refazer pedido</button>' : ''}
      <p class="order-error" role="alert"></p>

      <h3>Itens</h3>
      <ul class="order-items">
        ${order.items.map((i) => `
          <li><span>${i.quantity}x ${esc(i.name ?? 'Produto')}</span>
              <span>${formatCents(i.unit_price_cents * i.quantity)}</span></li>`).join('')}
      </ul>
      <p class="order-line"><span>Produtos</span><span>${formatCents(order.items_cents)}</span></p>
      <p class="order-line"><span>Frete</span><span>${formatCents(order.shipping_cents)}</span></p>
      <p class="order-line order-total"><span>Total</span><strong>${formatCents(order.total_cents)}</strong></p>

      <h3>Entrega</h3>
      <p>${d.type === 'retirada' ? 'Retirada' : `Envio${d.delivery_days ? ` (até ${d.delivery_days} dias úteis após a produção)` : ''}`}</p>
      ${address ? `<p>${address} · CEP ${esc(d.address!.cep)}</p>` : ''}
      ${tracking}
      <p>Produção: ${formatDate(order.production_date)}</p>

      <a class="order-whatsapp" target="_blank" rel="noopener"
         href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Olá! Tenho uma dúvida sobre o pedido ${order.id}`)}">
        Falar com a gente no WhatsApp
      </a>
    `;
  }

  private renderError(message: string, retry = true): void {
    this.root.innerHTML = `
      <p class="order-error">${esc(message)}</p>
      ${retry ? '<button type="button" class="order-action" data-action="retry">Tentar de novo</button>' : ''}
      <a class="order-action order-back" href="/">Voltar ao site</a>
    `;
  }

  private onClick(event: Event): void {
    const action = (event.target as HTMLElement).closest<HTMLElement>('[data-action]')?.dataset.action;
    if (action === 'pay') void this.pay();
    if (action === 'reorder') void this.reorder();
    if (action === 'retry') {
      this.root.innerHTML = '<p>Carregando pedido…</p>';
      void this.load();
    }
  }

  private setError(message: string): void {
    const el = this.root.querySelector('.order-error');
    if (el) el.textContent = message;
  }

  private async pay(): Promise<void> {
    if (!this.order || this.busy) return;
    if (this.order.payment_url) return window.location.assign(this.order.payment_url);
    this.busy = true;
    try {
      const payment = await createPayment(this.order.id);
      window.location.assign(payment.init_point);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        // expirou ou já foi pago enquanto a página estava aberta
        this.polls = 0;
        await this.load();
      } else {
        this.setError('O pagamento não abriu. Tente de novo em instantes.');
      }
    } finally {
      this.busy = false;
    }
  }

  /** Põe os itens do pedido expirado de volta no carrinho e volta ao site. */
  private async reorder(): Promise<void> {
    if (!this.order) return;
    await this.catalog;
    let added = 0;
    for (const item of this.order.items) {
      const product = products.find((p) => p.id === item.product_id && p.available);
      if (product && this.cart.set(product.type, item.quantity)) added++;
    }
    if (added === 0) return this.setError('Os produtos deste pedido não estão mais disponíveis.');
    window.location.assign('/#menu');
  }
}
