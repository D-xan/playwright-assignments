import { expect, type Locator, type Page } from '@playwright/test';

// Urban Ladder shows one "Login / Sign Up" page; new users sign up by mobile + SMS OTP,
// registered users can switch to "Login with Password".
export class AuthPage {
  readonly heading: Locator;
  readonly mobileInput: Locator;
  readonly sendOtpButton: Locator;
  readonly loginWithPasswordButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Login / Sign Up' });
    this.mobileInput = page.getByPlaceholder('Enter 10-digit Mobile Number');
    this.sendOtpButton = page.getByRole('button', { name: 'Send OTP' });
    this.loginWithPasswordButton = page.getByRole('button', { name: 'Login with Password' });
    this.emailInput = page.getByTestId('login-email-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.loginButton = page.getByTestId('login-submit-button');
  }

  async expectSignUpForm() {
    await expect(this.page).toHaveURL(/\/auth\/register/);
    await expect(this.heading).toBeVisible();
    await expect(this.mobileInput).toBeEditable();
    // Send OTP stays disabled until a valid 10-digit number is entered
    await expect(this.sendOtpButton).toBeDisabled();
  }

  async loginWithPassword(email: string, password: string) {
    await expect(async () => {
      await this.loginWithPasswordButton.click();
      await expect(this.emailInput).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 30_000 });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    await expect(this.page).toHaveURL('/');
  }
}
