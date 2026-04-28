import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import {
  getProjectSettingsRoute,
  project,
  ProjectSettingsTabRoutes,
} from "./constants";
import { save } from "./utils";

test.describe("projectSettings/project_settings", () => {
  test.describe("Renaming the identifier", () => {
    const origin = getProjectSettingsRoute(project);

    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(origin);
    });

    test("Update identifier", async ({ authenticatedPage: page }) => {
      const warningText =
        "Updates made to the project identifier will change the identifier used for the CLI, inter-project dependencies, etc. Project users should be made aware of this change, as the old identifier will no longer work.";

      await expect(page.getByTestId("input-warning")).toHaveCount(0);
      await page.getByTestId("identifier-input").clear();
      await page.getByTestId("identifier-input").fill("new-identifier");
      await expect(page.getByTestId("input-warning")).toContainText(
        warningText,
      );
      await save(page);
      await validateToast(page, "success", "Successfully updated project");
      await expect(page).toHaveURL(/new-identifier/);
    });
  });

  test.describe("A project that has GitHub webhooks disabled", () => {
    const origin = getProjectSettingsRoute(
      "logkeeper",
      ProjectSettingsTabRoutes.GithubCommitQueue,
    );

    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(origin);
    });

    test("Disables all interactive elements on the page", async ({
      authenticatedPage: page,
    }) => {
      await expect(
        page.getByTestId("project-settings-page").getByRole("button").first(),
      ).toHaveAttribute("aria-disabled", "true");
      await expect(page.locator("input").first()).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });
  });

  test.describe("A project id should redirect to the project identifier", () => {
    const projectId = "602d70a2b2373672ee493189";
    const origin = getProjectSettingsRoute(projectId);

    test.beforeEach(async ({ authenticatedPage: page }) => {
      await page.goto(origin);
    });

    test("Redirects to the project identifier", async ({
      authenticatedPage: page,
    }) => {
      await expect(page).toHaveURL(
        new RegExp(getProjectSettingsRoute("parsley")),
      );
    });
  });
});
