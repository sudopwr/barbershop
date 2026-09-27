import type { Catalog } from '@/lib/catalog';

export const catalog: Catalog = {
  categories: [
    {
      id: 'c1',
      name: 'Haircuts',
      slug: 'haircuts',
      description: 'Precision cuts',
      icon: 'mdi:content-cut',
      services: [
        { id: 's1', name: 'Classic Cut', description: 'Wash and style', price: 350, durationMinutes: 30, imageUrl: '', isFeatured: false },
        { id: 's2', name: 'Skin Fade', description: 'Down to the skin', price: 450, durationMinutes: 45, imageUrl: '', isFeatured: true },
        { id: 's4', name: 'Kids Cut', description: 'Under 12', price: 250, durationMinutes: 25, imageUrl: '', isFeatured: false },
      ],
    },
    {
      id: 'c2',
      name: 'Beard & Shave',
      slug: 'beard-and-shave',
      description: '',
      icon: 'mdi:razor-double-edge',
      services: [
        { id: 's3', name: 'Hot Towel Shave', description: 'Straight razor finish', price: 300, durationMinutes: 90, imageUrl: '', isFeatured: false },
      ],
    },
  ],
  featured: [
    { id: 's2', name: 'Skin Fade', description: 'Down to the skin', price: 450, durationMinutes: 45, imageUrl: '', isFeatured: true },
  ],
  priceFrom: 250,
};
