import type { CategoryRepository, ServiceRepository } from '../../../domain/repositories/index.js';
import { byMenuOrder } from '../../dto.js';

export interface PublicService {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
  isFeatured: boolean;
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  services: PublicService[];
}

export interface PublicCatalog {
  categories: PublicCategory[];
  featured: PublicService[];
  priceFrom: number | null;
}

/**
 * What visitors see on the landing page: only active categories that
 * contain at least one active service. Internal fields (timestamps,
 * sort order, flags) are stripped.
 */
export class GetPublicCatalog {
  constructor(
    private readonly categories: CategoryRepository,
    private readonly services: ServiceRepository,
  ) {}

  async execute(): Promise<PublicCatalog> {
    const [categories, services] = await Promise.all([
      this.categories.findAll({ isActive: true }),
      this.services.findAll({ isActive: true }),
    ]);

    const sortedServices = services.map((s) => s.toJSON()).sort(byMenuOrder);
    const toPublic = (s: (typeof sortedServices)[number]): PublicService => ({
      id: s.id,
      name: s.name,
      description: s.description,
      price: s.price,
      durationMinutes: s.durationMinutes,
      imageUrl: s.imageUrl,
      isFeatured: s.isFeatured,
    });

    const publicCategories = categories
      .map((c) => c.toJSON())
      .sort(byMenuOrder)
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        services: sortedServices.filter((s) => s.categoryId === c.id).map(toPublic),
      }))
      .filter((c) => c.services.length > 0);

    const visible = publicCategories.flatMap((c) => c.services);
    return {
      categories: publicCategories,
      featured: visible.filter((s) => s.isFeatured),
      priceFrom: visible.length ? Math.min(...visible.map((s) => s.price)) : null,
    };
  }
}
