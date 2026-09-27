import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import type { Container } from '../../../container.js';
import { AUTH_COOKIE, authenticate } from '../plugins/authenticate.js';
import { AdminResponse, ErrorResponse, LoginBody } from '../schemas/index.js';

interface Options {
  container: Container;
  cookieSecure: boolean;
}

export const authRoutes: FastifyPluginAsyncTypebox<Options> = async (app, { container, cookieSecure }) => {
  const cookieOptions = { path: '/api', httpOnly: true, sameSite: 'strict' as const, secure: cookieSecure };

  app.post(
    '/login',
    {
      config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
      schema: {
        tags: ['auth'],
        summary: 'Sign in as the shop admin',
        body: LoginBody,
        response: { 200: Type.Object({ admin: AdminResponse }), 401: ErrorResponse },
      },
    },
    async (request, reply) => {
      const { token, admin } = await container.auth.login.execute(request.body);
      reply.setCookie(AUTH_COOKIE, token, cookieOptions);
      return { admin };
    },
  );

  app.post('/logout', { schema: { tags: ['auth'], summary: 'Sign out' } }, async (_request, reply) => {
    reply.clearCookie(AUTH_COOKIE, cookieOptions);
    return reply.status(204).send();
  });

  app.get(
    '/me',
    {
      onRequest: authenticate(container.tokens),
      schema: { tags: ['auth'], summary: 'Current admin', response: { 200: Type.Object({ admin: AdminResponse }) } },
    },
    async (request) => ({ admin: await container.auth.currentAdmin.execute(request.admin!.sub) }),
  );
};
