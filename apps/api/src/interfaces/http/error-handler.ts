import type { FastifyError, FastifyInstance } from 'fastify';

import { ConflictError, DomainError, NotFoundError, UnauthorizedError } from '../../domain/errors/index.js';

const statusFor = (error: DomainError) => {
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ConflictError) return 409;
  if (error instanceof UnauthorizedError) return 401;
  return 400;
};

/** Translates domain and framework errors into one consistent JSON shape. */
export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error instanceof DomainError) {
      return reply.status(statusFor(error)).send({
        error: { code: error.code, message: error.message, details: error.details },
      });
    }

    if (error.validation) {
      const details: Record<string, string> = {};
      for (const issue of error.validation) {
        const missing = (issue.params as { missingProperty?: string })?.missingProperty;
        const field = missing ?? issue.instancePath.replace(/^\//, '').replace(/\//g, '.') ?? 'body';
        details[field || 'body'] = issue.message ?? 'is invalid';
      }
      return reply.status(400).send({
        error: { code: 'VALIDATION_ERROR', message: 'Invalid request', details },
      });
    }

    if (error.statusCode === 429) {
      return reply.status(429).send({ error: { code: 'TOO_MANY_REQUESTS', message: error.message } });
    }

    const status = error.statusCode && error.statusCode < 500 ? error.statusCode : 500;
    if (status === 500) request.log.error(error);
    return reply.status(status).send({
      error: {
        code: status === 500 ? 'INTERNAL_ERROR' : error.code ?? 'BAD_REQUEST',
        message: status === 500 ? 'Something went wrong' : error.message,
      },
    });
  });

  app.setNotFoundHandler((request, reply) =>
    reply.status(404).send({ error: { code: 'NOT_FOUND', message: `Route ${request.method} ${request.url} not found` } }),
  );
}
