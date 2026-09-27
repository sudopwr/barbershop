import type { Category, Service } from '../domain/entities/index.js';

export type CategoryDTO = ReturnType<Category['toJSON']> & { serviceCount?: number };
export type ServiceDTO = ReturnType<Service['toJSON']>;

export const toCategoryDTO = (c: Category, serviceCount?: number): CategoryDTO =>
  serviceCount === undefined ? c.toJSON() : { ...c.toJSON(), serviceCount };

export const toServiceDTO = (s: Service): ServiceDTO => s.toJSON();

/** Sort by explicit sortOrder, then alphabetically. */
export const byMenuOrder = <T extends { sortOrder: number; name: string }>(a: T, b: T) =>
  a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
