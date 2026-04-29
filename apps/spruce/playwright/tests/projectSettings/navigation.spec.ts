import { test, expect } from "../../fixtures";
import { getProjectSettingsRoute, project } from "./constants";

test.describe("navigation", () => {
  const origin = getProjectSettingsRoute(project);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
  });

  test("headers (repos) are clickable in project select dropdown", async ({
    authenticatedPage: page,
  }) => {
    const projectSelect = page.getByTestId("project-select");
    await expect(projectSelect).toBeVisible();
    await projectSelect.click();
    const projectSelectOptions = page.getByTestId("project-select-options");
    await expect(projectSelectOptions).toBeVisible();
    await projectSelectOptions.getByText("evergreen-ci/evergreen").click();
    await expect(page).not.toHaveURL(new RegExp(origin));
  });

  test.describe("project ID should redirect to the project identifier", () => {
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
