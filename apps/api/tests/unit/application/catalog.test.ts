import { beforeEach, describe, expect, it } from 'vitest';

import { createTestContainer } from '../../support/test-container.js';

describe('GetPublicCatalog', () => {
  let ctx: ReturnType<typeof createTestContainer>;

  beforeEach(() => {
    ctx = createTestContainer();
  });

  const addCategory = (name: string, extra = {}) => ctx.container.categories.create.execute({ name, ...extra });
  const addService = (categoryId: string, name: string, extra = {}) =>
    ctx.container.services.create.execute({ categoryId, name, price: 300, durationMinutes: 30, ...extra });

  it('is empty when nothing has been added', async () => {
    expect(await ctx.container.catalog.get.execute()).toEqual({ categories: [], featured: [], priceFrom: null });
  });

  it('shows only active categories with active services, in menu order', async () => {
    const beard = await addCategory('Beard', { sortOrder: 2 });
    const hair = await addCategory('Hair', { sortOrder: 1 });
    const hidden = await addCategory('Hidden', { isActive: false });
    const empty = await addCategory('Empty');

    await addService(hair.id, 'Skin Fade', { sortOrder: 2, price: 450 });
    await addService(hair.id, 'Classic Cut', { sortOrder: 1, price: 350 });
    await addService(hair.id, 'Retired Style', { isActive: false, price: 10 });
    await addService(beard.id, 'Hot Towel Shave', { isFeatured: true, price: 300 });
    await addService(hidden.id, 'Secret', { price: 1 });
    void empty;

    const catalog = await ctx.container.catalog.get.execute();

    expect(catalog.categories.map((c) => [c.name, c.services.map((s) => s.name)])).toEqual([
      ['Hair', ['Classic Cut', 'Skin Fade']],
      ['Beard', ['Hot Towel Shave']],
    ]);
    expect(catalog.featured.map((s) => s.name)).toEqual(['Hot Towel Shave']);
    expect(catalog.priceFrom).toBe(300);
  });

  it('never leaks internal fields', async () => {
    const hair = await addCategory('Hair');
    await addService(hair.id, 'Cut');

    const [category] = (await ctx.container.catalog.get.execute()).categories;

    expect(Object.keys(category!).sort()).toEqual(['description', 'icon', 'id', 'name', 'services', 'slug']);
    expect(Object.keys(category!.services[0]!).sort()).toEqual(
      ['description', 'durationMinutes', 'id', 'imageUrl', 'isFeatured', 'name', 'price'].sort(),
    );
  });
});
