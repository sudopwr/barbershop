import 'dotenv/config';

export interface AppConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  host: string;
  logLevel: string;
  mongoUrl: string;
  mongoDbName: string;
  corsOrigins: string[];
  jwtSecret: string;
  jwtExpiresIn: string;
  cookieSecure: boolean;
  admin: { username: string; password: string };
}

const DEV_SECRET = 'change-me-to-a-long-random-string-at-least-32-chars';

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const nodeEnv = (env.NODE_ENV ?? 'development') as AppConfig['nodeEnv'];
  const jwtSecret = env.JWT_SECRET ?? (nodeEnv === 'production' ? '' : DEV_SECRET);

  if (jwtSecret.length < 32) throw new Error('JWT_SECRET must be set and at least 32 characters long');
  if (nodeEnv === 'production' && jwtSecret === DEV_SECRET) {
    throw new Error('JWT_SECRET is still the example value — set a real secret for production');
  }

  return {
    nodeEnv,
    port: Number(env.PORT ?? 4000),
    host: env.HOST ?? '0.0.0.0',
    logLevel: env.LOG_LEVEL ?? (nodeEnv === 'test' ? 'silent' : 'info'),
    mongoUrl: env.MONGO_URL ?? 'mongodb://localhost:27017',
    mongoDbName: env.MONGO_DB_NAME ?? 'barbershop',
    corsOrigins: (env.CORS_ORIGINS ?? 'http://localhost:3039,http://localhost:5173')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    jwtSecret,
    jwtExpiresIn: env.JWT_EXPIRES_IN ?? '8h',
    cookieSecure: (env.COOKIE_SECURE ?? String(nodeEnv === 'production')) === 'true',
    admin: {
      username: env.ADMIN_USERNAME ?? 'admin',
      password: env.ADMIN_PASSWORD ?? (nodeEnv === 'production' ? '' : 'Admin@12345'),
    },
  };
}
