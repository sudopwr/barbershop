import { test, expect } from '@playwright/test';

import { ADMIN, signIn } from './support';

test.describe('Admin authentication', () => {
  test('redirects anonymous visitors to the sign-in page', async ({ page }) => {
    await page.goto('/services');
    await expect(page).toHaveURL(/\/sign-in\?returnTo=%2Fservices/);
    await expect(page.getByRole('heading', { name: 'Admin sign in' })).toBeVisible();
  });

  test('rejects a wrong password', async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByLabel('Username').fill(ADMIN.username);
    await page.getByLabel('Password', { exact: true }).fill('definitely-wrong');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByRole('alert')).toContainText('Invalid username or password');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('signs in, survives a reload, and signs out', async ({ page }) => {
    await signIn(page);

    await page.reload();
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();

    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/\/sign-in/);

    await page.goto('/');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('keeps the session cookie out of JavaScript', async ({ page, context }) => {
    await signIn(page);
    const cookie = (await context.cookies()).find((c) => c.name === 'bs_admin_token');

    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.sameSite).toBe('Strict');
    expect(await page.evaluate(() => document.cookie)).not.toContain('bs_admin_token');
  });
});
