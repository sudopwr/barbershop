import type { ServiceInput, CategoryInput, ServiceFilters } from './types';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { servicesApi, dashboardApi, categoriesApi } from './index';

// ----------------------------------------------------------------------

export const queryKeys = {
  categories: ['categories'] as const,
  services: (filters: ServiceFilters = {}) => ['services', filters] as const,
  stats: ['stats'] as const,
};

/** Any catalog change can affect counts, lists and the dashboard. */
function useInvalidateCatalog() {
  const client = useQueryClient();
  return () =>
    Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.categories }),
      client.invalidateQueries({ queryKey: ['services'] }),
      client.invalidateQueries({ queryKey: queryKeys.stats }),
    ]);
}

export const useCategories = () => useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list });

export const useServices = (filters: ServiceFilters = {}) =>
  useQuery({ queryKey: queryKeys.services(filters), queryFn: () => servicesApi.list(filters) });

export const useDashboardStats = () => useQuery({ queryKey: queryKeys.stats, queryFn: dashboardApi.stats });

export function useSaveCategory() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: Partial<CategoryInput> }) =>
      id ? categoriesApi.update(id, input) : categoriesApi.create(input as CategoryInput),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCatalog();
  return useMutation({ mutationFn: categoriesApi.remove, onSuccess: invalidate });
}

export function useSaveService() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: ServiceInput }) =>
      id ? servicesApi.update(id, input) : servicesApi.create(input),
    onSuccess: invalidate,
  });
}

export function useToggleService() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: Partial<ServiceInput> }) =>
      servicesApi.update(id, changes),
    onSuccess: invalidate,
  });
}

export function useDeleteService() {
  const invalidate = useInvalidateCatalog();
  return useMutation({ mutationFn: servicesApi.remove, onSuccess: invalidate });
}
