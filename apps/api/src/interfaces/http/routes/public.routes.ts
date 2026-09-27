import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import type { Container } from '../../../container.js';
import { CatalogResponse } from '../schemas/index.js';

export const publicRoutes: FastifyPluginAsyncTypebox<{ container: Container }> = async (app, { container }) => {
  app.get(
    '/catalog',
    {
      schema: {
        tags: ['public'],
        summary: 'Active categories and services shown on the landing page',
        response: { 200: CatalogResponse },
      },
    },
    async (_request, reply) => {
      // Short public cache: menu changes show up within a minute
      reply.header('Cache-Control', 'public, max-age=60');
      return container.catalog.get.execute();
    },
  );
};
