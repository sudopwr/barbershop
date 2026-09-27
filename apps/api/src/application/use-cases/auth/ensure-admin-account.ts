import { Admin } from '../../../domain/entities/index.js';
import { ValidationError } from '../../../domain/errors/index.js';
import type { AdminRepository } from '../../../domain/repositories/index.js';
import type { PasswordHasher } from '../../ports/index.js';

export const MIN_PASSWORD_LENGTH = 8;

/**
 * Bootstraps the shop-owner account from configuration on startup.
 * Idempotent: an existing account is left untouched (its password is
 * never overwritten by a restart).
 */
export class EnsureAdminAccount {
  constructor(
    private readonly admins: AdminRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: { username: string; password: string }) {
    const username = Admin.normalizeUsername(input.username ?? '');
    if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
      throw new ValidationError('Admin username must be 3-32 characters: letters, numbers, dot, dash or underscore');
    }
    if ((input.password ?? '').length < MIN_PASSWORD_LENGTH) {
      throw new ValidationError(`Admin password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    const existing = await this.admins.findByUsername(username);
    if (existing) return { created: false, admin: existing.toPublic() };

    const admin = Admin.restore({
      id: this.admins.nextId(),
      username,
      passwordHash: await this.hasher.hash(input.password),
      createdAt: new Date(),
      lastLoginAt: null,
    });
    await this.admins.save(admin);
    return { created: true, admin: admin.toPublic() };
  }
}
