// Catálogo vindo da API: preço e disponibilidade; textos e imagens continuam em src/data
import { apiFetch } from './client';

export interface ApiProduct {
  id: string;
  slug: string; // igual a `type` em src/data/products.ts
  name: string;
  price_cents: number;
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(cents / 100)
    .replace(/ /g, ' ');
}

export function fetchProducts(): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>('/products');
}
