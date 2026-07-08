import { test, expect } from "../../../fixtures";
import { clickRadio, validateToast } from "../../../helpers";
import {
  getProjectSettingsRoute,
  projectUseRepoEnabled,
  ProjectSettingsTabRoutes,
  repo,
  getRepoSettingsRoute,
} from "../constants";
import { expectSaveButtonEnabled, save } from "../utils";

test.describe("A repo that has GitHub webhooks enabled", () => {
  const destination = getRepoSettingsRoute(
    repo,
    ProjectSettingsTabRoutes.PullRequests,
  );

  test.beforeEach(async ({ page }) => {
    await page.goto(destination);
    await expectSaveButtonEnabled(page, false);
  });

  test("Allows enabling manual PR testing", async ({ page }) => {
    const radioBox = page.getByTestId("manual-pr-testing-enabled-radio-box");
    const enabledRadio = radioBox.getByRole("radio", { name: "Enabled" });
    await clickRadio(enabledRadio);
    await expect(enabledRadio).toBeChecked();
  });

  test("Saving a patch definition should hide the error banner, show a success toast and display disabled patch definitions for the repo on the project page", async ({
    page,
  }) => {
    const errorBanner = page.getByTestId("error-banner").filter({
      hasText:
        "A GitHub Patch Definition must be specified for this feature to run.",
    });
    await expect(errorBanner).toBeVisible();

    await page.getByRole("button", { name: "Add patch definition" }).click();
    await expect(errorBanner).toBeHidden();
    await expectSaveButtonEnabled(page, false);

    await page.getByTestId("variant-tags-input").first().fill("vtag");
    await page.getByTestId("task-tags-input").first().fill("ttag");
    await expectSaveButtonEnabled(page, true);

    await save(page);
    await validateToast(page, "success", "Successfully updated repo");

    await page.goto(
      getProjectSettingsRoute(
        projectUseRepoEnabled,
        ProjectSettingsTabRoutes.PullRequests,
      ),
    );

    const patchDefAccordion = page.getByText("Repo Patch Definition 1");
    await patchDefAccordion.click();

    const variantTagsInput = page.getByTestId("variant-tags-input");
    await expect(variantTagsInput).toHaveValue("vtag");
    await expect(variantTagsInput).toBeDisabled();

    const taskTagsInput = page.getByTestId("task-tags-input");
    await expect(taskTagsInput).toHaveValue("ttag");
    await expect(taskTagsInput).toBeDisabled();

    await expect(errorBanner).toBeHidden();
  });
});
