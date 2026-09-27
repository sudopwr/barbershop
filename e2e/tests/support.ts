import type { Page } from '@playwright/test';

import { expect } from '@playwright/test';

export const ADMIN = {
  username: process.env.E2E_ADMIN_USERNAME ?? 'admin',
  password: process.env.E2E_ADMIN_PASSWORD ?? 'Admin@12345',
};

export const ADMIN_URL = process.env.ADMIN_URL ?? 'http://localhost:3039';
export const WEB_URL = process.env.WEB_URL ?? 'http://localhost:5173';

/** Unique suffix so repeated runs never collide with earlier data. */
export const uid = () => Math.random().toString(36).slice(2, 7);

export async function signIn(page: Page, baseUrl = '') {
  await page.goto(`${baseUrl}/sign-in`);
  await page.getByLabel('Username').fill(ADMIN.username);
  await page.getByLabel('Password', { exact: true }).fill(ADMIN.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
}
