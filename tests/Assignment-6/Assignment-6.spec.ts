import { test, expect } from '@playwright/test';

// Assignment-6: recorded with Playwright's recorder (same locator engine as `npx playwright codegen`)
// by clicking through the Assignment-5 journey once. The raw recording is in
// recording.raw.ts; replaying it failed at the pincode "Check" button (see README).
// Every line changed or added after recording is marked // FIX: or // ASSERT:.

test('test', async ({ page }) => {
  test.setTimeout(2 * 60_000);

  // FIX: the marketing pop-up appears at random and blocks clicks. The recording clicked its
  // close button once; a locator handler closes it whenever it shows up during replay.
  await page.context().on('page', (p) =>
    p.addLocatorHandler(p.locator('ct-web-popup-imageonly #container'), () =>
      p.locator('ct-web-popup-imageonly #close').click(),
    ),
  );
  await page.addLocatorHandler(page.locator('ct-web-popup-imageonly #container'), () =>
    page.locator('ct-web-popup-imageonly #close').click(),
  );

  await page.goto('https://www.urbanladder.com/');
  await page.getByRole('button', { name: 'Open account menu' }).click();
  await page.getByRole('button', { name: 'Start here' }).click();
  await expect(page).toHaveURL(/\/auth\/register/); // ASSERT: sign-up page opened
  await page.getByRole('button', { name: 'Login with Password' }).click();
  // FIX: credentials from .env instead of the values typed during recording
  await page.getByRole('textbox', { name: 'Email Address / Mobile Number' }).fill(process.env.UL_EMAIL!);
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.UL_PASSWORD!);
  await page.getByTestId('login-submit-button').click();
  // FIX + ASSERT: wait for login to finish before moving on (the replay ran ahead of it)
  await expect(page).toHaveURL('https://www.urbanladder.com/');

  await page.getByRole('button', { name: 'Living menu' }).hover();
  await page.getByTestId('navigation-desktop-sub-category-item-1-0').click();
  await expect(page).toHaveURL(/\/collection\/coffee-table/); // ASSERT: Coffee Tables page

  // FIX: clicks before the page finishes loading its scripts are ignored; retry until the menu opens
  await expect(async () => {
    await page.getByRole('button', { name: 'Sort By filter' }).click();
    await expect(page.getByRole('radio', { name: 'Price High to Low' })).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 30_000 });
  await page.getByRole('radio', { name: 'Price High to Low' }).click();
  await expect(page).toHaveURL(/sortOn=price_dsc/); // ASSERT: sorted High to Low

  // FIX: the recording named the product it saw ('Hump Solid Wood Coffee Table'); use the
  // first card instead so the test still follows "first product" if the catalogue changes
  const firstTitle = page.getByTestId('plp-product-card-title').first();
  const productName = (await firstTitle.innerText()).trim();
  const page1Promise = page.waitForEvent('popup');
  await firstTitle.click();
  const page1 = await page1Promise;
  await expect(page1.locator('h1')).toHaveText(productName, { timeout: 15_000 }); // ASSERT: right product opened

  try {
    // FIX: typing before the page is ready is lost and Check stays disabled; retype until it enables
    await expect(async () => {
      await page1.getByRole('textbox', { name: 'Enter pincode to check availability' }).fill('560001');
      await expect(page1.getByRole('textbox', { name: 'Enter pincode to check availability' })).toHaveValue('560001', { timeout: 2_000 });
      await expect(page1.getByRole('button', { name: 'Check', exact: true })).toBeEnabled({ timeout: 2_000 });
    }).toPass({ timeout: 30_000 });
    await page1.getByRole('button', { name: 'Check', exact: true }).click();
    await page1.getByTestId('pdp-add-to-cart-button').click();
    await page1.getByRole('button', { name: 'Go to Cart' }).click();

    // ASSERT: the cart holds exactly this product (the cart fills in late, so allow 20s)
    await expect(page1.getByRole('heading', { name: 'Your Cart', exact: true })).toBeVisible({ timeout: 20_000 });
    await expect(page1.getByRole('heading', { name: 'Your Cart', exact: true }).locator('..')).toContainText('(1 Items)');
    await expect(page1.getByRole('button', { name: productName, exact: true })).toBeVisible();
  } finally {
    // Recorded step, kept as cleanup: remove the item so the account's cart is left empty
    // FIX: run it even if a step above failed, and handle a cart that is already empty
    if (!page1.url().endsWith('/cart')) await page1.goto('https://www.urbanladder.com/cart');
    const empty = page1.getByText('Your cart has room for designs.');
    const deleteIcon = page1.getByTestId('cart-item-delete-icon');
    await expect(deleteIcon.first().or(empty)).toBeVisible({ timeout: 20_000 });
    while (await deleteIcon.count()) {
      const before = await deleteIcon.count();
      // FIX: a hover mega-menu or the "added to cart" toast can cover the item; park the
      // mouse on blank space and wait for toasts to go before clicking
      await page1.mouse.move(5, 400);
      await page1.keyboard.press('Escape');
      await expect(page1.locator('.Toastify__toast')).toHaveCount(0, { timeout: 10_000 });
      await deleteIcon.first().click();
      await page1.getByRole('button', { name: 'Remove', exact: true }).click();
      await expect(deleteIcon).toHaveCount(before - 1);
    }
    await expect(empty).toBeVisible(); // ASSERT: cart is empty again
  }

  await page1.getByRole('button', { name: 'Open account menu' }).click();
  await page1.getByRole('link', { name: 'Logout' }).click();
  // ASSERT: logged out — the account menu offers SIGN IN again
  await page1.getByRole('button', { name: 'Open account menu' }).click();
  await expect(page1.getByRole('button', { name: 'SIGN IN', exact: true })).toBeVisible();
});
