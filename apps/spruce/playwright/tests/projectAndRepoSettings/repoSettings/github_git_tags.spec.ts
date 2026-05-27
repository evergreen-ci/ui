import { test, expect } from "../../../fixtures";
import { validateToast, clickRadio } from "../../../helpers";
import {
  getRepoSettingsRoute,
  ProjectSettingsTabRoutes,
  repo,
} from "../constants";
import { save, expectSaveButtonEnabled } from "../utils";

test.describe("Git Tags repo settings when GitHub webhooks are enabled", () => {
  const origin = getRepoSettingsRoute(repo, ProjectSettingsTabRoutes.GitTags);

  test.beforeEach(async ({ page }) => {
    await page.goto(origin);
    await expectSaveButtonEnabled(page, false);
  });

  test("Saves successfully when Git Tags are enabled and a Git Tag Definition is provided", async ({
    page,
  }) => {
    const gitTagRadioBox = page.getByTestId("git-tag-enabled-radio-box");
    const enabledRadio = gitTagRadioBox.getByRole("radio", { name: "Enabled" });
    await clickRadio(enabledRadio);

    const errorBanner = page.getByTestId("error-banner").filter({
      hasText:
        "A Git Tag Version Definition must be specified for this feature to run.",
    });
    await expect(errorBanner).toBeVisible();

    await page.getByRole("button", { name: "Add git tag" }).click();
    await page.getByTestId("git-tag-input").fill("v*");
    await page.getByTestId("remote-path-input").fill("./evergreen.yml");

    await expect(page.getByTestId("error-banner")).toBeHidden();
    await save(page);
    await validateToast(page, "success", "Successfully updated repo");
  });
});
