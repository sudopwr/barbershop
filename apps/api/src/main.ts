import { createContainer } from './container.js';
import { loadConfig, type AppConfig } from './infrastructure/config/env.js';
import { connectMongo } from './infrastructure/database/mongo.js';
import {
  MongoAdminRepository,
  MongoCategoryRepository,
  MongoServiceRepository,
} from './infrastructure/repositories/index.js';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher.js';
import { JwtTokenService } from './infrastructure/security/jwt-token-service.js';
import { buildApp } from './interfaces/http/app.js';

/** Wires real infrastructure (Mongo, bcrypt, JWT) and returns a ready-to-listen app. */
export async function bootstrap(config: AppConfig = loadConfig()) {
  const mongo = await connectMongo(config.mongoUrl, config.mongoDbName);

  const container = createContainer({
    admins: new MongoAdminRepository(mongo.db),
    categories: new MongoCategoryRepository(mongo.db),
    services: new MongoServiceRepository(mongo.db),
    hasher: new BcryptPasswordHasher(config.nodeEnv === 'test' ? 4 : 12),
    tokens: new JwtTokenService(config.jwtSecret, config.jwtExpiresIn),
  });

  const { created } = await container.auth.ensureAdmin.execute(config.admin);

  const app = await buildApp({
    container,
    logLevel: config.logLevel,
    corsOrigins: config.corsOrigins,
    cookieSecure: config.cookieSecure,
    enableDocs: config.nodeEnv !== 'production',
    healthCheck: async () => {
      await mongo.db.command({ ping: 1 });
    },
  });

  if (created) app.log.info(`Created admin account "${config.admin.username}"`);
  app.addHook('onClose', () => mongo.close());

  return { app, mongo, container };
}
