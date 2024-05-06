import { defineConfig } from "cypress";
import { execSync } from "child_process";

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
    },
    specPattern: "cypress/integration/**/*.ts",
    supportFile: "cypress/support/index.ts",
  },
  projectId: "i1oeyf",
  reporterOptions: {
    mochaFile: "bin/cypress/cypress-[hash].xml",
  },
  videoCompression: false,
  viewportHeight: 800,
  viewportWidth: 1280,
});
