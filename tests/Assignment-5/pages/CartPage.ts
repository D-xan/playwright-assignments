import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly heading: Locator;
  readonly itemCount: Locator;
  readonly firstItemQuantity: Locator;
  readonly deleteIcons: Locator;
  readonly emptyMessage: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Your Cart', exact: true });
    // "(1 Items)" is a bare text node next to the heading, so read the heading's parent
    this.itemCount = this.heading.locator('..');
    this.firstItemQuantity = page.getByTestId('cart-item-quantity-input-0');
    this.deleteIcons = page.getByTestId('cart-item-delete-icon');
    this.emptyMessage = page.getByText('Your cart has room for designs.');
  }

  async expectItem(name: string, priceText: string) {
    await expect(this.page).toHaveURL(/\/cart$/);
    // The cart is filled in by a slow API call after the page loads
    await expect(this.heading).toBeVisible({ timeout: 20_000 });
    await expect(this.itemCount).toContainText('(1 Items)');
    await expect(this.page.getByText(name, { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText(`Deal Price: ${priceText}`).first()).toBeAttached();
    await expect(this.firstItemQuantity).toHaveText(/^0?1$/);
  }

  /** Remove every line item so the account's cart is left empty for the next run. */
  async empty() {
    if (!/\/cart$/.test(this.page.url())) {
      await this.page.goto('/cart', { waitUntil: 'domcontentloaded' });
    }
    // The cart is filled in by a slow API call after the page loads
    await expect(this.heading.or(this.emptyMessage)).toBeVisible({ timeout: 20_000 });
    while (await this.deleteIcons.count()) {
      const before = await this.deleteIcons.count();
      await this.clearOverlays();
      await this.deleteIcons.first().click();
      await this.page.getByRole('button', { name: 'Remove', exact: true }).click();
      await expect(this.deleteIcons).toHaveCount(before - 1);
    }
    await expect(this.emptyMessage).toBeVisible();
  }

  /**
   * The header mega-menus open on hover and the "added to cart" toast sits at the bottom;
   * either can cover the cart items. Park the mouse on blank space and let toasts go.
   */
  private async clearOverlays() {
    await this.page.mouse.move(5, 400);
    await this.page.keyboard.press('Escape');
    await expect(this.page.locator('.Toastify__toast')).toHaveCount(0, { timeout: 10_000 });
  }
}
