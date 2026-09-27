# Barber Shop — full-stack boilerplate

A barber shop's service menu, done properly:

- **Admin panel** (React + MUI, built on [minimal-ui-kit/material-kit-react](https://github.com/minimal-ui-kit/material-kit-react)): the owner signs in with a username and password, then manages **categories** and **services** (price, duration, description, image, featured, visible/hidden, display order).
- **Public landing page** (React + MUI): visitors browse the live service catalog. No registration, no login, no booking, no forms.
- **Android + iOS app** (Expo + React Native Paper): the same catalog, for customers on their phones. See [`apps/mobile/README.md`](apps/mobile/README.md).
- **API** (Node.js + Fastify + MongoDB) organised with **Clean Architecture**, test-driven with **unit, API e2e and browser e2e** tests.
- **Docker** for hot-reload development and for production builds.

```
barbershop/
├── apps/
│   ├── api/      Fastify + MongoDB REST API (clean architecture)
│   ├── admin/    Admin panel (material-kit-react, MUI 7, React 19)
│   ├── web/      Public landing page (MUI 7, React 19)
│   └── mobile/   Android + iOS customer app (Expo, standalone package)
├── e2e/          Playwright browser tests (admin + website + full journey)
├── docker/       Dev image and nginx template
├── docker-compose.yml        Dev stack (hot reload)
└── docker-compose.prod.yml   Production stack
```

---

## Quick start (Docker, recommended)

```bash
docker compose up --build
```

| App         | URL                            | Notes                                  |
| ----------- | ------------------------------ | -------------------------------------- |
| Admin panel | http://localhost:3039          | `admin` / `Admin@12345`                |
| Website     | http://localhost:5173          | Public catalog                         |
| API         | http://localhost:4000/api      | Swagger UI at http://localhost:4000/api/docs |
| MongoDB     | mongodb://localhost:27017      | Data kept in the `mongo_data` volume   |

Load a sample menu (3 categories, 8 services) so the website has something to show:

```bash
docker compose exec api npm run seed:demo -w apps/api     # or: make seed
```

Code changes reload automatically. After changing dependencies, rebuild and reset the `node_modules` volume:
`docker compose down -v && docker compose up --build` (this also wipes the dev database).

## Local development (without Docker)

Needs Node 22+ and a MongoDB you can reach.

```bash
npm install
cp apps/api/.env.example apps/api/.env      # set MONGO_URL etc.
npm run dev:api      # :4000
npm run dev:admin    # :3039  (proxies /api → :4000)
npm run dev:web      # :5173  (proxies /api → :4000)
```

On first boot the API creates the admin account from `ADMIN_USERNAME` / `ADMIN_PASSWORD`. It never overwrites an existing password on restart.

---

## Tests

| Command                  | What it runs                                                                  | Needs            |
| ------------------------ | ----------------------------------------------------------------------------- | ---------------- |
| `npm test`               | Everything below except the browser tests                                     | —                |
| `npm run test:unit -w apps/api` | Domain entities + use cases (in-memory repos) + HTTP adapter (Fastify inject) | —          |
| `npm run test:e2e -w apps/api`  | Full API through HTTP → use cases → **real MongoDB**                   | Downloads a MongoDB binary once (mongodb-memory-server), or set `E2E_MONGO_URL` |
| `npm test -w apps/admin` | Component tests: sign-in, route guards, category/service forms, HTTP client   | —                |
| `npm test -w apps/web`   | Landing page, catalog tabs, loading/error/empty states, formatting            | —                |
| `npm run test:mobile`    | Mobile: catalog selectors, formatting, API URL, ServiceRow, Menu & Service screens (Jest) | `npm install --prefix apps/mobile` |
| `npm run test:e2e`       | **Playwright** browser tests: admin auth, catalog CRUD, and the full "admin publishes → visitor sees" journey | Running stack + `npx -w e2e playwright install chromium` |

Browser tests default to the dev stack (`ADMIN_URL=http://localhost:3039`, `WEB_URL=http://localhost:5173`). To run them against production, set `ADMIN_URL`, `WEB_URL` and `E2E_ADMIN_PASSWORD`.

**TDD loop:** `npm run test:watch -w apps/api` (or `-w apps/admin` / `-w apps/web`). Start from a failing test in `tests/unit/domain` or `tests/unit/application`. These need no database, so they run in milliseconds.

---

## Architecture (API)

Dependencies point inwards only. The domain knows nothing about Fastify or MongoDB.

```
src/
├── domain/                 Enterprise rules, zero dependencies
│   ├── entities/           Category, Service, Admin (+ validation, slugify)
│   ├── errors/             ValidationError, NotFoundError, ConflictError, UnauthorizedError
│   └── repositories/       Repository interfaces (ports)
├── application/            Use cases: one class per action
│   ├── ports/              PasswordHasher, TokenService
│   └── use-cases/          auth/, categories/, services/, catalog/, dashboard/
├── infrastructure/         Adapters: Mongo repositories, bcrypt, JWT, env config
├── interfaces/http/        Fastify app, routes, TypeBox schemas, error mapping
├── container.ts            Composition root (wires adapters → use cases)
├── main.ts / server.ts     Bootstrap + graceful shutdown
└── scripts/seed-demo.ts
```

The same `createContainer()` runs with Mongo in production and with in-memory repositories in tests (`tests/support`). That swap is what keeps the unit tests fast.

**Business rules enforced in the domain and use cases**

- Category names are unique, ignoring case and punctuation (`Beard & Shave` = `beard and shave`).
- Service names are unique within a category.
- A category that still has services can't be deleted.
- Prices are 0–1,000,000 with at most 2 decimals. Durations are whole minutes from 5 to 480.
- Image URLs must be http(s).
- The public catalog shows only **active** services in **active** categories. Empty categories are hidden, and internal fields are stripped.

**REST API**

| Method | Path | Auth |
| --- | --- | --- |
| `GET` | `/api/health` | — |
| `GET` | `/api/public/catalog` | — (cached 60 s) |
| `POST` | `/api/auth/login` · `/api/auth/logout` | — (login rate-limited: 10/min) |
| `GET` | `/api/auth/me` | admin |
| `GET POST` | `/api/admin/categories` | admin |
| `GET PATCH DELETE` | `/api/admin/categories/:id` | admin |
| `GET POST` | `/api/admin/services` (`?categoryId=&isActive=&search=`) | admin |
| `GET PATCH DELETE` | `/api/admin/services/:id` | admin |
| `GET` | `/api/admin/stats` | admin |

Errors always look like `{ "error": { "code", "message", "details?" } }`, with status 400, 401, 404, 409, 429 or 500.

**Security**

- The session JWT lives in an `httpOnly`, `SameSite=Strict` cookie (`Secure` in production), so JavaScript can't read it. Bearer tokens are also accepted for API clients.
- Passwords are hashed with bcrypt (12 rounds). Unknown user and wrong password return the same error.
- Helmet headers, CORS allow-list, and a login rate limit.
- The API refuses to start in production with the example `JWT_SECRET`.
- The admin and the website call the API on the same origin (`/api`): Vite proxies it in dev, nginx in prod. No cross-site cookies are needed.

## Frontends

**Admin (`apps/admin`)** keeps material-kit-react's theme, layouts and components, with the demo pages and mock data removed. On top of that it adds:

- `src/api`: typed gateways + React Query hooks. Components never call `fetch` directly.
- `src/auth`: `AuthProvider` (asks `/auth/me` on load), `AuthGuard` / `GuestGuard` (with a safe `returnTo`).
- `src/sections/{overview,categories,services}`: dashboard with stats and chart, category and service tables with dialogs (react-hook-form + zod), inline visible/featured toggles, search, filters and pagination.
- Brand colours live in `src/theme/theme-config.ts` (brass `#B8862B`, barber red `#C0392B`).

**Website (`apps/web`)** is a dark "barbershop at night" theme (Playfair Display + Inter). It has a hero, a menu with category tabs and dotted price leaders, featured services, a "why us" section, and opening hours with contact details. The shop details come from `VITE_SHOP_*` variables (see `apps/web/.env.example`).

**Icons** are bundled offline (`tools/build-icons.py`), so neither app calls the Iconify API at runtime. The admin's category icon picker and the website share the same icon list.

---

## Mobile app

```bash
cd apps/mobile && npm install && npx expo install --fix
npm start          # Expo Go on your phone (same Wi-Fi as the API), or press a / i
```

It reads `GET /api/public/catalog`, the same endpoint as the website, so anything the admin publishes appears in the app. Store builds go through EAS (`npm run build:android` / `build:ios`); set `EXPO_PUBLIC_API_URL` in `eas.json` to your HTTPS API first. The app has its own Maestro e2e flows in `apps/mobile/.maestro`.

## Production

```bash
cp .env.production.example .env.production   # set JWT_SECRET, ADMIN_PASSWORD, shop details
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
# or: make prod
```

- `api`: multi-stage build → compiled JS, production deps only, runs as the non-root `node` user, with a healthcheck.
- `web` / `admin`: Vite builds served by nginx (gzip, long-cache for hashed assets, `no-cache` for `index.html`, SPA fallback), with `/api` proxied to the API.
- Only `web` (`:8080`) and `admin` (`:8081`) publish ports. MongoDB and the API stay on the internal network.
- Put both behind HTTPS (e.g. Caddy, Traefik or a cloud load balancer) and keep `COOKIE_SECURE=true`. Set `COOKIE_SECURE=false` only to try the stack on plain `http://localhost`.
- `VITE_*` values are baked in at build time. Rebuild the images after changing shop details.

Load the demo menu into production (optional):
`docker compose -f docker-compose.prod.yml --env-file .env.production exec api node dist/scripts/seed-demo.js`

## CI

`.github/workflows/ci.yml` runs type-checks, lint and all tests (API e2e against a MongoDB service container), builds every app, then starts the Docker dev stack and runs Playwright. Run `npm install` once and commit `package-lock.json`, then switch the workflow and Dockerfiles to `npm ci` for reproducible builds.

## Customising

- **Currency/locale**: `VITE_CURRENCY`, `VITE_LOCALE` (default `INR`, `en-IN`).
- **Shop details**: `VITE_SHOP_*` in `apps/web/.env` (dev) or `.env.production` (prod).
- **Category icons**: edit `CATEGORY_ICONS` in `tools/build-icons.py` and re-run it against a checkout of `iconify/icon-sets`.
- **New entity**: add a domain entity + repository interface → use cases with unit tests → a Mongo adapter → routes + schemas → wire it in `container.ts`.
