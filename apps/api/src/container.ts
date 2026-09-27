import type { PasswordHasher, TokenService } from './application/ports/index.js';
import { EnsureAdminAccount, GetCurrentAdmin, LoginAdmin } from './application/use-cases/auth/index.js';
import { GetPublicCatalog } from './application/use-cases/catalog/index.js';
import {
  CreateCategory,
  DeleteCategory,
  GetCategory,
  ListCategories,
  UpdateCategory,
} from './application/use-cases/categories/index.js';
import { GetDashboardStats } from './application/use-cases/dashboard/index.js';
import {
  CreateService,
  DeleteService,
  GetService,
  ListServices,
  UpdateService,
} from './application/use-cases/services/index.js';
import type { AdminRepository, CategoryRepository, ServiceRepository } from './domain/repositories/index.js';

export interface Dependencies {
  admins: AdminRepository;
  categories: CategoryRepository;
  services: ServiceRepository;
  hasher: PasswordHasher;
  tokens: TokenService;
}

/**
 * Composition root: the only place that wires concrete adapters into use cases.
 * Swap `Dependencies` (e.g. in-memory repositories) to run the app without Mongo.
 */
export function createContainer(deps: Dependencies) {
  const { admins, categories, services, hasher, tokens } = deps;
  return {
    tokens,
    auth: {
      login: new LoginAdmin(admins, hasher, tokens),
      currentAdmin: new GetCurrentAdmin(admins),
      ensureAdmin: new EnsureAdminAccount(admins, hasher),
    },
    categories: {
      create: new CreateCategory(categories),
      update: new UpdateCategory(categories),
      remove: new DeleteCategory(categories, services),
      get: new GetCategory(categories),
      list: new ListCategories(categories, services),
    },
    services: {
      create: new CreateService(services, categories),
      update: new UpdateService(services, categories),
      remove: new DeleteService(services),
      get: new GetService(services),
      list: new ListServices(services),
    },
    catalog: { get: new GetPublicCatalog(categories, services) },
    dashboard: { stats: new GetDashboardStats(categories, services) },
  };
}

export type Container = ReturnType<typeof createContainer>;
