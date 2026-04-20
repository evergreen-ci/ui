import { test as base, Page } from "@playwright/test";
import { execSync } from "child_process";
import * as helpers from "./helpers";

type CustomFixtures = {
  unauthenticatedPage: Page;
  authenticatedPage: Page;
};

export const test = base.extend<CustomFixtures>({
  unauthenticatedPage: async ({ page }, use) => {
    await helpers.logout(page);
    await use(page);
  },
  authenticatedPage: async ({ page }, use) => {
    // Set up mutation detection BEFORE login/navigation.
    let mutationDispatched = false;

    // Intercept GraphQL queries to detect mutations; match both relative and absolute paths.
    await page.route("**/graphql/query", async (route) => {
      const request = route.request();
      try {
        const postData = request.postDataJSON();
        if (postData?.query?.startsWith("mutation")) {
          mutationDispatched = true;
        }
      } catch (e) {
        console.error("Failed to parse GraphQL request:", e);
      }
      await route.continue();
    });

    // Login before every test.
    await helpers.login(page);

    // Navigate to a page so we can access localStorage, then set it.
    await page.goto("http://localhost:5173");
    await page.evaluate(() => {
      localStorage.setItem("drawer-opened", "true");
      localStorage.setItem("has-seen-searchbar-guide-cue-tab-complete", "true");
    });

    await use(page);

    // Cleanup by restoring and reseeding database if mutation was dispatched.
    if (mutationDispatched) {
      try {
        console.log("A mutation was detected. Restoring Evergreen.");
        execSync("pnpm evg-db-ops --restore evergreen");
        execSync("pnpm evg-db-ops --reseed-and-dump");
      } catch (e) {
        console.error("Failed to restore/reseed evergreen database:", e);
      }
    }
  },
});

export { expect } from "@playwright/test";
