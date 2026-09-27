import { beforeEach, describe, expect, it } from 'vitest';

import { ConflictError, NotFoundError, ValidationError } from '../../../src/domain/errors/index.js';
import { createTestContainer } from '../../support/test-container.js';

describe('Service use cases', () => {
  let ctx: ReturnType<typeof createTestContainer>;
  let hairId: string;
  let beardId: string;
  const services = () => ctx.container.services;

  beforeEach(async () => {
    ctx = createTestContainer();
    hairId = (await ctx.container.categories.create.execute({ name: 'Hair' })).id;
    beardId = (await ctx.container.categories.create.execute({ name: 'Beard' })).id;
  });

  const fade = () => ({ categoryId: hairId, name: 'Skin Fade', price: 450, durationMinutes: 45 });

  it('creates a service in an existing category', async () => {
    const created = await services().create.execute(fade());
    expect(created).toMatchObject({ name: 'Skin Fade', price: 450, isActive: true });
  });

  it('rejects an unknown category', async () => {
    const error = await services().create.execute({ ...fade(), categoryId: 'missing' }).catch((e) => e);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.details).toEqual({ categoryId: 'Category does not exist' });
  });

  it('rejects duplicate names within a category but allows them across categories', async () => {
    await services().create.execute(fade());
    await expect(services().create.execute({ ...fade(), name: 'skin fade' })).rejects.toThrow(ConflictError);
    await expect(services().create.execute({ ...fade(), categoryId: beardId })).resolves.toBeDefined();
  });

  it('moves a service to another category', async () => {
    const created = await services().create.execute(fade());
    const moved = await services().update.execute(created.id, { categoryId: beardId });
    expect(moved.categoryId).toBe(beardId);
  });

  it('refuses moving into a missing category', async () => {
    const created = await services().create.execute(fade());
    await expect(services().update.execute(created.id, { categoryId: 'missing' })).rejects.toThrow(ValidationError);
  });

  it('filters by category, status and search text', async () => {
    await services().create.execute(fade());
    await services().create.execute({ ...fade(), name: 'Classic Cut', isActive: false });
    await services().create.execute({ ...fade(), categoryId: beardId, name: 'Beard Trim' });

    expect((await services().list.execute({ categoryId: hairId })).map((s) => s.name)).toEqual([
      'Classic Cut',
      'Skin Fade',
    ]);
    expect((await services().list.execute({ isActive: false })).map((s) => s.name)).toEqual(['Classic Cut']);
    expect((await services().list.execute({ search: 'TRIM' })).map((s) => s.name)).toEqual(['Beard Trim']);
  });

  it('deletes a service', async () => {
    const created = await services().create.execute(fade());
    await services().remove.execute(created.id);
    await expect(services().get.execute(created.id)).rejects.toThrow(NotFoundError);
  });
});
