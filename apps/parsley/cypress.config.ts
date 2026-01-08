import { defineConfig } from "cypress";
import { execSync } from "child_process";
import { unlinkSync } from "fs";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4173",
    experimentalStudio: true,
    video: true,
    setupNodeEvents(on) {
      on("before:run", () => {
        try {
          execSync("pnpm evg-db-ops --dump");
        } catch (e) {
          console.error(e);
        }
      });
      on("after:run", () => {
        try {
          execSync("pnpm evg-db-ops --clean-up");
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
            try {
              // Get the compressed video name which resembles file -compressed.mp4 and delete it
              const compressedName = results.video.replace(
                /.mp4$/,
                "-compressed.mp4",
              );
              unlinkSync(compressedName);
              unlinkSync(results.video);
            } catch {
              console.log("unlinkSync failed. Continuing...");
            }
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
  videoCompression: 0,
  video: true,
  viewportHeight: 800,
  viewportWidth: 1280,
});
