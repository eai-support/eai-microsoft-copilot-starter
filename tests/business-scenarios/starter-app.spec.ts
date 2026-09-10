import { expect, test } from '@playwright/test';

test('business user can create and version-update a governed case', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/');

  await expect(page).toHaveTitle(/EAI Case Assistant/);
  await expect(
    page.getByRole('heading', { name: 'Customer case workspace' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Permit evidence needs review' }),
  ).toBeVisible();

  await page
    .getByRole('button', { name: /Permit evidence needs review/ })
    .click();
  await page.getByLabel('Update status').selectOption('resolved');
  await expect(page.getByText('Version 2')).toBeVisible();
  await expect(
    page.getByRole('button', { name: /Permit evidence needs review/ }),
  ).toContainText('Resolved');

  await page.getByRole('button', { name: 'Create demonstration case' }).click();
  await expect(
    page.getByText('New service request from Copilot').first(),
  ).toBeVisible();
  await expect(page.getByText('Version 1')).toBeVisible();
  expect(pageErrors).toEqual([]);
});
