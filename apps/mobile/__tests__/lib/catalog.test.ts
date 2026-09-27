import { countServices, findService, relatedServices, toMenuSections } from '@/lib/catalog';

import { catalog } from '../fixtures';

describe('catalog helpers', () => {
  it('counts every visible service', () => {
    expect(countServices(catalog)).toBe(4);
    expect(countServices(undefined)).toBe(0);
  });

  it('finds a service together with its category', () => {
    expect(findService(catalog, 's3')).toMatchObject({
      name: 'Hot Towel Shave',
      category: { id: 'c2', name: 'Beard & Shave', icon: 'mdi:razor-double-edge' },
    });
    expect(findService(catalog, 'missing')).toBeUndefined();
  });

  it('builds one menu section per category', () => {
    const sections = toMenuSections(catalog);
    expect(sections.map((s) => [s.title, s.data.length])).toEqual([
      ['Haircuts', 3],
      ['Beard & Shave', 1],
    ]);
  });

  it('narrows sections to one category', () => {
    expect(toMenuSections(catalog, { slug: 'beard-and-shave' }).map((s) => s.title)).toEqual(['Beard & Shave']);
  });

  it('searches names and descriptions, case-insensitively, dropping empty sections', () => {
    expect(toMenuSections(catalog, { search: 'RAZOR' }).map((s) => s.data.map((d) => d.name))).toEqual([
      ['Hot Towel Shave'],
    ]);
    expect(toMenuSections(catalog, { search: 'cut' }).map((s) => s.data.map((d) => d.name))).toEqual([
      ['Classic Cut', 'Kids Cut'],
    ]);
    expect(toMenuSections(catalog, { search: 'nothing like this' })).toEqual([]);
  });

  it('suggests other services from the same category', () => {
    const fade = findService(catalog, 's2')!;
    expect(relatedServices(catalog, fade).map((s) => s.id)).toEqual(['s1', 's4']);
    expect(relatedServices(catalog, findService(catalog, 's3')!)).toEqual([]);
  });
});
