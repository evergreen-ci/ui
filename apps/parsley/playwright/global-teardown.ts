import { execSync } from "child_process";

/**
 * In the global teardown function, we restore the database after all tests have run.
 */
async function globalTeardown() {
  try {
    execSync("pnpm evg-db-ops --clean-up");
  } catch (e) {
    console.error(e);
  }
}

export default globalTeardown;
