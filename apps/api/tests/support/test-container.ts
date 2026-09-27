import { createContainer } from '../../src/container.js';
import { FakePasswordHasher, FakeTokenService } from './fakes.js';
import {
  InMemoryAdminRepository,
  InMemoryCategoryRepository,
  InMemoryServiceRepository,
} from './in-memory-repositories.js';

export function createTestContainer() {
  const deps = {
    admins: new InMemoryAdminRepository(),
    categories: new InMemoryCategoryRepository(),
    services: new InMemoryServiceRepository(),
    hasher: new FakePasswordHasher(),
    tokens: new FakeTokenService(),
  };
  return { deps, container: createContainer(deps) };
}
