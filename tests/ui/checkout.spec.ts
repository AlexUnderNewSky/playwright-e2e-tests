import { test, expect } from '@fixtures/test';
import { products, TAX_RATE } from '@data/products';
import { createCustomer } from '@data/customers';
import { sum } from '@utils/price';

test.describe('Checkout', () => {
  const order = [products.backpack, products.fleeceJacket];

  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(...order.map((product) => product.name));
    await inventoryPage.header.openCart();
    await cartPage.checkout();
  });

  test('user can complete a purchase', { tag: '@smoke' }, async ({ page, checkoutPage }) => {
    await checkoutPage.fillInformation(createCustomer());

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutPage.overviewItems).toHaveCount(order.length);

    const summary = await checkoutPage.getSummary();
    const expectedSubtotal = sum(order.map((product) => product.price));

    expect(summary.subtotal).toBe(expectedSubtotal);
    expect(summary.tax).toBeCloseTo(expectedSubtotal * TAX_RATE, 2);
    expect(summary.total).toBeCloseTo(summary.subtotal + summary.tax, 2);

    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');

    await checkoutPage.backHomeButton.click();
    await expect(page.getByTestId('shopping-cart-badge')).toBeHidden();
  });

  const requiredFields = [
    { field: 'firstName', error: 'Error: First Name is required' },
    { field: 'lastName', error: 'Error: Last Name is required' },
    { field: 'postalCode', error: 'Error: Postal Code is required' },
  ] as const;

  for (const { field, error } of requiredFields) {
    test(`requires ${field}`, async ({ page, checkoutPage }) => {
      await checkoutPage.fillInformation(createCustomer({ [field]: '' }));

      await expect(checkoutPage.errorMessage).toHaveText(error);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }

  test('cancel returns user to the cart', async ({ page, checkoutPage, cartPage }) => {
    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.items).toHaveCount(order.length);
  });
});
