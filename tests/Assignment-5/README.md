# Assignment 5 — Full E2E journey on Urban Ladder

`Assignment-5.spec.ts` covers the whole journey on https://www.urbanladder.com/

| Step | What the test does | What it checks |
|---|---|---|
| 1 | Account menu → **Start here** (the Sign Up link) | The sign-up form appears |
| 2 | **Login with Password** | The account menu shows "My Profile" and no "SIGN IN" |
| 3–4 | Hover **Living** → click **Coffee Tables** | The URL, the page title, and that products are shown |
| 5 | **Sort By → Price High to Low** | The URL has `sortOn=price_dsc` and the first 8 prices go down |
| 6 | Open the first product | It opens in a new tab |
| 7 | Check name, price and quantity, enter a pincode, **Add to Cart** | They match the listing, and "Go to Cart" appears |
| 8 | Go to the cart | It holds 1 item with the same name, price and quantity |
| 9 | **Logout** | "SIGN IN" is back |

At the end the test also empties the cart, even if a step failed, so the next run starts clean.

## Setup

Copy `.env.example` (in the project root) to `.env` and fill in a registered Urban Ladder account:

```
UL_EMAIL=you@example.com
UL_PASSWORD="your-password"
```

Wrap the password in quotes. A `#` in it would otherwise start a comment.

## Run

```bash
npm run assignment5          # background (headless)
npm run assignment5:headed   # watch it in a browser
npm run report               # open the HTML report
```

## Config requirements (`playwright.config.ts`)

- **baseURL**: `https://www.urbanladder.com`, so the code uses `page.goto('/')` and `/cart`
- **HTML report**: `reporter: [['html'], ['list']]`
- **Tracing**: `trace: 'on'`, which saves a `trace.zip` for every run (used in Assignment 7)
- **Screenshots**: `screenshot: 'on'`, plus a named screenshot at each main step, attached to the report

## Locators used

`getByRole`, `getByText`, `getByLabel`/`getByPlaceholder`, `getByTestId`, CSS (`#category-menu-3`, `.sr-only`, `h1`),
parent (`locator('..')`), chaining, `.first()`, `.filter({ hasText })` and `.or()`.
The code also uses `hover`, `test.step`, `expect.poll`, `expect(...).toPass()`, `context.waitForEvent('page')` and `context.route`.

## Page objects (`pages/`)

`HomePage`, `AuthPage`, `ListingPage`, `ProductPage`, `CartPage`, plus `popups.ts`, which blocks a marketing pop-up.

## Differences from the assignment text

- **Sign-up** on this site needs an SMS OTP to a real mobile number, which a script can't read. The account was registered once by hand. Step 1 checks the sign-up form, and step 2 logs in with a password.
- **"View Product"**: the site no longer has a button with that name. The product title is the link, and it opens a new tab.
- **Add to Cart** stays disabled until a delivery pincode is checked, so the test enters `560001` (change it with `UL_PINCODE`).
- A **CleverTap pop-up** ("Log In To View Exclusive Offers") appears at random and blocks clicks. Its script is blocked so runs are stable.
