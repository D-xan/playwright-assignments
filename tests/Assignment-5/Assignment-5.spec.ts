import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { ListingPage } from './pages/ListingPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { blockMarketingPopups } from './pages/popups';

// Assignment-5: full E2E journey on Urban Ladder.
// Credentials come from .env (see .env.example), never from the code.
const EMAIL = process.env.UL_EMAIL;
const PASSWORD = process.env.UL_PASSWORD;
const PINCODE = process.env.UL_PINCODE ?? '560001';

test.describe('Assignment-5: Urban Ladder E2E', () => {
  test.skip(!EMAIL || !PASSWORD, 'Set UL_EMAIL and UL_PASSWORD in .env to run this journey');

  test('sign up, log in, add the priciest coffee table to cart, log out', async ({ page }, testInfo) => {
    test.setTimeout(3 * 60_000);
    await blockMarketingPopups(page.context());

    const home = new HomePage(page);
    const auth = new AuthPage(page);
    const listing = new ListingPage(page);

    const snap = async (name: string, target = page) =>
      testInfo.attach(name, { body: await target.screenshot(), contentType: 'image/png' });

    await test.step('1. Open the Sign Up link', async () => {
      await home.open();
      await home.goToSignUp();
      // Sign-up itself needs an SMS OTP to a real mobile number, so the
      // account used here was registered once by hand. The step checks the form.
      await auth.expectSignUpForm();
      await snap('01-sign-up-form');
    });

    await test.step('2. Log in', async () => {
      await auth.loginWithPassword(EMAIL!, PASSWORD!);
      await home.openAccountMenu();
      await expect(home.myProfileLink).toBeVisible();
      await expect(home.signInButton).toBeHidden();
      await snap('02-logged-in');
      // Close the account menu; login already landed on the home page
      await page.keyboard.press('Escape');
    });

    await test.step('3-4. Living > Coffee Tables', async () => {
      await home.openCoffeeTables();
      await listing.expectCoffeeTables();
    });

    await test.step('5. Sort By > Price: High to Low', async () => {
      await listing.sortBy('Price High to Low');
      await expect(page).toHaveURL(/sortOn=price_dsc/);
      await expect.poll(() => listing.firstPrices(8)).toHaveLength(8);
      const prices = await listing.firstPrices(8);
      expect(prices).toEqual([...prices].sort((a, b) => b - a));
      await snap('05-sorted-high-to-low');
    });

    const first = listing.firstProduct();
    const name = (await first.title.innerText()).trim();
    const priceText = (await first.price.innerText()).replace('Deal Price:', '').trim();

    // The site has no separate "View Product" button; the product title is the link,
    // and it opens in a new tab.
    const productTab = await test.step('6. View the first product', async () => {
      const [tab] = await Promise.all([page.context().waitForEvent('page'), first.title.click()]);
      await tab.waitForLoadState('domcontentloaded');
      return tab;
    });

    const product = new ProductPage(productTab);
    const cart = new CartPage(productTab);
    const tabHome = new HomePage(productTab);

    try {
      await test.step('7. Verify product details and Add to Cart', async () => {
        await product.expectProduct(name, priceText);
        await product.checkPincode(PINCODE);
        await snap('07-product-page', productTab);
        await product.addToCart();
      });

      await test.step('8. Verify the product in the cart', async () => {
        await product.goToCart();
        await cart.expectItem(name, priceText);
        await snap('08-cart', productTab);
      });
    } finally {
      // The cart belongs to a real account and persists between runs:
      // always leave it empty, even when a step above failed.
      await test.step('Clean up: empty the cart', () => cart.empty());
    }

    await test.step('9. Log out', async () => {
      await tabHome.logout();
      await tabHome.openAccountMenu();
      await expect(tabHome.signInButton).toBeVisible();
      await expect(tabHome.myProfileLink).toBeHidden();
      await snap('09-logged-out', productTab);
    });
  });
});
