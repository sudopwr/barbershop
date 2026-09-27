import { describe, expect, it } from 'vitest';

import { createTestContainer } from '../../support/test-container.js';

describe('GetDashboardStats', () => {
  it('summarises the catalog', async () => {
    const { container } = createTestContainer();
    const hair = await container.categories.create.execute({ name: 'Hair', sortOrder: 1 });
    const beard = await container.categories.create.execute({ name: 'Beard', sortOrder: 2, isActive: false });
    const base = { price: 300, durationMinutes: 30 };
    await container.services.create.execute({ ...base, categoryId: hair.id, name: 'Cut', price: 400, isFeatured: true });
    await container.services.create.execute({ ...base, categoryId: hair.id, name: 'Fade', price: 500 });
    await container.services.create.execute({ ...base, categoryId: beard.id, name: 'Old', isActive: false });

    expect(await container.dashboard.stats.execute()).toEqual({
      totalCategories: 2,
      activeCategories: 1,
      totalServices: 3,
      activeServices: 2,
      featuredServices: 1,
      averagePrice: 450,
      servicesByCategory: [
        { categoryId: hair.id, name: 'Hair', count: 2 },
        { categoryId: beard.id, name: 'Beard', count: 1 },
      ],
    });
  });
});
