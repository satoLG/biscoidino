// Cliente HTTP da biscoidino_api (https://github.com/satoLG/biscoidino_api)

const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

/** Primeira resposta pode levar ~50 s: a API dorme no plano free do Render. */
export const DEFAULT_TIMEOUT_MS = 60_000;

export class ApiError extends Error {
  constructor(
    public readonly status: number, // 0 = rede, timeout ou API não configurada
    public readonly detail: unknown,
  ) {
    super(typeof detail === 'string' ? detail : `API respondeu ${status}`);
    this.name = 'ApiError';
  }
}

export function isApiConfigured(): boolean {
  return BASE_URL !== '';
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  if (!isApiConfigured()) throw new ApiError(0, 'VITE_API_URL não configurada');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { Accept: 'application/json', ...init.headers },
      signal: controller.signal,
    });
  } catch (error) {
    throw new ApiError(0, controller.signal.aborted ? 'tempo esgotado' : String(error));
  } finally {
    clearTimeout(timer);
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, body?.detail ?? body);
  return body as T;
}
