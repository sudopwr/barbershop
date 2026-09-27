import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify from 'fastify';

import type { Container } from '../../container.js';
import { registerErrorHandler } from './error-handler.js';
import { adminRoutes } from './routes/admin.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { publicRoutes } from './routes/public.routes.js';

export interface HttpOptions {
  container: Container;
  logLevel?: string;
  corsOrigins?: string[];
  cookieSecure?: boolean;
  enableDocs?: boolean;
  /** Extra readiness check, e.g. pinging the database. */
  healthCheck?: () => Promise<void>;
}

export async function buildApp(options: HttpOptions) {
  const { container, logLevel = 'info', corsOrigins = [], cookieSecure = false, enableDocs = false } = options;

  const base = Fastify({
    logger:
      logLevel === 'silent'
        ? false
        : {
            level: logLevel,
            redact: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
          },
    trustProxy: true,
  });

  // Registered on the base instance: the handler doesn't need TypeBox typing
  registerErrorHandler(base);
  const app = base.withTypeProvider<TypeBoxTypeProvider>();

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, { origin: corsOrigins, credentials: true });
  await app.register(cookie);
  await app.register(rateLimit, { global: false });

  if (enableDocs) {
    await app.register(swagger, {
      openapi: {
        info: { title: 'Barber Shop API', version: '1.0.0' },
        components: {
          securitySchemes: {
            cookieAuth: { type: 'apiKey', in: 'cookie', name: 'bs_admin_token' },
            bearerAuth: { type: 'http', scheme: 'bearer' },
          },
        },
      },
    });
    await app.register(swaggerUi, { routePrefix: '/api/docs' });
  }

  app.get('/api/health', { schema: { tags: ['health'] } }, async (_request, reply) => {
    try {
      await options.healthCheck?.();
      return { status: 'ok' };
    } catch {
      return reply.status(503).send({ status: 'unavailable' });
    }
  });

  await app.register(publicRoutes, { prefix: '/api/public', container });
  await app.register(authRoutes, { prefix: '/api/auth', container, cookieSecure });
  await app.register(adminRoutes, { prefix: '/api/admin', container });

  return app;
}

export type App = Awaited<ReturnType<typeof buildApp>>;
