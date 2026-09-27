import type { FastifyReply, FastifyRequest } from 'fastify';

import type { TokenPayload, TokenService } from '../../../application/ports/index.js';

export const AUTH_COOKIE = 'bs_admin_token';

declare module 'fastify' {
  interface FastifyRequest {
    admin?: TokenPayload;
  }
}

/** Reads the session from the httpOnly cookie (browser) or a Bearer header (API clients). */
export function extractToken(request: FastifyRequest): string | null {
  const cookie = request.cookies?.[AUTH_COOKIE];
  if (cookie) return cookie;
  const header = request.headers.authorization;
  return header?.startsWith('Bearer ') ? header.slice(7) : null;
}

export function authenticate(tokens: TokenService) {
  return async function onRequest(request: FastifyRequest, reply: FastifyReply) {
    const token = extractToken(request);
    const payload = token ? tokens.verify(token) : null;
    if (!payload) {
      return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Please sign in' } });
    }
    request.admin = payload;
  };
}
