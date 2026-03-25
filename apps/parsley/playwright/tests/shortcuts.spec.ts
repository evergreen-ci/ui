import { test, expect } from "../fixtures";
import * as helpers from "../helpers";

test.describe("Shortcuts", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto("/");
  });

  test("should be able to open the modal using keyboard shortcut", async ({
    authenticatedPage,
  }) => {
    await expect(
      helpers.getByDataCy(authenticatedPage, "shortcut-modal"),
    ).toBeHidden();
    await authenticatedPage.keyboard.press("Shift+?");
    await expect(
      helpers.getByDataCy(authenticatedPage, "shortcut-modal"),
    ).toBeVisible();
  });

  test("should be able to open the keyboard shortcut modal by clicking navbar icon button", async ({
    authenticatedPage,
  }) => {
    await authenticatedPage.getByLabel("Open shortcut modal").click();
    await expect(
      helpers.getByDataCy(authenticatedPage, "shortcut-modal"),
    ).toBeVisible();
  });
});
