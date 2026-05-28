import { test, expect } from "@playwright/test";

test("view test component", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("This is the Sage UI")).toBeVisible();
});
