import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { getProjectSettingsRoute, ProjectSettingsTabRoutes } from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

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

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(destination);
    await expect(page.getByText("Token Permission Restrictions")).toBeVisible();
  });

  test("save button should be disabled by default", async ({
    authenticatedPage: page,
  }) => {
    await expectSaveButtonEnabled(page, false);
  });

  test("should be able to replace app credentials", async ({
    authenticatedPage: page,
  }) => {
    await expect(
      page.getByTestId("replace-app-credentials-button"),
    ).toBeVisible();
    await page.getByTestId("replace-app-credentials-button").click();
    await expect(
      page.getByTestId("replace-github-credentials-modal"),
    ).toBeVisible();

    await expect(
      page
        .getByTestId("replace-github-credentials-modal")
        .getByRole("button", { name: "Replace" }),
    ).toHaveAttribute("aria-disabled", "true");

    await page.getByTestId("replace-app-id-input").fill("99999");
    await page.getByTestId("replace-private-key-input").fill("new-private-key");

    await expect(
      page
        .getByTestId("replace-github-credentials-modal")
        .getByRole("button", { name: "Replace" }),
    ).not.toHaveAttribute("aria-disabled", "true");

    await page
      .getByTestId("replace-github-credentials-modal")
      .getByRole("button", { name: "Replace" })
      .click();
    await validateToast(
      page,
      "success",
      "GitHub app credentials were successfully replaced.",
    );
  });

  test("should be able to save different permission groups for requesters, then return to defaults", async ({
    authenticatedPage: page,
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
    await page.getByTestId("save-settings-button").scrollIntoViewIfNeeded();
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
    await page.getByTestId("save-settings-button").scrollIntoViewIfNeeded();
    await expectSaveButtonEnabled(page, true);
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
  });
});
