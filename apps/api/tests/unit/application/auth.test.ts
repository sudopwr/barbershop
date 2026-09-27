import { beforeEach, describe, expect, it } from 'vitest';

import { UnauthorizedError, ValidationError } from '../../../src/domain/errors/index.js';
import { createTestContainer } from '../../support/test-container.js';

describe('Admin authentication', () => {
  let ctx: ReturnType<typeof createTestContainer>;

  beforeEach(async () => {
    ctx = createTestContainer();
    await ctx.container.auth.ensureAdmin.execute({ username: 'Owner', password: 'secret-pass' });
  });

  describe('EnsureAdminAccount', () => {
    it('creates the admin once with a hashed password and lower-cased username', async () => {
      const [row] = [...ctx.deps.admins.rows.values()];
      expect(row).toMatchObject({ username: 'owner', passwordHash: 'hashed:secret-pass' });
    });

    it('is idempotent and never overwrites an existing password', async () => {
      const result = await ctx.container.auth.ensureAdmin.execute({ username: 'owner', password: 'another-pass' });
      expect(result.created).toBe(false);
      expect(ctx.deps.admins.rows.size).toBe(1);
      expect([...ctx.deps.admins.rows.values()][0]!.passwordHash).toBe('hashed:secret-pass');
    });

    it('rejects weak passwords and odd usernames', async () => {
      await expect(ctx.container.auth.ensureAdmin.execute({ username: 'x', password: 'long-enough' })).rejects.toThrow(
        ValidationError,
      );
      await expect(ctx.container.auth.ensureAdmin.execute({ username: 'boss', password: 'short' })).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe('LoginAdmin', () => {
    it('returns a token and the public admin profile', async () => {
      const result = await ctx.container.auth.login.execute({ username: ' OWNER ', password: 'secret-pass' });

      expect(result.admin.username).toBe('owner');
      expect(result.admin).not.toHaveProperty('passwordHash');
      expect(ctx.deps.tokens.verify(result.token)).toEqual({ sub: result.admin.id, username: 'owner' });
    });

    it('records the login time', async () => {
      const { admin } = await ctx.container.auth.login.execute({ username: 'owner', password: 'secret-pass' });
      expect(admin.lastLoginAt).not.toBeNull();
      expect([...ctx.deps.admins.rows.values()][0]!.lastLoginAt).toBeInstanceOf(Date);
    });

    it('uses the same error for wrong password and unknown user', async () => {
      const wrongPassword = ctx.container.auth.login.execute({ username: 'owner', password: 'nope' });
      const unknownUser = ctx.container.auth.login.execute({ username: 'ghost', password: 'secret-pass' });

      await expect(wrongPassword).rejects.toThrow(new UnauthorizedError('Invalid username or password'));
      await expect(unknownUser).rejects.toThrow(new UnauthorizedError('Invalid username or password'));
    });

    it('requires both fields', async () => {
      await expect(ctx.container.auth.login.execute({ username: '', password: '' })).rejects.toThrow(ValidationError);
    });
  });

  describe('GetCurrentAdmin', () => {
    it('rejects a session for an admin that no longer exists', async () => {
      await expect(ctx.container.auth.currentAdmin.execute('missing')).rejects.toThrow(UnauthorizedError);
    });
  });
});
