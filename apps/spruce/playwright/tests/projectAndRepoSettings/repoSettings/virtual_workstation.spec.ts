import { test, expect } from "../../../fixtures";
import { validateToast } from "../../../helpers";
import { getRepoSettingsRoute, repo } from "../constants";
import { expectSaveButtonEnabled, save } from "../utils";

test.describe("Virtual Workstation page", () => {
  const origin = getRepoSettingsRoute(repo);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
    await page.getByTestId("navitem-virtual-workstation").click();
  });

  test("Adds two commands and then reorders them", async ({
    authenticatedPage: page,
  }) => {
    await expectSaveButtonEnabled(page, false);

    const addCommandButton = page.getByRole("button", { name: "Add Command" });
    await addCommandButton.click();
    await page.getByTestId("command-input").fill("command 1");
    await page.getByTestId("directory-input").fill("mongodb.user.directory");

    await addCommandButton.click();
    await page.getByTestId("command-input").nth(1).fill("command 2");
    await save(page);
    await validateToast(page, "success", "Successfully updated repo");
    await page.getByTestId("array-down-button").click();
    await save(page);
    await validateToast(page, "success", "Successfully updated repo");
    await expect(page.getByTestId("command-input").first()).toHaveValue(
      "command 2",
    );
    await expect(page.getByTestId("command-input").nth(1)).toHaveValue(
      "command 1",
    );
  });
});
