import { execSync } from "child_process";

/**
 * In the global setup function, we dump the database before any tests are run. We will use the dump later to restore
 * to a clean state.
 */
async function globalSetup() {
  try {
    execSync("pnpm evg-db-ops --dump");
  } catch (e) {
    console.error(e);
  }
}

export default globalSetup;
