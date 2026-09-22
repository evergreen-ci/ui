import { test as teardown } from "@playwright/test";
import { execFileSync } from "child_process";

teardown("clean up database", async ({}) => {
  try {
    execFileSync("pnpm", ["evg-db-ops", "--clean-up"]);
  } catch (e) {
    console.error(e);
  }
});
