import { test, expect } from "../../../fixtures";
import { validateToast, clickRadio } from "../../../helpers";
import {
  getProjectSettingsRoute,
  project,
  ProjectSettingsTabRoutes,
} from "../constants";
import { save, expectSaveButtonEnabled } from "../utils";

test.describe("Git Tags project settings when GitHub webhooks are disabled", () => {
  const origin = getProjectSettingsRoute(
    "logkeeper",
    ProjectSettingsTabRoutes.GitTags,
  );

  test.beforeEach(async ({ page }) => {
    await page.goto(origin);
    await expectSaveButtonEnabled(page, false);
  });

  test("Git tags page shows a disabled webhooks banner when webhooks are disabled", async ({
    page,
  }) => {
    const banner = page.getByTestId("disabled-webhook-banner");
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(
      "GitHub features are disabled because the Evergreen GitHub App is not",
    );
  });

  test("Disables all interactive elements on the page", async ({ page }) => {
    const settingsPage = page.getByTestId("project-settings-page");
    const buttons = settingsPage.getByRole("button");
    for (const button of await buttons.all()) {
      await expect(button).toBeDisabled();
    }
    const inputs = page.locator("input");
    for (const input of await inputs.all()) {
      await expect(input).toBeDisabled();
    }
  });
});

test.describe("Git Tags project settings when GitHub webhooks are enabled", () => {
  const origin = getProjectSettingsRoute(
    project,
    ProjectSettingsTabRoutes.GitTags,
  );

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
    await validateToast(page, "success", "Successfully updated project");
  });
});
