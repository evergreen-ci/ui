import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { getProjectSettingsRoute, ProjectSettingsTabRoutes } from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

test.describe("GitHub permission groups", () => {
  const destination = getProjectSettingsRoute(
    "logkeeper",
    ProjectSettingsTabRoutes.GithubPermissionGroups,
  );

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(destination);
    await expect(page.getByText("Token Permission Groups")).toBeVisible();
  });

  test("should not have any permission groups defined", async ({
    authenticatedPage: page,
  }) => {
    await expect(
      page.getByTestId("permission-group-list").locator("> *"),
    ).toHaveCount(0);
    await expectSaveButtonEnabled(page, false);
  });

  test("should throw an error if permission group definitions are invalid", async ({
    authenticatedPage: page,
  }) => {
    await expect(
      page.getByRole("button", { name: /^Add permission group$/ }),
    ).toBeVisible();
    await page.getByRole("button", { name: /^Add permission group$/ }).click();
    await expect(
      page.getByTestId("permission-group-list").locator("> *"),
    ).toHaveCount(1);

    const invalidGithubPermission = "invalid_github_permission";
    await page
      .getByTestId("permission-group-title-input")
      .fill("test permission group");
    await expect(page.getByTestId("add-permission-button")).toBeVisible();
    await page.getByTestId("add-permission-button").click();
    await page
      .getByTestId("permission-type-input")
      .fill(invalidGithubPermission);
    await page.getByTestId("permission-value-input").click();
    await page.getByText("Write").click({ force: true });
    await expectSaveButtonEnabled(page, true);
    await page.getByTestId("save-settings-button").scrollIntoViewIfNeeded();
    await save(page);
    await validateToast(page, "error", "There was an error saving the project");
  });

  test("should be able to save permission group, then delete it", async ({
    authenticatedPage: page,
  }) => {
    await expect(
      page.getByRole("button", { name: /^Add permission group$/ }),
    ).toBeVisible();
    await page.getByRole("button", { name: /^Add permission group$/ }).click();
    await expect(
      page.getByTestId("permission-group-list").locator("> *"),
    ).toHaveCount(1);

    await page
      .getByTestId("permission-group-title-input")
      .fill("test permission group");
    await expect(page.getByTestId("add-permission-button")).toBeVisible();
    await page.getByTestId("add-permission-button").click();
    await page.getByTestId("permission-type-input").fill("actions");
    await page.getByTestId("permission-value-input").click();
    await page.getByText("Read").click();
    await expectSaveButtonEnabled(page, true);
    await page.getByTestId("save-settings-button").scrollIntoViewIfNeeded();
    await save(page);
    await validateToast(page, "success", "Successfully updated project");

    await page.reload();
    await expect(
      page.getByTestId("permission-group-list").locator("> *"),
    ).toHaveCount(1);
    await page.getByTestId("delete-item-button").click();
    await expect(
      page.getByTestId("permission-group-list").locator("> *"),
    ).toHaveCount(0);
    await page.getByTestId("save-settings-button").scrollIntoViewIfNeeded();
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
  });
});
