import { test as teardown } from "@playwright/test";
import { execSync } from "child_process";

teardown("clean up database", async ({}) => {
  try {
    execSync("pnpm evg-db-ops --clean-up");
  } catch (e) {
    console.error(e);
  }
});
