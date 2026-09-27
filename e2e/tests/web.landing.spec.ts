import { test, expect } from '@playwright/test';

test.describe('Public landing page', () => {
  test('renders the hero, menu and visit sections', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Look sharp.');
    await expect(page.getByRole('region', { name: 'Services and prices' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Opening hours' })).toBeVisible();
  });

  test('"View services & prices" scrolls to the menu', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /view services/i }).click();
    await expect(page).toHaveURL(/#services$/);
    await expect(page.getByRole('heading', { name: 'Services & prices' })).toBeInViewport();
  });

  test('offers no sign-up, login or booking forms', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'Services and prices' })).toBeVisible();

    await expect(page.getByRole('textbox')).toHaveCount(0);
    await expect(page.getByText(/sign in|sign up|register|log in/i)).toHaveCount(0);
  });
});
