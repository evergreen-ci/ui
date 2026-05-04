import { test, expect } from "../../../fixtures";
import { validateToast, clickRadio } from "../../../helpers";
import { getProjectSettingsRoute, project } from "../constants";
import { save } from "../utils";

test.describe("GitHub page", () => {
  const origin = getProjectSettingsRoute(project);

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
    await page.getByTestId("navitem-github-commitqueue").click();
  });

  test("Allows adding a git tag alias", async ({ authenticatedPage: page }) => {
    const enabledRadio = page
      .getByTestId("git-tag-enabled-radio-box")
      .getByRole("radio", { name: "Enabled" });
    await clickRadio(enabledRadio);
    await page.getByRole("button", { name: "Add Git Tag" }).click();
    await page.getByTestId("git-tag-input").fill("myGitTag");
    await page.getByTestId("remote-path-input").fill("./evergreen.yml");
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
    await expect(page.getByTestId("remote-path-input")).toHaveValue(
      "./evergreen.yml",
    );
  });
});
