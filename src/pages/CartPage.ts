import { type Locator, type Page } from '@playwright/test';
import { Header } from '@components/Header';
import { parsePrice } from '@utils/price';

export class CartPage {
  readonly header: Header;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(private readonly page: Page) {
    this.header = new Header(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async removeItem(name: string) {
    await this.items.filter({ hasText: name }).getByRole('button', { name: 'Remove' }).click();
  }

  async getPrices(): Promise<number[]> {
    const prices = await this.itemPrices.allTextContents();
    return prices.map(parsePrice);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
