import { Type, type Static } from '@sinclair/typebox';

/** Entities carry Date objects; the serializer turns them into ISO strings. */
const DateTime = Type.Unsafe<Date | string>({ type: 'string', format: 'date-time' });

export const ErrorResponse = Type.Object({
  error: Type.Object({
    code: Type.String(),
    message: Type.String(),
    details: Type.Optional(Type.Record(Type.String(), Type.String())),
  }),
});

export const IdParams = Type.Object({ id: Type.String({ minLength: 1, maxLength: 64 }) });

// ---- Auth -------------------------------------------------------------------

export const LoginBody = Type.Object({
  username: Type.String({ minLength: 1, maxLength: 64 }),
  password: Type.String({ minLength: 1, maxLength: 128 }),
});

export const AdminResponse = Type.Object({
  id: Type.String(),
  username: Type.String(),
  lastLoginAt: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
});

// ---- Categories -------------------------------------------------------------

const categoryFields = {
  name: Type.String({ maxLength: 60 }),
  description: Type.String({ maxLength: 300 }),
  icon: Type.String({ maxLength: 80 }),
  sortOrder: Type.Integer({ minimum: 0, maximum: 9999 }),
  isActive: Type.Boolean(),
};

export const CreateCategoryBody = Type.Object(
  {
    name: categoryFields.name,
    description: Type.Optional(categoryFields.description),
    icon: Type.Optional(categoryFields.icon),
    sortOrder: Type.Optional(categoryFields.sortOrder),
    isActive: Type.Optional(categoryFields.isActive),
  },
  { additionalProperties: false },
);
export const UpdateCategoryBody = Type.Partial(CreateCategoryBody, { additionalProperties: false });

export const CategoryResponse = Type.Object({
  id: Type.String(),
  slug: Type.String(),
  ...categoryFields,
  serviceCount: Type.Optional(Type.Integer()),
  createdAt: DateTime,
  updatedAt: DateTime,
});

// ---- Services ---------------------------------------------------------------

const serviceFields = {
  categoryId: Type.String({ minLength: 1, maxLength: 64 }),
  name: Type.String({ maxLength: 80 }),
  description: Type.String({ maxLength: 500 }),
  price: Type.Number({ minimum: 0, maximum: 1_000_000 }),
  durationMinutes: Type.Integer({ minimum: 5, maximum: 480 }),
  imageUrl: Type.String({ maxLength: 2048 }),
  isFeatured: Type.Boolean(),
  isActive: Type.Boolean(),
  sortOrder: Type.Integer({ minimum: 0, maximum: 9999 }),
};

export const CreateServiceBody = Type.Object(
  {
    categoryId: serviceFields.categoryId,
    name: serviceFields.name,
    price: serviceFields.price,
    durationMinutes: serviceFields.durationMinutes,
    description: Type.Optional(serviceFields.description),
    imageUrl: Type.Optional(serviceFields.imageUrl),
    isFeatured: Type.Optional(serviceFields.isFeatured),
    isActive: Type.Optional(serviceFields.isActive),
    sortOrder: Type.Optional(serviceFields.sortOrder),
  },
  { additionalProperties: false },
);
export const UpdateServiceBody = Type.Partial(CreateServiceBody, { additionalProperties: false });

export const ServiceQuery = Type.Object({
  categoryId: Type.Optional(Type.String({ maxLength: 64 })),
  isActive: Type.Optional(Type.Boolean()),
  search: Type.Optional(Type.String({ maxLength: 80 })),
});

export const ServiceResponse = Type.Object({
  id: Type.String(),
  ...serviceFields,
  createdAt: DateTime,
  updatedAt: DateTime,
});

// ---- Public catalog ---------------------------------------------------------

const PublicService = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.String(),
  price: Type.Number(),
  durationMinutes: Type.Integer(),
  imageUrl: Type.String(),
  isFeatured: Type.Boolean(),
});

export const CatalogResponse = Type.Object({
  categories: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
      slug: Type.String(),
      description: Type.String(),
      icon: Type.String(),
      services: Type.Array(PublicService),
    }),
  ),
  featured: Type.Array(PublicService),
  priceFrom: Type.Union([Type.Number(), Type.Null()]),
});

// ---- Dashboard --------------------------------------------------------------

export const StatsResponse = Type.Object({
  totalCategories: Type.Integer(),
  activeCategories: Type.Integer(),
  totalServices: Type.Integer(),
  activeServices: Type.Integer(),
  featuredServices: Type.Integer(),
  averagePrice: Type.Number(),
  servicesByCategory: Type.Array(
    Type.Object({ categoryId: Type.String(), name: Type.String(), count: Type.Integer() }),
  ),
});

export type LoginBodyT = Static<typeof LoginBody>;
