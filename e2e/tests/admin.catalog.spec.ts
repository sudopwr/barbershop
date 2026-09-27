import { test, expect } from '@playwright/test';

import { uid, signIn } from './support';

test.describe('Admin catalog management', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('creates, edits and deletes a category and a service', async ({ page }) => {
    const category = `E2E Grooming ${uid()}`;
    const service = `E2E Beard Sculpt ${uid()}`;

    // Category
    await page.getByRole('link', { name: 'Categories', exact: true }).click();
    await page.getByRole('button', { name: 'New category' }).click();
    const categoryDialog = page.getByRole('dialog');
    await categoryDialog.getByLabel('Name').fill(category);
    await categoryDialog.getByLabel('Description').fill('Created by Playwright');
    await categoryDialog.getByRole('radio', { name: 'mdi:mustache' }).click();
    await categoryDialog.getByRole('button', { name: 'Create category' }).click();
    await expect(page.getByText('Category created')).toBeVisible();
    await expect(page.getByRole('row', { name: new RegExp(category) })).toBeVisible();

    // Duplicate names are rejected with a clear message
    await page.getByRole('button', { name: 'New category' }).click();
    await page.getByRole('dialog').getByLabel('Name').fill(category.toUpperCase());
    await page.getByRole('dialog').getByRole('button', { name: 'Create category' }).click();
    await expect(page.getByRole('dialog')).toContainText('already exists');
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();

    // Service
    await page.getByRole('link', { name: 'Services', exact: true }).click();
    await page.getByRole('button', { name: 'New service' }).click();
    const serviceDialog = page.getByRole('dialog');
    await serviceDialog.getByLabel('Service name').fill(service);
    await serviceDialog.getByLabel('Category').click();
    await page.getByRole('option', { name: category }).click();
    await serviceDialog.getByLabel('Description').fill('Shape, line-up and hot towel');
    await serviceDialog.getByLabel('Price').fill('299');
    await serviceDialog.getByLabel('Duration').fill('25');
    await serviceDialog.getByRole('button', { name: 'Create service' }).click();
    await expect(page.getByText('Service created')).toBeVisible();

    const row = page.getByRole('row', { name: new RegExp(service) });
    await expect(row).toContainText('₹299');
    await expect(row).toContainText('25 min');

    // Edit
    await row.getByRole('button', { name: `Edit ${service}` }).click();
    await page.getByRole('dialog').getByLabel('Price').fill('349');
    await page.getByRole('dialog').getByRole('button', { name: 'Save changes' }).click();
    await expect(row).toContainText('₹349');

    // A category with services can't be deleted
    await page.getByRole('link', { name: 'Categories', exact: true }).click();
    await page.getByRole('button', { name: `Delete ${category}` }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('alert')).toContainText('still has 1 service');

    // Clean up: service first, then the now-empty category
    await page.getByRole('link', { name: 'Services', exact: true }).click();
    await page.getByRole('button', { name: `Delete ${service}` }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText(`Deleted "${service}"`)).toBeVisible();

    await page.getByRole('link', { name: 'Categories', exact: true }).click();
    await page.getByRole('button', { name: `Delete ${category}` }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('row', { name: new RegExp(category) })).toHaveCount(0);
  });

  test('validates the service form before sending it', async ({ page }) => {
    const category = `E2E Validation ${uid()}`;
    await page.getByRole('link', { name: 'Categories', exact: true }).click();
    await page.getByRole('button', { name: 'New category' }).click();
    await page.getByRole('dialog').getByLabel('Name').fill(category);
    await page.getByRole('dialog').getByRole('button', { name: 'Create category' }).click();
    await expect(page.getByText('Category created')).toBeVisible();

    await page.getByRole('link', { name: 'Services', exact: true }).click();
    const newService = page.getByRole('button', { name: 'New service' });
    await expect(newService).toBeEnabled();
    await newService.click();
    await page.getByRole('dialog').getByLabel('Price').fill('');
    await page.getByRole('dialog').getByLabel('Duration').fill('2');
    await page.getByRole('dialog').getByRole('button', { name: 'Create service' }).click();

    await expect(page.getByText('At least 2 characters')).toBeVisible();
    await expect(page.getByText('Enter a price')).toBeVisible();
    await expect(page.getByText('At least 5 minutes')).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();

    // Clean up
    await page.getByRole('link', { name: 'Categories', exact: true }).click();
    await page.getByRole('button', { name: `Delete ${category}` }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText(`Deleted "${category}"`)).toBeVisible();
  });
});
