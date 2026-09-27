import type { Collection, Db, Filter, ObjectId } from 'mongodb';

import { Service, type ServiceProps } from '../../domain/entities/index.js';
import type { ServiceListFilter, ServiceRepository } from '../../domain/repositories/index.js';
import { COLLECTIONS } from '../database/mongo.js';
import { escapeRegex, newId, toObjectId } from './object-id.js';

/** nameKey is a lower-cased copy of name backing the unique (categoryId, nameKey) index. */
type ServiceDoc = Omit<ServiceProps, 'id'> & { _id: ObjectId; nameKey: string };

export class MongoServiceRepository implements ServiceRepository {
  private readonly col: Collection<ServiceDoc>;

  constructor(db: Db) {
    this.col = db.collection<ServiceDoc>(COLLECTIONS.services);
  }

  nextId = newId;

  async findById(id: string) {
    const _id = toObjectId(id);
    return _id ? this.toEntity(await this.col.findOne({ _id })) : null;
  }

  async findByName(categoryId: string, name: string) {
    return this.toEntity(await this.col.findOne({ categoryId, nameKey: name.trim().toLowerCase() }));
  }

  async findAll(filter: ServiceListFilter = {}) {
    const query: Filter<ServiceDoc> = {};
    if (filter.categoryId) query.categoryId = filter.categoryId;
    if (filter.isActive !== undefined) query.isActive = filter.isActive;
    if (filter.search?.trim()) query.name = { $regex: escapeRegex(filter.search.trim()), $options: 'i' };
    const docs = await this.col.find(query).sort({ sortOrder: 1, name: 1 }).toArray();
    return docs.map((d) => this.toEntity(d)!);
  }

  countByCategory(categoryId: string) {
    return this.col.countDocuments({ categoryId });
  }

  async save(service: Service) {
    const { id, ...rest } = service.toJSON();
    await this.col.replaceOne(
      { _id: toObjectId(id)! },
      { ...rest, nameKey: rest.name.toLowerCase() },
      { upsert: true },
    );
  }

  async delete(id: string) {
    const _id = toObjectId(id);
    if (_id) await this.col.deleteOne({ _id });
  }

  private toEntity(doc: ServiceDoc | null): Service | null {
    if (!doc) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, nameKey, ...rest } = doc;
    return Service.restore({ id: _id.toHexString(), ...rest });
  }
}
