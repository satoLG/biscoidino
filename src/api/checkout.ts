// Rotas públicas do checkout na biscoidino_api
import { apiFetch } from './client';

export interface CepInfo {
  cep: string;
  street: string;
  district: string;
  city: string;
  state: string;
}

export interface OrderItemIn {
  product_id: string;
  quantity: number; // preço nunca sai do front: a API usa o do banco
}

export interface ShippingOption {
  type: 'melhor_envio' | 'retirada';
  service_id: number | null;
  name: string;
  company: string;
  price_cents: number;
  delivery_days: number | null;
}

export interface ProductionDay {
  date: string; // AAAA-MM-DD
  remaining: number;
}

export interface CustomerIn {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface AddressIn {
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
}

export interface OrderIn {
  customer: CustomerIn;
  items: OrderItemIn[];
  delivery: { type: 'retirada' } | { type: 'melhor_envio'; service_id: number; address: AddressIn };
}

export interface OrderOut {
  id: string;
  status: string;
  production_date: string;
  total_cents: number;
  payment_url: string | null;
}

export interface PaymentOut {
  preference_id: string;
  init_point: string;
  amount_cents: number;
}

const json = (body: unknown, headers: Record<string, string> = {}): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...headers },
  body: JSON.stringify(body),
});

export function lookupCep(cep: string): Promise<CepInfo> {
  return apiFetch<CepInfo>(`/cep/${encodeURIComponent(cep)}`);
}

export function quoteShipping(cep: string, items: OrderItemIn[]): Promise<ShippingOption[]> {
  return apiFetch<ShippingOption[]>('/shipping/quote', json({ cep, items }));
}

export function productionAvailability(quantity: number): Promise<ProductionDay[]> {
  return apiFetch<ProductionDay[]>(`/production/availability?quantity=${quantity}`);
}

/** Mesma `idempotencyKey` em retentativas devolve o mesmo pedido em vez de criar outro. */
export function createOrder(body: OrderIn, idempotencyKey: string): Promise<OrderOut> {
  return apiFetch<OrderOut>('/orders', json(body, { 'Idempotency-Key': idempotencyKey }));
}

export function createPayment(orderId: string): Promise<PaymentOut> {
  return apiFetch<PaymentOut>(`/orders/${encodeURIComponent(orderId)}/payment`, { method: 'POST' });
}
