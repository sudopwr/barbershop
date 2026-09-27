import { beforeEach, describe, expect, it } from 'vitest';

import { ConflictError, NotFoundError, ValidationError } from '../../../src/domain/errors/index.js';
import { createTestContainer } from '../../support/test-container.js';

describe('Category use cases', () => {
  let ctx: ReturnType<typeof createTestContainer>;
  const categories = () => ctx.container.categories;

  beforeEach(() => {
    ctx = createTestContainer();
  });

  it('creates and persists a category', async () => {
    const created = await categories().create.execute({ name: 'Haircuts', icon: 'mdi:content-cut' });

    expect(created).toMatchObject({ name: 'Haircuts', slug: 'haircuts', serviceCount: 0 });
    expect(ctx.deps.categories.rows.has(created.id)).toBe(true);
  });

  it('refuses a duplicate name (case and punctuation insensitive)', async () => {
    await categories().create.execute({ name: 'Beard & Shave' });
    await expect(categories().create.execute({ name: 'beard and shave' })).rejects.toThrow(ConflictError);
  });

  it('validates before checking uniqueness', async () => {
    await expect(categories().create.execute({ name: '' })).rejects.toThrow(ValidationError);
  });

  it('lists categories in menu order with service counts', async () => {
    const b = await categories().create.execute({ name: 'Beard', sortOrder: 2 });
    await categories().create.execute({ name: 'Hair', sortOrder: 1 });
    await categories().create.execute({ name: 'Extras', sortOrder: 2 });
    await ctx.container.services.create.execute({ categoryId: b.id, name: 'Trim', price: 100, durationMinutes: 15 });

    const list = await categories().list.execute();

    expect(list.map((c) => [c.name, c.serviceCount])).toEqual([
      ['Hair', 0],
      ['Beard', 1],
      ['Extras', 0],
    ]);
  });

  it('updates a category and allows keeping its own name', async () => {
    const created = await categories().create.execute({ name: 'Hair' });
    const updated = await categories().update.execute(created.id, { name: 'Hair', description: 'All cuts' });
    expect(updated.description).toBe('All cuts');
  });

  it('refuses renaming onto another category', async () => {
    await categories().create.execute({ name: 'Hair' });
    const beard = await categories().create.execute({ name: 'Beard' });
    await expect(categories().update.execute(beard.id, { name: 'HAIR' })).rejects.toThrow(ConflictError);
  });

  it('throws NotFound for unknown ids', async () => {
    await expect(categories().get.execute('nope')).rejects.toThrow(NotFoundError);
    await expect(categories().update.execute('nope', { name: 'X1' })).rejects.toThrow(NotFoundError);
    await expect(categories().remove.execute('nope')).rejects.toThrow(NotFoundError);
  });

  it('deletes an empty category', async () => {
    const created = await categories().create.execute({ name: 'Hair' });
    await categories().remove.execute(created.id);
    expect(ctx.deps.categories.rows.size).toBe(0);
  });

  it('protects a category that still has services', async () => {
    const created = await categories().create.execute({ name: 'Hair' });
    await ctx.container.services.create.execute({ categoryId: created.id, name: 'Cut', price: 1, durationMinutes: 10 });

    await expect(categories().remove.execute(created.id)).rejects.toThrow(/still has 1 service\./);
  });
});
