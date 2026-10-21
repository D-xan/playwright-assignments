import { expect, type Locator, type Page } from '@playwright/test';

export class ProductPage {
  readonly name: Locator;
  readonly price: Locator;
  readonly quantity: Locator;
  readonly pincodeInput: Locator;
  readonly pincodeCheckButton: Locator;
  readonly addToCartButton: Locator;
  readonly goToCartButton: Locator;

  constructor(private readonly page: Page) {
    this.name = page.locator('h1');
    this.price = page.getByText(/^₹[\d,]+$/).first();
    this.quantity = page.getByTestId('pdp-quantity-input');
    this.pincodeInput = page.getByTestId('pdp-pincode-input');
    this.pincodeCheckButton = page.getByTestId('pdp-pincode-check-button');
    this.addToCartButton = page.getByTestId('pdp-add-to-cart-button');
    this.goToCartButton = page.getByRole('button', { name: 'Go to Cart' });
  }

  async expectProduct(name: string, priceText: string) {
    await expect(this.page).toHaveURL(/\/product\//);
    await expect(this.name).toHaveText(name);
    await expect(this.page).toHaveTitle(name);
    await expect(this.price).toHaveText(priceText);
    await expect(this.quantity).toHaveText(/^0?1$/);
  }

  /** Add to Cart stays disabled until a delivery pincode is checked. */
  async checkPincode(pincode: string) {
    // Typing before React hydrates is lost, and the site may fill in a saved pincode
    // late and overwrite ours, so retype until the box keeps our value and Check enables
    await expect(async () => {
      await this.pincodeInput.fill('');
      await this.pincodeInput.fill(pincode);
      await expect(this.pincodeInput).toHaveValue(pincode, { timeout: 2_000 });
      await expect(this.pincodeCheckButton).toBeEnabled({ timeout: 2_000 });
    }).toPass({ timeout: 30_000 });
    await this.pincodeCheckButton.click();
    await expect(this.page.getByText(/Expected delivery by/)).toBeVisible();
    await expect(this.addToCartButton).toBeEnabled();
  }

  async addToCart() {
    await this.addToCartButton.click();
    await expect(this.goToCartButton).toBeVisible();
  }

  async goToCart() {
    await this.goToCartButton.click();
  }
}
