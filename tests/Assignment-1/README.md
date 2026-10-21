# Assignment 1 — Run the example tests in Chromium

A new Playwright project was created with `npm init playwright@latest` (TypeScript, all other options left at their defaults).
The generated `example.spec.ts` is run as-is, with no new spec file, in the Chromium browser only.

## Run

```bash
npm run assignment1
# same as: npx playwright test tests/Assignment-1 --project=chromium
```

## Expected output

```
✓ [chromium] › example.spec.ts › has title
✓ [chromium] › example.spec.ts › get started link
2 passed
```

Screenshots of the run go in `screenshots/`.
