import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export type FieldErrors = Record<string, string>;

/** Mirrors the API's `{ error: { code, message, details } }` envelope. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: FieldErrors
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
};

/** Called on any 401 so the auth layer can drop a stale session. */
let onUnauthorized: (() => void) | undefined;
export const setUnauthorizedHandler = (handler?: () => void) => {
  onUnauthorized = handler;
};

function buildUrl(path: string, query?: RequestOptions['query']) {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });
  const qs = params.toString();
  return `${CONFIG.apiUrl}${path}${qs ? `?${qs}` : ''}`;
}

export async function http<T>(path: string, { method = 'GET', body, query, signal }: RequestOptions = {}) {
  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      signal,
      credentials: 'include',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server. Check your connection and try again.');
  }

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/auth/login')) onUnauthorized?.();
    throw new ApiError(
      response.status,
      data?.error?.code ?? 'UNKNOWN',
      data?.error?.message ?? `Request failed (${response.status})`,
      data?.error?.details
    );
  }

  return data as T;
}
