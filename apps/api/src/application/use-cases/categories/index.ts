import { Category, slugify, type CategoryInput, type CategoryUpdate } from '../../../domain/entities/index.js';
import { ConflictError, NotFoundError } from '../../../domain/errors/index.js';
import type { CategoryRepository, ServiceRepository } from '../../../domain/repositories/index.js';
import { byMenuOrder, toCategoryDTO } from '../../dto.js';

async function assertUniqueSlug(categories: CategoryRepository, name: string, ignoreId?: string) {
  const clash = await categories.findBySlug(slugify(name ?? ''));
  if (clash && clash.id !== ignoreId) {
    throw new ConflictError(`A category named "${clash.name}" already exists`, { name: 'Already exists' });
  }
}

export class CreateCategory {
  constructor(private readonly categories: CategoryRepository) {}

  async execute(input: CategoryInput) {
    // Build first so validation errors win over uniqueness checks
    const category = Category.create(input, this.categories.nextId());
    await assertUniqueSlug(this.categories, category.name);
    await this.categories.save(category);
    return toCategoryDTO(category, 0);
  }
}

export class UpdateCategory {
  constructor(private readonly categories: CategoryRepository) {}

  async execute(id: string, changes: CategoryUpdate) {
    const category = await this.categories.findById(id);
    if (!category) throw new NotFoundError('Category not found');
    category.update(changes);
    await assertUniqueSlug(this.categories, category.name, category.id);
    await this.categories.save(category);
    return toCategoryDTO(category);
  }
}

export class DeleteCategory {
  constructor(
    private readonly categories: CategoryRepository,
    private readonly services: ServiceRepository,
  ) {}

  async execute(id: string) {
    const category = await this.categories.findById(id);
    if (!category) throw new NotFoundError('Category not found');
    const count = await this.services.countByCategory(id);
    if (count > 0) {
      throw new ConflictError(
        `"${category.name}" still has ${count} service${count === 1 ? '' : 's'}. Move or delete them first.`,
      );
    }
    await this.categories.delete(id);
  }
}

export class GetCategory {
  constructor(private readonly categories: CategoryRepository) {}

  async execute(id: string) {
    const category = await this.categories.findById(id);
    if (!category) throw new NotFoundError('Category not found');
    return toCategoryDTO(category);
  }
}

export class ListCategories {
  constructor(
    private readonly categories: CategoryRepository,
    private readonly services: ServiceRepository,
  ) {}

  async execute() {
    const all = await this.categories.findAll();
    const withCounts = await Promise.all(
      all.map(async (c) => toCategoryDTO(c, await this.services.countByCategory(c.id))),
    );
    return withCounts.sort(byMenuOrder);
  }
}
