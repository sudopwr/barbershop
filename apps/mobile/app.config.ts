import type { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * App identity lives here. Change the bundle identifier / package name
 * before your first store build — they can't be changed after publishing.
 */
const APP_NAME = process.env.EXPO_PUBLIC_SHOP_NAME || "The Gentlemen's Barber";
const IDENTIFIER = process.env.APP_IDENTIFIER || 'com.example.barbershop';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: 'barbershop',
  scheme: 'barbershop',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  backgroundColor: '#0F0E0C',
  newArchEnabled: true,
  ios: {
    bundleIdentifier: IDENTIFIER,
    supportsTablet: true,
    // Allows plain-http API calls during local development only
    infoPlist: { NSAppTransportSecurity: { NSAllowsLocalNetworking: true } },
  },
  android: {
    package: IDENTIFIER,
    adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#0F0E0C' },
    edgeToEdgeEnabled: true,
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-splash-screen',
      { image: './assets/splash-icon.png', imageWidth: 180, resizeMode: 'contain', backgroundColor: '#0F0E0C' },
    ],
  ],
  experiments: { typedRoutes: true },
  extra: {
    // Filled by `eas init`; needed for EAS Build/Update
    eas: { projectId: process.env.EAS_PROJECT_ID },
  },
});
