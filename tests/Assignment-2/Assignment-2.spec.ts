import { test, expect } from '@playwright/test';

// Assignment-2: automate a successful login on Practice Test Automation.
const LOGIN_URL = 'https://practicetestautomation.com/practice-test-login/';
const SUCCESS_URL = 'https://practicetestautomation.com/logged-in-successfully/';

test.describe('Assignment-2: Practice Test Automation login', () => {
  test('logs in with valid credentials', async ({ page }) => {
    await test.step('Visit the login page', async () => {
      await page.goto(LOGIN_URL);
      await expect(page.getByRole('heading', { name: 'Test login' })).toBeVisible();
    });

    await test.step('Enter valid username and password', async () => {
      await page.getByLabel('Username').fill('student');
      await page.getByLabel('Password').fill('Password123');
    });

    await test.step('Click the Submit button', async () => {
      await page.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('Verify the logged-in page loaded', async () => {
      await expect(page).toHaveURL(SUCCESS_URL);
      await expect(page.getByRole('heading', { name: 'Logged In Successfully' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
    });
  });
});
