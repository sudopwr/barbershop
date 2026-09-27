import type { PasswordHasher, TokenPayload, TokenService } from '../../src/application/ports/index.js';

/** Deterministic, fast stand-in for bcrypt. */
export class FakePasswordHasher implements PasswordHasher {
  async hash(plain: string) {
    return `hashed:${plain}`;
  }

  async compare(plain: string, hash: string) {
    return hash === `hashed:${plain}`;
  }
}

/** Encodes the payload as base64 JSON so tests can reason about tokens. */
export class FakeTokenService implements TokenService {
  sign(payload: TokenPayload) {
    return `token.${Buffer.from(JSON.stringify(payload)).toString('base64url')}`;
  }

  verify(token: string) {
    if (!token.startsWith('token.')) return null;
    try {
      return JSON.parse(Buffer.from(token.slice(6), 'base64url').toString()) as TokenPayload;
    } catch {
      return null;
    }
  }
}
