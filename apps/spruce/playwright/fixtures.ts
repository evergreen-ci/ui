import { test as base } from "@playwright/test";
import { execSync } from "child_process";
import * as helpers from "./helpers";

const hostMutations = ["ReprovisionToNew", "RestartJasper", "UpdateHostStatus"];

export const test = base.extend({
  page: async ({ page }, use) => {
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
