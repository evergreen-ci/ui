import { test, expect } from "../../../fixtures";
import { clickRadio, validateToast } from "../../../helpers";
import {
  getRepoSettingsRoute,
  ProjectSettingsTabRoutes,
  repo,
} from "../constants";
import { expectSaveButtonEnabled, save } from "../utils";

test.describe("Merge Queue section", () => {
  const origin = getRepoSettingsRoute(
    repo,
    ProjectSettingsTabRoutes.MergeQueue,
  );

  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.goto(origin);
    await expectSaveButtonEnabled(page, false);
  });

  test("Enabling merge queue shows hidden inputs and error banner", async ({
    authenticatedPage: page,
  }) => {
    await expect(page.getByText("Merge Queue Patch Definitions")).toBeHidden();

    const mergeQueueEnabledRadio = page
      .getByTestId("mq-enabled-radio-box")
      .getByRole("radio", { name: "Enabled" });
    await clickRadio(mergeQueueEnabledRadio);

    await expect(page.getByText("Merge Queue Patch Definitions")).toBeVisible();
    await expect(
      page.getByTestId("error-banner").filter({
        hasText:
          "A Merge Queue Patch Definition must be specified for this feature to run.",
      }),
    ).toBeVisible();
  });

  test("Does not show override buttons for merge queue patch definitions", async ({
    authenticatedPage: page,
  }) => {
    const mergeQueueEnabledRadio = page
      .getByTestId("mq-enabled-radio-box")
      .getByRole("radio", { name: "Enabled" });
    await clickRadio(mergeQueueEnabledRadio);
    await expect(page.getByTestId("mq-override-radio-box")).toHaveCount(0);
  });

  test("Saves a merge queue definition", async ({
    authenticatedPage: page,
  }) => {
    const mergeQueueEnabledRadio = page
      .getByTestId("mq-enabled-radio-box")
      .getByRole("radio", { name: "Enabled" });
    await clickRadio(mergeQueueEnabledRadio);
    await page
      .getByRole("button", { name: "Add merge queue patch definition" })
      .click();
    await page.getByTestId("variant-tags-input").last().fill("cqvtag");
    await page.getByTestId("task-tags-input").last().fill("cqttag");
    await expect(page.getByTestId("warning-banner")).toHaveCount(0);
    await expect(page.getByTestId("error-banner")).toHaveCount(0);
    await save(page);
    await validateToast(page, "success", "Successfully updated repo");
  });
});
