# Playwright Assignments

One Playwright project (TypeScript), with one folder per assignment under `tests/`.
Each folder has its spec (or notes), a `README.md` explaining it, and a `screenshots/` folder.

```
automation project/
├── playwright.config.ts     baseURL, HTML report, trace, screenshots
├── package.json             run commands (below)
├── .env.example             copy to .env for Assignment 5 login
└── tests/
    ├── Assignment-1/  example.spec.ts           run the default example in Chromium
    ├── Assignment-2/  Assignment-2.spec.ts      login test (practicetestautomation.com)
    ├── Assignment-3/  README                    Assignment 2 in UI mode
    ├── Assignment-4/  README                    Assignment 2 in debug mode
    ├── Assignment-5/  Assignment-5.spec.ts      Urban Ladder E2E journey
    │                  pages/                    page objects for Assignment 5
    ├── Assignment-6/  README (+ recorded spec)  same journey, recorded with codegen
    └── Assignment-7/  README                    trace viewer notes
```

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env      # then fill in your Urban Ladder email and password
```

## Run

| Assignment | Command |
|---|---|
| 1 | `npm run assignment1` |
| 2 | `npm run assignment2` |
| 3 | `npm run assignment3` (opens UI mode) |
| 4 | `npm run assignment4` (opens the Inspector) |
| 5 | `npm run assignment5` or `npm run assignment5:headed` |
| 6 | `npm run assignment6:record`, then `npm run assignment6` |
| 7 | `npm run assignment7` (or drop `trace.zip` on https://trace.playwright.dev/) |
| All specs | `npm run all` |
| HTML report | `npm run report` |

Don't submit `.env`. It holds your password.
