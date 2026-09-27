import { test, expect } from '@playwright/test';

import { uid, signIn, WEB_URL, ADMIN_URL } from './support';

/**
 * The whole point of the product: what the admin publishes is what visitors see.
 */
test('a service added in the admin appears on the website, and disappears when hidden', async ({ page }) => {
  const category = `E2E Journey ${uid()}`;
  const service = `E2E Royal Shave ${uid()}`;

  await signIn(page, ADMIN_URL);

  await page.getByRole('link', { name: 'Categories', exact: true }).click();
  await page.getByRole('button', { name: 'New category' }).click();
  await page.getByRole('dialog').getByLabel('Name').fill(category);
  await page.getByRole('dialog').getByRole('button', { name: 'Create category' }).click();
  await expect(page.getByText('Category created')).toBeVisible();

  await page.getByRole('link', { name: 'Services', exact: true }).click();
  await page.getByRole('button', { name: 'New service' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Service name').fill(service);
  await dialog.getByLabel('Category').click();
  await page.getByRole('option', { name: category }).click();
  await dialog.getByLabel('Price').fill('799');
  await dialog.getByLabel('Duration').fill('60');
  await dialog.getByRole('button', { name: 'Create service' }).click();
  await expect(page.getByText('Service created')).toBeVisible();

  // Visitor view. The public catalog is cached by browsers for up to 60 s;
  // routing the request disables Playwright's HTTP cache so we always see fresh data.
  const visitor = await page.context().browser()!.newPage();
  await visitor.route('**/api/public/catalog', (route) => route.continue());
  await visitor.goto(WEB_URL);
  const block = visitor.getByRole('article', { name: category });
  await expect(block).toContainText(service);
  await expect(block).toContainText('₹799');
  await expect(block).toContainText('1 hr');

  // Hide it in the admin → gone from the website
  const row = page.getByRole('row', { name: new RegExp(service) });
  await row.getByLabel(`Toggle ${service} visibility`).click();
  await expect(row).toContainText('Hidden');

  await visitor.reload();
  await expect(visitor.getByRole('article', { name: category })).toHaveCount(0);
  await visitor.close();

  // Clean up
  await row.getByRole('button', { name: `Delete ${service}` }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText(`Deleted "${service}"`)).toBeVisible();
  await page.getByRole('link', { name: 'Categories', exact: true }).click();
  await page.getByRole('button', { name: `Delete ${category}` }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
});
