import { test, expect } from "../../../fixtures";
import { clickRadio, validateToast } from "../../../helpers";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
} from "../constants";
import { expectSaveButtonEnabled, save } from "../utils";

test.describe("Merge Queue project settings when GitHub webhooks are disabled", () => {
  const origin = getProjectSettingsRoute(
    "logkeeper",
    ProjectSettingsTabRoutes.MergeQueue,
  );

  test.beforeEach(async ({ page }) => {
    await page.goto(origin);
    await expectSaveButtonEnabled(page, false);
  });

  test("Merge Queue page shows a disabled webhooks banner when webhooks are disabled", async ({
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

test.describe("Merge Queue project settings when GitHub webhooks are enabled", () => {
  const origin = getProjectSettingsRoute(
    "spruce",
    ProjectSettingsTabRoutes.MergeQueue,
  );

  test.beforeEach(async ({ page }) => {
    await page.goto(origin);
    await expectSaveButtonEnabled(page, false);
  });

  test("Enabling merge queue shows hidden inputs and error banner", async ({
    page,
  }) => {
    const radioBox = page.getByTestId("mq-enabled-radio-box");
    const mergeQueueEnabledRadio = radioBox.getByRole("radio", {
      name: "Enabled",
    });
    await clickRadio(mergeQueueEnabledRadio);
    await expect(page.getByText("Merge Queue Patch Definitions")).toBeVisible();

    const errorBanner = page.getByTestId("error-banner");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(
      "A Merge Queue Patch Definition must be specified for this feature to run.",
    );
  });

  test("Saves a merge queue definition", async ({ page }) => {
    const radioBox = page.getByTestId("mq-enabled-radio-box");
    const mergeQueueEnabledRadio = radioBox.getByRole("radio", {
      name: "Enabled",
    });
    await clickRadio(mergeQueueEnabledRadio);

    await page
      .getByRole("button", { name: "Add merge queue patch definition" })
      .click();
    await page.getByTestId("variant-tags-input").first().fill("vtag");
    await page.getByTestId("task-tags-input").first().fill("ttag");

    await expect(page.getByTestId("error-banner")).toBeHidden();
    await save(page);
    await validateToast(page, "success", "Successfully updated project");
  });
});
