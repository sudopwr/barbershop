import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { ADMIN, startApp } from './helpers.js';

/**
 * End-to-end through HTTP → use cases → MongoDB.
 * Walks the real journey: admin signs in, builds a menu, visitors see it.
 */
describe('Catalog management (e2e)', () => {
  let ctx: Awaited<ReturnType<typeof startApp>>;
  let cookie: string;
  let hairId: string;
  let fadeId: string;

  beforeAll(async () => {
    ctx = await startApp();
  });

  afterAll(() => ctx.stop());

  it('health check pings the database', async () => {
    const res = await ctx.app.inject('/api/health');
    expect(res.json()).toEqual({ status: 'ok' });
  });

  it('seeds the admin account on boot and lets it sign in', async () => {
    const res = await ctx.app.inject({ method: 'POST', url: '/api/auth/login', payload: ADMIN });
    expect(res.statusCode).toBe(200);
    cookie = String(res.headers['set-cookie']).split(';')[0]!;

    const me = await ctx.app.inject({ url: '/api/auth/me', headers: { cookie } });
    expect(me.json().admin).toMatchObject({ username: ADMIN.username });
    expect(me.json().admin.lastLoginAt).toEqual(expect.any(String));
  });

  it('rejects a wrong password', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { ...ADMIN, password: 'wrong-password' },
    });
    expect(res.statusCode).toBe(401);
  });

  it('creates categories', async () => {
    const hair = await ctx.app.inject({
      method: 'POST',
      url: '/api/admin/categories',
      headers: { cookie },
      payload: { name: 'Haircuts', icon: 'mdi:content-cut', sortOrder: 1 },
    });
    expect(hair.statusCode).toBe(201);
    expect(hair.json()).toMatchObject({ name: 'Haircuts', slug: 'haircuts', isActive: true, serviceCount: 0 });
    hairId = hair.json().id;

    const beard = await ctx.app.inject({
      method: 'POST',
      url: '/api/admin/categories',
      headers: { cookie },
      payload: { name: 'Beard & Shave', sortOrder: 2 },
    });
    expect(beard.statusCode).toBe(201);
  });

  it('enforces unique category names at the database level too', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/admin/categories',
      headers: { cookie },
      payload: { name: 'HAIRCUTS' },
    });
    expect(res.statusCode).toBe(409);
  });

  it('creates, lists and updates services', async () => {
    const fade = await ctx.app.inject({
      method: 'POST',
      url: '/api/admin/services',
      headers: { cookie },
      payload: { categoryId: hairId, name: 'Skin Fade', price: 450, durationMinutes: 45, isFeatured: true },
    });
    expect(fade.statusCode).toBe(201);
    fadeId = fade.json().id;

    await ctx.app.inject({
      method: 'POST',
      url: '/api/admin/services',
      headers: { cookie },
      payload: { categoryId: hairId, name: 'Classic Cut', price: 350, durationMinutes: 30, isActive: false },
    });

    const list = await ctx.app.inject({ url: `/api/admin/services?categoryId=${hairId}`, headers: { cookie } });
    expect(list.json().map((s: { name: string }) => s.name)).toEqual(['Classic Cut', 'Skin Fade']);

    const inactive = await ctx.app.inject({ url: '/api/admin/services?isActive=false', headers: { cookie } });
    expect(inactive.json()).toHaveLength(1);

    const updated = await ctx.app.inject({
      method: 'PATCH',
      url: `/api/admin/services/${fadeId}`,
      headers: { cookie },
      payload: { price: 499.5 },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json()).toMatchObject({ price: 499.5, name: 'Skin Fade' });
  });

  it('shows only active items on the public catalog', async () => {
    const res = await ctx.app.inject('/api/public/catalog');
    const catalog = res.json();

    expect(res.statusCode).toBe(200);
    expect(catalog.categories).toHaveLength(1); // "Beard & Shave" has no services yet
    expect(catalog.categories[0].name).toBe('Haircuts');
    expect(catalog.categories[0].services.map((s: { name: string }) => s.name)).toEqual(['Skin Fade']);
    expect(catalog.featured).toHaveLength(1);
    expect(catalog.priceFrom).toBe(499.5);
  });

  it('reports dashboard stats', async () => {
    const res = await ctx.app.inject({ url: '/api/admin/stats', headers: { cookie } });
    expect(res.json()).toMatchObject({ totalCategories: 2, totalServices: 2, activeServices: 1, featuredServices: 1 });
  });

  it('refuses to delete a category that still has services', async () => {
    const res = await ctx.app.inject({ method: 'DELETE', url: `/api/admin/categories/${hairId}`, headers: { cookie } });
    expect(res.statusCode).toBe(409);
  });

  it('deletes services, then the empty category', async () => {
    const services = await ctx.app.inject({ url: `/api/admin/services?categoryId=${hairId}`, headers: { cookie } });
    for (const { id } of services.json()) {
      const del = await ctx.app.inject({ method: 'DELETE', url: `/api/admin/services/${id}`, headers: { cookie } });
      expect(del.statusCode).toBe(204);
    }
    const res = await ctx.app.inject({ method: 'DELETE', url: `/api/admin/categories/${hairId}`, headers: { cookie } });
    expect(res.statusCode).toBe(204);

    const catalog = await ctx.app.inject('/api/public/catalog');
    expect(catalog.json().categories).toEqual([]);
  });

  it('returns 404 for malformed and unknown ids', async () => {
    const malformed = await ctx.app.inject({ url: '/api/admin/services/not-an-id', headers: { cookie } });
    const unknown = await ctx.app.inject({ url: '/api/admin/services/650000000000000000000000', headers: { cookie } });
    expect(malformed.statusCode).toBe(404);
    expect(unknown.statusCode).toBe(404);
  });
});
