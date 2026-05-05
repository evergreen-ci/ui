import { test, expect } from "@playwright/test";

test.describe("Shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should be able to open the modal using keyboard shortcut", async ({
    page,
  }) => {
    await expect(page.getByTestId("shortcut-modal")).toBeHidden();
    await page.keyboard.press("Shift+?");
    await expect(page.getByTestId("shortcut-modal")).toBeVisible();
  });

  test("should be able to open the keyboard shortcut modal by clicking navbar icon button", async ({
    page,
  }) => {
    await page.getByLabel("Open shortcut modal").click();
    await expect(page.getByTestId("shortcut-modal")).toBeVisible();
  });
});
