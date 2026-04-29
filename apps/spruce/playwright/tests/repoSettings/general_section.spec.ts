import { test, expect } from "../../fixtures";
import { validateToast } from "../../helpers";
import { getRepoSettingsRoute, repo } from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

test.describe("General settings page", () => {
  const origin = getRepoSettingsRoute(repo);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
  });

  test("Should have the save button disabled on load", async ({
    authenticatedPage: page,
  }) => {
    await expectSaveButtonEnabled(page, false);
  });

  test("Does not show a 'Default to Repo' button on page", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("default-to-repo-button")).toHaveCount(0);
  });

  test("Does not show a 'Move to New Repo' button on page", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("move-repo-button")).toHaveCount(0);
  });

  test("Does not show an Attach/Detach to Repo button on page", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("attach-repo-button")).toHaveCount(0);
  });

  test("Does not show a 'Go to repo settings' link on page", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("attached-repo-link")).toHaveCount(0);
  });

  test("Inputting a display name then clicking save shows a success toast", async ({
    authenticatedPage: page,
  }) => {
    await page.getByTestId("display-name-input").fill("evg");
    await save(page);
    await validateToast(page, "success", "Successfully updated repo");
  });
});
