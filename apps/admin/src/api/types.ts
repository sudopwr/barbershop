export type Admin = {
  id: string;
  username: string;
  lastLoginAt: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  serviceCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type CategoryInput = Pick<Category, 'name' | 'description' | 'icon' | 'sortOrder' | 'isActive'>;

export type Service = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ServiceInput = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>;

export type ServiceFilters = {
  categoryId?: string;
  isActive?: boolean;
  search?: string;
};

export type DashboardStats = {
  totalCategories: number;
  activeCategories: number;
  totalServices: number;
  activeServices: number;
  featuredServices: number;
  averagePrice: number;
  servicesByCategory: { categoryId: string; name: string; count: number }[];
};
