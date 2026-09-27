import { randomUUID } from 'node:crypto';

import { inject } from 'vitest';

import { loadConfig } from '../../src/infrastructure/config/env.js';
import { bootstrap } from '../../src/main.js';

export const ADMIN = { username: 'e2e-admin', password: 'e2e-password-123' };

/** Boots the real application (Mongo, bcrypt, JWT) against a fresh database. */
export async function startApp() {
  const config = loadConfig({
    NODE_ENV: 'test',
    MONGO_URL: inject('mongoUrl'),
    MONGO_DB_NAME: `barbershop_e2e_${randomUUID().slice(0, 8)}`,
    JWT_SECRET: 'e2e-secret-e2e-secret-e2e-secret-e2e',
    ADMIN_USERNAME: ADMIN.username,
    ADMIN_PASSWORD: ADMIN.password,
  });
  const { app, mongo } = await bootstrap(config);

  return {
    app,
    async login() {
      const res = await app.inject({ method: 'POST', url: '/api/auth/login', payload: ADMIN });
      return String(res.headers['set-cookie']).split(';')[0]!;
    },
    async stop() {
      await mongo.db.dropDatabase();
      await app.close();
    },
  };
}
