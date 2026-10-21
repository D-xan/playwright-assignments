# Assignment 2 — Successful login test

`Assignment-2.spec.ts` automates a login on https://practicetestautomation.com/practice-test-login/

1. Open the login page
2. Enter username `student` and password `Password123`
3. Click **Submit**
4. Check the new page's URL is `https://practicetestautomation.com/logged-in-successfully/`
   (it also checks the "Logged In Successfully" heading and the "Log out" link)

## Run only this test

```bash
npm run assignment2
# same as: npx playwright test tests/Assignment-2 --project=chromium
```

## Expected output

```
✓ [chromium] › Assignment-2.spec.ts › Assignment-2: Practice Test Automation login › logs in with valid credentials
1 passed
```

Assignments 3 and 4 run this same test in UI mode and debug mode.
