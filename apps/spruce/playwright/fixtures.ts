import { test as base, Page } from "@playwright/test";
import { execSync } from "child_process";
import {
  SLACK_NOTIFICATION_BANNER,
  SEEN_WATERFALL_ONBOARDING_TUTORIAL,
  SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL,
  SEEN_TASK_REVIEW_TOOLTIP,
  SEEN_TEST_SELECTION_GUIDE_CUE,
} from "constants/cookies";
import * as helpers from "./helpers";

const bannerCookie = "This is an important notification";
const hostMutations = ["ReprovisionToNew", "RestartJasper", "UpdateHostStatus"];

type CustomFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<CustomFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Set up mutation detection BEFORE login/navigation.
    let mutationDispatched = false;
    let clearAmboyDB = false;

    // Intercept GraphQL queries to detect mutations; match both relative and absolute paths.
    await page.route("**/graphql/query", async (route) => {
      const request = route.request();
      try {
        const postData = request.postDataJSON();
        if (postData?.query?.startsWith("mutation")) {
          mutationDispatched = true;
          // Check if this is a host mutation that requires Amboy DB cleanup.
          hostMutations.forEach((m) => {
            if (helpers.hasOperationName(postData, m)) {
              clearAmboyDB = true;
            }
          });
        }
      } catch (e) {
        console.error("Failed to parse GraphQL request:", e);
      }
      await route.continue();
    });

    // Login before every test.
    await helpers.login(page);

    // Set cookies to dismiss banners and onboarding tutorials.
    const context = page.context();
    await context.addCookies([
      {
        name: bannerCookie,
        value: "true",
        domain: "localhost",
        path: "/",
      },
      {
        name: SLACK_NOTIFICATION_BANNER,
        value: "true",
        domain: "localhost",
        path: "/",
      },
      {
        name: SEEN_WATERFALL_ONBOARDING_TUTORIAL,
        value: "true",
        domain: "localhost",
        path: "/",
      },
      {
        name: SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL,
        value: "true",
        domain: "localhost",
        path: "/",
      },
      {
        name: SEEN_TASK_REVIEW_TOOLTIP,
        value: "true",
        domain: "localhost",
        path: "/",
      },
      {
        name: SEEN_TEST_SELECTION_GUIDE_CUE,
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);

    await use(page);

    // Cleanup by restoring databases if mutation was dispatched.
    if (mutationDispatched) {
      try {
        if (clearAmboyDB) {
          console.log(
            "A mutation that creates an Amboy job was detected. Restoring Amboy.",
          );
          execSync("pnpm evg-db-ops --restore amboy");
        }
        console.log("A mutation was detected. Restoring Evergreen.");
        execSync("pnpm evg-db-ops --restore evergreen");
      } catch (e) {
        console.error("Failed to restore database:", e);
      }
    }
  },
});

export { expect } from "@playwright/test";
