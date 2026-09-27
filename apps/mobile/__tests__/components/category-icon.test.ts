import { toGlyph } from '@/components/category-icon';

describe('toGlyph', () => {
  it('maps the admin’s mdi:* names to bundled Material Community Icons', () => {
    expect(toGlyph('mdi:razor-double-edge')).toBe('razor-double-edge');
    expect(toGlyph('mdi:mustache')).toBe('mustache');
  });

  it('falls back to scissors for unknown or non-mdi icons', () => {
    expect(toGlyph('mdi:not-a-real-icon')).toBe('content-cut');
    expect(toGlyph('solar:scissors-bold')).toBe('content-cut');
    expect(toGlyph(undefined)).toBe('content-cut');
  });
});
