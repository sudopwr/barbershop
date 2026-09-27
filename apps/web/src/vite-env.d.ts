/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_CURRENCY?: string;
  readonly VITE_LOCALE?: string;
  readonly VITE_SHOP_NAME?: string;
  readonly VITE_SHOP_TAGLINE?: string;
  readonly VITE_SHOP_PHONE?: string;
  readonly VITE_SHOP_EMAIL?: string;
  readonly VITE_SHOP_ADDRESS?: string;
  readonly VITE_SHOP_MAPS_URL?: string;
  readonly VITE_SHOP_INSTAGRAM?: string;
  readonly VITE_SHOP_HOURS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
