import { parseHours } from '@/lib/hours';
import { formatDuration, formatPrice, toTelUrl } from '@/utils/format';

describe('formatting', () => {
  it('formats prices in the shop currency', () => {
    expect(formatPrice(350, { currency: 'INR', locale: 'en-IN' })).toBe('₹350');
    expect(formatPrice(12.5, { currency: 'USD', locale: 'en-US' })).toBe('$12.50');
  });

  it.each([
    [20, '20 min'],
    [60, '1 hr'],
    [90, '1 hr 30 min'],
  ])('formats %i minutes as %s', (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected);
  });

  it('builds dialable tel: links', () => {
    expect(toTelUrl('+91 98765 43210')).toBe('tel:+919876543210');
  });

  it('parses opening hours and skips malformed entries', () => {
    expect(parseHours('Mon – Fri=10:00 – 21:00| Sunday = Closed |junk')).toEqual([
      { label: 'Mon – Fri', time: '10:00 – 21:00' },
      { label: 'Sunday', time: 'Closed' },
    ]);
  });
});
