# Sage &middot; [![GitHub license](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://github.com/evergreen-ci/sage/main/LICENSE)

Sage is the React UI for DevProd's agentic AI platform.

## Getting Started

### Running Locally

1. Clone the GitHub repository
2. Ensure you have Node.js v22+ and [pnpm](https://pnpm.io/installation) installed.
3. Run `pnpm install`
5. Run `pnpm dev`. This will launch the app.

### Code Formatting

Install the Prettier code formatting plugin in your code editor if you don't have it already. Run `pnpm eslint:fix` to fix linting errors.

### Unit tests

Unit tests are used to test individual features in isolation. We utilize [Vitest](https://vitest.dev) to execute our tests.

You can use the following commands:
- `pnpm test` - runs all tests
- `pnpm test <path_to_test(s)>` - targets specific folders or tests

### E2E tests

In order to run Playwright tests, you must have the app running locally via `pnpm dev`.

Then, in another terminal, you can use the following commands:
- `pnpm playwright:ui` - opens the Playwright app in interactive mode.
- `pnpm playwright:test` - runs all tests at the command-line and reports the results
- `pnpm playwright:test <path_to_test(s)>` - runs tests in a specific file at the command-line

### Storybook

Run `pnpm storybook` to launch Storybook and view our components.

## Deployment

Read more about deployment [here](../../packages/deploy-utils/README.md#deployment).
