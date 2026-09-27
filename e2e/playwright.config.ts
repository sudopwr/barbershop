import { defineConfig, devices } from '@playwright/test';

/**
 * Browser end-to-end tests. They drive the real admin panel and landing page,
 * so the stack must be running first — either:
 *   docker compose up            (dev: admin :3039, web :5173)
 *   npm run dev:api / dev:admin / dev:web
 * or point ADMIN_URL / WEB_URL at the production stack (:8081 / :8080).
 */
const ADMIN_URL = process.env.ADMIN_URL ?? 'http://localhost:3039';
const WEB_URL = process.env.WEB_URL ?? 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'admin', use: { ...devices['Desktop Chrome'], baseURL: ADMIN_URL }, testMatch: /admin\..*\.spec\.ts/ },
    { name: 'web', use: { ...devices['Desktop Chrome'], baseURL: WEB_URL }, testMatch: /web\..*\.spec\.ts/ },
    {
      name: 'web-mobile',
      use: { ...devices['Pixel 7'], baseURL: WEB_URL },
      testMatch: /web\..*\.spec\.ts/,
    },
    {
      name: 'journey',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /journey\..*\.spec\.ts/,
    },
  ],
});

export const urls = { admin: ADMIN_URL, web: WEB_URL };
