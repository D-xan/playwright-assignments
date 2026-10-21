import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly accountMenuButton: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;
  readonly myProfileLink: Locator;
  readonly livingMenu: Locator;

  constructor(private readonly page: Page) {
    this.accountMenuButton = page.getByRole('button', { name: 'Open account menu' });
    this.signInButton = page.getByRole('button', { name: 'SIGN IN', exact: true });
    // "New Customer? Start here" is the site's Sign Up link
    this.signUpLink = page.getByRole('button', { name: 'Start here' });
    this.myProfileLink = page.getByRole('link', { name: 'My Profile' });
    this.livingMenu = page.getByRole('button', { name: 'Living menu' });
  }

  async open() {
    // Relative path: resolved against baseURL in playwright.config.ts.
    // Ads/trackers can hold back the "load" event for minutes, so only wait for the HTML.
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveTitle(/Buy Furniture Online/);
  }

  async openAccountMenu() {
    // Clicks before React hydrates are ignored, so retry until the menu shows
    await expect(async () => {
      await this.accountMenuButton.click();
      await expect(this.signInButton.or(this.myProfileLink)).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 30_000 });
  }

  async goToSignUp() {
    await this.openAccountMenu();
    await expect(this.signUpLink).toBeVisible();
    await this.signUpLink.click();
  }

  async openCoffeeTables() {
    await expect(async () => {
      await this.page.mouse.move(0, 0);
      await this.livingMenu.hover();
      await expect(this.livingMenu).toHaveAttribute('aria-expanded', 'true', { timeout: 2_000 });
    }).toPass({ timeout: 30_000 });
    // The Living mega-menu has a "Tables" column; chain from it to the link
    await this.page
      .locator('#category-menu-3')
      .getByRole('link', { name: 'Coffee Tables', exact: true })
      .click();
  }

  async logout() {
    await this.openAccountMenu();
    await this.page.getByRole('link', { name: 'Logout', exact: true }).click();
  }
}
