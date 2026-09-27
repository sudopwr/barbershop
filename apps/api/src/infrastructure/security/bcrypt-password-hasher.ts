import bcrypt from 'bcryptjs';

import type { PasswordHasher } from '../../application/ports/index.js';

export class BcryptPasswordHasher implements PasswordHasher {
  constructor(private readonly rounds = 12) {}

  hash(plain: string) {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  }
}
