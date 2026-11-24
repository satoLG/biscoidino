// Validação de formato no front; a API valida tudo de novo

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export const onlyDigits = (value: string): string => value.replace(/\D/g, '');

export function isValidEmail(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  let digits = onlyDigits(value);
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) digits = digits.slice(2);
  return digits.length === 10 || digits.length === 11;
}

export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const size of [9, 10]) {
    let total = 0;
    for (let i = 0; i < size; i++) total += Number(cpf[i]) * (size + 1 - i);
    if (((total * 10) % 11) % 10 !== Number(cpf[size])) return false;
  }
  return true;
}

export function isValidCep(value: string): boolean {
  return onlyDigits(value).length === 8;
}

export function newIdempotencyKey(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
