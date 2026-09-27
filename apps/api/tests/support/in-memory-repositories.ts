import { randomUUID } from 'node:crypto';

import { Admin, Category, Service } from '../../src/domain/entities/index.js';
import type {
  AdminRepository,
  CategoryRepository,
  ServiceListFilter,
  ServiceRepository,
} from '../../src/domain/repositories/index.js';

/**
 * Test doubles that honour the repository contracts without a database.
 * Entities are stored as snapshots so tests catch "forgot to save" bugs.
 */
export class InMemoryCategoryRepository implements CategoryRepository {
  readonly rows = new Map<string, ReturnType<Category['toJSON']>>();

  nextId = () => randomUUID();

  async findById(id: string) {
    const row = this.rows.get(id);
    return row ? Category.restore(row) : null;
  }

  async findBySlug(slug: string) {
    const row = [...this.rows.values()].find((r) => r.slug === slug);
    return row ? Category.restore(row) : null;
  }

  async findAll(filter: { isActive?: boolean } = {}) {
    return [...this.rows.values()]
      .filter((r) => filter.isActive === undefined || r.isActive === filter.isActive)
      .map((r) => Category.restore(r));
  }

  async save(category: Category) {
    this.rows.set(category.id, category.toJSON());
  }

  async delete(id: string) {
    this.rows.delete(id);
  }
}

export class InMemoryServiceRepository implements ServiceRepository {
  readonly rows = new Map<string, ReturnType<Service['toJSON']>>();

  nextId = () => randomUUID();

  async findById(id: string) {
    const row = this.rows.get(id);
    return row ? Service.restore(row) : null;
  }

  async findByName(categoryId: string, name: string) {
    const key = name.trim().toLowerCase();
    const row = [...this.rows.values()].find((r) => r.categoryId === categoryId && r.name.toLowerCase() === key);
    return row ? Service.restore(row) : null;
  }

  async findAll(filter: ServiceListFilter = {}) {
    const search = filter.search?.trim().toLowerCase();
    return [...this.rows.values()]
      .filter((r) => !filter.categoryId || r.categoryId === filter.categoryId)
      .filter((r) => filter.isActive === undefined || r.isActive === filter.isActive)
      .filter((r) => !search || r.name.toLowerCase().includes(search))
      .map((r) => Service.restore(r));
  }

  async countByCategory(categoryId: string) {
    return [...this.rows.values()].filter((r) => r.categoryId === categoryId).length;
  }

  async save(service: Service) {
    this.rows.set(service.id, service.toJSON());
  }

  async delete(id: string) {
    this.rows.delete(id);
  }
}

export class InMemoryAdminRepository implements AdminRepository {
  readonly rows = new Map<string, ReturnType<Admin['toJSON']>>();

  nextId = () => randomUUID();

  async findByUsername(username: string) {
    const row = [...this.rows.values()].find((r) => r.username === username);
    return row ? Admin.restore(row) : null;
  }

  async findById(id: string) {
    const row = this.rows.get(id);
    return row ? Admin.restore(row) : null;
  }

  async save(admin: Admin) {
    this.rows.set(admin.id, admin.toJSON());
  }
}
