# Assignment 6 — Redo Assignment 5 with codegen (record and replay)

## Files

| File | What it is |
|---|---|
| `recording.raw.ts` | The raw recording, exactly as captured (password removed). Not a spec, so it doesn't run. |
| `Assignment-6.spec.ts` | The recording plus the changes needed to make it pass, and extra asserts. Every change is marked `// FIX:` or `// ASSERT:`. |

## How it was recorded

The journey was clicked through once in a real browser with Playwright's recorder, which picks locators the same way as `npx playwright codegen`:
sign-up link → Login with Password → Living → Coffee Tables → Sort By: Price High to Low → first product (new tab) → pincode → Add to Cart → Go to Cart → remove item → Logout.

To record it yourself:

```bash
npm run assignment6:record
# npx playwright codegen --target=playwright-test --output=tests/Assignment-6/Assignment-6.spec.ts https://www.urbanladder.com/
```

## Run

```bash
npm run assignment6        # runs Assignment-6.spec.ts in a visible browser
```

Result: ✅ `1 passed (≈32s)`

## Checking the recording: what happened on replay

**Replaying the raw recording unchanged failed.** It timed out on the pincode **Check** button.

What we found:

1. **Too fast for the page.** The recorder replays clicks at machine speed. Urban Ladder ignores typing and clicks that happen before its JavaScript has loaded. The typed pincode was lost, so **Check** stayed disabled. The Sort By dropdown has the same problem.
   → FIX: retry the action until the page reacts (`expect(...).toPass()`).
2. **No waiting after login.** The recording hovered "Living" 0.1s after clicking Login, before login had finished.
   → FIX + ASSERT: `await expect(page).toHaveURL('https://www.urbanladder.com/')`.
3. **Random pop-up.** During recording, a "Log In To View Exclusive Offers" pop-up appeared and its close button was recorded. On replay it may or may not appear, so a fixed click on it is wrong either way.
   → FIX: `page.addLocatorHandler(...)` closes it whenever it shows up.
4. **Product name hard-coded.** The recorder saved the name of the product it saw (`'Hump Solid Wood Coffee Table'`). If the catalogue changes, the test would open the wrong product, or fail.
   → FIX: click the first product card, whatever it is.
5. **No checks at all.** Codegen records actions only, so the raw script "passes" even if the page is wrong.
   → ASSERTS added: sign-up page URL, landing on home after login, Coffee Tables URL, `sortOn=price_dsc`, product page heading matches, cart shows `(1 Items)` with that product, cart empty after removing, `SIGN IN` back after logout.
6. **Leftover cart state.** The cart belongs to a real account. If the run failed half-way, the next run would start with an extra item.
   → FIX: the recorded "remove item" step runs in a `finally` block.

## Takeaways

- Codegen is great for **finding locators fast**. Its picks (`getByRole`, `getByTestId`) were good, and most were kept as they were.
- A recording is a **draft, not a finished test**. It needs waits for slow pages, asserts, and handling of random pop-ups and data that changes.
- Compare with Assignment 5. There the same journey is written by hand with page objects, and it is easier to read and change.

Put screenshots of the recorder and the passing run in `screenshots/`.
