import { Service, type ServiceInput, type ServiceUpdate } from '../../../domain/entities/index.js';
import { ConflictError, NotFoundError, ValidationError } from '../../../domain/errors/index.js';
import type {
  CategoryRepository,
  ServiceListFilter,
  ServiceRepository,
} from '../../../domain/repositories/index.js';
import { byMenuOrder, toServiceDTO } from '../../dto.js';

async function assertCategoryExists(categories: CategoryRepository, categoryId: string) {
  if (!(await categories.findById(categoryId))) {
    throw new ValidationError('Invalid service', { categoryId: 'Category does not exist' });
  }
}

async function assertUniqueName(services: ServiceRepository, service: Service) {
  const clash = await services.findByName(service.categoryId, service.name);
  if (clash && clash.id !== service.id) {
    throw new ConflictError(`"${service.name}" already exists in this category`, { name: 'Already exists' });
  }
}

export class CreateService {
  constructor(
    private readonly services: ServiceRepository,
    private readonly categories: CategoryRepository,
  ) {}

  async execute(input: ServiceInput) {
    const service = Service.create(input, this.services.nextId());
    await assertCategoryExists(this.categories, service.categoryId);
    await assertUniqueName(this.services, service);
    await this.services.save(service);
    return toServiceDTO(service);
  }
}

export class UpdateService {
  constructor(
    private readonly services: ServiceRepository,
    private readonly categories: CategoryRepository,
  ) {}

  async execute(id: string, changes: ServiceUpdate) {
    const service = await this.services.findById(id);
    if (!service) throw new NotFoundError('Service not found');
    service.update(changes);
    if (changes.categoryId !== undefined) await assertCategoryExists(this.categories, service.categoryId);
    await assertUniqueName(this.services, service);
    await this.services.save(service);
    return toServiceDTO(service);
  }
}

export class DeleteService {
  constructor(private readonly services: ServiceRepository) {}

  async execute(id: string) {
    if (!(await this.services.findById(id))) throw new NotFoundError('Service not found');
    await this.services.delete(id);
  }
}

export class GetService {
  constructor(private readonly services: ServiceRepository) {}

  async execute(id: string) {
    const service = await this.services.findById(id);
    if (!service) throw new NotFoundError('Service not found');
    return toServiceDTO(service);
  }
}

export class ListServices {
  constructor(private readonly services: ServiceRepository) {}

  async execute(filter: ServiceListFilter = {}) {
    const list = await this.services.findAll(filter);
    return list.map(toServiceDTO).sort(byMenuOrder);
  }
}
