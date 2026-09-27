import { useQuery } from '@tanstack/react-query';

import { fetchCatalog } from '@/api/catalog';

export const CATALOG_KEY = ['catalog'] as const;

/**
 * Cached for 5 minutes and kept for a day, so the menu still shows
 * (from memory) if the network drops while the app is open.
 */
export function useCatalog() {
  return useQuery({
    queryKey: CATALOG_KEY,
    queryFn: ({ signal }) => fetchCatalog(signal),
    staleTime: 5 * 60_000,
    gcTime: 24 * 60 * 60_000,
  });
}
