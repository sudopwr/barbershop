import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildApp, type App } from '../../../src/interfaces/http/app.js';
import { createTestContainer } from '../../support/test-container.js';

/**
 * HTTP adapter tests: real Fastify routing, validation and error mapping,
 * but in-memory repositories — no database needed.
 */
describe('HTTP API (in-memory)', () => {
  let app: App;
  let cookie: string;

  beforeEach(async () => {
    const { container } = createTestContainer();
    await container.auth.ensureAdmin.execute({ username: 'admin', password: 'password123' });
    app = await buildApp({ container, logLevel: 'silent' });

    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'admin', password: 'password123' },
    });
    cookie = String(login.headers['set-cookie']).split(';')[0]!;
  });

  afterEach(() => app.close());

  it('reports health', async () => {
    const res = await app.inject('/api/health');
    expect(res.json()).toEqual({ status: 'ok' });
  });

  it('sets an httpOnly, SameSite=Strict session cookie on login', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'admin', password: 'password123' },
    });
    const setCookie = String(res.headers['set-cookie']);
    expect(res.statusCode).toBe(200);
    expect(setCookie).toMatch(/^bs_admin_token=/);
    expect(setCookie).toMatch(/HttpOnly/);
    expect(setCookie).toMatch(/SameSite=Strict/);
    expect(res.json().admin).toMatchObject({ username: 'admin' });
  });

  it('returns 401 with a consistent error body for bad credentials', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'admin', password: 'wrong' },
    });
    expect(res.statusCode).toBe(401);
    expect(res.json()).toEqual({ error: { code: 'UNAUTHORIZED', message: 'Invalid username or password' } });
  });

  it('blocks admin routes without a session', async () => {
    const res = await app.inject('/api/admin/categories');
    expect(res.statusCode).toBe(401);
  });

  it('accepts a Bearer token as well as the cookie', async () => {
    const token = cookie.split('=')[1];
    const res = await app.inject({ url: '/api/auth/me', headers: { authorization: `Bearer ${token}` } });
    expect(res.statusCode).toBe(200);
    expect(res.json().admin.username).toBe('admin');
  });

  it('maps schema validation failures to 400 with field details', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/admin/services',
      headers: { cookie },
      payload: { name: 'Cut', price: -5 },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe('VALIDATION_ERROR');
    expect(res.json().error.details).toBeTypeOf('object');
  });

  it('maps domain conflicts to 409 and missing records to 404', async () => {
    await app.inject({ method: 'POST', url: '/api/admin/categories', headers: { cookie }, payload: { name: 'Hair' } });
    const dup = await app.inject({
      method: 'POST',
      url: '/api/admin/categories',
      headers: { cookie },
      payload: { name: 'hair' },
    });
    const missing = await app.inject({ url: '/api/admin/categories/unknown', headers: { cookie } });

    expect(dup.statusCode).toBe(409);
    expect(missing.statusCode).toBe(404);
  });

  it('logs out by clearing the cookie', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/auth/logout', headers: { cookie } });
    expect(res.statusCode).toBe(204);
    expect(String(res.headers['set-cookie'])).toMatch(/bs_admin_token=;/);
  });

  it('serves the public catalog without authentication', async () => {
    const res = await app.inject('/api/public/catalog');
    expect(res.statusCode).toBe(200);
    expect(res.headers['cache-control']).toBe('public, max-age=60');
    expect(res.json()).toEqual({ categories: [], featured: [], priceFrom: null });
  });

  it('returns JSON 404 for unknown routes', async () => {
    const res = await app.inject('/api/nope');
    expect(res.statusCode).toBe(404);
    expect(res.json().error.code).toBe('NOT_FOUND');
  });
});
