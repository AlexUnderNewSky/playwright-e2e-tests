# Playwright E2E Tests

![Playwright Tests](https://github.com/<your-username>/playwright-e2e-tests/actions/workflows/playwright.yml/badge.svg)

End-to-end UI and API test automation framework built with **Playwright** and **TypeScript**.

| Layer | Application under test                                           |
| ----- | ---------------------------------------------------------------- |
| UI    | [Sauce Demo](https://www.saucedemo.com), a demo e-commerce store |
| API   | [DummyJSON](https://dummyjson.com), a fake REST API              |

## Tech stack

- Playwright Test + TypeScript
- Page Object Model with custom fixtures
- Zod for API response schema validation
- Faker for test data generation
- GitHub Actions CI (browser matrix, HTML report artifacts)
- Prettier

## Features

- **Page Object Model**: page classes and reusable components (`Header`) keep locators out of tests
- **Custom fixtures**: page objects and API clients are injected straight into tests
- **Authentication via storage state**: a setup project logs in once and every UI test reuses the session
- **Data-driven tests**: sorting, login validation and checkout validation run as parameterized cases
- **Tags**: `@smoke` marks critical-path tests for quick runs
- **API contract checks**: responses are validated against Zod schemas
- **Cross-browser**: Chromium and Firefox
- **Debug artifacts**: traces on retry, screenshots and video on failure
- **Known issues**: tracked with `test.fail()` so the suite stays green and flags when a bug is fixed

## Project structure

```
├── .github/workflows/      # CI pipeline
├── src/
│   ├── api/                # API clients and Zod schemas
│   ├── components/         # Shared UI components (header, menu)
│   ├── data/               # Test data: users, products, customer factory
│   ├── fixtures/           # Custom Playwright fixtures
│   ├── pages/              # Page objects
│   ├── utils/              # Helpers
│   └── env.ts              # Environment configuration
├── tests/
│   ├── setup/              # Authentication setup
│   ├── ui/                 # UI end-to-end tests
│   └── api/                # API tests
└── playwright.config.ts
```

## Test coverage

| Area         | Scenarios                                                                     |
| ------------ | ----------------------------------------------------------------------------- |
| Login        | Valid login, locked user, validation errors, logout, protected route redirect |
| Inventory    | Product list, sorting by name/price, cart badge, product details              |
| Cart         | Added items and prices, removal, persistence after reload, navigation         |
| Checkout     | Full purchase flow with total/tax checks, required fields, cancel             |
| Auth API     | Login, invalid credentials, current user, unauthorized access, token refresh  |
| Products API | Pagination, sorting, search, category filter, 404, create/update/delete       |

## Getting started

```bash
git clone https://github.com/<your-username>/playwright-e2e-tests.git
cd playwright-e2e-tests
npm install
npx playwright install
```

Optionally copy `.env.example` to `.env` to override URLs and credentials. The defaults point at the public demo applications.

## Running tests

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `npm test`            | Run all tests                    |
| `npm run test:ui`     | UI tests in Chromium and Firefox |
| `npm run test:api`    | API tests only                   |
| `npm run test:smoke`  | Only tests tagged `@smoke`       |
| `npm run test:headed` | UI tests in a visible browser    |
| `npm run report`      | Open the last HTML report        |
| `npm run typecheck`   | TypeScript type check            |

Run a single file or test:

```bash
npx playwright test tests/ui/checkout.spec.ts
npx playwright test -g "complete a purchase"
npx playwright test --ui
```

## CI

The GitHub Actions workflow runs on every push and pull request to `main`, on a weekday schedule, and on demand:

1. Type check and formatting
2. API tests
3. UI tests in parallel across a Chromium/Firefox matrix

HTML reports are uploaded as build artifacts.
