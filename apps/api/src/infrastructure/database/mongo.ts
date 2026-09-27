import { MongoClient, type Db } from 'mongodb';

export const COLLECTIONS = {
  admins: 'admins',
  categories: 'categories',
  services: 'services',
} as const;

export interface MongoConnection {
  client: MongoClient;
  db: Db;
  close(): Promise<void>;
}

export async function connectMongo(url: string, dbName: string): Promise<MongoConnection> {
  const client = new MongoClient(url, { serverSelectionTimeoutMS: 10_000 });
  await client.connect();
  const db = client.db(dbName);
  await ensureIndexes(db);
  return { client, db, close: () => client.close() };
}

export async function ensureIndexes(db: Db): Promise<void> {
  await Promise.all([
    db.collection(COLLECTIONS.admins).createIndex({ username: 1 }, { unique: true }),
    db.collection(COLLECTIONS.categories).createIndex({ slug: 1 }, { unique: true }),
    db.collection(COLLECTIONS.categories).createIndex({ sortOrder: 1, name: 1 }),
    db.collection(COLLECTIONS.services).createIndex({ categoryId: 1, nameKey: 1 }, { unique: true }),
    db.collection(COLLECTIONS.services).createIndex({ isActive: 1, sortOrder: 1 }),
  ]);
}
