import jwt, { type SignOptions } from 'jsonwebtoken';

import type { TokenPayload, TokenService } from '../../application/ports/index.js';

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string,
  ) {}

  sign(payload: TokenPayload): string {
    return jwt.sign({ username: payload.username }, this.secret, {
      subject: payload.sub,
      expiresIn: this.expiresIn as SignOptions['expiresIn'],
      algorithm: 'HS256',
    });
  }

  verify(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret, { algorithms: ['HS256'] });
      if (typeof decoded === 'string' || !decoded.sub) return null;
      return { sub: decoded.sub, username: String(decoded.username ?? '') };
    } catch {
      return null;
    }
  }
}
