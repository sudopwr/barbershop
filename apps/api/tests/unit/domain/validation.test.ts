import { describe, expect, it } from 'vitest';

import { slugify } from '../../../src/domain/entities/index.js';

describe('slugify', () => {
  it.each([
    ['Haircuts', 'haircuts'],
    ['Beard & Shave', 'beard-and-shave'],
    ['  Kids   Cut!! ', 'kids-cut'],
    ['Café Crème', 'cafe-creme'],
  ])('turns "%s" into "%s"', (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});
