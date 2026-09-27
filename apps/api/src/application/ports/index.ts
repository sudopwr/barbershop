export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}

export interface TokenPayload {
  sub: string;
  username: string;
}

export interface TokenService {
  sign(payload: TokenPayload): string;
  /** Returns null for missing, expired or tampered tokens. */
  verify(token: string): TokenPayload | null;
}
