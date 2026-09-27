import { it, expect, describe } from 'vitest';

import { formatPrice, formatDuration } from './format';

describe('formatPrice', () => {
  it('drops decimals for whole amounts and keeps them otherwise', () => {
    expect(formatPrice(450, { currency: 'USD', locale: 'en-US' })).toBe('$450');
    expect(formatPrice(12.5, { currency: 'USD', locale: 'en-US' })).toBe('$12.50');
  });

  it('uses the configured currency', () => {
    expect(formatPrice(350, { currency: 'INR', locale: 'en-IN' })).toBe('₹350');
  });
});

describe('formatDuration', () => {
  it.each([
    [20, '20 min'],
    [60, '1 hr'],
    [90, '1 hr 30 min'],
    [120, '2 hr'],
  ])('%i minutes → %s', (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected);
  });
});
