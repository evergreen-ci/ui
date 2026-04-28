import { test, expect } from "../../fixtures";
import { clickRadio, validateToast } from "../../helpers";
import {
  getProjectSettingsRoute,
  project,
  ProjectSettingsTabRoutes,
} from "./constants";
import { expectSaveButtonEnabled, save } from "./utils";

test.describe("A project that has GitHub webhooks disabled", () => {
  const destination = getProjectSettingsRoute(
    "logkeeper",
    ProjectSettingsTabRoutes.CommitChecks,
  );

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(destination);
    await expectSaveButtonEnabled(page, false);
  });

  test("Commit Checks page shows a disabled webhooks banner when webhooks are disabled", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByTestId("disabled-webhook-banner")).toContainText(
      "GitHub features are disabled because the Evergreen GitHub App is not",
    );
  });

  test("Disables all interactive elements on the page", async ({
    authenticatedPage: page,
  }) => {
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

test.describe("A project that has GitHub webhooks enabled", () => {
  const destination = getProjectSettingsRoute(
    project,
    ProjectSettingsTabRoutes.CommitChecks,
  );

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(destination);
    await expectSaveButtonEnabled(page, false);
  });

  test("Shows an error banner when Commit Checks are enabled and hides it when Commit Checks are disabled", async ({
    authenticatedPage: page,
  }) => {
    const radioBox = page.getByTestId("github-checks-enabled-radio-box");
    const githubChecksEnabledRadio = radioBox.getByRole("checkbox", {
      name: "Enabled",
    });
    const githubChecksDisabledRadio = radioBox.getByRole("checkbox", {
      name: "Disabled",
    });

    await clickRadio(githubChecksEnabledRadio);
    const errorBanner = page.getByTestId("error-banner").filter({
      hasText:
        "A Commit Check Definition must be specified for this feature to run.",
    });
    await expect(errorBanner).toBeVisible();
    await clickRadio(githubChecksDisabledRadio);
    await expect(errorBanner).toBeHidden();
  });

  test("Saves successfully when Commit Checks are enabled and a Commit Check Definition is provided", async ({
    authenticatedPage: page,
  }) => {
    const radioBox = page.getByTestId("github-checks-enabled-radio-box");
    const githubChecksEnabledRadio = radioBox.getByRole("checkbox", {
      name: "Enabled",
    });
    await clickRadio(githubChecksEnabledRadio);

    await page.getByRole("button", { name: "Add Definition" }).click();
    await page.getByTestId("variant-tags-input").first().fill("vtag");
    await page.getByTestId("task-tags-input").first().fill("ttag");

    await expect(page.getByTestId("error-banner")).toBeHidden();
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
  });
});
