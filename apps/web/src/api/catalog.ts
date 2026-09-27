import { APP } from 'src/config/shop';

export type PublicService = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
  isFeatured: boolean;
};

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  services: PublicService[];
};

export type Catalog = {
  categories: PublicCategory[];
  featured: PublicService[];
  priceFrom: number | null;
};

/** The only API call the public site makes. */
export async function fetchCatalog(signal?: AbortSignal): Promise<Catalog> {
  const response = await fetch(`${APP.apiUrl}/public/catalog`, { signal });
  if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
  return response.json();
}
