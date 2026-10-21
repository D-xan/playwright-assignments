// Raw recording, kept for comparison. Not a spec file, so Playwright does not run it.
// Recorded by clicking through the Assignment-5 journey once in a real browser.
// Replaying it unchanged FAILS at the pincode "Check" button (see README.md).
// The credentials typed during recording have been removed.

import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.urbanladder.com/');
  await page.getByRole('button', { name: 'Open account menu' }).click();
  await page.getByRole('button', { name: 'Start here' }).click();
  await page.getByRole('button', { name: 'Login with Password' }).click();
  await page.getByRole('textbox', { name: 'Email Address / Mobile Number' }).fill('<email>');
  await page.getByRole('textbox', { name: 'Password' }).fill('<password>');
  await page.getByTestId('login-submit-button').click();
  await page.getByRole('button', { name: 'Living menu' }).hover();
  await page.getByTestId('navigation-desktop-sub-category-item-1-0').click();
  await page.getByRole('button', { name: 'Sort By filter' }).click();
  await page.getByRole('radio', { name: 'Price High to Low' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Hump Solid Wood Coffee Table' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('textbox', { name: 'Enter pincode to check availability' }).fill('560001');
  await page1.getByRole('button', { name: 'Check', exact: true }).click();
  await page1.getByTestId('pdp-add-to-cart-button').click();
  await page1.locator('ct-web-popup-imageonly #close').click();
  await page1.getByRole('button', { name: 'Go to Cart' }).click();
  await page1.getByTestId('cart-item-delete-icon').click();
  await page1.getByRole('button', { name: 'Remove', exact: true }).click();
  await page1.getByRole('button', { name: 'Open account menu' }).click();
  await page1.getByRole('link', { name: 'Logout' }).click();
});
