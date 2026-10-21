import type { BrowserContext } from '@playwright/test';

/**
 * Urban Ladder loads CleverTap, which shows a "Log In To View Exclusive Offers"
 * pop-up at random moments. It covers the page and blocks clicks, and it does not
 * always appear, which makes runs flaky. Blocking the third-party script on the
 * browser context keeps every tab (including the product tab) free of it.
 */
export async function blockMarketingPopups(context: BrowserContext) {
  await context.route(/clevertap/i, (route) => route.abort());
}
