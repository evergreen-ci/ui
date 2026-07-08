import { test, expect } from "../../../fixtures";
import { getProjectSettingsRoute, project } from "../constants";

test.describe("Project Triggers page", () => {
  const origin = getProjectSettingsRoute(project);

  test.beforeEach(async ({ page }) => {
    await page.goto(origin);
    await page.getByTestId("navitem-project-triggers").click();
  });

  test("Saves a project trigger", async ({ page }) => {
    await page.getByRole("button", { name: "Add project trigger" }).click();
    await expect(page.getByTestId("project-input")).toBeVisible();
    await expect(page.getByTestId("project-input")).toBeEnabled();
    await page.getByTestId("project-input").fill("spruce");
    await page.getByTestId("config-file-input").fill(".evergreen.yml");
  });
});
