import type { Admin, Category, Service } from '../entities/index.js';

export interface CategoryRepository {
  nextId(): string;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findAll(filter?: { isActive?: boolean }): Promise<Category[]>;
  save(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ServiceListFilter {
  categoryId?: string;
  isActive?: boolean;
  search?: string;
}

export interface ServiceRepository {
  nextId(): string;
  findById(id: string): Promise<Service | null>;
  findByName(categoryId: string, name: string): Promise<Service | null>;
  findAll(filter?: ServiceListFilter): Promise<Service[]>;
  countByCategory(categoryId: string): Promise<number>;
  save(service: Service): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface AdminRepository {
  nextId(): string;
  findByUsername(username: string): Promise<Admin | null>;
  findById(id: string): Promise<Admin | null>;
  save(admin: Admin): Promise<void>;
}
