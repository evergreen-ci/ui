import { test as setup } from "@playwright/test";
import { execSync } from "child_process";

setup("dumping the database", async ({}) => {
  try {
    execSync("pnpm evg-db-ops --dump");
  } catch (e) {
    console.error(e);
  }
});
