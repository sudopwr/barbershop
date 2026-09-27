const env = import.meta.env;

export type OpeningHours = { label: string; time: string }[];

/** "Mon – Fri=10:00 – 21:00|Sunday=Closed" → [{ label, time }] */
export function parseHours(value: string): OpeningHours {
  return value
    .split('|')
    .map((part) => part.split('='))
    .filter(([label, time]) => label?.trim() && time?.trim())
    .map(([label, time]) => ({ label: label.trim(), time: time.trim() }));
}

/** Static shop details. Everything is overridable with VITE_SHOP_* variables at build time. */
export const SHOP = {
  name: env.VITE_SHOP_NAME || "The Gentlemen's Barber",
  tagline: env.VITE_SHOP_TAGLINE || 'Sharp cuts. Hot towels. Good conversation.',
  phone: env.VITE_SHOP_PHONE || '+91 98765 43210',
  email: env.VITE_SHOP_EMAIL || 'hello@gentlemensbarber.example',
  address: env.VITE_SHOP_ADDRESS || '12 Hill Road, Bandra West, Mumbai 400050',
  mapsUrl: env.VITE_SHOP_MAPS_URL || 'https://maps.google.com/?q=Bandra+West+Mumbai',
  instagram: env.VITE_SHOP_INSTAGRAM || '',
  hours: parseHours(
    env.VITE_SHOP_HOURS || 'Mon – Fri=10:00 – 21:00|Saturday=09:00 – 21:00|Sunday=10:00 – 18:00'
  ),
};

export const APP = {
  apiUrl: env.VITE_API_URL || '/api',
  currency: env.VITE_CURRENCY || 'INR',
  locale: env.VITE_LOCALE || 'en-IN',
};
