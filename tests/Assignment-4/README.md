# Assignment 4 — Run Assignment 2 in debug mode

There is no new spec here. This runs `../Assignment-2/Assignment-2.spec.ts` with the Playwright Inspector.

## Run

```bash
npm run assignment4
# same as: npx playwright test tests/Assignment-2 --project=chromium --debug
```

## What to do

A browser and the **Playwright Inspector** open, and the test pauses before its first line.

1. Click **Step over** (or press F10) to run one line at a time:
   - `page.goto(...)` opens the login page
   - `getByLabel('Username').fill('student')`
   - `getByLabel('Password').fill('Password123')`
   - `getByRole('button', { name: 'Submit' }).click()`
   - `expect(page).toHaveURL(...)` checks the new URL
2. Before each step, the Inspector highlights the element the line will use.
3. Use **Pick locator** to hover over any element and see the locator Playwright suggests.
4. Click **Resume** (F8) to run the rest of the test.

Put a screenshot of each step in `screenshots/`.
