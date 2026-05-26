import { test, expect } from "../../../fixtures";
import { validateToast } from "../../../helpers";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
} from "../constants";
import { expectSaveButtonEnabled, save } from "../utils";

test.describe("GitHub app settings", () => {
  const destination = getProjectSettingsRoute(
    "spruce",
    ProjectSettingsTabRoutes.GithubAppSettings,
  );
  const permissionGroups = {
    all: "All app permissions",
    readPRs: "Read Pull Requests",
    writeIssues: "Write Issues",
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(destination);
    await expect(page.getByText("Token Permission Restrictions")).toBeVisible();
  });

  test("save button should be disabled by default", async ({ page }) => {
    await expectSaveButtonEnabled(page, false);
  });

  test("should be able to replace app credentials", async ({ page }) => {
    await expect(
      page.getByTestId("replace-app-credentials-button"),
    ).toBeVisible();
    await page.getByTestId("replace-app-credentials-button").click();

    const modal = page.getByTestId("replace-github-credentials-modal");
    await expect(modal).toBeVisible();

    const confirmButton = modal.getByRole("button", { name: "Replace" });
    await expect(confirmButton).toBeDisabled();

    await page.getByTestId("replace-app-id-input").fill("99999");
    await page.getByTestId("replace-private-key-input").fill("new-private-key");

    await expect(confirmButton).toBeEnabled();

    await confirmButton.click();
    await validateToast(
      page,
      "success",
      "GitHub app credentials were successfully replaced.",
    );
  });

  test("should be able to save different permission groups for requesters, then return to defaults", async ({
    page,
  }) => {
    await expect(page.getByTestId("permission-group-input")).toHaveCount(8);
    const permissionGroupInput0 = page
      .getByTestId("permission-group-input")
      .nth(0);
    const permissionGroupInput4 = page
      .getByTestId("permission-group-input")
      .nth(4);

    await permissionGroupInput0.click();
    const options = page.locator('[role="listbox"]');
    await expect(options).toHaveCount(1);
    await options.getByText(permissionGroups.readPRs).click();
    await permissionGroupInput4.click();
    await expect(options).toHaveCount(1);
    await options.getByText(permissionGroups.writeIssues).click();
    await expectSaveButtonEnabled(page, true);
    await save(page);
    await validateToast(page, "success", "Successfully updated project");

    await page.reload();
    await expect(permissionGroupInput0).toContainText(permissionGroups.readPRs);
    await expect(permissionGroupInput4).toContainText(
      permissionGroups.writeIssues,
    );

    await permissionGroupInput0.click();
    await expect(options).toHaveCount(1);
    await options.getByText(permissionGroups.all).click();
    await permissionGroupInput4.click();
    await expect(options).toHaveCount(1);
    await options.getByText(permissionGroups.all).click();
    await expectSaveButtonEnabled(page, true);
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
  });
});
