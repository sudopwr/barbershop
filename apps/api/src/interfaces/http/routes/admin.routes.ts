import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import type { Container } from '../../../container.js';
import { authenticate } from '../plugins/authenticate.js';
import {
  CategoryResponse,
  CreateCategoryBody,
  CreateServiceBody,
  ErrorResponse,
  IdParams,
  ServiceQuery,
  ServiceResponse,
  StatsResponse,
  UpdateCategoryBody,
  UpdateServiceBody,
} from '../schemas/index.js';

const secured = { security: [{ cookieAuth: [] }, { bearerAuth: [] }] };
const errors = { 400: ErrorResponse, 401: ErrorResponse, 404: ErrorResponse, 409: ErrorResponse };

/** Everything under /api/admin requires a valid admin session. */
export const adminRoutes: FastifyPluginAsyncTypebox<{ container: Container }> = async (app, { container }) => {
  app.addHook('onRequest', authenticate(container.tokens));

  app.get(
    '/stats',
    { schema: { ...secured, tags: ['dashboard'], response: { 200: StatsResponse } } },
    () => container.dashboard.stats.execute(),
  );

  // ---- Categories ----
  app.get(
    '/categories',
    { schema: { ...secured, tags: ['categories'], response: { 200: Type.Array(CategoryResponse) } } },
    () => container.categories.list.execute(),
  );

  app.get(
    '/categories/:id',
    { schema: { ...secured, tags: ['categories'], params: IdParams, response: { 200: CategoryResponse, ...errors } } },
    (request) => container.categories.get.execute(request.params.id),
  );

  app.post(
    '/categories',
    {
      schema: { ...secured, tags: ['categories'], body: CreateCategoryBody, response: { 201: CategoryResponse, ...errors } },
    },
    async (request, reply) => reply.status(201).send(await container.categories.create.execute(request.body)),
  );

  app.patch(
    '/categories/:id',
    {
      schema: {
        ...secured,
        tags: ['categories'],
        params: IdParams,
        body: UpdateCategoryBody,
        response: { 200: CategoryResponse, ...errors },
      },
    },
    (request) => container.categories.update.execute(request.params.id, request.body),
  );

  app.delete(
    '/categories/:id',
    { schema: { ...secured, tags: ['categories'], params: IdParams, response: errors } },
    async (request, reply) => {
      await container.categories.remove.execute(request.params.id);
      return reply.status(204).send();
    },
  );

  // ---- Services ----
  app.get(
    '/services',
    {
      schema: { ...secured, tags: ['services'], querystring: ServiceQuery, response: { 200: Type.Array(ServiceResponse) } },
    },
    (request) => container.services.list.execute(request.query),
  );

  app.get(
    '/services/:id',
    { schema: { ...secured, tags: ['services'], params: IdParams, response: { 200: ServiceResponse, ...errors } } },
    (request) => container.services.get.execute(request.params.id),
  );

  app.post(
    '/services',
    { schema: { ...secured, tags: ['services'], body: CreateServiceBody, response: { 201: ServiceResponse, ...errors } } },
    async (request, reply) => reply.status(201).send(await container.services.create.execute(request.body)),
  );

  app.patch(
    '/services/:id',
    {
      schema: {
        ...secured,
        tags: ['services'],
        params: IdParams,
        body: UpdateServiceBody,
        response: { 200: ServiceResponse, ...errors },
      },
    },
    (request) => container.services.update.execute(request.params.id, request.body),
  );

  app.delete(
    '/services/:id',
    { schema: { ...secured, tags: ['services'], params: IdParams, response: errors } },
    async (request, reply) => {
      await container.services.remove.execute(request.params.id);
      return reply.status(204).send();
    },
  );
};
