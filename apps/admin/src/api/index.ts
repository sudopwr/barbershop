import type {
  Admin,
  Service,
  Category,
  ServiceInput,
  CategoryInput,
  DashboardStats,
  ServiceFilters,
} from './types';

import { http } from 'src/lib/http';

// ----------------------------------------------------------------------
// Thin gateways over the REST API. Components never call fetch directly.

export const authApi = {
  login: (username: string, password: string) =>
    http<{ admin: Admin }>('/auth/login', { method: 'POST', body: { username, password } }),
  logout: () => http<void>('/auth/logout', { method: 'POST' }),
  me: () => http<{ admin: Admin }>('/auth/me'),
};

export const categoriesApi = {
  list: () => http<Category[]>('/admin/categories'),
  create: (input: CategoryInput) => http<Category>('/admin/categories', { method: 'POST', body: input }),
  update: (id: string, input: Partial<CategoryInput>) =>
    http<Category>(`/admin/categories/${id}`, { method: 'PATCH', body: input }),
  remove: (id: string) => http<void>(`/admin/categories/${id}`, { method: 'DELETE' }),
};

export const servicesApi = {
  list: (filters: ServiceFilters = {}) => http<Service[]>('/admin/services', { query: filters }),
  create: (input: ServiceInput) => http<Service>('/admin/services', { method: 'POST', body: input }),
  update: (id: string, input: Partial<ServiceInput>) =>
    http<Service>(`/admin/services/${id}`, { method: 'PATCH', body: input }),
  remove: (id: string) => http<void>(`/admin/services/${id}`, { method: 'DELETE' }),
};

export const dashboardApi = {
  stats: () => http<DashboardStats>('/admin/stats'),
};

export * from './types';
