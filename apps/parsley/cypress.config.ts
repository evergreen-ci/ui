import { defineConfig } from "cypress";
import { execSync } from "child_process";
import { unlinkSync } from "fs";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4173",
    experimentalStudio: true,
    setupNodeEvents(on) {
      on("before:run", () => {
        try {
          execSync("yarn evg-db-ops --dump");
        } catch (e) {
          console.error(e);
        }
      });
      on("after:run", () => {
        try {
          execSync("yarn evg-db-ops --clean-up");
        } catch (e) {
          console.error(e);
        }
      });
      on("after:spec", (_, results) => {
        // Delete videos for passing runs. From Cypress docs:
        // https://docs.cypress.io/app/guides/screenshots-and-videos#Delete-videos-for-specs-without-failing-or-retried-tests
        if (results && results.video) {
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === "failed"),
          );
          if (!failures) {
            unlinkSync(results.video);
          }
        }
      });
    },
    specPattern: "cypress/integration/**/*.ts",
    supportFile: "cypress/support/index.ts",
  },
  projectId: "i1oeyf",
  reporterOptions: {
    mochaFile: "bin/cypress/cypress-[hash].xml",
    testCaseSwitchClassnameAndName: true,
  },
  videoCompression: false,
  viewportHeight: 800,
  viewportWidth: 1280,
});
