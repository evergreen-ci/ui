import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { getProjectSettingsRoute, project } from "./constants";
import { expectSaveButtonEnabled } from "./utils";

test.describe("Project Settings when not defaulting to repo", () => {
  const origin = getProjectSettingsRoute(project);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
    await expectSaveButtonEnabled(page, false);
  });

  test("Does not show a 'Default to Repo' button on page", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("default-to-repo-button")).toHaveCount(0);
  });

  test("Shows two radio boxes", async ({ authenticatedPage: page }) => {
    await expect(
      page.getByTestId("enabled-radio-box").locator("> *"),
    ).toHaveCount(2);
  });

  test("Successfully attaches to and detaches from a repo that does not yet exist and shows 'Default to Repo' options", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("attach-repo-button").click();
    await page
      .getByTestId("attach-repo-modal")
      .getByRole("button", { name: "Attach" })
      .click();
    await validateToast(page, "success", "Successfully attached to repo", true);
    await page.getByTestId("attach-repo-button").click();
    await page
      .getByTestId("attach-repo-modal")
      .getByRole("button", { name: "Detach" })
      .click();
    await validateToast(page, "success", "Successfully detached from repo");
  });
});
