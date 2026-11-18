import { test, expect } from '@fixtures/test';
import { type SortOption } from '@pages/InventoryPage';
import { products } from '@data/products';

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('displays all products', { tag: '@smoke' }, async ({ inventoryPage }) => {
    const expectedNames = Object.values(products).map((product) => product.name);

    await expect(inventoryPage.items).toHaveCount(expectedNames.length);
    expect(await inventoryPage.getNames()).toEqual(expect.arrayContaining(expectedNames));
  });

  const nameSorting: { option: SortOption; order: 'asc' | 'desc' }[] = [
    { option: 'az', order: 'asc' },
    { option: 'za', order: 'desc' },
  ];

  for (const { option, order } of nameSorting) {
    test(`sorts products by name ${order}`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);

      const names = await inventoryPage.getNames();
      const expected = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).toEqual(order === 'asc' ? expected : expected.reverse());
    });
  }

  const priceSorting: { option: SortOption; order: 'asc' | 'desc' }[] = [
    { option: 'lohi', order: 'asc' },
    { option: 'hilo', order: 'desc' },
  ];

  for (const { option, order } of priceSorting) {
    test(`sorts products by price ${order}`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);

      const prices = await inventoryPage.getPrices();
      const expected = [...prices].sort((a, b) => (order === 'asc' ? a - b : b - a));
      expect(prices).toEqual(expected);
    });
  }

  test('cart badge reflects added and removed items', async ({ inventoryPage }) => {
    const { header } = inventoryPage;

    await expect(header.cartBadge).toBeHidden();

    await inventoryPage.addToCart(products.backpack.name, products.onesie.name);
    await expect(header.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(products.backpack.name);
    await expect(header.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(products.onesie.name);
    await expect(header.cartBadge).toBeHidden();
  });

  test('opens product details page', async ({ page, inventoryPage, productPage }) => {
    const product = products.fleeceJacket;

    await inventoryPage.openProduct(product.name);

    await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);
    await expect(productPage.name).toHaveText(product.name);
    await expect(productPage.price).toHaveText(`$${product.price}`);
    await expect(productPage.description).not.toBeEmpty();

    await productPage.addToCartButton.click();
    await expect(productPage.header.cartBadge).toHaveText('1');

    await productPage.backButton.click();
    await expect(inventoryPage.title).toHaveText('Products');
  });
});
