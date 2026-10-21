# Assignment 3 — Run Assignment 2 in UI mode

There is no new spec here. This runs `../Assignment-2/Assignment-2.spec.ts` in the Playwright UI Test Runner.

## Run

```bash
npm run assignment3
# same as: npx playwright test tests/Assignment-2 --project=chromium --ui
```

## What to do in the window

1. Click ▶ next to `Assignment-2.spec.ts`. It should turn green.
2. Click the test. The **Actions** list shows every step: goto, fill username, fill password, click Submit, the URL check.
3. Click each action. The screen shows the page **before** and **after** that step.
4. Look at the bottom tabs: **Locator**, **Source**, **Console**, **Network**, **Errors**.
5. Optional: tick **Show browser** in settings to watch a real browser.

## What to look for

- All 4 steps pass, and the whole test takes a few seconds.
- After **Submit**, the URL changes to `/logged-in-successfully/`.
- The Network tab shows the page load and the redirect after login.

Put screenshots (test list, green run, timeline) in `screenshots/`.
