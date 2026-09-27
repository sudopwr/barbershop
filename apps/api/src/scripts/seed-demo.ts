/**
 * Fills an empty database with a sample barber menu so the landing page
 * has something to show. Safe to re-run: existing categories are skipped.
 *   npm run seed:demo
 */
import { createContainer } from '../container.js';
import { loadConfig } from '../infrastructure/config/env.js';
import { connectMongo } from '../infrastructure/database/mongo.js';
import {
  MongoAdminRepository,
  MongoCategoryRepository,
  MongoServiceRepository,
} from '../infrastructure/repositories/index.js';
import { BcryptPasswordHasher } from '../infrastructure/security/bcrypt-password-hasher.js';
import { JwtTokenService } from '../infrastructure/security/jwt-token-service.js';
import { slugify } from '../domain/entities/index.js';

const MENU = [
  {
    name: 'Haircuts',
    icon: 'mdi:content-cut',
    description: 'Precision cuts tailored to your face shape and style.',
    services: [
      { name: 'Classic Cut', price: 350, durationMinutes: 30, description: 'Scissor or clipper cut, wash and style.' },
      { name: 'Skin Fade', price: 450, durationMinutes: 45, description: 'Seamless fade down to the skin, finished with a line-up.', isFeatured: true },
      { name: 'Kids Cut', price: 250, durationMinutes: 25, description: 'For little gentlemen under 12.' },
    ],
  },
  {
    name: 'Beard & Shave',
    icon: 'mdi:face-man-shimmer',
    description: 'Sharp lines, hot towels and a proper straight-razor finish.',
    services: [
      { name: 'Beard Trim & Shape', price: 200, durationMinutes: 20, description: 'Shaped, lined and oiled.' },
      { name: 'Hot Towel Shave', price: 300, durationMinutes: 30, description: 'Traditional straight-razor shave with hot towels.', isFeatured: true },
    ],
  },
  {
    name: 'Grooming',
    icon: 'mdi:spa',
    description: 'Treatments to look and feel your best.',
    services: [
      { name: 'Head Massage', price: 250, durationMinutes: 20, description: 'Relaxing oil massage for scalp and shoulders.' },
      { name: 'Charcoal Face Mask', price: 400, durationMinutes: 30, description: 'Deep-cleansing mask with steam.' },
      { name: 'The Full Works', price: 999, durationMinutes: 90, description: 'Cut, shave, face mask and massage.', isFeatured: true },
    ],
  },
];

const config = loadConfig();
const mongo = await connectMongo(config.mongoUrl, config.mongoDbName);
const categoriesRepo = new MongoCategoryRepository(mongo.db);
const container = createContainer({
  admins: new MongoAdminRepository(mongo.db),
  categories: categoriesRepo,
  services: new MongoServiceRepository(mongo.db),
  hasher: new BcryptPasswordHasher(),
  tokens: new JwtTokenService(config.jwtSecret, config.jwtExpiresIn),
});

let sortOrder = 0;
for (const { services, ...category } of MENU) {
  if (await categoriesRepo.findBySlug(slugify(category.name))) {
    console.log(`skip  ${category.name} (exists)`);
    continue;
  }
  const created = await container.categories.create.execute({ ...category, sortOrder: sortOrder++ });
  for (const [i, service] of services.entries()) {
    await container.services.create.execute({ ...service, categoryId: created.id, sortOrder: i });
  }
  console.log(`added ${category.name} (${services.length} services)`);
}

await mongo.close();
