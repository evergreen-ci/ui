import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import {
  getProjectSettingsRoute,
  project,
  ProjectSettingsTabRoutes,
  projectUseRepoEnabled,
} from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

test.describe("Access page", () => {
  const origin = getProjectSettingsRoute(
    projectUseRepoEnabled,
    ProjectSettingsTabRoutes.Access,
  );

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
    await expectSaveButtonEnabled(page, false);
    await expect(page.getByTestId("default-to-repo-button")).toBeVisible();
    await expect(page.getByTestId("default-to-repo-button")).toBeEnabled();
  });

  test("Changing settings and clicking the save button produces a success toast and the changes are persisted", async ({
    authenticatedPage: page,
  }) => {
    await page.getByText("Unrestricted", { exact: true }).click();
    await expect(
      page.getByLabel("Unrestricted", { exact: true }),
    ).toBeChecked();

    await page.getByText("Add Username").click();
    const usernameInput = page.getByLabel("Username");
    await usernameInput.fill("admin");
    await expect(usernameInput).toHaveValue("admin");
    await expect(usernameInput).toBeVisible();
    await save(page);
    await validateToast(page, "success", "Successfully updated project");

    await page.reload();
    await expect(page.getByLabel("Username")).toHaveValue("admin");
    await expect(page.getByLabel("Username")).toBeVisible();

    await page.getByTestId("delete-item-button").click();
    await expect(page.getByLabel("Username")).toHaveCount(0);
    await save(page);
    await validateToast(page, "success", "Successfully updated project");

    await page.reload();
    await expectSaveButtonEnabled(page, false);
    await expect(page.getByLabel("Username")).toHaveCount(0);
  });

  test("Clicking on 'Default to Repo on Page' selects the 'Default to repo (unrestricted)' radio box and produces a success banner", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("default-to-repo-button")).toHaveAttribute(
      "aria-disabled",
      "false",
    );
    await page.getByTestId("default-to-repo-button").click();
    await page
      .getByLabel('Type "confirm" to confirm your action')
      .fill("confirm");
    await page
      .getByTestId("default-to-repo-modal")
      .getByRole("button", { name: "Confirm" })
      .click();
    await validateToast(page, "success", "Successfully defaulted page to repo");
    await expect(
      page.getByLabel("Default to repo (unrestricted)"),
    ).toBeChecked();
  });

  test("Submitting an invalid admin username produces an error toast", async ({
    authenticatedPage: page,
  }) => {
    await page.goto(
      getProjectSettingsRoute(project, ProjectSettingsTabRoutes.Access),
    );
    await page.getByText("Add Username").click();
    const newUsernameInput = page.getByLabel("Username").first();
    await newUsernameInput.fill("mongodb_user");
    await save(page);
    await validateToast(page, "error", "There was an error saving the project");
  });
});
