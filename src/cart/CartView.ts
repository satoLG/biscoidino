// Botão flutuante e gaveta do carrinho
import { Product, products } from '../data';
import { formatCents } from '../api/catalog';
import { Cart, MAX_ITEMS } from './cart';

const WHATSAPP_NUMBER = '5511953826504';
const LIMIT_MESSAGE = `Máximo de ${MAX_ITEMS} pacotes por pedido`;

interface Line {
  product: Product;
  quantity: number;
}

export class CartView {
  private button!: HTMLButtonElement;
  private drawer!: HTMLElement;
  private cart: Cart;

  constructor(cart: Cart) {
    this.cart = cart;
  }

  mount(root: HTMLElement): void {
    root.insertAdjacentHTML('beforeend', `
      <button id="cart-button" class="cart-button" type="button" aria-label="Abrir carrinho" hidden>
        <span aria-hidden="true">🛒</span> <span class="cart-count">0</span>
      </button>
      <aside id="cart-drawer" class="cart-drawer" aria-label="Carrinho" hidden>
        <div class="cart-header">
          <h2 class="trademark-name">CARRINHO</h2>
          <button class="cart-close" type="button" aria-label="Fechar carrinho">✕</button>
        </div>
        <div class="cart-body"></div>
      </aside>
    `);
    this.button = root.querySelector('#cart-button')!;
    this.drawer = root.querySelector('#cart-drawer')!;
    this.button.addEventListener('click', () => this.open());
    this.drawer.querySelector('.cart-close')!.addEventListener('click', () => this.close());
    this.drawer.addEventListener('click', (event) => this.onDrawerClick(event));
    this.cart.onChange(() => this.update());
    this.update();
  }

  /** Chamado pelos botões "Adicionar" do cardápio. */
  add(slug: string): void {
    this.toast(this.cart.add(slug) ? 'Adicionado ao carrinho' : LIMIT_MESSAGE);
  }

  open(): void {
    this.drawer.hidden = false;
  }

  close(): void {
    this.drawer.hidden = true;
  }

  /** Redesenha; chamado também quando preços/disponibilidade da API chegam. */
  update(): void {
    const count = this.cart.count;
    this.button.hidden = count === 0;
    this.button.querySelector('.cart-count')!.textContent = String(count);
    this.drawer.querySelector('.cart-body')!.innerHTML = count === 0
      ? '<p class="cart-empty">Seu carrinho está vazio.</p>'
      : this.renderLines(this.lines());
  }

  private lines(): Line[] {
    return this.cart.entries().flatMap(([slug, quantity]) => {
      const product = products.find((p) => p.type === slug);
      return product ? [{ product, quantity }] : [];
    });
  }

  private renderLines(lines: Line[]): string {
    const subtotal = lines
      .filter((l) => l.product.available)
      .reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);
    const hasUnavailable = lines.some((l) => !l.product.available);
    return `
      <ul class="cart-lines">
        ${lines.map(({ product, quantity }) => `
          <li class="cart-line ${product.available ? '' : 'unavailable'}" data-slug="${product.type}">
            <img src="${product.image}" alt="">
            <div class="cart-line-info">
              <strong>${product.name}</strong>
              <span>${product.available ? product.price : 'indisponível'}</span>
            </div>
            <div class="cart-qty">
              <button type="button" data-action="dec" aria-label="Diminuir">−</button>
              <span class="cart-qty-value">${quantity}</span>
              <button type="button" data-action="inc" aria-label="Aumentar">+</button>
            </div>
            <button type="button" class="cart-remove" data-action="remove" aria-label="Remover">✕</button>
          </li>`).join('')}
      </ul>
      ${hasUnavailable ? '<p class="cart-warning">Remova os itens indisponíveis para continuar.</p>' : ''}
      <p class="cart-subtotal">Subtotal: <strong>${formatCents(subtotal)}</strong> <small>+ frete</small></p>
      <button type="button" class="cart-checkout" disabled title="Em breve">Finalizar pedido (em breve)</button>
      <a class="cart-whatsapp" href="${this.whatsappLink(lines)}" target="_blank" rel="noopener">
        Encomendar pelo WhatsApp
      </a>
    `;
  }

  private whatsappLink(lines: Line[]): string {
    const items = lines.map((l) => `${l.quantity}x ${l.product.name}`).join(', ');
    const text = `Olá, gostaria de encomendar biscoitos: ${items}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  private onDrawerClick(event: Event): void {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
    const slug = target?.closest<HTMLElement>('.cart-line')?.dataset.slug;
    if (!target || !slug) return;
    const quantity = this.cart.quantity(slug);
    const action = target.dataset.action;
    if (action === 'remove') this.cart.remove(slug);
    if (action === 'dec') this.cart.set(slug, quantity - 1);
    if (action === 'inc' && !this.cart.set(slug, quantity + 1)) this.toast(LIMIT_MESSAGE);
  }

  private toast(message: string): void {
    const el = document.createElement('div');
    el.className = 'cart-toast';
    el.setAttribute('role', 'status');
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}
