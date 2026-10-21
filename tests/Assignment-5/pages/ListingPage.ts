import { expect, type Locator, type Page } from '@playwright/test';
import { parsePrice } from './price';

export class ListingPage {
  readonly heading: Locator;
  readonly sortByButton: Locator;
  readonly productCards: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText('Coffee Table', { exact: true }).first();
    this.sortByButton = page.getByRole('button', { name: 'Sort By filter' });
    this.productCards = page.getByTestId('plp-product-card');
  }

  async expectCoffeeTables() {
    await expect(this.page).toHaveURL(/\/collection\/coffee-table/);
    await expect(this.page).toHaveTitle(/Coffee Tables/);
    await expect(this.productCards.first()).toBeVisible();
  }

  async sortBy(option: string) {
    // The dropdown only reacts once the page has hydrated, so retry the click
    await expect(async () => {
      await this.sortByButton.click();
      await expect(this.sortByButton).toHaveAttribute('aria-expanded', 'true', { timeout: 2_000 });
    }).toPass({ timeout: 30_000 });
    await this.page.getByRole('radio', { name: option }).click();
  }

  /** Deal prices of the first `count` cards, read from the screen-reader text. */
  async firstPrices(count: number): Promise<number[]> {
    const texts = await this.productCards
      .locator('.sr-only', { hasText: 'Deal Price' })
      .allInnerTexts();
    return texts.slice(0, count).map(parsePrice);
  }

  firstProduct() {
    const card = this.productCards.first();
    return {
      card,
      title: card.getByTestId('plp-product-card-title'),
      price: card.locator('.sr-only', { hasText: 'Deal Price' }),
    };
  }
}
