// Carrinho: só produto (slug) e quantidade; preço sempre vem do catálogo/API

/** Igual a MAX_ITEMS_PER_ORDER da API. */
export const MAX_ITEMS = 20;
const STORAGE_KEY = 'biscoidino-cart';

export type CartItems = Record<string, number>; // slug -> quantidade

type Listener = (items: CartItems) => void;

export class Cart {
  private items: CartItems;
  private listeners: Listener[] = [];
  private storage: Storage | null;

  constructor(storage: Storage | null = safeLocalStorage()) {
    this.storage = storage;
    this.items = this.load();
  }

  get count(): number {
    return Object.values(this.items).reduce((sum, qty) => sum + qty, 0);
  }

  entries(): [string, number][] {
    return Object.entries(this.items);
  }

  quantity(slug: string): number {
    return this.items[slug] ?? 0;
  }

  /** false quando passaria do limite de itens do pedido. */
  add(slug: string, quantity = 1): boolean {
    return this.set(slug, this.quantity(slug) + quantity);
  }

  set(slug: string, quantity: number): boolean {
    const others = this.count - this.quantity(slug);
    if (quantity > 0 && others + quantity > MAX_ITEMS) return false;
    if (quantity <= 0) delete this.items[slug];
    else this.items[slug] = Math.floor(quantity);
    this.save();
    return true;
  }

  remove(slug: string): void {
    this.set(slug, 0);
  }

  clear(): void {
    this.items = {};
    this.save();
  }

  onChange(listener: Listener): void {
    this.listeners.push(listener);
  }

  private load(): CartItems {
    try {
      const raw = JSON.parse(this.storage?.getItem(STORAGE_KEY) ?? '{}');
      const items: CartItems = {};
      for (const [slug, qty] of Object.entries(raw ?? {})) {
        if (typeof qty === 'number' && Number.isInteger(qty) && qty > 0) items[slug] = qty;
      }
      return items;
    } catch {
      return {};
    }
  }

  private save(): void {
    try {
      this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch {
      // modo privado / armazenamento cheio: o carrinho vale só nesta aba
    }
    this.listeners.forEach((listener) => listener({ ...this.items }));
  }
}

function safeLocalStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
