import { APP } from '@/config/env';
import type { Catalog } from '@/lib/catalog';

export class CatalogError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = 'CatalogError';
  }
}

/** The only API call the app makes — the same public endpoint the website uses. */
export async function fetchCatalog(signal?: AbortSignal): Promise<Catalog> {
  let response: Response;
  try {
    response = await fetch(`${APP.apiUrl}/public/catalog`, { signal, headers: { Accept: 'application/json' } });
  } catch {
    throw new CatalogError("Can't reach the shop right now. Check your connection.");
  }
  if (!response.ok) throw new CatalogError(`The menu couldn't be loaded (${response.status}).`, response.status);
  return (await response.json()) as Catalog;
}
