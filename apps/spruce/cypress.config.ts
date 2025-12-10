import { defineConfig } from "cypress";
import { execSync } from "child_process";
import { unlinkSync } from "fs";

export default defineConfig({
  e2e: {
    retries: {
      runMode: 3,
      openMode: 0,
    },
    baseUrl: "http://localhost:3000",
    projectId: "yshv48",
    reporterOptions: {
      mochaFile: "bin/cypress/junit-[hash].xml",
      testCaseSwitchClassnameAndName: true,
    },
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/integration/**/*.ts",
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    videoCompression: 0,
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
  },
});
