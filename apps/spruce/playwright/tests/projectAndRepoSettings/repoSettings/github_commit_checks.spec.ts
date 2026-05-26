import { test, expect } from "../../../fixtures";
import { clickRadio } from "../../../helpers";
import {
  getRepoSettingsRoute,
  ProjectSettingsTabRoutes,
  repo,
} from "../constants";
import { expectSaveButtonEnabled } from "../utils";

test.describe("GitHub Commit Checks", () => {
  const origin = getRepoSettingsRoute(
    repo,
    ProjectSettingsTabRoutes.CommitChecks,
  );

  test.beforeEach(async ({ page }) => {
    await page.goto(origin);
    await expectSaveButtonEnabled(page, false);
  });

  test("Shows an error banner when Commit Checks are enabled and hides it when Commit Checks are disabled", async ({
    page,
  }) => {
    const githubChecksEnabledRadio = page
      .getByTestId("github-checks-enabled-radio-box")
      .getByRole("radio", { name: "Enabled" });
    await clickRadio(githubChecksEnabledRadio);
    const errorBanner = page.getByTestId("error-banner").filter({
      hasText:
        "A Commit Check Definition must be specified for this feature to run.",
    });
    await expect(errorBanner).toBeVisible();
    const githubChecksDisabledRadio = page
      .getByTestId("github-checks-enabled-radio-box")
      .getByRole("radio", { name: "Disabled", exact: true });
    await clickRadio(githubChecksDisabledRadio);
    await expect(errorBanner).toHaveCount(0);
  });
});
