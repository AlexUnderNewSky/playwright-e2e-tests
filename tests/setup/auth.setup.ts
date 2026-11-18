import { test as setup, expect } from '@fixtures/test';
import { users } from '@data/users';
import { env } from '../../src/env';

setup('authenticate as standard user', async ({ page, loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard);

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.title).toHaveText('Products');

  await page.context().storageState({ path: env.authFile });
});
