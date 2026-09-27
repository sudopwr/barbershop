import type { CategoryRepository, ServiceRepository } from '../../../domain/repositories/index.js';
import { byMenuOrder } from '../../dto.js';

export class GetDashboardStats {
  constructor(
    private readonly categories: CategoryRepository,
    private readonly services: ServiceRepository,
  ) {}

  async execute() {
    const [categories, services] = await Promise.all([this.categories.findAll(), this.services.findAll()]);
    const active = services.filter((s) => s.isActive);
    const averagePrice = active.length
      ? Math.round((active.reduce((sum, s) => sum + s.price, 0) / active.length) * 100) / 100
      : 0;

    return {
      totalCategories: categories.length,
      activeCategories: categories.filter((c) => c.isActive).length,
      totalServices: services.length,
      activeServices: active.length,
      featuredServices: services.filter((s) => s.isFeatured).length,
      averagePrice,
      servicesByCategory: categories
        .map((c) => c.toJSON())
        .sort(byMenuOrder)
        .map((c) => ({
          categoryId: c.id,
          name: c.name,
          count: services.filter((s) => s.categoryId === c.id).length,
        })),
    };
  }
}
