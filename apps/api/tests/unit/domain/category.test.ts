import { describe, expect, it } from 'vitest';

import { Category } from '../../../src/domain/entities/index.js';
import { ValidationError } from '../../../src/domain/errors/index.js';

const NOW = new Date('2026-01-01T10:00:00Z');

describe('Category', () => {
  it('creates a category with defaults and a slug', () => {
    const category = Category.create({ name: '  Beard & Shave ' }, 'c1', NOW);

    expect(category.toJSON()).toEqual({
      id: 'c1',
      name: 'Beard & Shave',
      slug: 'beard-and-shave',
      description: '',
      icon: '',
      sortOrder: 0,
      isActive: true,
      createdAt: NOW,
      updatedAt: NOW,
    });
  });

  it('rejects a missing or too short name', () => {
    expect(() => Category.create({ name: ' ' }, 'c1')).toThrow(ValidationError);
    expect(() => Category.create({ name: 'A' }, 'c1')).toThrow(ValidationError);
  });

  it('reports every invalid field at once', () => {
    try {
      Category.create({ name: '', sortOrder: -1 }, 'c1');
      expect.fail('should have thrown');
    } catch (error) {
      expect((error as ValidationError).details).toEqual({
        name: 'name is required',
        sortOrder: 'sortOrder must be a whole number between 0 and 9999',
      });
    }
  });

  it('updates fields, re-slugs the name and bumps updatedAt', () => {
    const category = Category.create({ name: 'Cuts' }, 'c1', NOW);
    const later = new Date('2026-02-01T00:00:00Z');

    category.update({ name: 'Hair Cuts', isActive: false }, later);

    expect(category.toJSON()).toMatchObject({
      name: 'Hair Cuts',
      slug: 'hair-cuts',
      isActive: false,
      createdAt: NOW,
      updatedAt: later,
    });
  });

  it('keeps its previous state when an update is invalid', () => {
    const category = Category.create({ name: 'Cuts' }, 'c1', NOW);
    expect(() => category.update({ name: '' })).toThrow(ValidationError);
    expect(category.name).toBe('Cuts');
  });
});
