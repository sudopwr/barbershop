import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { resolveApiUrl } from '@/lib/api-url';
import { parseHours } from '@/lib/hours';

// EXPO_PUBLIC_* variables are inlined at build time by Expo.
export const APP = {
  apiUrl: resolveApiUrl({
    explicitUrl: process.env.EXPO_PUBLIC_API_URL,
    hostUri: Constants.expoConfig?.hostUri,
    platform: Platform.OS,
    port: process.env.EXPO_PUBLIC_API_PORT || 4000,
  }),
  currency: process.env.EXPO_PUBLIC_CURRENCY || 'INR',
  locale: process.env.EXPO_PUBLIC_LOCALE || 'en-IN',
};

export const SHOP = {
  name: process.env.EXPO_PUBLIC_SHOP_NAME || "The Gentlemen's Barber",
  tagline: process.env.EXPO_PUBLIC_SHOP_TAGLINE || 'Sharp cuts. Hot towels. Good conversation.',
  phone: process.env.EXPO_PUBLIC_SHOP_PHONE || '+91 98765 43210',
  email: process.env.EXPO_PUBLIC_SHOP_EMAIL || 'hello@gentlemensbarber.example',
  address: process.env.EXPO_PUBLIC_SHOP_ADDRESS || '12 Hill Road, Bandra West, Mumbai 400050',
  mapsUrl: process.env.EXPO_PUBLIC_SHOP_MAPS_URL || 'https://maps.google.com/?q=Bandra+West+Mumbai',
  instagram: process.env.EXPO_PUBLIC_SHOP_INSTAGRAM || '',
  hours: parseHours(
    process.env.EXPO_PUBLIC_SHOP_HOURS || 'Mon – Fri=10:00 – 21:00|Saturday=09:00 – 21:00|Sunday=10:00 – 18:00'
  ),
};
