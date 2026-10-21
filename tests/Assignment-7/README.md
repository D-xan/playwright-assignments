# Assignment 7 — Look at Assignment 5's trace

Every run of Assignment 5 saves a trace (`trace: 'on'` in `playwright.config.ts`) at:

```
test-results/Assignment-5-…-chromium/trace.zip
```

## How it was opened

1. Go to https://trace.playwright.dev/
2. Click **Select file** (or drag the file onto the page) and choose `trace.zip`.
   The viewer runs in your browser. It does not upload the trace anywhere.

The same viewer also runs locally: `npm run assignment7`.

> ⚠️ The trace records everything the test typed, **including the password** in the "Fill" action of step 2.
> Don't share `trace.zip` publicly. None of the screenshots below show that step.

## Screenshots (`screenshots/`)

| File | What it shows |
|---|---|
| `01-trace-overview.png` | Whole viewer: timeline filmstrip, actions, page snapshot, call details |
| `02-steps-list.png` | The 9 `test.step` groups and how long each took |
| `03a-sort-click-before.png` | **Before** the "Price High to Low" click. The red dot marks where Playwright clicked. |
| `03b-sort-click-after.png` | **After** the click: URL has `?sortOn=price_dsc` and ₹1,41,299 is first |
| `04-logout-retry-toPass.png` | Inside step 9, the `toPass` block took 5.0s because the first try failed |
| `05-network.png` | Network tab, 1,472 requests |
| `06-console.png` | Console tab, 150 messages from the site |
| `07-source.png` | Source tab, pointing at the exact line that ran (`ListingPage.ts:27`) |
| `08-attachments.png` | The 8 attachments: step screenshots plus the end-of-test screenshot |

## Observations

**Timing (total ≈ 35s for the test body)**

| Step | Time |
|---|---|
| 1. Open the Sign Up link | 5.6s |
| 2. Log in | 3.0s |
| 3–4. Living > Coffee Tables | 1.1s |
| 5. Sort By > Price: High to Low | 3.2s |
| 6. View the first product | 6.2s |
| 7. Verify product details and Add to Cart | 5.7s |
| 8. Verify the product in the cart | 1.4s |
| Clean up: empty the cart | 1.5s |
| 9. Log out | 7.0s |

1. **Steps are easy to follow.** Because the spec uses `test.step`, the actions list reads like the assignment (1 → 9) instead of a flat list of 100+ clicks and checks. Each step expands into its locator calls.
2. **The slowest steps are page loads.** Steps 1 and 6 (opening the site and the product's new tab) take the most time. The filmstrip shows the page painting slowly. The product heading appeared several seconds after the tab opened.
3. **Auto-retry is visible.** Three checks failed on the first try and passed on retry inside `expect(...).toPass()`: the account menu twice and the Sort By dropdown once. Example: in step 9 the first click on the account icon was ignored (red ✕, 3s), the retry worked, and the block took 5.0s in total. This shows why the retries are needed. The site ignores clicks until its JavaScript is ready.
4. **Before / After snapshots prove each action.** For the sort click, "Before" shows the open dropdown with the click point, and "After" shows the new URL `?sortOn=price_dsc` and the priciest table (₹1,41,299) first. These are real DOM snapshots, not pictures, so you can inspect elements in them.
5. **Locators are shown in full.** The Call tab shows each locator, for example `getByRole('radio', { name: 'Price High to Low' })` with `strict: true`, plus the timeout used. The Log tab shows Playwright's auto-waiting ("waiting for element to be visible, enabled and stable").
6. **Network: 1,472 requests in ~35s.** Most are images and scripts from `cdn.swadeshonline.com` (784) and `www.urbanladder.com` (388). The rest are third-party widgets and trackers (popin, Jio video, Google, Sentry).
   - Login is one `POST …/authentication/v1.0/login/password` → **200**.
   - The cart is read through `GET …/cart/v1.0/basic`, called about 10 times across the journey.
   - **CleverTap requests show as failed**: they were blocked on purpose (`context.route`) to stop the random pop-up.
   - Only 6 responses were 4xx: `401` on `…/authentication/v1.0/session` and `…/vto/…/auth` while logged out. These are expected.
7. **Console: 150 messages, all from the website itself.** They include React hydration errors (#418/#422) and a `"pincode not found!"` error from the cart before a pincode is set. None come from the test. They explain why clicks right after page load are ignored (hydration).
8. **Attachments.** The 8 attachments are the step screenshots (`01-sign-up-form`, `02-logged-in`, `05-sorted-high-to-low`, `07-product-page`, `08-cart`, `09-logged-out`) and the automatic end-of-test screenshots, so each step can be checked visually.
9. **Two tabs are traced.** The product opens in a new tab, and the trace records both pages. The filmstrip has two rows, the listing page and the product/cart tab.

**Summary:** the trace confirms each assignment step happened in order and passed. It shows where the time goes (page loads and the site's slow JavaScript start-up) and why the test needs its retries and pop-up blocking.
