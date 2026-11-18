import { test as base } from '@playwright/test';
import { AuthApi } from '@api/AuthApi';
import { ProductsApi } from '@api/ProductsApi';

type Api = {
  authApi: AuthApi;
  productsApi: ProductsApi;
};

export const test = base.extend<Api>({
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },
  productsApi: async ({ request }, use) => {
    await use(new ProductsApi(request));
  },
});

export { expect } from '@playwright/test';
