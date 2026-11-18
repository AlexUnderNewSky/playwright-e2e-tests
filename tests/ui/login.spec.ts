import { test, expect } from '@fixtures/test';
import { users } from '@data/users';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test(
    'standard user can log in',
    { tag: '@smoke' },
    async ({ page, loginPage, inventoryPage }) => {
      await loginPage.login(users.standard);

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.title).toHaveText('Products');
      await expect(inventoryPage.items).toHaveCount(6);
    },
  );

  test('locked out user sees an error', async ({ page, loginPage }) => {
    await loginPage.login(users.lockedOut);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  const invalidCases = [
    {
      title: 'empty username',
      credentials: { username: '', password: 'secret_sauce' },
      error: 'Epic sadface: Username is required',
    },
    {
      title: 'empty password',
      credentials: { username: 'standard_user', password: '' },
      error: 'Epic sadface: Password is required',
    },
    {
      title: 'wrong password',
      credentials: { username: 'standard_user', password: 'wrong_password' },
      error: 'Epic sadface: Username and password do not match any user in this service',
    },
    {
      title: 'unknown user',
      credentials: { username: 'unknown_user', password: 'secret_sauce' },
      error: 'Epic sadface: Username and password do not match any user in this service',
    },
  ];

  for (const { title, credentials, error } of invalidCases) {
    test(`shows validation error for ${title}`, async ({ loginPage }) => {
      await loginPage.login(credentials);

      await expect(loginPage.errorMessage).toHaveText(error);
    });
  }

  test('user can log out', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard);
    await inventoryPage.header.logout();

    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('protected page redirects unauthenticated user', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.errorMessage).toHaveText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
  });
});
