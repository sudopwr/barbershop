import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  /** Base URL of the API. Defaults to same-origin `/api` (Vite proxy in dev, nginx in prod). */
  apiUrl: string;
  /** Public landing page, linked from the sidebar. */
  websiteUrl: string;
  currency: string;
  locale: string;
};

export const CONFIG: ConfigValue = {
  appName: import.meta.env.VITE_APP_NAME || 'Barber Shop Admin',
  appVersion: packageJson.version,
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  websiteUrl: import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173',
  currency: import.meta.env.VITE_CURRENCY || 'INR',
  locale: import.meta.env.VITE_LOCALE || 'en-IN',
};
