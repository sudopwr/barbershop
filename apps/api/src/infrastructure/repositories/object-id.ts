import { ObjectId } from 'mongodb';

export const newId = () => new ObjectId().toHexString();

/** Returns null for strings that can't be an ObjectId, so lookups become "not found" instead of throwing. */
export const toObjectId = (id: string): ObjectId | null =>
  /^[a-f0-9]{24}$/i.test(id) ? new ObjectId(id) : null;

export const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
