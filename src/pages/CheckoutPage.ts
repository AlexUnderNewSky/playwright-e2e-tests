import { type Locator, type Page } from '@playwright/test';
import { type Customer } from '@data/customers';
import { parsePrice } from '@utils/price';

export class CheckoutPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  readonly overviewItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.errorMessage = page.getByTestId('error');

    this.overviewItems = page.getByTestId('inventory-item');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');

    this.completeHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async fillInformation(customer: Partial<Customer>) {
    await this.firstNameInput.fill(customer.firstName ?? '');
    await this.lastNameInput.fill(customer.lastName ?? '');
    await this.postalCodeInput.fill(customer.postalCode ?? '');
    await this.continueButton.click();
  }

  async getSummary() {
    const [subtotal, tax, total] = await Promise.all([
      this.subtotalLabel.textContent(),
      this.taxLabel.textContent(),
      this.totalLabel.textContent(),
    ]);
    return {
      subtotal: parsePrice(subtotal ?? ''),
      tax: parsePrice(tax ?? ''),
      total: parsePrice(total ?? ''),
    };
  }

  async finish() {
    await this.finishButton.click();
  }
}
