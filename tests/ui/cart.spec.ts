import { test, expect } from '@fixtures/test';
import { products } from '@data/products';

test.describe('Cart', () => {
  const selected = [products.backpack, products.bikeLight, products.boltTShirt];

  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(...selected.map((product) => product.name));
    await inventoryPage.header.openCart();
  });

  test('shows added products with correct prices', { tag: '@smoke' }, async ({ cartPage }) => {
    await expect(cartPage.items).toHaveCount(selected.length);
    await expect(cartPage.itemNames).toHaveText(selected.map((product) => product.name));
    expect(await cartPage.getPrices()).toEqual(selected.map((product) => product.price));
  });

  test('removes a product from the cart', async ({ cartPage }) => {
    await cartPage.removeItem(products.bikeLight.name);

    await expect(cartPage.items).toHaveCount(selected.length - 1);
    await expect(cartPage.itemNames).not.toContainText([products.bikeLight.name]);
    await expect(cartPage.header.cartBadge).toHaveText(String(selected.length - 1));
  });

  test('keeps products after page reload', async ({ page, cartPage }) => {
    await page.reload();

    await expect(cartPage.items).toHaveCount(selected.length);
  });

  test('continue shopping returns to inventory', async ({ page, cartPage, inventoryPage }) => {
    await cartPage.continueShoppingButton.click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.header.cartBadge).toHaveText(String(selected.length));
  });
});
