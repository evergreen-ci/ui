import { test, expect } from "../../fixtures";
import { getProjectSettingsRoute, project } from "./constants";

test.describe("Clicking on The Project Select Dropdown", () => {
  const origin = getProjectSettingsRoute(project);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
  });

  test("Headers are clickable", async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId("project-select")).toBeVisible();
    await page.getByTestId("project-select").click();
    await expect(page.getByTestId("project-select-options")).toBeVisible();
    await page
      .getByTestId("project-select-options")
      .getByText("evergreen-ci/evergreen")
      .click();
    await expect(page).not.toHaveURL(new RegExp(origin));
  });
});
