import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { getProjectSettingsRoute, project } from "./constants";

test.describe("projectSettings/admin_actions", () => {
  test.describe("Duplicating a project", () => {
    const destination = getProjectSettingsRoute(project);

    test("Successfully duplicates a project with warnings", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(destination);
      await page.getByTestId("new-project-button").click();
      await expect(page.getByTestId("new-project-menu")).toBeVisible();
      await page.getByTestId("copy-project-button").click();
      await expect(page.getByTestId("copy-project-modal")).toBeVisible();
      await expect(
        page.getByTestId("performance-tooling-banner"),
      ).toBeVisible();

      await page.getByTestId("project-name-input").fill("copied-project");

      await page.getByRole("button", { name: "Duplicate" }).click();
      await validateToast(
        page,
        "warning",
        "The project was duplicated but may not be fully enabled",
      );

      await expect(page).toHaveURL(/copied-project/);
    });
  });

  test.describe("Creating a new project and deleting it", () => {
    test("Successfully creates a new project and then deletes it", async ({
      authenticatedPage: page,
    }) => {
      await page.goto(getProjectSettingsRoute(project));
      await page.getByTestId("new-project-button").click();
      await expect(page.getByTestId("new-project-menu")).toBeVisible();
      await page.getByTestId("create-project-button").click();
      await expect(page.getByTestId("create-project-modal")).toBeVisible();
      await expect(
        page.getByTestId("performance-tooling-banner"),
      ).toBeVisible();

      await page.getByTestId("project-name-input").fill("my-new-project");
      await expect(page.getByTestId("new-owner-select")).toContainText(
        "evergreen-ci",
      );
      await expect(page.getByTestId("new-repo-input")).toHaveValue("spruce");
      await page.getByTestId("new-repo-input").clear();
      await page.getByTestId("new-repo-input").fill("new-repo");

      await page.getByRole("button", { name: "Create project" }).click();
      await validateToast(
        page,
        "success",
        "Successfully created the project “my-new-project”",
        true,
      );

      await expect(page).toHaveURL(/my-new-project/);

      await page.goto(getProjectSettingsRoute("my-new-project"));
      await page.getByTestId("attach-repo-button").click();
      await page
        .getByTestId("attach-repo-modal")
        .getByRole("button", { name: "Attach" })
        .click();
      await validateToast(
        page,
        "success",
        "Successfully attached to repo",
        true,
      );

      await page.getByTestId("delete-project-button").scrollIntoViewIfNeeded();
      await page.getByTestId("delete-project-button").click();
      await page
        .getByTestId("delete-project-modal")
        .getByRole("button", { name: "Delete" })
        .click();
      await validateToast(
        page,
        "success",
        "The project “my-new-project” was deleted.",
        true,
      );

      await page.reload();
      await validateToast(
        page,
        "error",
        "There was an error loading the project my-new-project",
      );
    });
  });
});
