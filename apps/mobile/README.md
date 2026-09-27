# Mobile app (Android + iOS)

A customer app built with Expo, Expo Router and React Native Paper, in the same dark brass theme as the website. It reads the same public endpoint (`GET /api/public/catalog`). There's no login and no registration: customers only browse.

| Tab | What it shows |
| --- | --- |
| **Home** | Hero, "from ₹…" and service-count chips, featured carousel, category tiles, opening-hours shortcut |
| **Menu** | Category chips, search, sticky category sections, pull-to-refresh |
| **Service** (tap any row) | Price, duration, description, image, "Call the shop", more in the same category |
| **Visit** | Opening hours, address/phone/email/Instagram, directions |

The catalog is cached with React Query (fresh for 5 minutes, kept for 24 h). It refetches when the app returns to the foreground, and on pull-to-refresh.

## Run it

This app is a standalone package: it isn't an npm workspace, so React Native's dependencies stay out of the web apps and Docker images.

```bash
cd apps/mobile
npm install
npx expo install --fix     # aligns native package versions with the installed Expo SDK
cp .env.example .env       # optional: shop details, currency
npm start                  # scan the QR code with Expo Go, or press a / i for emulator / simulator
```

Start the API first (`docker compose up` from the repo root, then `make seed` for demo data).

**How the app finds the API in development:** it reuses the IP of the computer running `expo start`, so a phone on the same Wi-Fi reaches `http://<your-laptop-ip>:4000/api`. The Android emulator uses `10.0.2.2` and the iOS simulator uses `localhost`. Set `EXPO_PUBLIC_API_URL` to override this (always set it for store builds).

## Structure

```
app/                     Expo Router screens (file = route)
  _layout.tsx            Fonts, splash, React Query, Paper + navigation themes
  (tabs)/index|menu|visit.tsx
  service/[id].tsx
src/
  api/catalog.ts         The single API call
  hooks/use-catalog.ts   React Query hook
  lib/                   Pure logic: catalog selectors, API-URL resolver, hours parser (unit-tested)
  components/            ServiceRow, FeaturedCard, CategoryIcon, states, SectionTitle
  config/env.ts          EXPO_PUBLIC_* → APP / SHOP
  theme/                 Palette, fonts, Paper + navigation themes
__tests__/               Jest (jest-expo) + React Native Testing Library
.maestro/                End-to-end flows on a real device/emulator
```

Category icons picked in the admin (`mdi:*`) map one-to-one to Material Community Icons bundled with Expo. Unknown names fall back to scissors.

## Tests

```bash
npm test                   # Jest: selectors, formatting, API URL, ServiceRow, Menu & Service screens
npm run test:e2e           # Maestro flows (install https://maestro.mobile.dev, run the app + API first)
```

## Build for the stores (EAS)

1. In `app.config.ts`, set `APP_IDENTIFIER` (e.g. `com.yourshop.barber`), the name and the version. The identifier can't change after you publish.
2. In `eas.json`, set `EXPO_PUBLIC_API_URL` for `preview` and `production` to your HTTPS API.
3. Then run:

```bash
npm i -g eas-cli && eas login
eas init                           # links the project, sets the projectId
npm run build:preview              # installable APK + iOS internal build for testing
npm run build:android              # Play Store (.aab)
npm run build:ios                  # App Store (needs an Apple Developer account)
eas submit -p android|ios          # upload to the stores
```

App icon, adaptive icon and splash are in `assets/`. Replace them with your own artwork at the same sizes.

Store builds must call the API over **HTTPS**. Plain `http://` only works in development: Android allows cleartext for Expo Go and dev builds only, and iOS allows only local networking.
