import { defineConfig } from "cypress";
import { execSync } from "child_process";

export default defineConfig({
  projectId: "i1oeyf",
  e2e: {
    baseUrl: "http://localhost:4173",
    supportFile: "cypress/support/index.ts",
    specPattern: "cypress/integration/**/*.ts",
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
    },
  },
  reporterOptions: {
    mochaFile: "bin/cypress/cypress-[hash].xml",
  },
  viewportWidth: 1280,
  viewportHeight: 800,
  videoCompression: false,
});
