import { it, vi, expect, describe, afterEach } from 'vitest';

import { jsonResponse } from 'src/test/render';

import { http, ApiError, setUnauthorizedHandler } from './http';

describe('http client', () => {
  afterEach(() => setUnauthorizedHandler(undefined));

  it('sends JSON with credentials and skips empty query params', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ ok: true }));

    await http('/admin/services', { query: { search: 'fade', categoryId: undefined, isActive: false } });
    await http('/admin/categories', { method: 'POST', body: { name: 'Hair' } });

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/services?search=fade&isActive=false', expect.objectContaining({ credentials: 'include', method: 'GET' }));
    const [, init] = fetchMock.mock.calls[1]!;
    expect(init).toMatchObject({ method: 'POST', body: '{"name":"Hair"}', headers: { 'Content-Type': 'application/json' } });
  });

  it('returns undefined for 204 responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));
    await expect(http('/admin/services/1', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('turns the API error envelope into an ApiError', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({ error: { code: 'CONFLICT', message: 'Already exists', details: { name: 'Already exists' } } }, 409)
    );

    const error = await http('/admin/categories', { method: 'POST', body: {} }).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 409, code: 'CONFLICT', message: 'Already exists', details: { name: 'Already exists' } });
  });

  it('notifies the auth layer on 401, except for the login call itself', async () => {
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () =>
      jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Please sign in' } }, 401)
    );

    await http('/auth/login', { method: 'POST', body: {} }).catch(() => undefined);
    expect(onUnauthorized).not.toHaveBeenCalled();

    await http('/admin/stats').catch(() => undefined);
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it('reports network failures in plain language', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(http('/admin/stats')).rejects.toMatchObject({ code: 'NETWORK_ERROR', status: 0 });
  });
});
