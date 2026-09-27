import type { Collection, Db, ObjectId } from 'mongodb';

import { Admin, type AdminProps } from '../../domain/entities/index.js';
import type { AdminRepository } from '../../domain/repositories/index.js';
import { COLLECTIONS } from '../database/mongo.js';
import { newId, toObjectId } from './object-id.js';

type AdminDoc = Omit<AdminProps, 'id'> & { _id: ObjectId };

export class MongoAdminRepository implements AdminRepository {
  private readonly col: Collection<AdminDoc>;

  constructor(db: Db) {
    this.col = db.collection<AdminDoc>(COLLECTIONS.admins);
  }

  nextId = newId;

  async findByUsername(username: string) {
    return this.toEntity(await this.col.findOne({ username }));
  }

  async findById(id: string) {
    const _id = toObjectId(id);
    return _id ? this.toEntity(await this.col.findOne({ _id })) : null;
  }

  async save(admin: Admin) {
    const { id, ...rest } = admin.toJSON();
    await this.col.replaceOne({ _id: toObjectId(id)! }, rest, { upsert: true });
  }

  private toEntity(doc: AdminDoc | null): Admin | null {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return Admin.restore({ id: _id.toHexString(), ...rest });
  }
}
