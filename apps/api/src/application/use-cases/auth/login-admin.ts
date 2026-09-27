import { Admin } from '../../../domain/entities/index.js';
import { UnauthorizedError, ValidationError } from '../../../domain/errors/index.js';
import type { AdminRepository } from '../../../domain/repositories/index.js';
import type { PasswordHasher, TokenService } from '../../ports/index.js';

export interface LoginAdminInput {
  username: string;
  password: string;
}

export class LoginAdmin {
  constructor(
    private readonly admins: AdminRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async execute({ username, password }: LoginAdminInput) {
    if (!username?.trim() || !password) {
      throw new ValidationError('Username and password are required');
    }

    const admin = await this.admins.findByUsername(Admin.normalizeUsername(username));
    // Same message for unknown user and wrong password — don't leak which one failed
    const valid = admin ? await this.hasher.compare(password, admin.passwordHash) : false;
    if (!admin || !valid) throw new UnauthorizedError('Invalid username or password');

    admin.recordLogin();
    await this.admins.save(admin);

    const token = this.tokens.sign({ sub: admin.id, username: admin.username });
    return { token, admin: admin.toPublic() };
  }
}
