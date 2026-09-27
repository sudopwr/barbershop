/** Shapes returned by GET /api/public/catalog (same contract the website uses). */
export type PublicService = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
  isFeatured: boolean;
};

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  services: PublicService[];
};

export type Catalog = {
  categories: PublicCategory[];
  featured: PublicService[];
  priceFrom: number | null;
};

export type ServiceWithCategory = PublicService & { category: Pick<PublicCategory, 'id' | 'name' | 'icon'> };

export const countServices = (catalog?: Catalog) =>
  catalog?.categories.reduce((sum, c) => sum + c.services.length, 0) ?? 0;

export function findService(catalog: Catalog | undefined, id: string): ServiceWithCategory | undefined {
  for (const category of catalog?.categories ?? []) {
    const service = category.services.find((s) => s.id === id);
    if (service) return { ...service, category: { id: category.id, name: category.name, icon: category.icon } };
  }
  return undefined;
}

/**
 * Sections for the menu list: optionally one category, optionally filtered by a
 * search term (matches service name or description). Empty sections are dropped.
 */
export function toMenuSections(catalog: Catalog | undefined, { slug, search }: { slug?: string; search?: string } = {}) {
  const term = search?.trim().toLowerCase() ?? '';
  return (catalog?.categories ?? [])
    .filter((c) => !slug || c.slug === slug)
    .map((c) => ({
      key: c.id,
      title: c.name,
      icon: c.icon,
      description: c.description,
      data: term
        ? c.services.filter((s) => `${s.name} ${s.description}`.toLowerCase().includes(term))
        : c.services,
    }))
    .filter((section) => section.data.length > 0);
}

/** Related services for the detail screen: same category, excluding itself. */
export function relatedServices(catalog: Catalog | undefined, service: ServiceWithCategory, limit = 3) {
  const category = catalog?.categories.find((c) => c.id === service.category.id);
  return (category?.services ?? []).filter((s) => s.id !== service.id).slice(0, limit);
}
