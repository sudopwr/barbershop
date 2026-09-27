import type { Collection, Db, Filter, ObjectId } from 'mongodb';

import { Category, type CategoryProps } from '../../domain/entities/index.js';
import type { CategoryRepository } from '../../domain/repositories/index.js';
import { COLLECTIONS } from '../database/mongo.js';
import { newId, toObjectId } from './object-id.js';

type CategoryDoc = Omit<CategoryProps, 'id'> & { _id: ObjectId };

export class MongoCategoryRepository implements CategoryRepository {
  private readonly col: Collection<CategoryDoc>;

  constructor(db: Db) {
    this.col = db.collection<CategoryDoc>(COLLECTIONS.categories);
  }

  nextId = newId;

  async findById(id: string) {
    const _id = toObjectId(id);
    return _id ? this.toEntity(await this.col.findOne({ _id })) : null;
  }

  async findBySlug(slug: string) {
    return this.toEntity(await this.col.findOne({ slug }));
  }

  async findAll(filter: { isActive?: boolean } = {}) {
    const query: Filter<CategoryDoc> = {};
    if (filter.isActive !== undefined) query.isActive = filter.isActive;
    const docs = await this.col.find(query).sort({ sortOrder: 1, name: 1 }).toArray();
    return docs.map((d) => this.toEntity(d)!);
  }

  async save(category: Category) {
    const { id, ...rest } = category.toJSON();
    await this.col.replaceOne({ _id: toObjectId(id)! }, rest, { upsert: true });
  }

  async delete(id: string) {
    const _id = toObjectId(id);
    if (_id) await this.col.deleteOne({ _id });
  }

  private toEntity(doc: CategoryDoc | null): Category | null {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return Category.restore({ id: _id.toHexString(), ...rest });
  }
}
