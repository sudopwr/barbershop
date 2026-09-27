import type { TestProject } from 'vitest/node';

/**
 * Starts a throw-away MongoDB for the e2e suite.
 * Set E2E_MONGO_URL to use an existing server instead (CI service, docker compose).
 */
export default async function setup(project: TestProject) {
  let uri = process.env.E2E_MONGO_URL;
  let stop: (() => Promise<unknown>) | undefined;

  if (!uri) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const server = await MongoMemoryServer.create();
    uri = server.getUri();
    stop = () => server.stop();
  }

  project.provide('mongoUrl', uri);
  return async () => {
    await stop?.();
  };
}

declare module 'vitest' {
  export interface ProvidedContext {
    mongoUrl: string;
  }
}
