import { describe, expect, it } from 'vitest';

import { Service } from '../../../src/domain/entities/index.js';
import { ValidationError } from '../../../src/domain/errors/index.js';

const valid = { categoryId: 'cat-1', name: 'Skin Fade', price: 450, durationMinutes: 45 };

describe('Service', () => {
  it('creates a service with sensible defaults', () => {
    const service = Service.create(valid, 's1');
    expect(service.toJSON()).toMatchObject({
      ...valid,
      description: '',
      imageUrl: '',
      isFeatured: false,
      isActive: true,
      sortOrder: 0,
    });
  });

  it('rounds price to two decimals', () => {
    expect(Service.create({ ...valid, price: 99.999 }, 's1').price).toBe(100);
    expect(Service.create({ ...valid, price: 12.345 }, 's1').price).toBe(12.35);
  });

  it.each([
    ['negative price', { price: -1 }, 'price'],
    ['non-number price', { price: '10' as unknown as number }, 'price'],
    ['too short duration', { durationMinutes: 2 }, 'durationMinutes'],
    ['too long duration', { durationMinutes: 600 }, 'durationMinutes'],
    ['fractional duration', { durationMinutes: 12.5 }, 'durationMinutes'],
    ['missing category', { categoryId: '' }, 'categoryId'],
    ['bad image url', { imageUrl: 'javascript:alert(1)' }, 'imageUrl'],
  ])('rejects %s', (_label, override, field) => {
    try {
      Service.create({ ...valid, ...override }, 's1');
      expect.fail('should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).details).toHaveProperty(field);
    }
  });

  it('accepts an https image url', () => {
    const service = Service.create({ ...valid, imageUrl: 'https://cdn.example.com/fade.jpg' }, 's1');
    expect(service.toJSON().imageUrl).toBe('https://cdn.example.com/fade.jpg');
  });

  it('applies partial updates', () => {
    const service = Service.create(valid, 's1');
    service.update({ price: 500, isFeatured: true });
    expect(service.toJSON()).toMatchObject({ name: 'Skin Fade', price: 500, isFeatured: true });
  });

  it('allows clearing the description', () => {
    const service = Service.create({ ...valid, description: 'Sharp' }, 's1');
    service.update({ description: '' });
    expect(service.toJSON().description).toBe('');
  });
});
