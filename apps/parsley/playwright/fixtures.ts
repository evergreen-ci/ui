import { test as base, Page } from "@playwright/test";
import { execSync } from "child_process";
import * as helpers from "./helpers";

type CustomFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<CustomFixtures>({
  authenticatedPage: async ({ page, context }, use) => {
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

    // Set cookies before every test.
    await context.addCookies([
      {
        name: "drawer-opened",
        value: "true",
        domain: "localhost",
        path: "/",
      },
      {
        name: "has-seen-searchbar-guide-cue-tab-complete",
        value: "true",
        domain: "localhost",
        path: "/",
      },
      {
        name: "has-seen-sections-prod-feature-modal",
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);

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
