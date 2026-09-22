import { test as setup } from "@playwright/test";
import { execFileSync } from "child_process";

setup("dumping the database", async ({}) => {
  try {
    execFileSync("pnpm", ["evg-db-ops", "--dump"]);
  } catch (e) {
    console.error(e);
  }
});
